import { Button } from "../components/ui/button";
import { ShoppingBag, Search, Menu, User } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../components/ui/sheet";
import { Input } from "./ui/input";

export default function Navbar() {
  const navItems = [
    "Phones",
    "Watches",
    "Headphone & Speaker",
    "Accessories",
    "Gadget",
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
                  key={item}
                  className="cursor-pointer text-muted-foreground hover:text-primary transition font-medium"
                >
                  {item}
                </p>
              ))}
            </div>
          </SheetContent>
        </Sheet>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-6 text-sm font-medium  text-white">
          {navItems.map((item) => (
            <span
              key={item}
              className="hover:text-gray-900 cursor-pointer transition"
            >
              {item}
            </span>
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
