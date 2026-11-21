import { Check, ChevronDown, ChevronLeft, ChevronRight, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import ProductCard, { formatPrice } from "../../components/ProductCard";
import { getAllBrands, getShopProducts, getTopMenuData } from "../../services/api";

const LIMIT = 12;

const SORT_OPTIONS = [
  { value: "default", label: "Default Sorting" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

// current selling price of a product (works for single + variable)
const sellPrice = (p) =>
  p.type === "variable"
    ? p.min_offer_price ?? p.min_price ?? 0
    : p.offer_price ?? p.price ?? 0;

function ProductGridSkeleton({ count = LIMIT }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse overflow-hidden rounded-md bg-white shadow-[0_1px_4px_rgba(0,0,0,0.08)]">
          <div className="aspect-square bg-gray-200" />
          <div className="space-y-2 p-3">
            <div className="h-3 w-full rounded bg-gray-200" />
            <div className="h-3 w-2/3 rounded bg-gray-200" />
            <div className="h-4 w-1/3 rounded bg-gray-300" />
          </div>
        </div>
      ))}
    </div>
  );
}

function SidebarSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="h-5 w-32 rounded bg-gray-300" />
      {[7, 3, 5, 2].map((rows, s) => (
        <div key={s} className="space-y-3">
          <div className="h-4 w-24 rounded bg-gray-300" />
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-3 w-3 shrink-0 rounded-sm bg-gray-200" />
              <div className="h-3 flex-1 rounded bg-gray-200" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  // /brand/:slug -> same shop page, restricted to one brand
  const { slug: brandSlug = "" } = useParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sort, setSort] = useState("default");

  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState({});
  const [filterOptions, setFilterOptions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ---- filter state lives in the URL (shareable + back button works) ----
  const category = searchParams.get("category") || "";
  const size = searchParams.get("size") || "";
  const color = searchParams.get("color") || "";
  const search = searchParams.get("search") || "";
  const brand = searchParams.get("brand") || "";
  const childCategory = searchParams.get("child_category") || "";
  const minPrice = searchParams.get("min_price") || "";
  const maxPrice = searchParams.get("max_price") || "";
  const page = Number(searchParams.get("page")) || 1;

  const updateParams = (changes, { keepPage = false } = {}) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(changes).forEach(([key, value]) => {
      if (value === "" || value === null || value === undefined) next.delete(key);
      else next.set(key, String(value));
    });
    if (!keepPage) next.delete("page");
    setSearchParams(next);
  };

  // lock body scroll while the mobile filter drawer is open
  useEffect(() => {
    if (!mobileFiltersOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileFiltersOpen]);

  // different brand page -> drop the previous brand's filter options
  useEffect(() => {
    setFilterOptions(null);
  }, [brandSlug]);

  // ---- fetch ----
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    getShopProducts({
      category,
      size,
      color,
      search,
      brand,
      brand_slug: brandSlug,
      child_category: childCategory,
      min_price: minPrice,
      max_price: maxPrice,
      page,
      limit: LIMIT,
    })
      .then(({ products, filters, meta }) => {
        if (cancelled) return;
        setProducts(products);
        setMeta(meta);
        // keep the full option lists while filters are applied, so options don't vanish
        const hasFilter = brandSlug || category || size || color || search || brand || childCategory || minPrice || maxPrice;
        setFilterOptions((prev) => (!prev || !hasFilter ? filters : prev));
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Shop fetch error", err);
        setError("Could not load products. Please try again.");
        setProducts([]);
      })
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [category, size, color, search, brand, brandSlug, childCategory, minPrice, maxPrice, page]);

  // brand names for the "Active Filter" chip (brands come from the navbar menu)
  const [brands, setBrands] = useState([]);
  useEffect(() => {
    if (!brand && !brandSlug) return;
    getAllBrands().then(setBrands).catch(() => {});
  }, [brand, brandSlug]);

  const categories = filterOptions?.categories || [];
  const sizes = filterOptions?.sizes || [];
  const colors = filterOptions?.colors || [];
  const priceBounds = {
    min: Number(filterOptions?.price?.min ?? 0),
    max: Number(filterOptions?.price?.max ?? 0),
  };

  // ---- price slider: local value while dragging, commit to URL after a short pause ----
  const [priceRange, setPriceRange] = useState([0, 0]);

  useEffect(() => {
    if (!priceBounds.max) return;
    setPriceRange([
      minPrice ? Number(minPrice) : priceBounds.min,
      maxPrice ? Number(maxPrice) : priceBounds.max,
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minPrice, maxPrice, priceBounds.min, priceBounds.max]);

  useEffect(() => {
    if (!priceBounds.max) return;
    const [lo, hi] = priceRange;
    const curLo = minPrice ? Number(minPrice) : priceBounds.min;
    const curHi = maxPrice ? Number(maxPrice) : priceBounds.max;
    if (lo === curLo && hi === curHi) return;

    const t = setTimeout(() => {
      updateParams({
        min_price: lo <= priceBounds.min ? "" : lo,
        max_price: hi >= priceBounds.max ? "" : hi,
      });
    }, 500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priceRange]);

  // ---- active filter chips ----
  const activeFilters = [];
  if (search) activeFilters.push({ type: "search", label: `Search: ${search}` });
  if (category)
    activeFilters.push({
      type: "category",
      label: categories.find((c) => String(c.id) === category)?.name || "Category",
    });
  if (brand)
    activeFilters.push({
      type: "brand",
      label: brands.find((b) => String(b.id) === brand)?.name || "Brand",
    });
  if (color)
    activeFilters.push({
      type: "color",
      label: colors.find((c) => String(c.id) === color)?.name || "Color",
    });
  if (size)
    activeFilters.push({
      type: "size",
      label: sizes.find((s) => String(s.id) === size)?.title || "Size",
    });
  if (minPrice || maxPrice)
    activeFilters.push({
      type: "price",
      label: `Price: ${formatPrice(minPrice || priceBounds.min)} - ${formatPrice(maxPrice || priceBounds.max)}`,
    });

  // ---- breadcrumb + page title (Home > Category > Sub category > Child) ----
  // names come from the navbar menu (same ids the menu links use)
  const [menu, setMenu] = useState([]);
  useEffect(() => {
    getTopMenuData().then((d) => setMenu(d || [])).catch(() => {});
  }, []);

  const menuCat = menu.find((m) => String(m.id) === category);
  const menuSub = (menuCat?.sub_categories || []).find((s) => String(s.id) === brand);
  const menuChild = (menuSub?.child_categories || []).find((c) => String(c.id) === childCategory);

  const categoryName = menuCat?.name || categories.find((c) => String(c.id) === category)?.name;
  const brandName = menuSub?.name || brands.find((b) => String(b.id) === brand)?.name;
  const childName = menuChild?.name;
  const pageBrandName = brandSlug
    ? brands.find((b) => b.slug === brandSlug)?.name ||
      brandSlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "";

  const crumbs = [{ label: "Home", to: "/" }];
  if (brandSlug) {
    crumbs.push({ label: "All Brands", to: "/all-brands" });
    crumbs.push({ label: pageBrandName, to: `/brand/${brandSlug}` });
  } else if (!category && !brand && !childCategory && !search) crumbs.push({ label: "Shop" });
  if (category && categoryName) crumbs.push({ label: categoryName, to: `/shop-page?category=${category}` });
  if (brand && brandName)
    crumbs.push({
      label: brandName,
      to: `/shop-page?${category ? `category=${category}&` : ""}brand=${brand}`,
    });
  if (childCategory && childName)
    crumbs.push({
      label: childName,
      to: `/shop-page?${category ? `category=${category}&` : ""}${brand ? `brand=${brand}&` : ""}child_category=${childCategory}`,
    });
  if (search) crumbs.push({ label: `Search: ${search}` });

  const pageTitle = search
    ? `Search: ${search}`
    : childName || brandName || pageBrandName || categoryName || "All Products";

  const removeFilter = (type) => {
    if (type === "price") updateParams({ min_price: "", max_price: "" });
    else if (type === "brand") updateParams({ brand: "", child_category: "" });
    else updateParams({ [type]: "" });
  };

  const clearAll = () => setSearchParams({});

  // single-select toggle: click again to un-select
  const toggleParam = (key, id, current) =>
    updateParams({ [key]: String(id) === current ? "" : id });

  // sorting is applied on the loaded page
  const sortedProducts = useMemo(() => {
    if (sort === "default") return products;
    const list = [...products];
    list.sort((a, b) => (sort === "price_asc" ? sellPrice(a) - sellPrice(b) : sellPrice(b) - sellPrice(a)));
    return list;
  }, [products, sort]);

  const total = meta.total ?? products.length;
  const perPage = meta.per_page ?? LIMIT;
  const currentPage = meta.current_page ?? page;
  const lastPage = meta.last_page ?? 1;
  const from = total === 0 ? 0 : (currentPage - 1) * perPage + 1;
  const to = Math.min(currentPage * perPage, total);

  const goToPage = (p) => {
    updateParams({ page: p }, { keepPage: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const checkboxClass = (active) =>
    `w-3 h-3 border rounded-sm mr-3 shrink-0 flex items-center justify-center transition-colors ${
      active ? "bg-gray-900 border-gray-900" : "border-gray-300 group-hover:border-accent"
    }`;
  const labelClass = (active) =>
    `transition-colors ${active ? "font-medium text-gray-900" : "text-gray-600 group-hover:text-accent"}`;

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8 md:pt-6 md:pb-12 gap-8 flex flex-col lg:flex-row">
        {/* Left side */}
        {/* Mobile overlay */}
        <div
          onClick={() => setMobileFiltersOpen(false)}
          className={`fixed inset-0 z-[100] bg-black/50 transition-opacity duration-300 lg:hidden ${
            mobileFiltersOpen ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        />
        <aside
          className={`fixed inset-y-0 left-0 z-[110] flex w-[85%] max-w-xs flex-col bg-white shadow-xl transition-transform duration-300 ease-out
            lg:z-auto lg:w-64 lg:max-w-none lg:translate-x-0 lg:self-start lg:sticky lg:top-40 lg:bg-transparent lg:shadow-none lg:block shrink-0 ${
              mobileFiltersOpen ? "translate-x-0" : "-translate-x-full"
            }`}
        >
          {/* Mobile drawer header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 lg:hidden">
            <span className="text-base font-bold">Filters</span>
            <button
              onClick={() => setMobileFiltersOpen(false)}
              aria-label="Close filters"
              className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 lg:overflow-visible lg:p-0">
          {!filterOptions && loading ? (
            <SidebarSkeleton />
          ) : (
          <div className="space-y-8 lg:pr-3">
            <div className="hidden lg:block">
              <h2 className="text-lg font-bold font-serif mb-4">Filter Option</h2>
            </div>
            {/* Category */}
            {categories.length > 0 && (
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-3">Category</h3>
                <ul className="space-y-2">
                  {categories.map((cat) => {
                    const active = String(cat.id) === category;
                    return (
                      <li key={cat.id} className="flex items-center text-sm">
                        <button
                          onClick={() => toggleParam("category", cat.id, category)}
                          className="flex items-center group w-full text-left"
                        >
                          <span className={checkboxClass(active)}>
                            {active && <Check className="w-2 h-2 text-white" />}
                          </span>
                          <span className={labelClass(active)}>{cat.name}</span>
                          <span className="ml-auto text-xs text-gray-400">({cat.products_count})</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* Price */}
            {priceBounds.max > priceBounds.min && (
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-4">Price</h3>
                <div className="px-2">
                  <input
                    type="range"
                    min={priceBounds.min}
                    max={priceBounds.max}
                    value={priceRange[0]}
                    onChange={(e) =>
                      setPriceRange(([, hi]) => [Math.min(Number(e.target.value), hi - 1), hi])
                    }
                    className="w-full accent-black"
                  />
                  <input
                    type="range"
                    min={priceBounds.min}
                    max={priceBounds.max}
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange(([lo]) => [lo, Math.max(Number(e.target.value), lo + 1)])
                    }
                    className="w-full accent-black mt-2"
                  />
                  <div className="mt-4 text-sm text-gray-600 font-medium">
                    {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                  </div>
                </div>
              </div>
            )}

            {/* Color */}
            {colors.length > 0 && (
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-3">Color</h3>
                <ul className="space-y-2.5">
                  {colors.map((col) => {
                    const active = String(col.id) === color;
                    return (
                      <li key={col.id} className="flex items-center text-sm">
                        <button
                          onClick={() => toggleParam("color", col.id, color)}
                          className="flex items-center group"
                        >
                          <span
                            className="relative w-4 h-4 rounded-full mr-3 shrink-0 border border-gray-300"
                            style={{ background: col.code }}
                          >
                            {active && (
                              <span className="absolute -inset-1 border border-gray-400 rounded-full"></span>
                            )}
                          </span>
                          <span className={`capitalize ${labelClass(active)}`}>{col.name}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* Size */}
            {sizes.length > 0 && (
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-3">Size</h3>
                <ul className="space-y-2">
                  {sizes.map((s) => {
                    const active = String(s.id) === size;
                    return (
                      <li key={s.id} className="flex items-center text-sm">
                        <button
                          onClick={() => toggleParam("size", s.id, size)}
                          className="flex items-center group w-full text-left"
                        >
                          <span className={checkboxClass(active)}>
                            {active && <Check className="w-2 h-2 text-white" />}
                          </span>
                          <span className={labelClass(active)}>{s.title}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
          )}
          </div>

          {/* Mobile drawer footer */}
          <div className="flex gap-3 border-t border-gray-200 p-4 pb-24 lg:hidden">
            {activeFilters.length > 0 && (
              <button
                onClick={clearAll}
                className="flex-1 rounded-md border border-gray-300 py-2.5 text-sm font-medium"
              >
                Clear All
              </button>
            )}
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="flex-1 rounded-md bg-gray-900 py-2.5 text-sm font-semibold text-white"
            >
              {loading ? "Loading..." : `Show ${total} results`}
            </button>
          </div>
        </aside>

        {/* Right side */}
        <div className="flex-1 min-w-0">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-3 flex flex-wrap items-center gap-1 text-sm text-gray-500">
            {crumbs.map((c, i) => {
              const last = i === crumbs.length - 1;
              return (
                <span key={`${c.label}-${i}`} className="flex items-center gap-1">
                  {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-gray-400" />}
                  {last || !c.to ? (
                    <span className={last ? "font-medium text-gray-900" : ""}>{c.label}</span>
                  ) : (
                    <Link to={c.to} className="hover:text-accent transition-colors">
                      {c.label}
                    </Link>
                  )}
                </span>
              );
            })}
          </nav>

          {/* Title + filter button + sort */}
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <button
                onClick={() => setMobileFiltersOpen(true)}
                aria-label="Open filters"
                className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-white lg:hidden"
              >
                <SlidersHorizontal className="h-4 w-4" />
                {activeFilters.length > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-white">
                    {activeFilters.length}
                  </span>
                )}
              </button>
              <h1 className="truncate text-xl font-bold md:text-2xl">{pageTitle}</h1>
            </div>

            <div className="relative shrink-0">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                aria-label="Sort products"
                className="appearance-none border border-gray-200 rounded-md py-1.5 pl-3 pr-8 text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-3">
            <div className="text-sm text-gray-500 whitespace-nowrap">
              {loading ? (
                <span className="inline-block h-4 w-40 animate-pulse rounded bg-gray-200 align-middle" />
              ) : (
                `Showing ${from}-${to} of ${total} results`
              )}
            </div>

            {activeFilters.length > 0 && (
              <div className="flex-1 flex flex-wrap items-center gap-2 md:justify-center">
                <span className="text-sm font-medium text-gray-700 mr-1">Active Filter</span>
                {activeFilters.map((item) => (
                  <div
                    key={item.type}
                    className="flex items-center bg-accent text-white px-3 py-1 rounded-md text-sm font-medium"
                  >
                    {item.label}
                    <button
                      onClick={() => removeFilter(item.type)}
                      className="ml-1.5 hover:text-gray-200 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={clearAll}
                  className="text-sm text-gray-500 underline ml-2 hover:text-gray-900 transition-colors"
                >
                  Clear All
                </button>
              </div>
            )}

          </div>

          {error ? (
            <div className="py-16 text-center text-sm text-red-500">{error}</div>
          ) : loading ? (
            <ProductGridSkeleton />
          ) : sortedProducts.length === 0 ? (
            <div className="py-16 text-center">
              <h2 className="text-base font-bold text-neutral-900">No products found</h2>
              <p className="mt-1 text-sm text-neutral-500">Try changing or clearing your filters.</p>
              {activeFilters.length > 0 && (
                <button
                  onClick={clearAll}
                  className="mt-5 rounded-md bg-[#ea5b3a] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#d44a2a]"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {lastPage > 1 && (
            <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
              <button
                disabled={currentPage <= 1}
                onClick={() => goToPage(currentPage - 1)}
                className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: lastPage }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === lastPage || Math.abs(p - currentPage) <= 1)
                .map((p, idx, arr) => (
                  <span key={p} className="flex items-center gap-2">
                    {idx > 0 && p - arr[idx - 1] > 1 && <span className="text-gray-400">…</span>}
                    <button
                      onClick={() => goToPage(p)}
                      className={`h-9 min-w-9 rounded-md border px-3 text-sm font-medium transition-colors ${
                        p === currentPage
                          ? "border-gray-900 bg-gray-900 text-white"
                          : "border-gray-200 text-gray-700 hover:border-gray-900"
                      }`}
                    >
                      {p}
                    </button>
                  </span>
                ))}
              <button
                disabled={currentPage >= lastPage}
                onClick={() => goToPage(currentPage + 1)}
                className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
