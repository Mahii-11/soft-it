import { useEffect, useState } from "react";
import { getOnlineSaleProducts } from "../services/api";
import Loader from "../loader/Loader";
import ProductCard from "../components/ProductCard";

export default function OnlineSale() {
  return (
    <div>
        <SaleHero />
        <OnlineSaleProducts/>
    </div>
  )
}



export function SaleHero() {
  return (
    <section className="w-full bg-[#F3F4F6] lg:bg-white  py-4 md:py-16">

      <div className="container-custom">

        <div className="lg:hidden overflow-hidden rounded-xl lg:rounded-none">

          <img
            src="/images/banner-1.png"
            alt="Sale Banner"
            className="
            w-full
            h-[120px]
            sm:h-[150px]
            md:h-[260px]
            lg:h-[320px]
            object-cover
            "
            loading="lazy"
          />

        </div>
          <div className="hidden lg:block  overflow-hidden rounded-xl lg:rounded-none">
          <img
            src="/images/sale-banner.jpg"
            alt="Sale Banner"
            className="
            w-full
            h-[120px]
            sm:h-[150px]
            md:h-[260px]
            lg:h-[320px]
            object-cover
            "
            loading="lazy"
          />

        </div>

      </div>

    </section>
  );
}






export function OnlineSaleProducts() {
  const [deal, setDeal] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDealProducts = async () => {
      try {
        setLoading(true);
        const data = await getOnlineSaleProducts();
        setDeal(data);
      } catch (error) {
        console.error("Error fetching deal products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDealProducts();
  }, []);

  if (loading) {
    return <Loader type="dealofday" count={5} />;
  }

  if (!deal || deal.length === 0) {
    return <div className="py-20 text-center text-gray-500">No deals available.</div>;
  }

  return (
    <section className="bg-[#f0f0f0] py-10">
      <div className="container-custom">
        <h2 className="mb-4 font-sans text-lg font-bold text-neutral-900 md:text-xl">
          Online Sale Products
        </h2>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
          {deal.map((product, i) => (
            <ProductCard key={product.id ?? product.product_id ?? i} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
