import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getsearchProducts } from "../services/api";
import Loader from "../loader/Loader";

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {

    const fetchProducts = async () => {
      if (!query) return;


      try {
        setLoading(true);
        const result = await getsearchProducts(query);
        setProducts(result);
      } catch (error) {
        console.error("Search error", error);

      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

  }, [query]);


   if (loading) {
    return (
      <Loader type="dealofday" count={5} />
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6">

      <h1 className="text-xl font-semibold mb-6">
        Search results for: {query}
      </h1>

         <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">

        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-3xl p-5 flex flex-col transition duration-300 hover:shadow-lg"
            style={{
              boxShadow:
                "0 2px 8px rgba(0,0,0,0.04), 0 8px 20px rgba(0,0,0,0.05)",
            }}
          >

            {/* Image */}
            <div className="h-37.5 flex items-center justify-center mb-4">
              <img
                src={product.image}
                alt={product.name}
                className="h-full object-contain"
              />
            </div>

          

            {/* Product Name */}
            <h3 className="text-[14px] text-center text-gray-700 leading-snug line-clamp-2 min-h-[52px]">
              {product.name}
            </h3>

            {/* Price */}
            <div className="flex items-center justify-center gap-2 mt-3">
              <span className="text-blue-600 font-semibold text-[16px]">
                Tk. {product.price}
              </span>
            </div>

            {/* Button */}
             <button className=" mt-5 rounded-full border border-blue-500 bg-blue-50 text-blue-600 py-2 text-sm font-medium hover:bg-blue-500 hover:text-white transition">
              Buy Now
            </button>
          </div>
          
        ))}
      </div>

    </div>
  );
}