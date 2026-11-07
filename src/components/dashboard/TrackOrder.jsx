import { useEffect, useMemo, useState } from "react";
import { Search, Package, Truck, CheckCircle2, Clock, XCircle, PauseCircle, Undo2 } from "lucide-react";
import { getUserOrders } from "../../services/api";

// Normal delivery flow (order_status: 0 → 1 → 2 → 3)
const STEPS = [
  { label: "Pending", icon: Clock },
  { label: "Processing", icon: Package },
  { label: "Courier", icon: Truck },
  { label: "Completed", icon: CheckCircle2 },
];

// Special statuses that are outside the normal flow
const SPECIAL = {
  4: { label: "Cancelled", icon: XCircle, cls: "bg-red-50 text-red-600 border-red-200", note: "This order has been cancelled." },
  5: { label: "On Hold", icon: PauseCircle, cls: "bg-amber-50 text-amber-700 border-amber-200", note: "This order is currently on hold." },
  6: { label: "Return", icon: Undo2, cls: "bg-slate-100 text-slate-700 border-slate-200", note: "This order has been returned." },
};

export const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" })
    : "N/A";

export function Stepper({ status }) {
  const special = SPECIAL[status];

  if (special) {
    const Icon = special.icon;
    return (
      <div className={`flex items-center gap-2 border rounded-lg px-4 py-3 text-sm font-medium ${special.cls}`}>
        <Icon className="w-4 h-4" /> {special.note}
      </div>
    );
  }

  const current = Math.min(Math.max(status, 0), STEPS.length - 1);

  return (
    <div className="flex items-start">
      {STEPS.map((step, i) => {
        const done = i <= current;
        const Icon = step.icon;
        return (
          <div key={step.label} className="flex-1 flex flex-col items-center relative">
            {i > 0 && (
              <div
                className="absolute top-5 right-1/2 w-full h-0.5 -z-0"
                style={{ background: i <= current ? "#ea5b3a" : "#e2e8f0" }}
              />
            )}
            <div
              className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2"
              style={{
                background: done ? "#ea5b3a" : "#fff",
                borderColor: done ? "#ea5b3a" : "#e2e8f0",
                color: done ? "#fff" : "#94a3b8",
              }}
            >
              <Icon className="w-5 h-5" />
            </div>
            <span
              className={`mt-2 text-xs sm:text-sm text-center ${
                done ? "font-semibold text-slate-900" : "text-slate-400"
              }`}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function TrackOrder() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getUserOrders();
        const list = res?.orders || res?.data?.data || res?.data || [];
        setOrders(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error("Track order fetch failed:", err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().replace("#ORD-", "").toLowerCase();
    if (!q) return orders;
    return orders.filter((o) => String(o.order_id).toLowerCase().includes(q));
  }, [orders, query]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <div className="pb-4 mb-6 border-b border-slate-100">
        <h2 className="text-2xl font-bold text-slate-900">Track Your Order</h2>
        <p className="text-sm text-slate-500 mt-1">
          See where your order is right now, from processing to delivery.
        </p>
      </div>

      <div className="relative mb-6">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by order ID..."
          className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:border-[#ea5b3a] focus:ring-4 focus:ring-[#ea5b3a]/10 transition-all"
        />
      </div>

      {loading ? (
        <p className="text-center text-slate-500 py-10">Loading orders...</p>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center text-center py-14">
          <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
            <Truck className="w-9 h-9 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            {orders.length === 0 ? "No orders to track yet" : "No order matches your search"}
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            {orders.length === 0
              ? "Once you place an order, you can follow its progress here."
              : "Check the order ID and try again."}
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {filtered.map((o) => (
            <div key={o.id} className="border border-slate-200 rounded-xl p-5">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
                <div>
                  <p className="font-bold text-slate-900">#ORD-{o.order_id}</p>
                  <p className="text-sm text-slate-500 mt-0.5">
                    {o.order_products?.[0]?.product_name || "No Product Found"}
                  </p>
                </div>
                <div className="text-right text-sm">
                  <p className="text-slate-500">Placed on {formatDate(o.created_at)}</p>
                  <p className="font-semibold text-slate-900 mt-0.5">
                    ৳{Number(o.total_amount || 0).toLocaleString()}
                  </p>
                </div>
              </div>

              <Stepper status={Number(o.order_status)} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
