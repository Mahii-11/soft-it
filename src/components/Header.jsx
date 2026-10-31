import { Search, ShoppingBag, User, Phone, Mail, Truck, MapPin, Megaphone, Menu, MessageSquare } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getsearchProducts } from "../services/api";
import useDebounce from "../hooks/useDebounce";
import { getTotalCartQuantity, openCart } from "../cart/cartSlice";
import { useDispatch, useSelector } from "react-redux";

const outlineButton =
  "hidden items-center rounded border border-white/40 px-4 py-2 text-sm font-semibold uppercase text-white transition hover:border-[#ea5b3a] hover:text-[#ea5b3a] lg:inline-flex";

// Mobile quick-contact buttons. Replace the placeholder number with the real WhatsApp number.
const PHONE = "+15551234567";
const WHATSAPP_HREF = `https://wa.me/${PHONE.replace(/\D/g, "")}`;
const mobileContactButton =
  "flex h-9 w-9 items-center justify-center rounded-full bg-[#ea5b3a] text-white transition active:scale-95 lg:hidden";

// Navbar owns the mobile menu sheet and listens for this event.
export const OPEN_MOBILE_MENU_EVENT = "open-mobile-menu";

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
      <header className="sticky top-0 z-50 w-full rounded-b-3xl bg-[#26282d] text-white lg:rounded-none">
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
        <div className="container-custom flex flex-wrap items-center gap-x-4 gap-y-3 py-3 lg:h-16 lg:flex-nowrap lg:gap-8 lg:py-0">
          <Link
            to="/"
            className="shrink-0 -skew-x-6 font-brand text-[26px] font-bold uppercase leading-none tracking-[-0.02em] text-white md:text-[26px]"
          >
            Gadget<span className="ml-1 text-[#ea5b3a]">Globe</span>
          </Link>

          {/* Search: own row under the logo on mobile, inline from md up */}
          <div className="order-last flex w-full items-center gap-3 md:order-none md:max-w-md md:flex-1">
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => window.dispatchEvent(new Event(OPEN_MOBILE_MENU_EVENT))}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white md:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="relative flex-1">
              <input
                type="text"
                value={search}
                onChange={handleSearch}
                onKeyDown={handleKeyDown}
                placeholder="Search for products..."
                className="h-11 w-full rounded-lg bg-[#1a1b1e] pl-4 pr-11 text-sm text-white outline-none placeholder:text-neutral-400 focus:ring-1 focus:ring-[#ea5b3a] md:rounded"
              />
              <Search className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white" />
            </div>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <Link to="/online-sale" className={outlineButton}>
              <Megaphone className="mr-2 h-4 w-4" />
              Hot Deal
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

            <a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
              className={mobileContactButton}
            >
              <FaWhatsapp className="h-[18px] w-[18px]" />
            </a>
            <a href={`sms:${PHONE}`} aria-label="Send SMS" className={mobileContactButton}>
              <MessageSquare className="h-4 w-4" />
            </a>
            <a href={`tel:${PHONE}`} aria-label="Call us" className={mobileContactButton}>
              <Phone className="h-4 w-4" />
            </a>
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
