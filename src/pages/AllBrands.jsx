import { Link } from "react-router-dom";
import { getAllBrands } from "../services/api";
import useApiData from "../hooks/useApiData";

const cellClass =
  "flex h-24 items-center justify-center border-b border-r border-[#dfe1e5] bg-white transition-colors duration-300 hover:bg-[#fafafa] md:h-[120px]";

export default function AllBrands() {
  const { data, loading, error } = useApiData("all-brands", getAllBrands);
  const brands = Array.isArray(data) ? data : [];

  return (
    <section className="container-custom py-6 md:py-10">
      <h1 className="mb-4 text-xl font-semibold text-[#25282c] md:mb-6 md:text-2xl">
        All Brands
      </h1>

      {error && !loading ? (
        <p className="py-10 text-center text-neutral-500">
          Failed to load brands. Please try again later.
        </p>
      ) : (
        <div className="grid grid-cols-2 border-l border-t border-[#dfe1e5] sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-[repeat(6,minmax(0,1fr))]">
          {loading
            ? Array.from({ length: 18 }).map((_, i) => (
                <div key={i} className={`${cellClass} animate-pulse`} />
              ))
            : brands.map((brand) => {
                const logo = brand.image || brand.logo;
                return (
                  <Link
                    key={brand.id ?? brand.slug}
                    to={`/brand/${brand.slug}`}
                    aria-label={brand.name}
                    className={cellClass}
                  >
                    {logo ? (
                      <img
                        src={logo}
                        alt={brand.name}
                        loading="lazy"
                        draggable={false}
                        className="h-14 w-full max-w-[140px] object-contain object-center mix-blend-multiply md:h-[96px] md:max-w-[180px]"
                      />
                    ) : (
                      <span className="px-3 font-sans text-sm font-bold uppercase tracking-wide text-neutral-700 md:text-base">
                        {brand.name}
                      </span>
                    )}
                  </Link>
                );
              })}
        </div>
      )}
    </section>
  );
}
