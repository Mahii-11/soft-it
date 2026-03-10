import { Search, ArrowLeft } from "lucide-react";
import { Input } from "../components/ui/input";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getsearchProducts } from "../services/api";
import useDebounce from "../hooks/useDebounce";

export default function SearchPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);

  const debounceSearch = useDebounce(search, 500);



  useEffect(() => {

    const fetchProducts = async () => {

      if (!debounceSearch) {
        setProducts([]);
        return;
      }

      const result = await getsearchProducts(debounceSearch);

      console.log("Products:", result);

      setProducts(result);

    };

    fetchProducts();

  }, [debounceSearch]);
  


  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearch(value);

    if (!value) return;

    const products = await getsearchProducts(value);
    console.log("Products:", products);
  }


  return (
    <div className="min-h-screen bg-white">

      {/* Top bar */}
      <div className="flex items-center gap-3 p-4 border-b">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-100 transition"
        >
          <ArrowLeft className="h-5 w-5 text-gray-700" />
        </button>

        <h1 className="text-lg font-semibold text-gray-900">
          Search
        </h1>
      </div>

      {/* Search Input */}
      <div className="p-4">
        <div className="relative">

          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />

          <Input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={handleSearch}
            className="
            pl-11
            h-12
            rounded-full
            border
            border-gray-200
            bg-gray-50
            focus:bg-white
            focus:border-[#5B3DF5]
            focus:ring-2
            focus:ring-[#5B3DF5]/20
            transition
            "
            
          />
        </div>
      </div>


            <div className="px-4">
              {products.length > 0 && (
                  <div className="fixed inset-0 z-[999] bg-black/40 backdrop-blur-sm">
                    <div className="flex justify-center pt-24 px-4 h-full">
                     <div
                     className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl p-6 max-h-[70vh] overflow-y-auto overscroll-contain">

                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                     <h2 className="text-lg font-semibold">
                     Product Search By: <span className="text-primary">{search}</span>
                    </h2>
                    <button
                       onClick={() => setProducts([])}
                       className="text-sm text-gray-500 hover:text-black"
                       >
                      Close
                     </button>
                     </div>

                         {/* Product Grid */}
                       <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        {products.slice(0,8).map((product)=>(
                       <div
                       key={product.id}
                       className="border rounded-xl p-4 hover:shadow-md transition"
                      >

                       <img
                        src={product.image}
                        className="w-full h-40 object-contain mb-3"
                       />

                     <p className="text-sm font-medium line-clamp-2">
                       {product.name}
                    </p>

              <p className="text-orange-500 font-semibold">
                Tk. {product.price}
              </p>

            </div>
          ))}

        </div>

      </div>

    </div>

  </div>
 )}
</div>
</div>
  );
}