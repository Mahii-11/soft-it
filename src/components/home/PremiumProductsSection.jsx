import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { getProductsByEndpoint } from "../../services/api";
import Loader from "../../loader/Loader";

const sections = [
  {
    title: "Featured products",
    endpoint: "featured-product-data",
    products: [],
  },
  {
    title: "New Arrivals",
    endpoint: "new-arrival-product-data",
    products: [],
  },
  {
    title: "Best Selling Product",
    endpoint: "featured-product-data",
    products: [],
  },
];

export default function PremiumProductsSection() {
  const [dataSections, setDataSections] = useState(sections);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const updatedSections = await Promise.all(
          sections.map(async (section) => {
            const products = await getProductsByEndpoint(section.endpoint);
            return {
              ...section,
              products: products?.slice(0, 3) || [],
            };
          })
        );

        setDataSections(updatedSections);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  if (loading) return <Loader type="products" />;

  return (
    <section className="bg-white py-10 md:py-14">
      <div className="max-w-7xl mx-auto px-4">
        {/* 3 Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-8 lg:gap-12">
          {dataSections.map((section, i) => (
            <div key={i}>
              {/* Title */}
              <h2 className="text-[20px] sm:text-[24px] md:text-[28px] leading-none font-normal text-black mb-8">
                {section.title}
              </h2>

              {/* Products */}
              <div className="space-y-10">
                {section.products.map((product, index) => (
                  <div key={index} className="flex gap-5 items-start group">
                    {/* Image */}
                    <div className="relative w-[88px] h-[88px] shrink-0 flex items-center justify-center">
                      {/* badge */}
                      <span className="absolute -top-1 -left-1 z-10 bg-[#f44336] text-white text-[10px] px-2 py-[2px] rounded-full font-semibold">
                        -25%
                      </span>

                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain transition duration-300 group-hover:scale-105"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 pt-1">
                      {/* Name */}
                      <h3 className="text-[15px] sm:text-[16px] md:text-[17px] leading-[1.35] text-black line-clamp-2 mb-3">
                        {product.name}
                      </h3>

                      {/* Show stars only for 3rd section */}
                      {i === 2 && (
                        <div className="flex items-center gap-1 mb-2">
                          <div className="flex text-[#F5A623]">
                            {[...Array(4)].map((_, idx) => (
                              <Star
                                key={idx}
                                className="w-4 h-4 fill-current"
                                strokeWidth={0}
                              />
                            ))}
                            <Star
                              className="w-4 h-4 text-gray-300 fill-current"
                              strokeWidth={0}
                            />
                          </div>

                          <span className="text-[#7c7c7c] text-[13px] ml-1">
                            (1.234)
                          </span>
                        </div>
                      )}

                      {/* Price */}
                      <p className="text-black font-semibold text-[15px] sm:text-[20px] md:text-[22px] leading-none">
                        {i === 2 ? "$59.99" : `${product.price} Tk`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}