import { getAllTrendingProducts } from "../services/api";
import ProductGridPage from "../components/ProductGridPage";

// Arrow of the "New Trending" section - every product from all-trending-products
export default function AllTrending() {
  return (
    <ProductGridPage
      title="New Trending"
      queryKey="all-trending"
      fetcher={getAllTrendingProducts}
    />
  );
}
