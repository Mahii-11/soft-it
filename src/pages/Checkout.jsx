import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Banknote, Check, MapPin, QrCode, ShieldCheck, Truck } from "lucide-react";
import { clearCart, getCart, getTotalCartPrice } from "../cart/cartSlice";
import { createOrder, getUserOrders } from "../services/api";

// Backend payment_method ids. 1 = cash on delivery (existing). 2 for QR is an
// assumption - confirm the id with the backend before going live.
const PAYMENT_METHODS = { cod: 1, qr: 2 };
const QR_IMAGE = "/images/payment-qr.png";

const DELIVERY_OPTIONS = [
  { value: "inside", label: "Inside Dhaka", note: "Delivery within Dhaka city", fee: 60, shippingMethod: 21 },
  { value: "outside", label: "Outside Dhaka", note: "Delivery anywhere in the country", fee: 120, shippingMethod: 22 },
];

const fieldClass =
  "w-full rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-[#ea5b3a] focus:ring-2 focus:ring-[#ea5b3a]/15";

function SectionCard({ step, title, children }) {
  return (
    <section className="rounded-xl bg-white p-5 shadow-[0_1px_4px_rgba(0,0,0,0.06)] md:p-6">
      <h2 className="mb-5 flex items-center gap-3 font-sans text-base font-bold text-neutral-900 md:text-lg">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#26282d] text-xs font-bold text-white">
          {step}
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function OptionCard({ selected, onSelect, icon: Icon, title, note, aside }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition ${
        selected
          ? "border-[#ea5b3a] bg-[#ea5b3a]/5 ring-1 ring-[#ea5b3a]"
          : "border-neutral-200 hover:border-neutral-400"
      }`}
    >
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
          selected ? "bg-[#ea5b3a] text-white" : "bg-[#f6f6f6] text-neutral-600"
        }`}
      >
        <Icon size={20} />
      </span>
      <span className="flex-1">
        <span className="block text-sm font-semibold text-neutral-900">{title}</span>
        <span className="mt-0.5 block text-xs text-neutral-500">{note}</span>
      </span>
      {aside && <span className="text-sm font-bold text-neutral-900">{aside}</span>}
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
          selected ? "border-[#ea5b3a] bg-[#ea5b3a] text-white" : "border-neutral-300"
        }`}
      >
        {selected && <Check size={12} strokeWidth={3} />}
      </span>
    </button>
  );
}

export default function CheckoutPage() {
  const location = useLocation();
  const buyNowItem = location.state?.item;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const reduxCartItems = useSelector(getCart);
  const cartTotal = useSelector(getTotalCartPrice);
  const cartItems = buyNowItem ? [buyNowItem] : reduxCartItems;
  const subtotal = buyNowItem ? buyNowItem.unit_price * buyNowItem.quantity : cartTotal;

  const [deliveryType, setDeliveryType] = useState("inside");
  const [paymentType, setPaymentType] = useState("cod");
  const [transactionId, setTransactionId] = useState("");
  const [qrMissing, setQrMissing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    shipping_name: "",
    order_phone: "",
    shipping_address: "",
  });

  const delivery = DELIVERY_OPTIONS.find((option) => option.value === deliveryType);
  const deliveryFee = delivery.fee;
  const total = subtotal + deliveryFee;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleOrderSubmit = async () => {
    if (loading) return;

    if (cartItems.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Cart is Empty",
        text: "Please add product to cart first",
      });
      return;
    }

    if (!formData.shipping_name || !formData.order_phone || !formData.shipping_address) {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please fill all required fields",
      });
      return;
    }

    const phoneRegex = /^01[3-9]\d{8}$/;

    if (!phoneRegex.test(formData.order_phone)) {
      Swal.fire({
        icon: "error",
        title: "Invalid Phone Number",
        text: "Please enter a valid Bangladeshi phone number",
      });
      return;
    }

    if (paymentType === "qr" && !transactionId.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Transaction ID Required",
        text: "Please scan the QR code, pay, and enter the transaction ID",
      });
      return;
    }

    try {
      setLoading(true);

      Swal.fire({
        title: "Processing Order...",
        text: "Please wait while we place your order",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const data = new FormData();
      data.append("shipping_name", formData.shipping_name);
      data.append("order_phone", formData.order_phone);
      data.append("shipping_address", formData.shipping_address);
      data.append("product_qty", cartItems.reduce((sum, item) => sum + item.quantity, 0));
      data.append("total_amount", total);
      data.append("shipping_cost", deliveryFee);
      data.append("shipping_method", delivery.shippingMethod);
      data.append("payment_method", PAYMENT_METHODS[paymentType]);
      if (paymentType === "qr") {
        data.append("transaction_id", transactionId.trim());
      }

      cartItems.forEach((product, index) => {
        data.append(`product_data[${index}][product_id]`, product.product_id || product.id);
        data.append(`product_data[${index}][unit_price]`, product.unit_price);
        data.append(`product_data[${index}][qty]`, product.quantity);
        data.append(`product_data[${index}][variation_color_id]`, product.color_name);
        data.append(`product_data[${index}][variation]`, product.variation_size);
        data.append(`product_data[${index}][size_id]`, product.size_id);
        data.append(`product_data[${index}][color_id]`, product.color_id);
        data.append(`product_data[${index}][product_image]`, product.image.split("/").pop());
        data.append(`product_data[${index}][product_name]`, product.product_name);
      });

      const result = await createOrder(data);

      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "Order Placed 🎉",
          html: "Your order has been confirmed successfully.",
          confirmButtonColor: "#ea5b3a",
          width: "300px",
          padding: "1.2rem",
          customClass: {
            popup: "rounded-xl",
            title: "text-base font-semibold",
            htmlContainer: "text-sm text-gray-600",
            confirmButton: "text-sm px-5 py-2",
          },
        }).then(async () => {
          if (!buyNowItem) {
            dispatch(clearCart());
          }
          try {
            // fetch all orders again, the newest one is the order just placed
            const res = await getUserOrders();
            const ordersArray = res?.data?.data || res?.data || [];

            navigate("/thank-you", {
              state: { order: ordersArray[0] },
            });
          } catch (err) {
            console.log(err);
            navigate("/thank-you", {
              state: { order: null },
            });
          }
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Order Failed ❌",
          text: result.msg || "Order creation failed!",
        });
      }
    } catch (error) {
      console.error("Error in createOrder:", error);
      Swal.fire({
        icon: "error",
        title: "Order Failed ❌",
        text: "Something went wrong. Please try again.",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setLoading(false);
    }
  };

  // block access if nothing exists
  if (reduxCartItems.length === 0 && !buyNowItem) {
    return (
      <div className="py-32 text-center">
        <h2 className="text-xl font-semibold">No checkout session found</h2>
        <p>Please add product to cart or use Buy Now</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f0f0] px-3 py-6 font-sans md:px-5 md:py-10">
      <div className="mx-auto max-w-[1100px]">
        <h1 className="mb-6 font-sans text-2xl font-bold text-neutral-900 md:text-3xl">Checkout</h1>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          {/* ================= LEFT ================= */}
          <div className="space-y-5">
            <SectionCard step={1} title="Shipping Details">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-semibold text-neutral-600">Full Name</label>
                  <input
                    name="shipping_name"
                    value={formData.shipping_name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className={fieldClass}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-neutral-600">Phone Number</label>
                  <input
                    name="order_phone"
                    value={formData.order_phone}
                    onChange={handleChange}
                    inputMode="tel"
                    placeholder="01XXXXXXXXX"
                    className={fieldClass}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-neutral-600">Address</label>
                  <input
                    name="shipping_address"
                    value={formData.shipping_address}
                    onChange={handleChange}
                    placeholder="House, road, area"
                    className={fieldClass}
                  />
                </div>
              </div>
            </SectionCard>

            <SectionCard step={2} title="Delivery Area">
              <div role="radiogroup" className="grid gap-3 sm:grid-cols-2">
                {DELIVERY_OPTIONS.map((option) => (
                  <OptionCard
                    key={option.value}
                    selected={deliveryType === option.value}
                    onSelect={() => setDeliveryType(option.value)}
                    icon={option.value === "inside" ? MapPin : Truck}
                    title={option.label}
                    note={option.note}
                    aside={`৳${option.fee}`}
                  />
                ))}
              </div>
            </SectionCard>

            <SectionCard step={3} title="Payment Method">
              <div role="radiogroup" className="space-y-3">
                <OptionCard
                  selected={paymentType === "cod"}
                  onSelect={() => setPaymentType("cod")}
                  icon={Banknote}
                  title="Cash on Delivery"
                  note="Pay in cash when your order arrives"
                />
                <OptionCard
                  selected={paymentType === "qr"}
                  onSelect={() => setPaymentType("qr")}
                  icon={QrCode}
                  title="Pay with QR Code"
                  note="Scan the QR code and pay now"
                />
              </div>

              {paymentType === "qr" && (
                <div className="mt-5 rounded-xl bg-[#fafafa] p-5">
                  <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
                    <div className="flex h-44 w-44 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-neutral-200 bg-white p-2">
                      {qrMissing ? (
                        <span className="px-3 text-center text-xs text-neutral-400">
                          QR code image not added yet
                        </span>
                      ) : (
                        <img
                          src={QR_IMAGE}
                          alt="Payment QR code"
                          className="h-full w-full object-contain"
                          onError={() => setQrMissing(true)}
                        />
                      )}
                    </div>

                    <div className="w-full flex-1">
                      <p className="text-sm font-semibold text-neutral-900">
                        Pay <span className="text-[#ea5b3a]">৳{total.toLocaleString()}</span> by scanning the QR code
                      </p>
                      <ol className="mt-2 list-decimal space-y-1 pl-4 text-xs text-neutral-600">
                        <li>Open your payment app and scan the QR code</li>
                        <li>Pay the exact total amount</li>
                        <li>Enter the transaction ID below</li>
                      </ol>

                      <label className="mb-1.5 mt-4 block text-xs font-semibold text-neutral-600">
                        Transaction ID
                      </label>
                      <input
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        placeholder="e.g. 8N7A6D5EE7"
                        className={fieldClass}
                      />
                    </div>
                  </div>
                </div>
              )}
            </SectionCard>
          </div>

          {/* ================= RIGHT ================= */}
          <aside className="h-fit rounded-xl bg-white p-5 shadow-[0_1px_4px_rgba(0,0,0,0.06)] md:p-6 lg:sticky lg:top-40">
            <h2 className="mb-5 font-sans text-base font-bold text-neutral-900 md:text-lg">Order Summary</h2>

            <ul className="max-h-[300px] space-y-4 overflow-y-auto pr-1">
              {cartItems.map((product) => (
                <li
                  key={`${product.product_slug}-${product.variation_id}-${product.color_id}`}
                  className="flex items-start gap-3"
                >
                  <div className="relative h-16 w-16 shrink-0">
                    <img
                      src={product.image || "/images/motorola.png"}
                      alt={product.product_name}
                      className="h-full w-full rounded-lg bg-[#f6f6f6] object-contain"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/images/motorola.png";
                      }}
                    />
                    <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#26282d] text-[10px] font-bold text-white">
                      {product.quantity}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm font-medium text-neutral-900">{product.product_name}</p>
                    {(product.variation_size || product.color_name) && (
                      <p className="mt-0.5 text-xs capitalize text-neutral-500">
                        {[product.variation_size && `Size: ${product.variation_size}`, product.color_name && `Color: ${product.color_name}`]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    )}
                  </div>

                  <span className="text-sm font-bold text-neutral-900">
                    ৳{(product.quantity * product.discount_price).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-5 space-y-2 border-t border-neutral-100 pt-4 text-sm">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal</span>
                <span>৳{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Delivery Fee</span>
                <span>৳{deliveryFee}</span>
              </div>
              <div className="flex justify-between border-t border-neutral-100 pt-3 font-sans text-lg font-bold text-neutral-900">
                <span>Total</span>
                <span>৳{total.toLocaleString()}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleOrderSubmit}
              disabled={loading}
              className="mt-5 h-12 w-full rounded-md bg-[#ea5b3a] text-sm font-bold uppercase tracking-wide text-white transition hover:bg-[#d44a2a] disabled:cursor-not-allowed disabled:bg-neutral-300"
            >
              {loading ? "Processing..." : "Place Order"}
            </button>

            <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-neutral-500">
              <ShieldCheck size={13} /> Your information is safe with us
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}
