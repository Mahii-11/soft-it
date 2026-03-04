import { useSelector } from "react-redux";
import { getCart, getTotalCartPrice } from "../cart/cartSlice";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/lebel";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Button } from "../components/ui/button";







export default function CheckoutPage() {
  const cartItems = useSelector(getCart);
  const subtotal = useSelector(getTotalCartPrice);
  const deliveryFee = subtotal > 1000 ? 0 : 70;
  const total = subtotal + deliveryFee;




  return (
   
  <div className="bg-gray-100 min-h-screen py-16 px-3 sm:px-4 md:px-6">
    
    <div className="max-w-7xl mx-auto">
      
      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 lg:p-10">
        
        {/* Main Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">

          {/* ================= LEFT SIDE ================= */}
          <div className="lg:col-span-2 space-y-6">

            {/* Shipping Address */}
            <div className="bg-background p-4 sm:p-6 rounded-2xl border">
              <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">
                Shipping Address
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="sm:col-span-2 space-y-2">
                  <Label>Street Address</Label>
                  <Input className="h-11" />
                </div>

                <div className="space-y-2">
                  <Label>City</Label>
                  <Input className="h-11" />
                </div>

                <div className="space-y-2">
                  <Label>State</Label>
                  <Input className="h-11" />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-background p-4 sm:p-6 rounded-2xl border">
              <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">
                Payment Method
              </h2>

              <RadioGroup defaultValue="card" className="flex flex-col gap-4">
                
                <div className="flex items-center gap-3 rounded-xl border p-4 cursor-pointer hover:bg-muted/50 transition">
                  <RadioGroupItem value="card" />
                  <Label className="font-normal cursor-pointer flex-1 text-sm sm:text-base">
                    Credit/Debit Card (Simulated)
                  </Label>
                </div>

                <div className="flex items-center gap-3 rounded-xl border p-4 cursor-pointer hover:bg-muted/50 transition">
                  <RadioGroupItem value="cod" />
                  <Label className="font-normal cursor-pointer flex-1 text-sm sm:text-base">
                    Cash on Delivery
                  </Label>
                </div>
              </RadioGroup>
            </div>

          </div>

          {/* ================= RIGHT SIDE ================= */}
          <div className="bg-[#F8FAFC] p-4 sm:p-6 rounded-2xl shadow-inner h-fit lg:sticky lg:top-24">

            <h2 className="text-lg sm:text-xl font-semibold mb-4">
              Order Summary
            </h2>

            {/* Cart Items */}
            <div className="flex flex-col gap-4 mb-4 max-h-[300px] overflow-y-auto pr-2">
              {cartItems.map((product) => (
                <div
                  key={product.product_slug}
                  className="flex items-start gap-3"
                >
                  <img
                    src={product.image || "/images/motorola.png"}
                    alt={product.product_name}
                    className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/motorola.png";
                    }}
                  />

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm sm:text-base truncate">
                      {product.product_name}
                    </p>

                    <p className="text-gray-500 text-xs sm:text-sm">
                      Qty: {product.quantity}
                    </p>

                    <p className="text-red-500 font-semibold text-sm sm:text-base">
                      ৳{(product.quantity * product.discount_price).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Delivery Fee */}
            <div className="flex justify-between text-sm sm:text-base mb-2">
              <span>Delivery Fee</span>
              <span>
                {deliveryFee === 0 ? "Free" : `৳${deliveryFee}`}
              </span>
            </div>

            {/* Total */}
            <div className="flex justify-between font-bold text-base sm:text-lg mb-4 border-t pt-3">
              <span>Total:</span>
              <span>৳{total.toFixed(2)}</span>
            </div>

            <Button className="w-full h-11 text-sm sm:text-base">
              Proceed to Pay
            </Button>
          </div>

        </div>
      </div>
    </div>
  </div>
);
}


