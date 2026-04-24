import {  Search  } from "lucide-react";
import { MapPin } from "lucide-react";
import { Input } from "./ui/input";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getsearchProducts } from "../services/api";
import useDebounce from "../hooks/useDebounce";


export default function Header() {
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

    const handleSearch = (e) => {
  setSearch(e.target.value);
};


   const handleKeyDown = (e) => {
  if (e.key === "Enter" && search.trim()) {

    setProducts([]);
    navigate(`/search-results?q=${encodeURIComponent(search)}`);
    setSearch("");

  }
};

  return (

    <>
  
    <nav className="sticky top-0 z-50 w-full border border-[#E2E8F0] bg-[#F8FAFC] backdrop-blur-md">
      <div className="container-custom flex h-16 items-center justify-between gap-4">
        
        {/* Logo */}
        <Link to="/">
     { /*  <div className="flex items-center gap-2 cursor-pointer">
         <div className="flex items-center cursor-pointer">
           <img
            src="/images/logo-softit.png"
            alt="company logo"
            className="h-8 md:h-9 w-auto object-contain"
             />
           </div>
        </div> */}
            <div className="flex items-center gap-2">
               <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center text-white font-bold text-xl">
              
                G
            </div>
             
              <span className="text-xl font-bold font-display text-gray-950 tracking-tight">GadgetGlobe</span>
              
            </div>
        
        </Link>
        {/* Search */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              value={search}
              onChange={handleSearch}
              onKeyDown={handleKeyDown}
              placeholder="Search gadgets..."
              className="pl-9 h-10 rounded-full"
            />
          </div>
        </div>
       
         <div className="flex items-center gap-2 sm:gap-4">
          <Link to="/online-sale">
          <span className="text-black bg-clip-text  text-xl font-bold font-display hidden sm:block tracking-tight">
          Online 
          <span className="bg-clip-text text-red-600">
          Sale!
         </span>
         </span>
          </Link>
        </div>

        {/* Actions */}
           <div className="flex items-center gap-2">
             <span className="relative flex h-5 w-5">
             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-600 opacity-75"></span>
             <MapPin className="relative h-5 w-5 text-red-600" />
             </span>

             <Link to="/our-location">
              <span className="font-space text-red-600 uppercase text-xl font-bold tracking-tighter">
              Our Store
              </span>
             </Link>
            </div>
      </div>

        
    </nav>



          {products.length > 0 && (
  <div className="fixed inset-0 z-[999] bg-black/30 backdrop-blur-sm">

    <div className="flex justify-center pt-20 px-3 sm:px-6">

      <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl max-h-[75vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b">

          <h2 className="text-sm sm:text-base font-semibold">
            Product Search By:
            <span className="text-orange-500 ml-1">{search}</span>
          </h2>

          <button
            onClick={() => setProducts([])}
            className="text-gray-500 hover:text-black text-sm"
          >
            Close
          </button>

        </div>

        {/* Product List */}
        <div className="p-3 sm:p-5 space-y-3">

          {products.slice(0, 8).map((product) => (

            <div
              key={product.id}
              className="flex items-center gap-3 sm:gap-4 bg-gray-100 rounded-lg p-3 sm:p-4 hover:shadow-md transition"
            >

              {/* Image */}
              <img
                src={product.image}
                alt={product.name}
                className="w-16 h-16 sm:w-20 sm:h-20 object-contain flex-shrink-0"
              />

              {/* Product Info */}
              <div className="flex-1">

                <p className="text-xs sm:text-sm font-medium text-gray-800 line-clamp-2">
                  {product.name}
                </p>

                <p className="text-orange-500 font-semibold mt-1 text-sm sm:text-base">
                  Tk. {product.price}
                </p>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>

  </div>
)}
</>
);
}
