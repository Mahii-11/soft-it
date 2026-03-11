import { Button } from "../components/ui/button";
import { ShoppingBag, Menu, User, ChevronDown, Flame, Home } from "lucide-react";
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
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {  getTotalCartQuantity } from "../cart/cartSlice";
import { getTopMenuData } from "../services/api";


export default function Navbar() {
  const [navItems, setNavItems] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const totalCartQuantity = useSelector(getTotalCartQuantity);


  useEffect(() => {
  const handleScroll = () => {

    if (window.innerWidth < 1024) return;

    const currentScroll = window.scrollY;
    if (currentScroll > lastScrollY && currentScroll > 80) {
      setShowNavbar(false);
    } else {
      setShowNavbar(true);
    }

   setLastScrollY(currentScroll);

  };
  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);

}, [lastScrollY]);


useEffect(() => {
  async function loadMenu() {
    try {
      const data = await getTopMenuData();

      const formattedMenu = data
        .filter((item) => item.menu_active === 1)
        .sort((a, b) => a.serial - b.serial)
        .map((item) => ({
          label: item.name,
          href: `/category/${item.slug}`,
          children: item.active_sub_categories.map((sub) => ({
            label: sub.name,
            href: `/category/${item.slug}/${sub.slug}`,
          })),
        }));

      setNavItems(formattedMenu);
    } catch (error) {
      console.error(error);
    }
  }

  loadMenu();
}, []);







  return (
    <nav className={`fixed z-40 bottom-0 left-0 w-full lg:top-[64px] lg:bottom-auto border-b bg-white border-[#E2E8F0] text-[#0F172A] transition-transform duration-300 ${
    showNavbar ? "lg:translate-y-0" : "lg:-translate-y-full"
  }`}>
      <div className="container-custom h-12 sm:h-14 flex items-center gap-4">

      
        {/* Desktop Links */}
       <div className="hidden lg:flex items-center text-sm w-full font-medium text-[#0F172A]">

         <div className="flex items-center gap-6">
           {navItems.map((item) => (
            <div
              key={item.label}
              className="relative hover:text-[#5B3DF5] cursor-pointer transition"
              onMouseEnter={() =>
                item.children && setOpenDropdown(item.label)
              }
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button className="flex items-center gap-1 text-[13px] font-medium hover:text-[#5B3DF5]">
                {item.label}
                {item.children && <ChevronDown className="w-4 h-4" />}
              </button>

              <AnimatePresence>
                {item.children && openDropdown === item.label && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-2 bg-white border border-[#E2E8F0] shadow-sm rounded-md py-2 min-w-40 z-50"
                  >
                    {item.children.map((child) => (
                      <NavLink
                        key={child.label}
                        to={child.href}
                        className="block whitespace-nowrap px-4 py-2 text-sm hover:text-[#5B3DF5]"
                      >
                        {child.label}
                      </NavLink>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
         </div>


         <div className="flex items-center gap-4 ml-auto">
            <Link to="/cart" className="relative">
             <ShoppingBag className="h-5 w-5 text-[#5B3DF5]" />
             <span className="absolute -top-1 -right-2 h-4 w-4 text-[9px] bg-[#5B3DF5] text-white rounded-full flex items-center justify-center">
             {totalCartQuantity}
            </span>
            </Link>
             <Link to="/dashboard">
                <User className="h-5 w-5 text-[#5B3DF5] sm:block" />
            </Link>

         </div>
        </div>


        <div className="lg:hidden fixed bottom-3 left-1/2 -translate-x-1/2 w-[92%] max-w-md z-50">
        <div className="grid grid-cols-6 place-items-center py-3 px-2 rounded-2xl backdrop-blur-xl bg-white/80 border border-white/40 shadow-[0_8px_30px_rgba(0,0,0,0.08)]">

               <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-5 w-5 text-[#5B3DF5]" />
            </Button>
          </SheetTrigger>

          <SheetContent side="left" className="w-72">
            <SheetHeader>
              <SheetTitle className="text-left text-xl font-bold text-[#5B3DF5] font-space">
                Menu
              </SheetTitle>
            </SheetHeader>

            <div className="mt-6 space-y-4">
           

              {/* Links */}
              {navItems.map((item) => (
                <p
                  key={item.label}
                  className="cursor-pointer text-[#0F172A] hover:text-[#5B3DF5] transition font-medium"
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
                                    `block py-2 text-[#64748B] hover:text-[#5B3DF5] ${
                                      isActive ? "text-[#5B3DF5]" : ""
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
      className="flex flex-col items-center justify-center text-[#5B3DF5] transition-transform active:scale-95"
    >
      <Home className="h-5 w-5" />
    </Link>

    <Link
      to="/search"
      className="flex flex-col items-center justify-center text-[#5B3DF5] transition-transform active:scale-95"
    >
      <HiOutlineMagnifyingGlass size={22} />
    </Link>

    <Link
      to="/online-sale"
      className="flex flex-col items-center justify-center text-[#5B3DF5] transition-transform active:scale-95"
    >
      <Flame className="h-5 w-5" />
    </Link>

    <Link
      to="/cart"
      className="relative flex flex-col items-center justify-center text-[#5B3DF5] transition-transform active:scale-95"
    >
      <ShoppingBag className="h-5 w-5" />
      <span className="absolute -top-1 -right-2 h-4 w-4 text-[9px] bg-[#5B3DF5] text-white rounded-full flex items-center justify-center">
        {totalCartQuantity}
      </span>
    </Link>

    <Link
      to="/login"
      className="flex flex-col items-center justify-center text-[#5B3DF5] transition-transform active:scale-95"
    >
      <User className="h-5 w-5" />
    </Link>

  </div>
</div>
      </div>
    </nav>
  );
}
