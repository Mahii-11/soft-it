import { Button } from "../components/ui/button";
import { ShoppingBag, Menu, User, ChevronDown, ChevronRight, Flame, Home, Megaphone } from "lucide-react";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../components/ui/sheet";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {  getTotalCartQuantity, openCart } from "../cart/cartSlice";
import { getTopMenuData } from "../services/api";


// How many top-level categories fit in one row before the rest go under "More"
function getMaxVisible() {
  const w = window.innerWidth;
  if (w >= 1536) return 9;
  if (w >= 1280) return 7;
  return 5;
}

const itemClass =
  "flex items-center justify-between gap-6 whitespace-nowrap rounded-md px-3 py-2.5 text-[15px] font-medium text-neutral-800 transition-colors hover:bg-[#ea5b3a] hover:text-white";

// White rounded panel; items with children open a flyout to the right.
function DropdownPanel({ items, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      className={`absolute left-0 top-full z-50 min-w-60 rounded-lg bg-white p-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.18)] ${className}`}
    >
      {items.map((item) => (
        <div key={item.label} className="group/sub relative">
          <NavLink to={item.href} className={itemClass}>
            <span className="flex items-center gap-2">
              <span className="text-[10px]">&bull;</span>
              {item.label}
            </span>
            {item.children && <ChevronRight className="h-4 w-4" />}
          </NavLink>

          {item.children && (
            <div className="absolute left-full top-0 hidden pl-1.5 group-hover/sub:block">
              <div className="min-w-56 rounded-lg bg-white p-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.18)]">
                {item.children.map((child) => (
                  <NavLink key={child.label} to={child.href} className={itemClass}>
                    <span className="flex items-center gap-2">
                      <span className="text-[10px]">&bull;</span>
                      {child.label}
                    </span>
                  </NavLink>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </motion.div>
  );
}

export default function Navbar() {
  const [navItems, setNavItems] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [maxVisible, setMaxVisible] = useState(getMaxVisible);
  const totalCartQuantity = useSelector(getTotalCartQuantity);
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const onResize = () => setMaxVisible(getMaxVisible());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);


useEffect(() => {
  async function loadMenu() {
    try {
      const data = await getTopMenuData();

      const formattedMenu = data
        .map((item) => ({
          label: item.name,
          href: `/category/${item.slug}`,
          children: item.sub_categories?.length
            ? item.sub_categories.map((sub) => ({
                label: sub.name,
                href: `/category/${item.slug}/${sub.slug}`,
                children: sub.child_categories?.length
                  ? sub.child_categories.map((child) => ({
                      label: child.name,
                      href: `/category/${item.slug}/${sub.slug}/${child.slug}`,
                    }))
                  : undefined,
              }))
            : undefined,
        }));

      setNavItems(formattedMenu);
    } catch (error) {
      console.error(error);
    }
  }

  loadMenu();
}, []);


  const visibleItems = navItems.slice(0, maxVisible);
  const moreItems = navItems.slice(maxVisible);

  return (
    <>
      {/* Desktop category bar */}
      {/* top-24 = Header height on desktop (32px utility bar + 64px main bar) */}
      <nav className="sticky top-24 z-40 hidden bg-[#26282d] text-white lg:block">
        <div className="container-custom flex h-12 items-center justify-between">
          <div className="flex h-full items-center gap-7">
            {visibleItems.map((item) => (
              <div
                key={item.label}
                className="relative flex h-full items-center transition hover:text-[#ea5b3a]"
                onMouseEnter={() => item.children && setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <NavLink
                  to={item.href}
                  className="flex items-center gap-1 whitespace-nowrap text-[15px] font-medium"
                >
                  {item.label}
                  {item.children && <ChevronDown className="h-4 w-4" />}
                </NavLink>

                <AnimatePresence>
                  {item.children && openDropdown === item.label && (
                    <DropdownPanel items={item.children} />
                  )}
                </AnimatePresence>
              </div>
            ))}

            {moreItems.length > 0 && (
              <div
                className="relative flex h-full items-center transition hover:text-[#ea5b3a]"
                onMouseEnter={() => setOpenDropdown("__more")}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button className="flex items-center gap-1 whitespace-nowrap text-[15px] font-medium">
                  More
                  <ChevronDown className="h-4 w-4" />
                </button>

                <AnimatePresence>
                  {openDropdown === "__more" && <DropdownPanel items={moreItems} />}
                </AnimatePresence>
              </div>
            )}
          </div>

          <Link
            to="/online-sale"
            className="flex items-center gap-2 rounded border border-white/20 border-b-[#ea5b3a] px-4 py-1.5 text-[15px] font-medium transition hover:text-[#ea5b3a]"
          >
            <Megaphone className="h-4 w-4" />
            Offer
          </Link>
        </div>
      </nav>

      {/* Mobile bottom bar */}
      <div className="fixed bottom-3 left-1/2 z-50 w-[92%] max-w-md -translate-x-1/2 lg:hidden">
        <div className="grid grid-cols-6 place-items-center rounded-2xl border border-white/40 bg-white/80 px-2 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl">

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5 text-black" />
              </Button>
            </SheetTrigger>

            <SheetContent side="left" className="w-72">
              <SheetHeader>
                <SheetTitle className="text-left text-xl font-bold text-black font-space">
                  Menu
                </SheetTitle>
              </SheetHeader>

              <div className="mt-6 space-y-4">
                {/* Links */}
                {navItems.map((item) => (
                  <p
                    key={item.label}
                    className="cursor-pointer text-[#0F172A] hover:text-red-600 transition font-medium"
                  >
                    {item.children ? (
                      <div>
                        <button
                          onClick={() =>
                            setOpenDropdown(
                              openDropdown === item.label ? null : item.label
                            )
                          }
                          className="flex items-center justify-between w-full py-2 text-political-dark font-medium"
                        >
                          {item.label}
                          <ChevronDown
                            className={`w-4 h-4 transition-transform ${
                              openDropdown === item.label ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        <AnimatePresence>
                          {openDropdown === item.label && (
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: "auto" }}
                              exit={{ height: 0 }}
                              className="overflow-hidden pl-4"
                            >
                              {item.children.map((child) => (
                                <NavLink
                                  key={child.label}
                                  to={child.href}
                                  className={({ isActive }) =>
                                    `block py-2 text-[#64748B] hover:text-red-600 ${
                                      isActive ? "text-red-600" : ""
                                    }`
                                  }
                                  onClick={() => setIsOpen(false)}
                                >
                                  {child.label}
                                </NavLink>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <NavLink
                        to={item.href}
                        className={({ isActive }) =>
                          `block py-2 font-medium ${
                            isActive
                              ? "text-white"
                              : "text-gray-300 "
                          }`
                        }
                        onClick={() => setIsOpen(false)}
                      >
                        {item.label}
                      </NavLink>
                    )}
                  </p>
                ))}
              </div>
            </SheetContent>
          </Sheet>

          <Link
            to="/"
            className="flex flex-col items-center justify-center text-black transition-transform active:scale-95"
          >
            <Home className="h-5 w-5" />
          </Link>

          <Link
            to="/search"
            className="flex flex-col items-center justify-center text-black transition-transform active:scale-95"
          >
            <HiOutlineMagnifyingGlass size={22} />
          </Link>

          <Link
            to="/online-sale"
            className="flex flex-col items-center justify-center text-black transition-transform active:scale-95"
          >
            <span className="relative flex h-5 w-5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-600 opacity-75"></span>
              <Flame className="h-5 w-5" />
            </span>
          </Link>

          <button
            type="button"
            onClick={() => dispatch(openCart())}
            aria-label="Cart"
            className="relative flex flex-col items-center justify-center text-black transition-transform active:scale-95"
          >
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute -top-1 -right-2 h-4 w-4 text-[9px] bg-black text-white rounded-full flex items-center justify-center">
              {totalCartQuantity}
            </span>
          </button>

          <Link
            to={token  ? "/dashboard" : "/login"}
            className="flex flex-col items-center justify-center text-black transition-transform active:scale-95"
          >
            <User className="h-5 w-5" />
          </Link>

        </div>
      </div>
    </>
  );
}
