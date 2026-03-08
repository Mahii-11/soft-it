import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { X } from "lucide-react";

export default function CartPopup({ popup, onClose }) {
  return (
    <AnimatePresence>
      {popup && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className="
          fixed 
          top-4 right-4
          sm:top-6 sm:right-6
          w-[92%] sm:w-[360px]
          bg-white/90 backdrop-blur-lg
          border border-gray-100
          shadow-[0_10px_40px_rgba(0,0,0,0.15)]
          rounded-2xl
          p-4 sm:p-5
          z-[9999]
          "
        >

          {/* close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
          >
            <X size={18} />
          </button>

          {/* Product Info */}
          <div className="flex items-center gap-4">

            <img
              src={popup.image}
              alt="product"
              className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-xl border"
            />

            <div className="flex flex-col">

              <p className="text-green-600 text-sm font-medium">
                ✔ Added to Cart
              </p>

              <p className="text-lg font-semibold text-gray-800">
                ৳{popup.price}
              </p>

            </div>

          </div>

          {/* Divider */}
          <div className="my-4 h-[1px] bg-gray-100"></div>

          {/* Buttons */}
          <div className="flex gap-3">

            <button
              onClick={onClose}
              className="
              flex-1 
              border border-gray-200
              rounded-xl 
              py-2.5
              text-sm font-medium
              hover:bg-gray-50
              transition
              "
            >
              Close
            </button>

            <Link
              to="/cart"
              className="
              flex-1 
              text-center
              bg-[#5B3DF5]
              text-white
              rounded-xl
              py-2.5
              text-sm font-medium
              hover:bg-[#4338CA]
              transition
              "
            >
              View Cart
            </Link>

          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}