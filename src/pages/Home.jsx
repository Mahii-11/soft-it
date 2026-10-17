import DealofDayProducts from "../components/home/DealofDayProducts";
import HeroSection from "../components/home/HeroSection";
import NewArrival from "../components/home/NewArrival";
import MostViewedProducts from "../components/home/MostViewedProducts";
import PremiumCategories from "../components/home/PremiumCategories";
import PremiumDualBanner from "../components/home/PremiumDualBanner";
import PremiumWatchBannerOne from "../components/home/PremiumWatchBannerOne";
import WhyShopWithUs from "../components/home/WhyShopWithUs";



export default function Home() {
  return (
    <div>
      <HeroSection/>
      <DealofDayProducts />
      <PremiumCategories/>
      <PremiumDualBanner />
      <MostViewedProducts/>
      <PremiumWatchBannerOne/>
      <NewArrival />
      <WhyShopWithUs />
    </div>
  )
}
