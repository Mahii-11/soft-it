import { useState } from "react";
import { Link } from "react-router-dom";

export default function ProductDetails() {
  const product = {
    id: 1,
    name: "3MP + 3MP Dual Lens Full HD WiFi Wireless Camera",
    brand: "No Brand",
    status: "In Stock",
    price: 1995,
    regularPrice: 5700,
    description:
      "This wireless security camera provides crystal clear Full HD video quality with dual lens support. Perfect for home and office security.",
    images: [
      "/images/motorola.png",
      "/images/macbook.png",
      "/images/iphone.png",
      "/images/smarthome.png",
    ],
    colors: ["White", "Black", "Gray"],
  };

  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="bg-gray-100 min-h-screen py-6 md:py-10 px-4">
      <div className="max-w-6xl mx-auto bg-white p-4 md:p-6 rounded-md shadow-sm">

        {/* Main Container */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">

          {/* LEFT SIDE */}
          <div className="w-full lg:w-2/5">
            <img
              src={selectedImage}
              alt="Main Product"
              className="w-full border rounded-md object-cover"
            />

            <div className="flex flex-wrap gap-3 mt-4">
              {product.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt=""
                  onClick={() => setSelectedImage(img)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 border rounded cursor-pointer object-cover
                  ${
                    selectedImage === img
                      ? "border-orange-500"
                      : "border-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="w-full lg:w-3/5">

            <h2 className="text-xl sm:text-2xl font-semibold mb-3">
              {product.name}
            </h2>

            <p className="text-gray-600 mb-2">
              Brand:{" "}
              <span className="text-blue-600 font-medium">
                {product.brand}
              </span>
            </p>

            <p
              className={`mb-4 font-medium ${
                product.status === "In Stock"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              Status: {product.status}
            </p>

            {/* Price */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <h3 className="text-2xl sm:text-3xl text-orange-500 font-bold">
                ৳ {product.price}
              </h3>
              <p className="line-through text-gray-400">
                ৳ {product.regularPrice}
              </p>
            </div>

            {/* Color */}
            <div className="mb-6">
              <p className="font-medium mb-2">Color:</p>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-1 border rounded text-sm sm:text-base
                    ${
                      selectedColor === color
                        ? "border-orange-500 text-orange-500"
                        : "border-gray-300"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <p className="font-medium mb-2">Quantity:</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                  className="px-3 py-1 border rounded hover:bg-gray-100"
                >
                  -
                </button>

                <span className="text-lg font-medium">{quantity}</span>

                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1 border rounded hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h4 className="font-semibold mb-2">Description:</h4>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                {product.description}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
                Buy Now
              </button>
              <Link 
              to="/cart">
               <button className="w-full sm:w-auto bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600 transition">
                Add to Cart
              </button>
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}