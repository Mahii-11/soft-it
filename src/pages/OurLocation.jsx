import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { HiLocationMarker, HiPhone } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import "leaflet/dist/leaflet.css";
import {  getOurLocations } from "../services/api";

// Fix default Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Component to pan map on selection
function MapPanner({ coords }) {
  const map = useMap();
  if (coords) map.flyTo(coords, 16, { duration: 1.5 });
  return null;
}

export default function ContactPage() {
  const [locations, setLocations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [coordsList, setCoordsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLocations() {
      try {
        const data = await getOurLocations();

        // Extract coordinates
        const coords = data.map((loc) => {
          const match = loc.google_map.match(/!2d([-.\d]+)!3d([-.\d]+)/);
          return match ? [parseFloat(match[2]), parseFloat(match[1])] : [0, 0];
        });

        setLocations(data);
        setCoordsList(coords);
        if (data.length > 0) setSelected(0);
      } catch (err) {
        console.error("Failed to load locations:", err);
      } finally {
        setLoading(false);
      }
    }

    loadLocations();
  }, []);

  // Skeleton for loading
  if (loading)
    return (
      <div className="max-w-7xl mx-auto p-4 flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/3 flex flex-col gap-4">
          {[...Array(2)].map((_, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-gray-200 animate-pulse h-24"
            ></div>
          ))}
        </div>
        <div className="lg:w-2/3 w-full h-[400px] rounded-3xl bg-gray-200 animate-pulse"></div>
      </div>
    );

  if (locations.length === 0)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-gray-500 text-lg">No locations found.</p>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6 mt-16">
      {/* Branch List */}
      <div className="lg:w-1/3 flex flex-col gap-4">
        <AnimatePresence>
          {locations.map((loc, idx) => (
            <motion.div
              key={idx}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              onClick={() => setSelected(idx)}
              className={`cursor-pointer p-4 rounded-2xl border transition-all duration-300 ${
                selected === idx
                  ? "bg-[#5B3DF5] text-white shadow-lg"
                  : "bg-white text-gray-800 hover:bg-gray-100"
              }`}
            >
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <HiLocationMarker className="w-5 h-5" />
                {loc.name}
              </h2>
              <p className="flex items-center gap-2 mt-1">
                <HiPhone className="w-4 h-4" />
                {loc.phone}
              </p>
              <p className="text-sm mt-1">{loc.address}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Map Section */}
      <div className="lg:w-2/3 w-full h-[400px] sm:h-[500px] md:h-[600px] rounded-3xl overflow-hidden shadow-lg relative z-10">
        <MapContainer
          center={coordsList[selected] || [23.7945, 90.3435]}
          zoom={13}
          scrollWheelZoom={true}
          className="w-full h-full relative z-10"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          {coordsList.map((coord, idx) => (
            <Marker
              key={idx}
              position={coord}
              eventHandlers={{
                click: () => setSelected(idx),
              }}
            >
              <Popup>
                <strong>{locations[idx].name}</strong>
                <br />
                {locations[idx].address}
                <br />
                📞 {locations[idx].phone}
              </Popup>
            </Marker>
          ))}

          <MapPanner coords={coordsList[selected]} />
        </MapContainer>
      </div>
    </div>
  );
}