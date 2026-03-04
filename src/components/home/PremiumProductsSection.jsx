import { Star, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import {  getProductsByEndpoint } from "../../services/api";
import Loader from "../../loader/Loader";

const sections = [
  { title: "Featured Products", endpoint: "featured-product-data", products: [] },
  { title: "New Arrivals", endpoint: "new-arrival-product-data", products: [] },
 // { title: "Best Selling Product", endpoint: "best-selling-data", products: [] },
];

export default function PremiumProductsSection() {
    const [dataSections, setDataSections] = useState(sections);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    const fetchAll = async () => {
      try {
        const updatedSections = await Promise.all(
          dataSections.map(async (section) => {
             const products = await getProductsByEndpoint(section.endpoint);
            return { ...section, products }; // populate products dynamically
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






 /* const sections = [
    {
      title: "Featured Products",
      products: [
        { name: "Motorola Edge 60 Pro 5G", price: "40000 Tk", image: "/images/motorola.png" },
        { name: "OnePlus Buds 4 ANC TWS", price: "8450 Tk", image: "/images/oneplus.png" },
        { name: "CMF Watch Pro 2 BT", price: "6500 Tk", image: "/images/cmwatch.png" },
      ],
    },
    {
      title: "New Arrivals",
      products: [
        { name: "CMF Watch Pro 2 BT", price: "6500 Tk", image: "/images/cmwatch.png" },
        { name: "OnePlus Buds 4 ANC TWS", price: "8450 Tk", image: "/images/oneplus.png" },
        { name: "Surface Laptop 5", price: "180000 Tk", image: "/images/laptop.png" },
      ],
    },
    {
      title: "Best Selling Product",
      products: [
        { name: "Instant Pot Vortex Plus XL", price: "$59.99", image: "/images/air.png" },
        { name: "iPad Mini 6 8.3 inch", price: "$59.99", image: "/images/ipad.png" },
        { name: "JBL Live 460nc", price: "$59.99", image: "/images/jbl.png" },
      ],
    },
  ];  */

  return (
    <section className="min-h-screen bg-[#F8FAFC] relative overflow-hidden font-sans">

      <div className="absolute right-0 top-0 bottom-0 w-[45%] lg:w-[35%] z-0 hidden md:block">
        <div className="w-full h-full relative">
          <img
            src="/images/laptop-desk3.png"
            alt="Desk setup"
            className="object-cover object-left-top w-full h-full absolute inset-0"
          />
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#F8FAFC] to-transparent z-10" />
        </div>
      </div>




      <div className="container mx-auto px-4 md:px-8 lg:px-12 py-16 relative z-10 h-full flex flex-col justify-center min-h-screen">
        <div className="w-full md:w-[60%] lg:w-[65%] xl:w-[60%] pr-0 md:pr-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
             {dataSections.map((section, i) => (
            <div key={i} >
              <h2 className="text-xl text-[#0F172A] font-semibold mb-8">
                {section.title}
              </h2>

              <div className="space-y-6">
                {section.products.map((product, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl p-3 flex gap-4 items-center border border-[#E2E8F0] shadow-sm hover:shadow-md transition duration-300"
                  >
                    {/* Image */}
                     <div className="w-24 h-24 sm:w-[100px] sm:h-[100px] flex-shrink-0 relative bg-white rounded-lg overflow-hidden flex items-center justify-center p-2  border border-[#E2E8F0]">
                      <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain"
                      />
                    </div>
                    {/* Info */}
                     <div className="flex flex-col flex-grow py-1 justify-center">
                        <h3 className="text-[13px] sm:text-sm font-semibold text-[#0F172A] leading-snug line-clamp-2 mb-2">
                        {product.name}
                       </h3>


                      <div className="flex items-center gap-2.5 mb-2">
                        <span className="text-[#5B3DF5] font-bold text-[15px]">
                        ৳{product.price.toLocaleString()}
                       </span>
                      </div> 

                      
                  <div className="flex items-center gap-1">
                    <div className="flex text-[#FFA41C]">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-3 h-3 fill-current"
                          strokeWidth={1}
                        />
                      ))}
                    </div>
                    <span className="text-[#64748B] text-[10px] font-medium ml-1">
                      (99)
                    </span>
                  </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          </div>
        </div>
      </div>
    </section>
  );
}
