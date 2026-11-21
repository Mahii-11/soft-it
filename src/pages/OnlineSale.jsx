import DealofDayProducts from "../components/home/DealofDayProducts";

// "Hot Deal" page: the same Special Offer section as the home page
// (title + countdown, product slider and banner from the flash-sale-products API)
export default function OnlineSale() {
  return (
    <div className="min-h-[60vh] bg-[#f0f0f0] py-3 font-sans md:py-6">
      <DealofDayProducts />
    </div>
  );
}
