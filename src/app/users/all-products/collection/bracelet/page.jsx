import ProductsPage from "@/components/users/ProductsPage";
import { collectionProducts } from "@/data/collections";

export default function Page() {
  return (
    <ProductsPage
      slug="bracelet"
      title="Vòng Tay"
      products={collectionProducts["bracelet"]}
    />
  );
}
