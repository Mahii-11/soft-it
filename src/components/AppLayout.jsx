import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from './Footer'
import Header from "./Header";
import ScrollToTop from "./ScrollToTop";
import RouteLoader from "../loader/RouteLoader";
import FullScreenRouteLoader from "../loader/FullScreenRouteLoader";

export default function AppLayout() {


  return (
    <div>
      <RouteLoader />
      <FullScreenRouteLoader /> 
      <ScrollToTop/>
      <Header/>
      <Navbar/>
      <main>
        <Outlet  /> 
      </main>
      <Footer/>
    </div>
  )
}