import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  Heart,
  Settings,
  LifeBuoy,
  LogOut,
  Package,
  X,
} from "lucide-react";



export default function DashboardMenu({ sidebarOpen, setSidebarOpen }) {
     
  return (
    <div>
        {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
          data-testid="overlay-sidebar"
        />
      )}

      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out flex flex-col ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
          <Link to="/dashboard" className="flex items-center gap-2 text-[#5B3DF5] font-bold text-xl tracking-tight cursor-pointer hover:opacity-80">
            <ShoppingBag className="w-6 h-6 stroke-[2.5]" />
            <span>ShopDash</span>
          </Link>
          <button className="lg:hidden text-slate-500 hover:text-slate-700" onClick={() => setSidebarOpen(false)} data-testid="button-close-sidebar">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">Menu</div>
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#5B3DF5]/10 text-[#5B3DF5] font-medium transition-colors" data-testid="link-dashboard">
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </div>
          <Link to="/dashboard/orders" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium transition-colors cursor-pointer" data-testid="link-orders">
            <Package className="w-5 h-5" />
            Orders
          </Link>
        
          <Link to="/dashboard/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium transition-colors cursor-pointer" data-testid="link-settings">
            <Settings className="w-5 h-5" />
            Account Settings
          </Link>
          <div className="pt-6 mt-2 border-t border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">Help</div>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium transition-colors" data-testid="link-support">
            <LifeBuoy className="w-5 h-5" />
            Support
          </a>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-red-600 hover:bg-red-50 font-medium transition-colors" data-testid="button-logout">
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

    </div>
  )
}
