// src/loader/RouteLoader.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

export default function RouteLoader() {
  const location = useLocation();

  useEffect(() => {
    NProgress.start();

    const timeout = setTimeout(() => {
      NProgress.done();
    }, 400); // smooth feel

    return () => {
      clearTimeout(timeout);
      NProgress.done();
    };
  }, [location.pathname]);

  return null;
}