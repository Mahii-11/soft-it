import { Check,Heart,Eye, Star, ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";


import p1 from "../../assets/products/p1.png";
import p2 from "../../assets/products/p2.png";
import p3 from "../../assets/products/p3.png";
import p4 from "../../assets/products/p4.png";
import p5 from "../../assets/products/p5.png";
import p6 from "../../assets/products/p6.png";
import p7 from "../../assets/products/p7.png";
import p8 from "../../assets/products/p8.png";
import p9 from "../../assets/products/p21.png";
import p10 from "../../assets/products/p10.png";
import p11 from "../../assets/products/p11.png";
import p12 from "../../assets/products/p12.png";

const products = [
  {
    id: 1,
    name: "Trendy Brown Coat",
    category: "Coats",
    rating: 4.8,
    price: 75,
    oldPrice: 150,
    discount: "50% off",
    image: p1,
  },
  {
    id: 2,
    name: "Classy Light Coat",
    category: "Coats",
    rating: 4.9,
    price: 165,
    oldPrice: 220,
    discount: "25% off",
    image: p2,
  },
  {
    id: 3,
    name: "Modern Brown Dress",
    category: "Dresses",
    rating: 4.8,
    price: 90,
    oldPrice: 100,
    discount: "10% off",
    image: p3,
  },
  {
    id: 4,
    name: "Modern Black Dress",
    category: "Dresses",
    rating: 4.9,
    price: 75,
    oldPrice: 100,
    discount: "25% off",
    image: p4,
  },
  {
    id: 5,
    name: "Light Brown Sweater",
    category: "Sweater",
    rating: 4.7,
    price: 63,
    oldPrice: 70,
    discount: "10% off",
    image: p5,
  },
  {
    id: 6,
    name: "Classic White Shirt",
    category: "Shirt",
    rating: 5.0,
    price: 45,
    oldPrice: 50,
    discount: "10% off",
    image: p6,
  },
  {
    id: 7,
    name: "Mustard Casual Shirt",
    category: "Shirt",
    rating: 4.6,
    price: 52,
    oldPrice: 65,
    discount: "25% off",
    image: p7,
  },
  {
    id: 8,
    name: "Elegant Striped Blouse",
    category: "Shirt",
    rating: 4.7,
    price: 58,
    oldPrice: 80,
    discount: "30% off",
    image: p8,
  },
  {
    id: 9,
    name: "Wool Beige Coat",
    category: "Coats",
    rating: 4.8,
    price: 135,
    oldPrice: 180,
    discount: "25% off",
    image: p9,
  },
  {
    id: 10,
    name: "Formal Black Blazer",
    category: "Jackets",
    rating: 4.9,
    price: 120,
    oldPrice: 160,
    discount: "25% off",
    image: p10,
  },
  {
    id: 11,
    name: "Soft Pink Knit",
    category: "Sweater",
    rating: 4.6,
    price: 48,
    oldPrice: 60,
    discount: "20% off",
    image: p11,
  },
  {
    id: 12,
    name: "Floral Summer Dress",
    category: "Dresses",
    rating: 4.7,
    price: 68,
    oldPrice: 95,
    discount: "30% off",
    image: p12,
  },
];

const categories = [
  { id: 1, name: "Smartphones", active: true },
  { id: 2, name: "Laptops", active: false },
  { id: 3, name: "Headphones", active: false },
  { id: 4, name: "Smart Watch", active: false },
  { id: 5, name: "Gaming", active: false },
  { id: 6, name: "Cameras", active: false },
  { id: 7, name: "Accessories", active: false },
];


const colors = [
  { id: 1, name: "Black", hex: "#000000" },
  { id: 2, name: "Gray", hex: "#808080" },
  { id: 3, name: "Green", hex: "#4ade80" },
  { id: 4, name: "Red", hex: "#f87171" },
  { id: 5, name: "Orange", hex: "#fb923c" },
  { id: 6, name: "Blue", hex: "#60a5fa" },
  { id: 7, name: "Pink", hex: "#f472b6" },
  { id: 8, name: "White", hex: "#ffffff", border: true },
];

const sizes = [
  { id: 1, name: "64GB" },
  { id: 2, name: "128GB" },
  { id: 3, name: "256GB" },
  { id: 4, name: "512GB" },
  { id: 5, name: "1TB" },
  { id: 6, name: "2TB" },
];



export default function ShopPage() {
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState("Smartphones");
    const [minPrice, setMinPrice] = useState(25);
    const [maxPrice, setMaxPrice] = useState(125);
    const [activeColor, setActiveColor] = useState("Black");
    const [activeSize, setActiveSize] = useState("64GB");


const filters = [];

if (activeCategory)
  filters.push({
    type: "category",
    label: activeCategory,
  });

if (activeColor)
  filters.push({
    type: "color",
    label: activeColor,
  });

if (activeSize)
  filters.push({
    type: "size",
    label: activeSize,
  });

if (minPrice !== 0 || maxPrice !== 500)
  filters.push({
    type: "price",
    label: `Price: $${minPrice} - $${maxPrice}`,
  });
    
  const removeFilter = (type) => {
  if (type === "category") setActiveCategory("");
  if (type === "color") setActiveColor("");
  if (type === "size") setActiveSize("");
  if (type === "price") {
    setMinPrice(0);
    setMaxPrice(500);
  }
};


const clearAll = () => {
  setActiveCategory("");
  setActiveColor("");
  setActiveSize("");
  setMinPrice(0);
  setMaxPrice(500);
};


  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans sm:mt-10 md:mt-14">
      <div className="relative w-full bg-[#faf9f8] h-40 md:h-56 flex flex-col items-center justify-center overflow-hidden">
        <h1 className="text-4xl md:text-5xl font-bold font-serif tracking-tight text-gray-900 mb-2">
            Shop
        </h1>
        <div className="text-sm font-medium text-gray-500 flex items-center space-x-2">
            <span>Home</span>
            <span className="text-gray-300">/</span>
            <span className="text-accent">Shop</span>           
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 gap-8 flex flex-col lg:flex-row">
  {/* Left side */}

        <div
        className={`lg:w-64 shrink-0 lg:self-start lg:sticky lg:top-4 ${
             mobileFiltersOpen ? "block" : "hidden lg:block"
        }`}
            
        >
            <div className="space-y-8 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto lg:pr-2 hide-scrollbar">
                <div>
                    <h2 className="text-lg font-bold font-serif mb-4">Filter Option</h2>
                </div>
                <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-3">
                       Category 
                    </h3>

                    <ul className="space-y-2">
                        {categories.map((cat) => (
                            <li key={cat.id} className="flex items-center text-sm">
                                <button 
                                 onClick={() => setActiveCategory(cat.name)}
                                className="flex items-center group w-full text-left">
                                    <span
                                    className={`w-3 h-3 border border-gray-300 rounded-sm mr-3 shrink-0 flex items-center justify-center transition-colors ${
                                          activeCategory === cat.name ? "bg-gray-900 border-gray-900" : "group-hover:border-accent"
                                    }`}
                                    >

                                 {activeCategory === cat.name  && (
                                  <Check className="w-2 h-2 text-white" />
                                   )}
                                    </span>

                                      <span
                                       className={`transition-colors ${
                                        activeCategory === cat.name
                                       ? "font-medium text-gray-900"
                                       : "text-gray-600 group-hover:text-accent"
                                         }`}
                                         >
                                    {cat.name}
                                       </span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
           <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-4">
        Price
                </h3>

      <div className="px-2">
        {/* Slider */}
        <input
          type="range"
          min="0"
          max="500"
          value={minPrice}
          onChange={(e) =>
            setMinPrice(
              Math.min(Number(e.target.value), maxPrice - 1)
            )
          }
          className="w-full accent-black"
        />

        <input
          type="range"
          min="0"
          max="500"
          value={maxPrice}
          onChange={(e) =>
            setMaxPrice(
              Math.max(Number(e.target.value), minPrice + 1)
            )
          }
          className="w-full accent-black mt-2"
        />

        {/* Price Text */}
        <div className="mt-4 text-sm text-gray-600 font-medium">
          ${minPrice}.00 - ${maxPrice}.00
        </div>
      </div>
            </div>
            <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-3">
                    Color
                </h3>

              <ul className="space-y-2.5">
                  {colors.map((col) => (
                    <li key={col.id}
                    className="flex items-center text-sm"
                    >
                        <button
                        onClick={() => setActiveColor(col.name)}
                        className="flex items-center group"
                        >
                            <span
                              className={`relative w-4 h-4 rounded-full mr-3 shrink-0 ${
                                col.border ? "border border-gray-300" : ""
                              }`}

                              style={{background: col.hex}}
                            >
                                 {activeColor === col.name && (
                                   <span className="absolute -inset-1 border border-gray-400 rounded-full"></span>
                                  )}
                            </span>
                            <span
                             className={`transition-colors ${
                                activeColor === col.name
                                ? "font-medium text-gray-900"
                                : "text-gray-600 group-hover:text-accent"
                             }`}
                            >
                            {col.name}
                            </span>
                        </button>
                    </li>
                ))}
              </ul>




            </div>
              <div>
  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-3">
    Size
  </h3>

  <ul className="space-y-2">
    {sizes.map((size) => (
      <li key={size.id} className="flex items-center text-sm">
        <button
          onClick={() => setActiveSize(size.name)}
          className="flex items-center group w-full text-left"
        >
          <span
            className={`w-3 h-3 border border-gray-300 rounded-sm mr-3 shrink-0 flex items-center justify-center transition-colors ${
              activeSize === size.name
                ? "bg-gray-900 border-gray-900"
                : "group-hover:border-accent"
            }`}
          >
            {activeSize === size.name && (
              <Check className="w-2 h-2 text-white" />
            )}
          </span>

          <span
            className={`transition-colors ${
              activeSize === size.name
                ? "font-medium text-gray-900"
                : "text-gray-600 group-hover:text-accent"
            }`}
          >
            {size.name}
          </span>
        </button>
      </li>
    ))}
  </ul>
              </div>
            </div>
        </div>


        {/* Right side */}

        <div className="flex-1">
            <div className="lg:hidden mb-4">
                <button
                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                className="flex items-center justify-center space-x-2 text-gray-900 font-medium border border-gray-200 px-4 py-2 rounded-md w-full"
                >

                    <SlidersHorizontal className="w-4 h-4"/>
                     <span>
                     {mobileFiltersOpen
                     ? "Hide Filters"
                     : "Show Filters"}
                   </span>
                </button>
            </div>


            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div className="text-sm text-gray-500 whitespace-nowrap">
                    Showing 1-12 of 240 results
                </div>

                <div className="flex-1 flex flex-wrap items-center gap-2 md:justify-center">
                    <span className="text-sm font-medium text-gray-700 mr-1">
                        Active Filter
                    </span>
                    {filters.map((item) => (
                        <div
                         key={item.type}
                         className="flex items-center bg-accent text-white px-3 py-1 rounded-md text-sm font-medium"
                        >
                          {item.label}

                          <button 
                          onClick={() => removeFilter(item.type)}
                          className="ml-1.5 hover:text-gray-200 transition-colors">
                          <X className="w-3 h-3" />
                           </button>
                        </div>
                    ))}
                     <button 
                     onClick={clearAll}
                     className="text-sm text-gray-500 underline ml-2 hover:text-gray-900 transition-colors">
                       Clear All
                    </button>
                </div>

                <div className="flex items-center space-x-2 whitespace-nowrap">
                    <span className="text-sm text-gray-600">
                        Sort By:
                    </span>

                    <div className="relative">
                        <select className="appearance-none border border-gray-200 rounded-md py-1.5  pl-3 pr-8 text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent">
                            <option>Default Sorting</option>
                            <option>Price: Low to High</option>
                            <option>Price: High to Low</option>
                            <option>Newest Arrivals</option>
                        </select>
                         <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                           <ChevronDown className="w-4 h-4" />
                         </div>
                    </div>
                </div>
            </div>


              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-in-out"
                  />

                  {product.discount && (
                    <div className="absolute top-3 left-3 bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                      {product.discount}
                    </div>
                  )}

                  <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-x-4 group-hover:translate-x-0">
                    <button className="bg-white p-2 rounded-full shadow-md text-gray-600 hover:text-accent hover:scale-110 transition-all duration-200">
                      <Heart className="w-4 h-4" />
                    </button>

                    <button className="bg-white p-2 rounded-full shadow-md text-gray-600 hover:text-accent hover:scale-110 transition-all duration-200">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-4 flex flex-col flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                      {product.category}
                    </span>

                    <div className="flex items-center text-accent">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="text-xs font-medium ml-1 text-gray-600">
                        {product.rating}
                      </span>
                    </div>
                  </div>

                  <h4
                    className="font-semibold text-gray-900 mb-2 truncate"
                    title={product.name}
                  >
                    {product.name}
                  </h4>

                  <div className="mt-auto flex items-center space-x-2">
                    <span className="font-bold text-gray-900">
                      ${product.price.toFixed(2)}
                    </span>

                    <span className="text-sm text-gray-400 line-through">
                      ${product.oldPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>




        </div>











      </div>
    </div>
  )
}
