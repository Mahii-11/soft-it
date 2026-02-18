import FeatureIconsSection from "../components/home/FeatureIconsSection";
import HeroSection from "../components/home/HeroSection";
import MostViewedProducts from "../components/home/MostViewedProducts";
import PremiumCategories from "../components/home/PremiumCategories";
import PremiumProductsSection from "../components/home/PremiumProductsSection";


export default function Home() {
  return (
    <div>
      <HeroSection/>
      <FeatureIconsSection/>
      <PremiumCategories/>
      <PremiumProductsSection/>
      <MostViewedProducts/>
      
    </div>
  )
}
