import { Search, ShoppingBag, User, Phone, Mail, Truck, MapPin, Megaphone, Menu, MessageSquare } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { getsearchProducts, getUserProfile } from "../services/api";
import { resolveImageUrl } from "../utils/imageUrl";
import useDebounce from "../hooks/useDebounce";
import useSiteInfo from "../hooks/useSiteInfo";
import { formatPrice, getProductPrices } from "./ProductCard";
import { getTotalCartQuantity, openCart } from "../cart/cartSlice";
import { useDispatch, useSelector } from "react-redux";

const outlineButton =
  "hidden items-center rounded border border-white/40 px-4 py-2 text-sm font-semibold uppercase text-white transition hover:border-[#ea5b3a] hover:text-[#ea5b3a] lg:inline-flex";

// Mobile quick-contact buttons (number আসে setting-data / social-data API থেকে)
const mobileContactButton =
  "flex h-9 w-9 items-center justify-center rounded-full bg-[#ea5b3a] text-white transition active:scale-95 lg:hidden";

// Navbar owns the mobile menu sheet and listens for this event.
export const OPEN_MOBILE_MENU_EVENT = "open-mobile-menu";
// Dashboard fires this after a profile update so the header avatar refreshes.
export const PROFILE_UPDATED_EVENT = "profile-updated";

export default function Header() {
  const { phone, dialPhone, whatsappNumber } = useSiteInfo();
  const totalCartQuantity = useSelector(getTotalCartQuantity);
  // useLocation: page change হলে re-render হয়, তাই login/logout এর পর token সঠিক থাকে
  useLocation();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // login করা থাকলে user এর profile photo account icon এ দেখানো হবে
  const [avatar, setAvatar] = useState(null);
  useEffect(() => {
    if (!token) {
      setAvatar(null);
      return;
    }
    let active = true;
    const load = async () => {
      const res = await getUserProfile();
      if (active) setAvatar(res?.status === true && res?.user?.image ? res.user.image : null);
    };
    load();
    // dashboard এ profile update হলে icon ও update হবে
    window.addEventListener(PROFILE_UPDATED_EVENT, load);
    return () => {
      active = false;
      window.removeEventListener(PROFILE_UPDATED_EVENT, load);
    };
  }, [token]);
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const debounceSearch = useDebounce(search, 500);

  // কোন term এর search শেষ হয়েছে - "No results" message দেখানোর জন্য
  const [searchedTerm, setSearchedTerm] = useState(null);

  useEffect(() => {
    let active = true;

    const fetchProducts = async () => {
      if (!debounceSearch.trim()) {
        setProducts([]);
        setSearchedTerm(null);
        return;
      }

      let result = [];
      try {
        result = await getsearchProducts(debounceSearch);
      } catch (error) {
        console.error("Search error", error);
      }
      if (!active) return;
      setProducts(result);
      setSearchedTerm(debounceSearch);
    };

    fetchProducts();
    return () => {
      active = false;
    };
  }, [debounceSearch]);

  // typing চলাকালীন পুরনো "no results" দেখানো হবে না
  const noResults =
    products.length === 0 && !!searchedTerm && searchedTerm === search && !!search.trim();
  const closeSearch = () => {
    setProducts([]);
    setSearchedTerm(null);
  };

  // dropdown এর বাইরে click করলে বন্ধ
  const searchBoxRef = useRef(null);
  useEffect(() => {
    const onDown = (e) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) closeSearch();
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && search.trim()) {
      setProducts([]);
      navigate(`/shop-page?search=${encodeURIComponent(search.trim())}`);
      setSearch("");
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full rounded-b-3xl bg-[#26282d] text-white lg:rounded-none">
        {/* Top utility bar */}
        <div className="hidden bg-[#1a1b1e] text-xs lg:block">
          <div className="container-custom flex h-8 items-center justify-between">
            {phone ? (
              <a
                href={dialPhone ? `tel:${dialPhone}` : undefined}
                className="flex items-center gap-1.5 font-semibold"
              >
                <Phone size={13} /> {phone}
              </a>
            ) : (
              <span />
            )}

            <div className="flex items-center gap-6 font-medium">
              <a
                href="#contact-us"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("contact-us")?.scrollIntoView({ behavior: "smooth", block: "end" });
                }}
                className="flex items-center gap-1.5 hover:text-[#ea5b3a]"
              >
                <Mail size={13} /> Contact
              </a>
              <Link to="/track-order" className="flex items-center gap-1.5 hover:text-[#ea5b3a]">
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
            <div ref={searchBoxRef} className="relative flex-1">
              <input
                type="text"
                value={search}
                onChange={handleSearch}
                onKeyDown={handleKeyDown}
                placeholder="Search for products..."
                className="h-11 w-full rounded-lg bg-[#1a1b1e] pl-4 pr-11 text-sm text-white outline-none placeholder:text-neutral-400 focus:ring-1 focus:ring-[#ea5b3a] md:rounded"
              />
              <Search className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white" />

              {/* Live search dropdown - input এর ঠিক নিচে, input এর সমান width */}
              {(products.length > 0 || noResults) && (
                <div className="absolute left-0 right-0 top-full z-[60] mt-1 max-h-[70vh] overflow-y-auto rounded-md bg-white text-neutral-900 shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
                  {noResults && (
                    <p className="px-4 py-5 text-sm text-neutral-500">
                      No products found for &ldquo;{search}&rdquo;
                    </p>
                  )}

                  {products.slice(0, 8).map((product) => {
                    const { current, original } = getProductPrices(product);
                    return (
                      <Link
                        key={product.id}
                        to={`/product-details/${product.slug}`}
                        onClick={() => {
                          closeSearch();
                          setSearch("");
                        }}
                        className="flex items-center gap-3 border-b border-neutral-100 px-4 py-3 transition last:border-b-0 hover:bg-neutral-50"
                      >
                        <img
                          src={product.image}
                          alt=""
                          className="h-8 w-8 shrink-0 object-contain"
                        />
                        <span className="min-w-0 truncate text-sm text-neutral-800">
                          {product.name}
                        </span>
                        <span className="shrink-0 text-sm font-bold text-neutral-900">
                          {product.type === "variable" && "From "}
                          {formatPrice(current)}
                        </span>
                        {original && (
                          <span className="shrink-0 text-xs text-neutral-400 line-through">
                            {formatPrice(original)}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
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
              {token && avatar ? (
                <img
                  src={resolveImageUrl(avatar)}
                  alt="Profile"
                  className="h-full w-full rounded-full object-cover"
                  onError={() => setAvatar(null)}
                />
              ) : (
                <User className="h-5 w-5" />
              )}
            </Link>

            {whatsappNumber && (
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat on WhatsApp"
                className={mobileContactButton}
              >
                <FaWhatsapp className="h-[18px] w-[18px]" />
              </a>
            )}
            {dialPhone && (
              <>
                <a href={`sms:${dialPhone}`} aria-label="Send SMS" className={mobileContactButton}>
                  <MessageSquare className="h-4 w-4" />
                </a>
                <a href={`tel:${dialPhone}`} aria-label="Call us" className={mobileContactButton}>
                  <Phone className="h-4 w-4" />
                </a>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
