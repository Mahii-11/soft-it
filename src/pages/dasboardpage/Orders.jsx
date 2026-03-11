import { CheckCircle2, Package, Clock} from "lucide-react"
import { Link } from "react-router-dom";


const recentOrders = [
    { id: "#ORD-7352", product: "Wireless Noise-Cancelling Headphones", status: "Delivered", date: "Oct 24, 2023", amount: "$249.99" },
    { id: "#ORD-7353", product: "Minimalist Mechanical Keyboard", status: "Processing", date: "Oct 26, 2023", amount: "$129.50" },
    { id: "#ORD-7354", product: "Ergonomic Office Chair", status: "Shipped", date: "Oct 27, 2023", amount: "$399.00" },
    { id: "#ORD-7355", product: "USB-C Hub Multiport Adapter", status: "Delivered", date: "Oct 28, 2023", amount: "$45.99" },
    { id: "#ORD-7356", product: "4K Monitor 27-inch", status: "Pending", date: "Oct 29, 2023", amount: "$349.00" },
  ];



   const getStatusBadge = (status) => {
    switch (status) {
      case "Delivered":
        return <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full flex items-center gap-1 w-max" data-testid={`status-${status}`}><CheckCircle2 className="w-3 h-3" /> Delivered</span>;
      case "Processing":
        return <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full flex items-center gap-1 w-max" data-testid={`status-${status}`}><Package className="w-3 h-3" /> Processing</span>;
      case "Shipped":
        return <span className="px-3 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full flex items-center gap-1 w-max" data-testid={`status-${status}`}><Package className="w-3 h-3" /> Shipped</span>;
      case "Pending":
        return <span className="px-3 py-1 text-xs font-medium bg-orange-100 text-orange-700 rounded-full flex items-center gap-1 w-max" data-testid={`status-${status}`}><Clock className="w-3 h-3" /> Pending</span>;
      default:
        return <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full" data-testid={`status-${status}`}>{status}</span>;
    }
  };



export default function Orders() {
  return (


     <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
                <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-800">Recent Orders</h2>
                  <Link href="/dashboard/orders" className="text-[#5B3DF5] hover:text-[#4A2EE0] text-sm font-medium hover:underline cursor-pointer" data-testid="button-view-all-orders">View All</Link>
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
                          <td className="px-5 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900" data-testid={`text-order-id-${i}`}>{order.id}</td>
                          <td className="px-5 sm:px-6 py-4 text-sm text-slate-600 max-w-[200px] truncate">{order.product}</td>
                          <td className="px-5 sm:px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(order.status)}
                          </td>
                          <td className="px-5 sm:px-6 py-4 whitespace-nowrap text-sm text-slate-500 hidden sm:table-cell">{order.date}</td>
                          <td className="px-5 sm:px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-800 text-right">{order.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
   
  )
}
