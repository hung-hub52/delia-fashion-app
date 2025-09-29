import ProductsPage from "@/components/users/ProductsPage";
import { collectionProducts } from "@/data/collections";

export default function Page() {
  return (
    <ProductsPage
      slug="glasses"
      title="Kính Mắt"
      products={collectionProducts["glasses"]}
    />
  );
}
