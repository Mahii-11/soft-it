import { getAllTopPicksProducts } from "../services/api";
import ProductGridPage from "../components/ProductGridPage";

// "View More" page of Customer Top Picks - every product from all-top-picks-products
export default function AllTopPicks() {
  return (
    <ProductGridPage
      title="Customer Top Picks"
      queryKey="all-top-picks"
      fetcher={getAllTopPicksProducts}
    />
  );
}
