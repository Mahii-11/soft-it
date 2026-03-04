import BannerSection from "../components/home/BannerSection";
import DealofDayProducts from "../components/home/DealofDayProducts";
import FeatureIconsSection from "../components/home/FeatureIconsSection";
import HeroSection from "../components/home/HeroSection";
import MostViewedProducts from "../components/home/MostViewedProducts";
import PremiumCategories from "../components/home/PremiumCategories";
import PremiumProductsSection from "../components/home/PremiumProductsSection";


export default function Home() {
  return (
    <div>
      <HeroSection/>
      <PremiumCategories/>
      <BannerSection />
      <PremiumProductsSection/>
      <MostViewedProducts/>
      <DealofDayProducts />
      <FeatureIconsSection/>
    </div>
  )
}
