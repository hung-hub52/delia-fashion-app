import ProductsPage from "@/components/users/ProductsPage";
import { collectionProducts } from "@/data/collections";

export default function Page() {
  return (
    <ProductsPage
      slug="wallet"
      title="Ví Da"
      products={collectionProducts["wallet"]}
    />
  );
}
