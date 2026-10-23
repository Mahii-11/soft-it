import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from './Footer'
import Header from "./Header";
import ScrollToTop from "./ScrollToTop";
import CartDrawer from "./CartDrawer";

export default function AppLayout() {


  return (
    <div>
      <ScrollToTop/>
      <Header/>
      <Navbar/>
      <main className="pb-20 lg:pb-0">
        <Outlet  /> 
      </main>
      <Footer/>
      <CartDrawer />
    </div>
  )
}