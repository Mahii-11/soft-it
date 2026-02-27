import { useSelector } from "react-redux";
import { getCart, getTotalCartPrice } from "../cart/cartSlice";






export default function CheckoutPage() {
  const cartItems = useSelector(getCart);
  const subtotal = useSelector(getTotalCartPrice);
  const deliveryFee = subtotal > 1000 ? 0 : 70;
  const total = subtotal + deliveryFee;




  return (
    <div className="bg-gray-100 min-h-screen py-6 md:py-10 px-4">
      <div className="max-w-6xl mx-auto bg-white p-6 md:p-10 rounded-lg shadow-lg">

        {/* Top Section: Delivery Info + Order Summary */}
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Left Side: Delivery Information */}
          <div className="w-full lg:w-2/3 bg-gray-50 p-6 rounded-lg shadow-inner">
            <h2 className="text-xl font-semibold mb-4">Delivery Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <Input label="Full Name" name="fullname"/>
               <Select 
               label="Region"
               name="region"
               options={[

                {value: "dhaka", label: "Dhaka"},
                {value: "sylhet", label: "Sylhet"}

               ]}
               />

               <Input label="Phone Number" name="phone" />
               <Select 
                label="City" 
                name="city" 
                options={[
                { value: "dhaka", label: "Dhaka" },
                { value: "tangail", label: "Tangail" },
                 ]}
                 />

               <Input label="Building / House No / Floor / Street" name="building" />
                <Select 
                label="Area" 
                name="area" 
                options={[
                { value: "agargaon", label: "Agargaon" },
                { value: "shewrapara", label: "Shewrapara" },
                { value: "kazipara", label: "Kazipara"}
                ]}
                 />

              <Input label="Colony / Suburb / Locality / Landmark"  name="colony" />
              <Input label="Address"  name="address" />
            </div>

            {/* Label Selection */}
            <div className="flex gap-4 mt-4">
              <button className="flex-1 py-2 border border-blue-500 rounded text-blue-500 font-medium hover:bg-blue-50">
                OFFICE
              </button>
              <button className="flex-1 py-2 border border-red-500 rounded text-red-500 font-medium hover:bg-red-50">
                HOME
              </button>
            </div>

            <button className="mt-6 bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600">
              SAVE
            </button>
          </div>

          {/* Right Side: Order Summary */}
          <div className="w-full lg:w-1/3 bg-gray-50 p-6 rounded-lg shadow-inner">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            {/* Items */}
           <div className="flex flex-col gap-4 mb-4">
             {cartItems.map((product) => (
             <div key={product.product_slug} className="flex items-center gap-4">
             <img
             src={product.image || "/images/motorola.png"}
             alt={product.product_name}
             className="w-16 h-16 object-cover rounded"
              onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/motorola.png";
                    }}
             />
            <div className="flex-1">
            <p className="font-medium">{product.product_name}</p>
            <p className="text-gray-500 text-sm">Qty: {product.quantity}</p>
            <p className="text-red-500 font-semibold">
             ৳{(product.quantity * product.discount_price).toFixed(2)}
            </p>
            </div>
            </div>
             ))}
            </div>

            {/* Delivery Fee */}
            <div className="flex justify-between mb-2">
              <span>Delivery Fee</span>
             <span>
              {deliveryFee === 0 ? "Free" : `৳${deliveryFee}`}
             </span>
            </div>

            {/* Total */}
            <div className="flex justify-between font-bold text-lg mb-4">
              <span>Total:</span>
              <span>৳{total.toFixed(2)}</span>
            </div>

            <button className="w-full bg-gray-400 text-white py-2 rounded cursor-not-allowed">
              Proceed to Pay
            </button>
          </div>
        </div>

        {/* Bottom Section: Promotion / Additional Info */}
        <div className="mt-8 bg-gray-50 p-6 rounded-lg shadow-inner">
          <h2 className="text-lg font-semibold mb-2">Promotion</h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter Store Code"
              className="flex-1 p-3 border rounded"
            />
            <button className="bg-blue-500 text-white px-4 rounded">APPLY</button>
          </div>
        </div>
      </div>
    </div>
  );
}




function Input({label, type="text", name}) {
  const isPhone = name === "phone";

  const placeholderMap = {
    fullName: "Enter your full name",
    phone: "01XXXXXXXXX",
    building: "Please enter",
    colony: "Colony / Suburb / Locality / Landmark",

    
  }

  return (
    <div>
      <label  className="block text-sm font-medium text-gray-600 mb-2">
        {label}
      </label>
        <input
        type={type}
        name={name}
        required
        placeholder={placeholderMap[name] || `Enter ${label}`}
        pattern={
             isPhone
            ? "^(\\+8801[3-9]\\d{8}|01[3-9]\\d{8})$"
            : undefined
        }
        className="w-full rounded-xl border border-gray-300 px-4 py-3 
        focus:ring-2 focus:ring-blue-500 focus:border-blue-500
        invalid:border-red-500 invalid:ring-red-400
        transition duration-300 outline-none shadow-sm hover:shadow-md"
      />
    </div>
  )
}


function Select({label, name, options = []}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-2">
        {label}
      </label>
      <select
      name={name}
      required
      className="w-full rounded-xl border border-gray-300 px-4 py-3
        focus:ring-2 focus:ring-blue-500 focus:border-blue-500
        transition duration-300 outline-none shadow-sm hover:shadow-md"
      defaultValue="" 
      >
         <option value="" disabled>
          Select {label}
        </option>
        {options.map((opt, i) => (
          <option key={i} value={opt.value || opt}>
            {opt.label || opt}
          </option>
        ))}
      </select>
    </div>
  )
}

