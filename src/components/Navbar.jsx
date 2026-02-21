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
import { useState } from "react";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  const [openDropdown, setOpenDropdown] = useState(null);




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
    <nav className="sticky top-0 z-40 w-full border-b b  bg-[#9F28E3] backdrop-blur-md text-stone-100">
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
                  className="cursor-pointer text-muted-foreground hover:text-primary transition font-medium"
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
                                    `block py-2 text-gray-300 hover:text-white ${
                                      isActive ? "text-rose-50" : ""
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
        <div className="hidden lg:flex items-center gap-6 text-sm font-medium  text-white">
          {navItems.map((item) => (
            <div
              key={item}
              className="relative hover:text-gray-900 cursor-pointer transition"
              onMouseEnter={() => 
                item.children && setOpenDropdown(item.label)
              }
              onMouseLeave={() => setOpenDropdown(null)}
            >
              
                {item.children ? (
                  <button
                    className={`flex items-center gap-1 text-[13px] font-medium transition-colors ${
                      item.children.some((c) => c.href === location)
                        ? "text-rose-50"
                        : "text-gray-100 hover:text-white"
                    }`}
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
                 ? "ml-4 rounded-sm bg-pink-500 px-5 py-2 text-sm font-semibold text-gray-200 hover:bg-pink-600 transition whitespace-nowrap"
                 : `text-sm font-medium transition-colors ${
                 isActive
                 ? "text-gray-200"
                : "text-gray-200 hover:text-white"
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
                      className="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-md py-2 min-w-40 z-50"
                    >
                      {item.children.map((child) => (
                        <NavLink
                          key={child.label}
                          to={child.href}
                          className={({ isActive }) =>
                            `block whitespace-nowrap px-4 py-2 text-sm text-gray-400  hover:text-pink-500 transition-colors ${
                              isActive ? "text-pink-600" : ""
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
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search products..." className="pl-9" />
        </div>

        {/* Actions */}
        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          
          {/* Cart */}
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-white text-[10px] flex items-center justify-center">
              0
            </span>
          </Button>

          {/* User */}
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
