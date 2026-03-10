import {  Search  } from "lucide-react";
import { MapPin } from "lucide-react";
import { Input } from "./ui/input";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getsearchProducts } from "../services/api";
import useDebounce from "../hooks/useDebounce";


export default function Header() {
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
              placeholder="Search gadgets..."
              className="pl-9 h-10 rounded-full"
            />
          </div>
        </div>
       
         <div className="flex items-center gap-2 sm:gap-4">
          <Link to="/online-sale">
          <span className="text-[#5B3DF5] bg-clip-text  text-xl font-bold font-display hidden sm:block tracking-tight">
          Online 
          <span className="bg-clip-text text-[#5B3DF5]">
          Sale!
         </span>
         </span>
          </Link>
        </div>

        {/* Actions */}
           <div className="flex items-center gap-2">
             <span className="relative flex h-5 w-5">
             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5B3DF5] opacity-75"></span>
             <MapPin className="relative h-5 w-5 text-[#5B3DF5]" />
             </span>

             <span className="font-space text-[#5B3DF5] uppercase text-xl font-bold tracking-tighter">
              Our Store
              </span>
            </div>
      </div>

        
    </nav>




  {products.length > 0 && (
  <div className="fixed inset-0 z-[999] bg-black/40 backdrop-blur-sm">

    <div className="flex justify-center pt-24 px-4 h-full">

      <div
        className="
        bg-white
        w-full
        max-w-4xl
        rounded-2xl
        shadow-2xl
        p-6
        max-h-[70vh]
        overflow-y-auto
        overscroll-contain
        "
      >

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
</>
);
}
