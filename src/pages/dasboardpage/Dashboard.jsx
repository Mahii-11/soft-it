import {
  ShoppingBag,
  Heart,
  MessageSquare,
  Clock,
} from "lucide-react";
import Orders from "./Orders";
import Account from "./Account";
import DashboardMenu from "../../components/dashboard/DashboardMenu";
import Header from "../../components/dashboard/Header";
import { useState } from "react";

export default function Dashboard() {
      const [sidebarOpen, setSidebarOpen] = useState(false);
     
 

  const user = {
    name: "Alex Morgan",
    email: "alex.morgan@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Commerce St, Suite 4B\nNew York, NY 10001",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
  };

  const stats = [
    { title: "Total Orders", value: "128", icon: ShoppingBag, color: "bg-blue-100 text-blue-600" },
    { title: "Pending Orders", value: "3", icon: Clock, color: "bg-orange-100 text-orange-600" },
    { title: "Wishlist Items", value: "24", icon: Heart, color: "bg-pink-100 text-pink-600" },
    { title: "Unread Messages", value: "5", icon: MessageSquare, color: "bg-purple-100 text-purple-600" },
  ];

  
 

  return (
      <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900 mt-16">
       <DashboardMenu sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>
    

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
      <Header setSidebarOpen={setSidebarOpen} />

        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900" data-testid="text-welcome">Welcome back, {user.name.split(' ')[0]}! 👋</h1>
                <p className="text-slate-500 mt-1">Here is what's happening with your store today.</p>
              </div>
              <button className="bg-[#5B3DF5] hover:bg-[#4A2EE0] text-white px-4 py-2.5 rounded-lg text-sm font-medium shadow-sm shadow-[#5B3DF5]/20 transition-all active:scale-95 flex items-center gap-2 self-start sm:self-auto" data-testid="button-continue-shopping">
                <ShoppingBag className="w-4 h-4" />
                Continue Shopping
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
              {stats.map((stat, i) => (
                <div key={i} className="bg-white rounded-xl sm:rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow" data-testid={`card-stat-${i}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-slate-500 text-sm font-medium mb-1">{stat.title}</p>
                      <h3 className="text-2xl sm:text-3xl font-bold text-slate-800" data-testid={`text-stat-value-${i}`}>{stat.value}</h3>
                    </div>
                    <div className={`p-3 rounded-xl ${stat.color}`}>
                      <stat.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
             <Orders/>
             <Account/>
            </div>
          </div>
        </div>
      </main>
    </div>
  
  );
}