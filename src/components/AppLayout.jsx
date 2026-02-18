import { Outlet } from "react-router";
import Navbar from "./Navbar";
import Footer from './Footer'
import Header from "./Header";

export default function AppLayout() {
  return (
    <div>
        <Header/>
        <Navbar/>
      <main>
        <Outlet/>
      </main>
      <Footer/>
    </div>
  )
}
