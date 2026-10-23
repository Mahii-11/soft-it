import { getNewArrivalProducts } from "../../services/api";
import useApiData from "../../hooks/useApiData";
import ProductSlider, { ProductSliderSkeleton } from "./ProductSlider";
import SectionHeading from "./SectionHeading";

export default function NewArrival() {
  const { data, loading } = useApiData("new-arrival", getNewArrivalProducts);
  const products = data ?? [];

  if (!loading && products.length === 0) return null;

  return (
    <section className="container-custom py-4 md:py-6">
      <SectionHeading title="New Arrival" to="/shop" />
      {loading ? <ProductSliderSkeleton /> : <ProductSlider products={products} />}
    </section>
  );
}
