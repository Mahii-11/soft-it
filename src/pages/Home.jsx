import HeroSection from "../components/home/HeroSection";
import PremiumCategories from "../components/home/PremiumCategories";
import DealofDayProducts from "../components/home/DealofDayProducts";
import MostViewedProducts from "../components/home/MostViewedProducts";
import PremiumDualBanner from "../components/home/PremiumDualBanner";
import RecommendedForYou from "../components/home/RecommendedForYou";
import NewArrival from "../components/home/NewArrival";
import CustomerFavorites from "../components/home/CustomerFavorites";
import BrandsGrid from "../components/home/BrandsGrid";
import WhyShopWithUs from "../components/home/WhyShopWithUs";


export default function Home() {
  return (
    <div className="bg-[#f0f0f0] font-sans">
      <HeroSection />
      <PremiumCategories />
      <DealofDayProducts />
      <MostViewedProducts />
      <PremiumDualBanner />
      <RecommendedForYou />
      <NewArrival />
      <CustomerFavorites />
      <BrandsGrid />
      <WhyShopWithUs />
    </div>
  );
}
