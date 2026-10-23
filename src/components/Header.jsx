import { Search, ShoppingBag, User, Phone, Mail, Truck, MapPin } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getsearchProducts } from "../services/api";
import useDebounce from "../hooks/useDebounce";
import { getTotalCartQuantity, openCart } from "../cart/cartSlice";
import { useDispatch, useSelector } from "react-redux";

const outlineButton =
  "hidden items-center rounded border border-white/40 px-4 py-2 text-sm font-semibold uppercase text-white transition hover:border-[#ea5b3a] hover:text-[#ea5b3a] lg:inline-flex";

export default function Header() {
  const totalCartQuantity = useSelector(getTotalCartQuantity);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
      <header className="sticky top-0 z-50 w-full bg-[#26282d] text-white">
        {/* Top utility bar */}
        <div className="hidden bg-[#1a1b1e] text-xs lg:block">
          <div className="container-custom flex h-8 items-center justify-between">
            <a href="tel:+15551234567" className="flex items-center gap-1.5 font-semibold">
              <Phone size={13} /> +1 (555) 123-4567
            </a>

            <div className="flex items-center gap-6 font-medium">
              <a href="mailto:support@gadgetglobe.com" className="flex items-center gap-1.5 hover:text-[#ea5b3a]">
                <Mail size={13} /> Contact
              </a>
              <Link to={token ? "/dashboard" : "/login"} className="flex items-center gap-1.5 hover:text-[#ea5b3a]">
                <Truck size={13} /> Track Order
              </Link>
              <Link to="/our-location" className="flex items-center gap-1.5 hover:text-[#ea5b3a]">
                <MapPin size={13} /> Store Locations
              </Link>
            </div>
          </div>
        </div>

        {/* Main bar */}
        <div className="container-custom flex h-16 items-center gap-4 lg:gap-8">
          <Link
            to="/"
            className="shrink-0 -skew-x-6 font-brand text-[22px] font-bold uppercase leading-none tracking-[-0.02em] text-white md:text-[26px]"
          >
            Gadget<span className="ml-1 text-[#ea5b3a]">Globe</span>
          </Link>

          <div className="relative hidden max-w-md flex-1 md:block">
            <input
              type="text"
              value={search}
              onChange={handleSearch}
              onKeyDown={handleKeyDown}
              placeholder="Search for products..."
              className="h-11 w-full rounded bg-[#1a1b1e] pl-4 pr-11 text-sm text-white outline-none placeholder:text-neutral-400 focus:ring-1 focus:ring-[#ea5b3a]"
            />
            <Search className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white" />
          </div>

          <div className="ml-auto flex items-center gap-3">
            <Link to="/our-location" className={outlineButton}>
              Our Store
            </Link>
            <Link to="/online-sale" className={outlineButton}>
              Online Sale
            </Link>

            <button
              type="button"
              onClick={() => dispatch(openCart())}
              aria-label="Cart"
              className="relative hidden h-11 w-11 items-center justify-center rounded-full border border-white/40 transition hover:border-[#ea5b3a] lg:flex"
            >
              <ShoppingBag className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#ea5b3a] text-[9px] font-semibold text-white">
                {totalCartQuantity}
              </span>
            </button>

            <Link
              to={token ? "/dashboard" : "/login"}
              aria-label="Account"
              className="hidden h-11 w-11 items-center justify-center rounded-full bg-white text-[#26282d] transition hover:bg-neutral-200 lg:flex"
            >
              <User className="h-5 w-5" />
            </Link>

            <Link to="/our-location" aria-label="Our store" className="p-2 lg:hidden">
              <MapPin className="h-5 w-5" />
            </Link>
            <Link to="/search" aria-label="Search" className="p-2 md:hidden">
              <Search className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </header>

      {products.length > 0 && (
        <div className="fixed inset-0 z-[999] bg-black/30 backdrop-blur-sm">
          <div className="flex justify-center px-3 pt-20 sm:px-6">
            <div className="max-h-[75vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between border-b px-4 py-4 sm:px-6">
                <h2 className="text-sm font-semibold sm:text-base">
                  Product Search By:
                  <span className="ml-1 text-orange-500">{search}</span>
                </h2>

                <button
                  onClick={() => setProducts([])}
                  className="text-sm text-gray-500 hover:text-black"
                >
                  Close
                </button>
              </div>

              {/* Product List */}
              <div className="space-y-3 p-3 sm:p-5">
                {products.slice(0, 8).map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 rounded-lg bg-gray-100 p-3 transition hover:shadow-md sm:gap-4 sm:p-4"
                  >
                    {/* Image */}
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-16 w-16 flex-shrink-0 object-contain sm:h-20 sm:w-20"
                    />

                    {/* Product Info */}
                    <div className="flex-1">
                      <p className="line-clamp-2 text-xs font-medium text-gray-800 sm:text-sm">
                        {product.name}
                      </p>

                      <p className="mt-1 text-sm font-semibold text-orange-500 sm:text-base">
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
