import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from './Footer'
import Header from "./Header";
import ScrollToTop from "./ScrollToTop";
import CartDrawer from "./CartDrawer";
import WhatsAppWidget from "./WhatsAppWidget";

export default function AppLayout() {


  return (
    <div>
      <ScrollToTop/>
      <Header/>
      <Navbar/>
      <main>
        <Outlet  /> 
      </main>
      <Footer/>
      <CartDrawer />
      <WhatsAppWidget />
    </div>
  )
}