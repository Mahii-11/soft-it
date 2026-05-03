// src/loader/FullScreenRouteLoader.jsx
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function FullScreenRouteLoader() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 600); // adjust timing

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    loading && (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 backdrop-blur-sm">
<div class="loader">
    <div class="circle"></div>
    <div class="circle"></div>
    <div class="circle"></div>
    <div class="circle"></div>
</div>
      </div>
    )
  );
}