import { ShoppingBag, Clock, Heart, MessageSquare, Package, CheckCircle2, Settings, LifeBuoy } from "lucide-react";

export default function Overview({ user, setActiveTab }) {
  const stats = [
    { title: "Total Orders", value: "128", icon: ShoppingBag, color: "bg-blue-100 text-blue-600" },
    { title: "Pending Orders", value: "3", icon: Clock, color: "bg-orange-100 text-orange-600" },
    { title: "Wishlist Items", value: "24", icon: Heart, color: "bg-pink-100 text-pink-600" },
    { title: "Unread Messages", value: "5", icon: MessageSquare, color: "bg-purple-100 text-purple-600" },
  ];

  const recentOrders = [
    { id: "#ORD-7352", product: "Wireless Noise-Cancelling Headphones", status: "Delivered", date: "Oct 24, 2023", amount: "$249.99" },
    { id: "#ORD-7353", product: "Minimalist Mechanical Keyboard", status: "Processing", date: "Oct 26, 2023", amount: "$129.50" },
    { id: "#ORD-7354", product: "Ergonomic Office Chair", status: "Shipped", date: "Oct 27, 2023", amount: "$399.00" },
    { id: "#ORD-7355", product: "USB-C Hub Multiport Adapter", status: "Delivered", date: "Oct 28, 2023", amount: "$45.99" },
    { id: "#ORD-7356", product: "4K Monitor 27-inch", status: "Pending", date: "Oct 29, 2023", amount: "$349.00" },
  ];

  // ✅ Object mapping pattern
  const statusConfig = {
    Delivered: { color: "bg-green-100 text-green-700", icon: CheckCircle2 },
    Processing: { color: "bg-blue-100 text-blue-700", icon: Package },
    Shipped: { color: "bg-purple-100 text-purple-700", icon: Package },
    Pending: { color: "bg-orange-100 text-orange-700", icon: Clock },
  };

  const getStatusBadge = (status) => {
    const config = statusConfig[status];
    if (!config) {
      return (
        <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
          {status}
        </span>
      );
    }
    const Icon = config.icon;
    return (
      <span
        className={`px-3 py-1 text-xs font-medium rounded-full flex items-center gap-1 w-max ${config.color}`}
        data-testid={`status-${status}`}
      >
        <Icon className="w-3 h-3" />
        {status}
      </span>
    );
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900" data-testid="text-welcome">
            Welcome back, {user.name.split(" ")[0]}! 👋
          </h1>
          <p className="text-slate-500 mt-1">Here is what's happening with your store today.</p>
        </div>

        <button
          className="bg-[#5B3DF5] hover:bg-[#4A2EE0] text-white px-4 py-2.5 rounded-lg text-sm font-medium shadow-sm shadow-[#5B3DF5]/20 transition-all active:scale-95 flex items-center gap-2 self-start sm:self-auto"
          data-testid="button-continue-shopping"
        >
          <ShoppingBag className="w-4 h-4" />
          Continue Shopping
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white rounded-xl sm:rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
            data-testid={`card-stat-${i}`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-500 text-sm font-medium mb-1">{stat.title}</p>
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-800" data-testid={`text-stat-value-${i}`}>
                  {stat.value}
                </h3>
              </div>

              <div className={`p-3 rounded-xl ${stat.color}`}>
                <stat.icon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
          <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">Recent Orders</h2>

            <button
              onClick={() => setActiveTab("orders")}
              className="text-[#5B3DF5] hover:text-[#4A2EE0] text-sm font-medium hover:underline cursor-pointer"
              data-testid="button-view-all-orders"
            >
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="px-5 sm:px-6 py-4 font-semibold">Order ID</th>
                  <th className="px-5 sm:px-6 py-4 font-semibold">Product</th>
                  <th className="px-5 sm:px-6 py-4 font-semibold">Status</th>
                  <th className="px-5 sm:px-6 py-4 font-semibold hidden sm:table-cell">Date</th>
                  <th className="px-5 sm:px-6 py-4 font-semibold text-right">Amount</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {recentOrders.map((order, i) => (
                  <tr key={i} className="hover:bg-slate-50/80 transition-colors group" data-testid={`row-order-${i}`}>
                    <td className="px-5 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900" data-testid={`text-order-id-${i}`}>
                      {order.id}
                    </td>

                    <td className="px-5 sm:px-6 py-4 text-sm text-slate-600 max-w-[200px] truncate">
                      {order.product}
                    </td>

                    <td className="px-5 sm:px-6 py-4 whitespace-nowrap">{getStatusBadge(order.status)}</td>

                    <td className="px-5 sm:px-6 py-4 whitespace-nowrap text-sm text-slate-500 hidden sm:table-cell">
                      {order.date}
                    </td>

                    <td className="px-5 sm:px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-800 text-right">
                      {order.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full relative overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-[#5B3DF5] to-[#8C75F7]"></div>

          <div className="p-6 pt-0 flex-1 flex flex-col relative">
            <img
              src={user.avatar}
              alt="Profile"
              className="w-20 h-20 rounded-full border-4 border-white shadow-sm object-cover absolute -top-10 left-6 bg-white"
              data-testid="img-avatar-profile"
            />

            <div className="mt-12 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-slate-900" data-testid="text-profile-name">
                  {user.name}
                </h2>
                <p className="text-slate-500 text-sm">Member since 2022</p>
              </div>

              <button
                onClick={() => setActiveTab("profile")}
                className="text-slate-400 hover:text-[#5B3DF5] transition-colors p-2 hover:bg-[#5B3DF5]/10 rounded-full cursor-pointer"
                data-testid="button-profile-settings"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 p-2 bg-slate-50 rounded-lg text-slate-400">
                  <MessageSquare className="w-4 h-4" />
                </div>

                <div>
                  <p className="text-xs text-slate-500 font-medium">Email</p>
                  <p className="text-sm text-slate-800" data-testid="text-profile-email">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 p-2 bg-slate-50 rounded-lg text-slate-400">
                  <LifeBuoy className="w-4 h-4" />
                </div>

                <div>
                  <p className="text-xs text-slate-500 font-medium">Phone</p>
                  <p className="text-sm text-slate-800" data-testid="text-profile-phone">
                    {user.phone}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 p-2 bg-slate-50 rounded-lg text-slate-400">
                  <Package className="w-4 h-4" />
                </div>

                <div>
                  <p className="text-xs text-slate-500 font-medium">Default Address</p>
                  <p className="text-sm text-slate-800 whitespace-pre-line" data-testid="text-profile-address">
                    {user.address}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-6">
              <button
                onClick={() => setActiveTab("profile")}
                className="block w-full text-center py-2.5 px-4 border border-[#5B3DF5]/20 text-[#5B3DF5] hover:bg-[#5B3DF5] hover:text-white rounded-lg text-sm font-medium transition-all focus:ring-4 focus:ring-[#5B3DF5]/10 cursor-pointer"
                data-testid="button-edit-profile"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}