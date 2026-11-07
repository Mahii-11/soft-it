import { useState } from "react";
import { Search } from "lucide-react";
import { trackOrderPublic } from "../services/api";
import { Stepper, formatDate } from "../components/dashboard/TrackOrder";

// Public page: login ছাড়াই order ID + phone দিয়ে order track করা যায়
export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setOrder(null);
    setLoading(true);
    try {
      const id = orderId.trim().replace(/^#?ORD-/i, "");
      setOrder(await trackOrderPublic(id, phone.trim()));
    } catch (err) {
      setError(err.message || "Order not found. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:border-[#ea5b3a] focus:ring-4 focus:ring-[#ea5b3a]/10 transition-all";

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="pb-4 mb-6 border-b border-slate-100">
          <h1 className="text-2xl font-bold text-slate-900">Track Your Order</h1>
          <p className="text-sm text-slate-500 mt-1">
            Enter your order ID and phone number to see your order status. No login required.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2 mb-6">
          <input
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="Order ID (e.g. #ORD-1234)"
            required
            className={inputClass}
          />
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone number"
            required
            className={inputClass}
          />
          <button
            type="submit"
            disabled={loading}
            className="sm:col-span-2 flex items-center justify-center gap-2 h-12 rounded-lg bg-[#ea5b3a] text-sm font-bold uppercase tracking-wide text-white transition hover:bg-[#d44a2a] disabled:bg-neutral-300"
          >
            <Search className="w-4 h-4" /> {loading ? "Searching..." : "Track Order"}
          </button>
        </form>

        {error && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
        )}

        {order && (
          <div className="border border-slate-200 rounded-xl p-5">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
              <div>
                <p className="font-bold text-slate-900">#ORD-{order.order_id}</p>
                <p className="text-sm text-slate-500 mt-0.5">
                  {order.products?.[0]?.name || "No Product Found"}
                  {order.products?.length > 1 && ` +${order.products.length - 1} more`}
                </p>
              </div>
              <div className="text-right text-sm">
                <p className="text-slate-500">Placed on {formatDate(order.order_date)}</p>
                <p className="font-semibold text-slate-900 mt-0.5">
                  ৳{Number(order.total_amount || 0).toLocaleString()}
                </p>
              </div>
            </div>
            <Stepper status={Number(order.order_status)} />
          </div>
        )}
      </div>
    </div>
  );
}
