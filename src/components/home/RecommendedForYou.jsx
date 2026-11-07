import { Link } from "react-router-dom";
import { getJustForYou } from "../../services/api";
import useApiData from "../../hooks/useApiData";

// API: /just-for-you -> [{ id, name, slug, image, total_views }] (total_views UI তে লাগে না)
export default function RecommendedForYou() {
  const { data } = useApiData("just-for-you", getJustForYou);
  const items = Array.isArray(data) ? data.slice(0, 8) : [];

  if (items.length === 0) return null;

  return (
    <section className="container-custom py-3 md:py-6">
      <h2 className="mb-4 font-sans text-base font-bold text-neutral-900 md:text-xl">
        Just for You
      </h2>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
        {items.map((item) => (
          <Link
            key={item.id}
            to={`/category/${item.slug}`}
            className="group flex flex-col items-center gap-2 rounded-md bg-white px-2 py-3 text-center shadow-[0_1px_4px_rgba(0,0,0,0.08)] transition hover:shadow-[0_6px_18px_rgba(0,0,0,0.12)]"
          >
            <img
              src={item.image}
              alt={item.name}
              loading="lazy"
              className="h-16 w-16 rounded object-cover"
            />
            <span className="line-clamp-1 text-xs text-neutral-700">{item.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
