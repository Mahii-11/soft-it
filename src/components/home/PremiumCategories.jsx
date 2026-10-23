import { Link } from "react-router-dom";
import { getPremimumCategories } from "../../services/api";
import useApiData from "../../hooks/useApiData";

const PLACEHOLDER = "https://via.placeholder.com/150?text=Category";

export default function PremiumCategories() {
  const { data, loading } = useApiData("premium-categories", getPremimumCategories);

  const categories = (Array.isArray(data) ? data : [])
    .slice()
    .sort((a, b) => a.serial - b.serial);

  if (!loading && categories.length === 0) return null;

  return (
    <section className="container-custom py-6 md:py-8">
      <h2 className="mb-4 font-sans text-lg font-bold text-neutral-900 md:text-xl">
        Popular Categories
      </h2>

      <div className="overflow-x-auto rounded-lg bg-gradient-to-r from-white via-neutral-200 to-white scrollbar-hide">
        <div className="flex min-w-max justify-center gap-6 px-5 py-5 md:gap-10 md:px-8 md:py-6 lg:min-w-0 lg:justify-evenly">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex animate-pulse flex-col items-center gap-3">
                  <div className="h-16 w-16 rounded-full bg-white md:h-[76px] md:w-[76px]" />
                  <div className="h-3 w-14 rounded bg-white" />
                </div>
              ))
            : categories.map((item) => (
                <Link
                  key={item.id}
                  to={`/category/${item.slug}`}
                  className="group flex shrink-0 flex-col items-center gap-3"
                >
                  <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-transform duration-300 group-hover:-translate-y-1 md:h-[76px] md:w-[76px]">
                    <img
                      src={item.image || PLACEHOLDER}
                      alt={item.name}
                      loading="lazy"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = PLACEHOLDER;
                      }}
                    />
                  </div>
                  <span className="max-w-[90px] text-center text-[11px] font-medium text-neutral-800 transition-colors group-hover:text-[#ea5b3a] md:text-xs">
                    {item.name}
                  </span>
                </Link>
              ))}
        </div>
      </div>
    </section>
  );
}
