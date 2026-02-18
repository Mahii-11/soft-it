import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/lebel";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Loader2 } from "lucide-react";

export default function Checkout() {
  // Static Cart Items
  const cartItems = [
    {
      id: 1,
      product: { name: "Premium Wireless Headphones", price: 89.99 },
      quantity: 2,
    },
    {
      id: 2,
      product: { name: "Smart Fitness Watch", price: 59.99 },
      quantity: 1,
    },
  ];

  // Static Summary
  const summary = {
    subtotal: 239.97,
    shipping: 0,
    total: 239.97,
  };

  if (cartItems.length === 0) {
    return <div className="text-center py-20">Your cart is empty</div>;
  }

  return (
    <div className="min-h-screen bg-muted/10 pb-20">
      <div className="container-custom py-12">
        <h1 className="text-3xl font-bold font-display mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form className="space-y-8">
              
              {/* Shipping Address */}
              <div className="bg-background p-6 rounded-2xl border">
                <h2 className="text-xl font-bold mb-6">Shipping Address</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  <div className="col-span-2 space-y-2">
                    <Label>Street Address</Label>
                    <Input />
                  </div>

                  <div className="space-y-2">
                    <Label>City</Label>
                    <Input />
                  </div>

                  <div className="space-y-2">
                    <Label>State</Label>
                    <Input />
                  </div>

                  <div className="space-y-2">
                    <Label>Zip Code</Label>
                    <Input />
                  </div>

                  <div className="space-y-2">
                    <Label>Country</Label>
                    <Input />
                  </div>

                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-background p-6 rounded-2xl border">
                <h2 className="text-xl font-bold mb-6">Payment Method</h2>

                <RadioGroup defaultValue="card" className="flex flex-col gap-4">
                  
                  <div className="flex items-center space-x-3 rounded-lg border p-4 cursor-pointer hover:bg-muted/50">
                    <RadioGroupItem value="card" />
                    <Label className="font-normal cursor-pointer flex-1">
                      Credit/Debit Card (Simulated)
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 rounded-lg border p-4 cursor-pointer hover:bg-muted/50">
                    <RadioGroupItem value="cod" />
                    <Label className="font-normal cursor-pointer flex-1">
                      Cash on Delivery
                    </Label>
                  </div>

                </RadioGroup>
              </div>
              <Link to="/profile">
               <Button
                type="button"
                size="lg"
                className="w-full rounded-full text-lg"
              >
                Pay ${summary.total.toFixed(2)}
              </Button>
              </Link>
            </form>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-background rounded-2xl border p-6 sticky top-24">
              <h2 className="text-lg font-bold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="truncate flex-1 pr-4">
                      {item.product.name} x {item.quantity}
                    </span>
                    <span>
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${summary.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>${summary.shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2">
                  <span>Total</span>
                  <span>${summary.total.toFixed(2)}</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
