import { Link } from "react-router-dom";
import { Tag } from "lucide-react";
import { getTopMenuData } from "../../services/api";
import useApiData from "../../hooks/useApiData";

// Quick links built from the menu tree: top-level categories first, then their sub categories.
function buildLinks(menu) {
  const links = menu.map((category) => ({
    id: `c${category.id}`,
    name: category.name,
    to: `/category/${category.slug}`,
  }));

  for (const category of menu) {
    for (const sub of category.sub_categories ?? []) {
      links.push({
        id: `s${sub.id}`,
        name: sub.name,
        to: `/category/${category.slug}/${sub.slug}`,
      });
    }
  }
  return links.slice(0, 8);
}

export default function RecommendedForYou() {
  const { data } = useApiData("menu-data", getTopMenuData);
  const links = buildLinks(Array.isArray(data) ? data : []);

  if (links.length === 0) return null;

  return (
    <section className="container-custom py-4 md:py-6">
      <h2 className="mb-4 font-sans text-lg font-bold text-neutral-900 md:text-xl">
        Recommended for You
      </h2>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
        {links.map((item) => (
          <Link
            key={item.id}
            to={item.to}
            className="group flex flex-col items-center gap-2 rounded-md bg-white px-2 py-3 text-center shadow-[0_1px_4px_rgba(0,0,0,0.08)] transition hover:shadow-[0_6px_18px_rgba(0,0,0,0.12)]"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded bg-[#f6f6f6] text-neutral-500 transition-colors group-hover:text-[#ea5b3a]">
              <Tag size={18} />
            </span>
            <span className="line-clamp-1 text-xs text-neutral-700">{item.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
