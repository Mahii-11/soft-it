import { Button } from "../components/ui/button";
import { ShoppingBag, Search, Menu, User, ChevronDown } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../components/ui/sheet";
import { Input } from "./ui/input";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {  getTotalCartQuantity } from "../cart/cartSlice";

export default function Navbar() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const totalCartQuantity = useSelector(getTotalCartQuantity);


  useEffect(() => {
  const handleScroll = () => {
    if (window.scrollY > lastScrollY) {
      // Scrolling down
      setShowNavbar(false);
    } else {
      // Scrolling up
      setShowNavbar(true);
    }
    setLastScrollY(window.scrollY);
  };

  window.addEventListener("scroll", handleScroll);

  return () => {
    window.removeEventListener("scroll", handleScroll);
  };
}, [lastScrollY]);




  const navItems = [
    {label: "phones", href: "/phones",
      children: [
        {label: "smartphones", href: "/phones/smartphones"},
      ]
    },
      {label: "watches", href: "/watches",
      children: [
        {label: "smartwatches", href: "/watches/smartwatches"},
      ]
    },
      {label: "Headphone & Speaker", href: "/headphone-speaker",
      children: [
        {label: "headphones", href: "/headphone-speaker/headphones"},
        {label: "speakers", href: "/headphone-speaker/speakers"},
      ]
    },
      {label: "Accessories", href: "/accessories",
      children: [
        {label: "smartphones", href: "/accessories/smartphones"},
      ]
    },

      {label: "Gadget", href: "/gadget",
      children: [
        {label: "headphones", href: "/gadget/headphones"},
        {label: "speakers", href: "/gadget/speakers"},
      ]
    },

  ];

  return (
    <nav className={`fixed z-40 w-full border-b bg-white border-[#E2E8F0] text-[#0F172A] transition-transform duration-300 ${
    showNavbar ? "translate-y-0" : "-translate-y-full"
  }`}>
      <div className="container-custom h-14 flex items-center gap-4">

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>

          <SheetContent side="left" className="w-72">
            <SheetHeader>
              <SheetTitle className="text-left text-xl font-bold">
                Menu
              </SheetTitle>
            </SheetHeader>

            <div className="mt-6 space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search products..." className="pl-9" />
              </div>

              {/* Links */}
              {navItems.map((item) => (
                <p
                  key={item.children}
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

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-6 text-sm font-medium  text-[#0F172A]">
          {navItems.map((item) => (
            <div
              key={item}
              className="relative hover:text-[#5B3DF5] cursor-pointer transition"
              onMouseEnter={() => 
                item.children && setOpenDropdown(item.label)
              }
              onMouseLeave={() => setOpenDropdown(null)}
            >
              
                {item.children ? (
                  <button
                   className="flex items-center gap-1 text-[13px] font-medium text-[#0F172A] hover:text-[#5B3DF5] transition-colors"
                    data-testid={`nav-${item.label
                      .toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    {item.label}
                    <ChevronDown className="w-4 h-4" />
                  </button>
                ) : (
                 <NavLink
                   to={item.href}
                   className={({ isActive }) =>
                   item.isButton
                 ? "ml-4 rounded-sm px-5 py-2 text-sm font-semibol transition whitespace-nowrap"
                 : `text-sm font-medium transition-colors ${
                 isActive
                 ? "text-[#5B3DF5]"
                 : "text-[#0F172A] hover:text-[#5B3DF5]"
                 }`
             }
            >
           {item.label}
            </NavLink>

                )}

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
                           className={({ isActive }) =>
                           `block whitespace-nowrap px-4 py-2 text-sm transition-colors ${
                            isActive
                            ? "text-[#5B3DF5]"
                            : "text-[#0F172A] hover:text-[#5B3DF5]"
                            }`
                           }
                          data-testid={`nav-${child.label
                            .toLowerCase()
                            .replace(" ", "-")}`}
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

        {/* Center Search */}
        <div className="flex-1 max-w-xl relative mx-auto sm:hidden md:hidden lg:hidden">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
          <Input placeholder="Search products..." className="pl-9" />
        </div>

        {/* Actions */}
        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          
          {/* Cart */}
          <Link to="/cart">
          <Button variant="ghost" size="icon" className="relative text-[#64748B] hover:text-[#5B3DF5]">
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[#5B3DF5] text-white text-[10px] flex items-center justify-center">
              {totalCartQuantity}
            </span>
          </Button>
           </Link>

          {/* User */}
          <Button variant="ghost" size="icon" className="text-[#64748B] hover:text-[#5B3DF5]">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
