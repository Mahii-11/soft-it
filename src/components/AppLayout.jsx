import { Outlet } from "react-router";
import Navbar from "./Navbar";
import Footer from './Footer'
import Header from "./Header";
import ScrollToTop from "./ScrollToTop";

export default function AppLayout() {
  return (
    <div>
       <ScrollToTop/>
        <Header/>
        <Navbar/>
      <main>
        <Outlet/>
      </main>
      <Footer/>
    </div>
  )
}
