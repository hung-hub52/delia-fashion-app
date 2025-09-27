import ProductsPage from "@/components/users/ProductsPage";
import { collectionProducts } from "@/data/collections";

export default function Page() {
  return (
    <ProductsPage
      slug="hat"
      title="Mũ Nón"
      products={collectionProducts["hat"]}
    />
  );
}
