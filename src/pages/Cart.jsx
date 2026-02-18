import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
import { Trash2, Minus, Plus, ArrowRight } from "lucide-react";

export default function Cart() {
  // Static Cart Data
  const cartItems = [
    {
      id: 1,
      product: {
        id: 101,
        name: "Premium Wireless Headphones",
        price: "89.99",
        images: "/images/headphone.png",
      },
      quantity: 2,
    },
    {
      id: 2,
      product: {
        id: 102,
        name: "Smart Fitness Watch",
        price: "59.99",
        images: "/images/cmwatch.png",
      },
      quantity: 1,
    },
  ];

  // Static Summary Data
  const summary = {
    subtotal: 239.97,
    shipping: 0,
    total: 239.97,
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
          <Trash2 className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-muted-foreground mb-8 text-center max-w-sm">
          Looks like you haven't added anything to your cart yet.
        </p>
        <Link href="/shop">
          <Button size="lg" className="rounded-full px-8">
            Start Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/10 pb-20">
      <div className="container-custom py-12">
        <h1 className="text-3xl font-bold font-display mb-8">
          Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-background p-4 rounded-xl border flex gap-4 items-center"
              >
                <div className="h-24 w-24 bg-muted/20 rounded-lg overflow-hidden shrink-0">
                  <img
                    src={item.product.images}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <Link href={`/product/${item.product.id}`}>
                    <h3 className="font-semibold hover:text-primary transition-colors truncate">
                      {item.product.name}
                    </h3>
                  </Link>
                  <p className="text-muted-foreground text-sm mt-1">
                    ${item.product.price}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center border rounded-lg bg-background">
                    <button className="p-2 hover:bg-muted transition-colors rounded-l-lg">
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">
                      {item.quantity}
                    </span>
                    <button className="p-2 hover:bg-muted transition-colors rounded-r-lg">
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-background rounded-2xl border p-6 sticky top-24">
              <h2 className="text-lg font-bold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>${summary.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>
                    {summary.shipping === 0
                      ? "Free"
                      : `$${summary.shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="border-t pt-4 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${summary.total.toFixed(2)}</span>
                </div>
              </div>

              <Link to="/checkout">
                <Button className="w-full rounded-full" size="lg">
                  Proceed to Checkout
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
