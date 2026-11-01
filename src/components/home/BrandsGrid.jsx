import { Link } from "react-router-dom";
import { getBrands } from "../../services/api";
import useApiData from "../../hooks/useApiData";

// Shown until the brands endpoint exists / if the request fails.
const FALLBACK_BRANDS = [
  ["Apple", "Apple_Brand_Logo_-_1.webp"],
  ["Asus", "Asus_Brand.webp"],
  ["EcoFlow", "ecoflow_brand_logo_png.webp"],
  ["HP", "HP_Brand_Logo_-_1.webp"],
  ["Honor", "Honor.webp"],
  ["Lenovo", "Lenovo_Brand_logo.webp"],
  ["Oraimo", "Oraimo.webp"],
  ["Dyson", "Dyson_Brand_Logo_SEhfYmW.webp"],
  ["Samsung", "Samsung_Brand.webp"],
  ["Sony", "Sony_.webp"],
  ["TCL", "TCL_Brand_Logo.webp"],
  ["UGREEN", "UGREEN.webp"],
  ["Xiaomi", "Xiaomi_Brand.webp"],
].map(([name, file], i) => ({
  id: i + 1,
  name,
  slug: name.toLowerCase(),
  image: `/images/${file}`,
}));

const cellClass =
  "flex h-16 items-center justify-center border-b border-r border-[#dfe1e5] transition-colors duration-300 md:h-[120px]";

export default function BrandsGrid() {
  const { data, loading } = useApiData("brands", getBrands);

  const fetched = Array.isArray(data) ? data : [];
  const brands = fetched.length > 0 ? fetched : loading ? [] : FALLBACK_BRANDS;

  return (
    <section className="container-custom pt-3 md:pt-[35px]">
      <div className="grid grid-cols-3 gap-0 border-l border-t border-[#dfe1e5] sm:grid-cols-4 lg:grid-cols-[repeat(7,minmax(0,1fr))]">
        {loading
          ? Array.from({ length: 14 }).map((_, i) => (
              <div key={i} className={`${cellClass} animate-pulse bg-white`} />
            ))
          : brands.map((brand) => {
              const logo = brand.image || brand.logo;
              return (
                <Link
                  key={brand.id ?? brand.slug}
                  to={`/brand/${brand.slug}`}
                  aria-label={brand.name}
                  className={`${cellClass} group bg-white hover:bg-[#fafafa]`}
                >
                  {logo ? (
                    <img
                      src={logo}
                      alt={brand.name}
                      loading="lazy"
                      draggable={false}
                      className="h-9 w-full max-w-[80px] object-contain object-center mix-blend-multiply md:h-[96px] md:max-w-[200px]"
                    />
                  ) : (
                    <span className="px-3 font-sans text-sm font-bold uppercase tracking-wide text-neutral-700 transition-colors duration-300 md:text-base">
                      {brand.name}
                    </span>
                  )}
                </Link>
              );
            })}

        <Link
          to="/all-brands"
          className={`${cellClass} bg-[#25282c] text-center text-xs font-semibold text-white hover:bg-[#393c42] md:text-[15px]`}
        >
          View All Brands
        </Link>
      </div>
    </section>
  );
}
