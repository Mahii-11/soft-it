import { Search, ArrowLeft } from "lucide-react";
import { Input } from "../components/ui/input";
import { useNavigate } from "react-router-dom";

export default function SearchPage() {
  const navigate = useNavigate();

  const recentSearches = ["iPhone 15", "AirPods Pro", "Samsung Watch"];
  const popularSearches = ["Smart Watch", "Bluetooth Speaker", "Headphones"];

  return (
    <div className="min-h-screen bg-white">

      {/* Top bar */}
      <div className="flex items-center gap-3 p-4 border-b">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-100 transition"
        >
          <ArrowLeft className="h-5 w-5 text-gray-700" />
        </button>

        <h1 className="text-lg font-semibold text-gray-900">
          Search
        </h1>
      </div>

      {/* Search Input */}
      <div className="p-4">
        <div className="relative">

          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />

          <Input
            placeholder="Search products..."
            className="
            pl-11
            h-12
            rounded-full
            border
            border-gray-200
            bg-gray-50
            focus:bg-white
            focus:border-[#5B3DF5]
            focus:ring-2
            focus:ring-[#5B3DF5]/20
            transition
            "
          />
        </div>
      </div>

      {/* Recent Searches */}
      <div className="px-4 mt-2">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">
          Recent Searches
        </h2>

        <div className="flex flex-wrap gap-2">
          {recentSearches.map((item) => (
            <button
              key={item}
              className="px-3 py-1.5 text-sm rounded-full bg-gray-100 hover:bg-gray-200 transition"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Popular Searches */}
      <div className="px-4 mt-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">
          Popular Searches
        </h2>

        <div className="flex flex-wrap gap-2">
          {popularSearches.map((item) => (
            <button
              key={item}
              className="px-3 py-1.5 text-sm rounded-full bg-gray-100 hover:bg-gray-200 transition"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}