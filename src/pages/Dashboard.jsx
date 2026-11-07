import { useEffect, useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import Overview from "../components/dashboard/Overview";
import Orders from "../components/dashboard/Orders";
import Wishlist from "../components/dashboard/Wishlist";
import AccountSettings from "../components/dashboard/AccountSettings";
import AddressBook from "../components/dashboard/AddressBook";
// import RewardPoints from "../components/dashboard/RewardPoints"; // Points - future এ চালু হবে
import TrackOrder from "../components/dashboard/TrackOrder";
import { useSearchParams } from "react-router-dom";
import PasswordSettings from "../components/dashboard/PasswordSettings";
import { getUserProfile } from "../services/api";

// Dashboard এর layout এর মতো skeleton — loading এর সময় page jump করে না
function DashboardSkeleton() {
  const bar = "rounded-md bg-slate-200";
  return (
    <div className="min-h-screen bg-slate-50 flex" role="status" aria-label="Loading dashboard">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col gap-3 border-r border-slate-200 bg-white p-5 animate-pulse">
        <div className={`${bar} h-8 w-32 mb-4`} />
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className={`${bar} h-5 w-5`} />
            <div className={`${bar} h-4 flex-1`} />
          </div>
        ))}
      </aside>

      <main className="flex-1 min-w-0">
        {/* Top bar */}
        <div className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 animate-pulse">
          <div className={`${bar} h-5 w-40`} />
          <div className="flex items-center gap-3">
            <div className={`${bar} h-9 w-9 rounded-full`} />
            <div className={`${bar} h-4 w-24 hidden sm:block`} />
          </div>
        </div>

        <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8 animate-pulse">
          {/* Welcome banner */}
          <div className="h-32 rounded-2xl bg-gradient-to-r from-[#ea5b3a]/25 to-[#ea5b3a]/10" />

          {/* Stat cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3">
                <div className={`${bar} h-10 w-10 rounded-xl`} />
                <div className={`${bar} h-3 w-20`} />
                <div className={`${bar} h-6 w-28`} />
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
            <div className={`${bar} h-5 w-40`} />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className={`${bar} h-10 w-full`} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // ?tab=track এর মতো লিংক দিয়ে সরাসরি কোনো section এ খোলা যায় (যেমন Header এর Track Order)
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") || "dashboard"
  );

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Load user safely
    useEffect(() => {
  const loadUser = async () => {
    try {
      const res = await getUserProfile();

      console.log("PROFILE RES:", res);

      if (res?.status === true && res?.user) {
        setUser(res.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error(err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  loadUser();
}, []);

  // 🔵 LOADING STATE (IMPORTANT)
  if (loading) {
    return <DashboardSkeleton />;
  }

  // 🔴 NO USER STATE
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        User not found / Unauthorized
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* 🔥 SAFE USER PASS */}
        <Header
          setSidebarOpen={setSidebarOpen}
          setActiveTab={setActiveTab}
          user={user}
        />

        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">

            {activeTab === "dashboard" && (
              <Overview user={user} setActiveTab={setActiveTab} />
            )}

            {activeTab === "orders" && <Orders />}

            {activeTab === "track" && <TrackOrder />}

            {activeTab === "wishlist" && <Wishlist />}

            {/* TODO: Points - future এ চালু করা হবে
            {activeTab === "points" && <RewardPoints />}
            */}

            {activeTab === "address" && <AddressBook user={user} />}

            {activeTab === "password" && <PasswordSettings />}

            {activeTab === "profile" && (
              <AccountSettings user={user} setUser={setUser} />
            )}

          </div>
        </div>

      </main>
    </div>
  );
}