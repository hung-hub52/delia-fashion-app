import ProductsPage from "@/components/users/ProductsPage";
import { collectionProducts } from "@/data/collections";

export default function Page() {
  return (
    <ProductsPage
      slug="bag"
      title="Túi Xách"
      products={collectionProducts["bag"]}
    />
  );
}
