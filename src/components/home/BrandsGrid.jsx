import { Link } from "react-router-dom";

// No brands endpoint exists yet. Replace these placeholders with real brands:
// put the logo file in /public/images/brands and set `logo: "/images/brands/<file>"`.
// Entries without a logo render the name as text.
const brands = [
  { name: "Brand 1", slug: "brand-1", logo: "" },
  { name: "Brand 2", slug: "brand-2", logo: "" },
  { name: "Brand 3", slug: "brand-3", logo: "" },
  { name: "Brand 4", slug: "brand-4", logo: "" },
  { name: "Brand 5", slug: "brand-5", logo: "" },
  { name: "Brand 6", slug: "brand-6", logo: "" },
  { name: "Brand 7", slug: "brand-7", logo: "" },
  { name: "Brand 8", slug: "brand-8", logo: "" },
  { name: "Brand 9", slug: "brand-9", logo: "" },
  { name: "Brand 10", slug: "brand-10", logo: "" },
  { name: "Brand 11", slug: "brand-11", logo: "" },
  { name: "Brand 12", slug: "brand-12", logo: "" },
  { name: "Brand 13", slug: "brand-13", logo: "" },
];

const cellClass =
  "flex h-20 items-center justify-center border border-neutral-100 px-3 md:h-[120px]";

export default function BrandsGrid() {
  return (
    <section className="container-custom py-4 md:py-6">
      <div className="grid grid-cols-3 bg-white sm:grid-cols-4 lg:grid-cols-7">
        {brands.map((brand) => (
          <Link
            key={brand.slug}
            to={`/brand/${brand.slug}`}
            aria-label={brand.name}
            className={`${cellClass} transition-colors hover:bg-neutral-50`}
          >
            {brand.logo ? (
              <img
                src={brand.logo}
                alt={brand.name}
                loading="lazy"
                draggable={false}
                className="max-h-10 max-w-[70%] object-contain md:max-h-12"
              />
            ) : (
              <span className="font-sans text-sm font-bold uppercase tracking-wide text-neutral-700 md:text-base">
                {brand.name}
              </span>
            )}
          </Link>
        ))}

        <Link
          to="/shop"
          className={`${cellClass} border-[#26282d] bg-[#26282d] text-center text-xs font-semibold text-white transition-colors hover:bg-black md:text-sm`}
        >
          View All Brands
        </Link>
      </div>
    </section>
  );
}
