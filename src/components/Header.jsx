import {  Search  } from "lucide-react";
import { MapPin } from "lucide-react";
import { Input } from "./ui/input";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container-custom flex h-16 items-center justify-between gap-4">
        
        {/* Logo */}
        <Link to="/">
         <div className="flex items-center gap-2 cursor-pointer">
         <div className="flex items-center cursor-pointer">
           <img
            src="/images/logo-softit.png"
            alt="company logo"
            className="h-8 md:h-9 w-auto object-contain"
             />
           </div>
        </div>
        
        </Link>
        {/* Search */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search gadgets..."
              className="pl-9 h-10 rounded-full"
            />
          </div>
        </div>

         <div className="flex items-center gap-2 sm:gap-4">
         <span className="bg-gradient-to-br from-primary to-violet-600 bg-clip-text text-transparent  text-xl font-bold font-display hidden sm:block tracking-tight">
          Online 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
          Sale!
         </span>
         </span>
        </div>

        {/* Actions */}
        <div className="sm:flex items-center gap-2 sm:gap-4 hidden">
         <MapPin className="h-5 w-5 text-primary" /> 
         <span className="bg-gradient-to-br from-primary to-violet-600 bg-clip-text text-transparent  text-xl font-bold font-display hidden sm:block tracking-tight">
          Our Store
         </span>
        </div>
      </div>
    </nav>
  );
}
