import { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import Overview from "../components/dashboard/Overview";
import Orders from "../components/dashboard/Orders";
import Wishlist from "../components/dashboard/Wishlist";
import AccountSettings from "../components/dashboard/AccountSettings";

export default function Dashboard() {
const [sidebarOpen, setSidebarOpen] = useState(false);
const [activeTab, setActiveTab] = useState("dashboard");

const user = {
name: "MA AHI",
email: "adibmahi14@gmail.com",
phone: "01840197327",
address: "Dhanbari Tangail",
avatar: "/images/mahi07.jpg",
joined: "January 15, 2026",
status: "Active Member",
};

return ( 


<div className="min-h-screen bg-slate-50 flex font-sans text-slate-900  sm:mt-6 md:mt-8 lg:mt-16"> 
    <Sidebar
     sidebarOpen={sidebarOpen}
     setSidebarOpen={setSidebarOpen}
     activeTab={activeTab}
     setActiveTab={setActiveTab}
   />

  <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
    <Header
      setSidebarOpen={setSidebarOpen}
      setActiveTab={setActiveTab}
      user={user}
    />

    {/* Dashboard Content Area */}
    <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {activeTab === "dashboard" && (
          <Overview user={user} setActiveTab={setActiveTab} />
        )}

        {activeTab === "orders" && <Orders />}

        {activeTab === "wishlist" && <Wishlist />}

        {activeTab === "profile" && (
          <AccountSettings user={user} />
        )}
      </div>
    </div>
  </main>
</div>

);

}
