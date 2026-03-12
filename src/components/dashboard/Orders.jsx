import { Download, Eye, CheckCircle2, Package, Clock } from "lucide-react";

export default function Orders() {
  const allOrders = [
    { id: "#ORD-7352", product: "Wireless Noise-Cancelling Headphones", status: "Delivered", date: "Oct 24, 2023", amount: "$249.99" },
    { id: "#ORD-7353", product: "Minimalist Mechanical Keyboard", status: "Processing", date: "Oct 26, 2023", amount: "$129.50" },
    { id: "#ORD-7354", product: "Ergonomic Office Chair", status: "Shipped", date: "Oct 27, 2023", amount: "$399.00" },
    { id: "#ORD-7355", product: "USB-C Hub Multiport Adapter", status: "Delivered", date: "Oct 28, 2023", amount: "$45.99" },
    { id: "#ORD-7356", product: "4K Monitor 27-inch", status: "Pending", date: "Oct 29, 2023", amount: "$349.00" },
    { id: "#ORD-7357", product: "Wireless Mouse Pro", status: "Delivered", date: "Oct 30, 2023", amount: "$79.99" },
    { id: "#ORD-7358", product: "Monitor Arm Stand", status: "Shipped", date: "Oct 31, 2023", amount: "$89.50" },
    { id: "#ORD-7359", product: "Desk Lamp LED", status: "Delivered", date: "Nov 01, 2023", amount: "$45.00" },
  ];

  // ✅ Object mapping for dynamic status badges
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
      <span className={`px-3 py-1 text-xs font-medium rounded-full flex items-center gap-1 w-max ${config.color}`}>
        <Icon className="w-3 h-3" />
        {status}
      </span>
    );
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Your Orders</h1>
          <p className="text-slate-500 mt-1">Track and manage all your orders in one place.</p>
        </div>

        <button className="bg-[#5B3DF5] hover:bg-[#4A2EE0] text-white px-4 py-2.5 rounded-lg text-sm font-medium shadow-sm shadow-[#5B3DF5]/20 transition-all active:scale-95 flex items-center gap-2 self-start sm:self-auto">
          <Download className="w-4 h-4" />
          Download Invoice
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mt-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-5 sm:px-6 py-4 font-semibold">Order ID</th>
                <th className="px-5 sm:px-6 py-4 font-semibold">Product</th>
                <th className="px-5 sm:px-6 py-4 font-semibold">Status</th>
                <th className="px-5 sm:px-6 py-4 font-semibold hidden sm:table-cell">Date</th>
                <th className="px-5 sm:px-6 py-4 font-semibold">Amount</th>
                <th className="px-5 sm:px-6 py-4 font-semibold text-center">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {allOrders.map((order, i) => (
                <tr key={i} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-5 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{order.id}</td>
                  <td className="px-5 sm:px-6 py-4 text-sm text-slate-600 max-w-[200px] truncate">{order.product}</td>
                  <td className="px-5 sm:px-6 py-4 whitespace-nowrap">{getStatusBadge(order.status)}</td>
                  <td className="px-5 sm:px-6 py-4 whitespace-nowrap text-sm text-slate-500 hidden sm:table-cell">{order.date}</td>
                  <td className="px-5 sm:px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-800">{order.amount}</td>
                  <td className="px-5 sm:px-6 py-4 whitespace-nowrap text-center">
                    <button className="text-[#5B3DF5] hover:bg-[#5B3DF5]/10 p-2 rounded-lg transition-colors inline-flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}