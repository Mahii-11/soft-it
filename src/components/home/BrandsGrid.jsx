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
  "flex h-20 items-center justify-center rounded-lg px-3 transition-colors duration-300 md:h-[120px]";

export default function BrandsGrid() {
  const { data, loading } = useApiData("brands", getBrands);

  const fetched = Array.isArray(data) ? data : [];
  const brands = fetched.length > 0 ? fetched : loading ? [] : FALLBACK_BRANDS;

  return (
    <section className="container-custom py-4 md:py-6">
      <div className="grid grid-cols-3 gap-1 sm:grid-cols-4 lg:grid-cols-7">
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
                  className={`${cellClass} group bg-white hover:bg-[#ea5b3a]`}
                >
                  {logo ? (
                    <img
                      src={logo}
                      alt={brand.name}
                      loading="lazy"
                      draggable={false}
                      className="max-h-10 max-w-[70%] object-contain mix-blend-multiply md:max-h-12"
                    />
                  ) : (
                    <span className="font-sans text-sm font-bold uppercase tracking-wide text-neutral-700 transition-colors duration-300 group-hover:text-white md:text-base">
                      {brand.name}
                    </span>
                  )}
                </Link>
              );
            })}

        <Link
          to="/shop"
          className={`${cellClass} bg-[#26282d] text-center text-xs font-semibold text-white hover:bg-[#ea5b3a] md:text-sm`}
        >
          View All Brands
        </Link>
      </div>
    </section>
  );
}
