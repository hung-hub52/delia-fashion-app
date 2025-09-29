import ProductsPage from "@/components/users/ProductsPage";
import { collectionProducts } from "@/data/collections";

export default function Page() {
  return (
    <ProductsPage
      slug="scarf"
      title="Khăn Lụa, Len"
      products={collectionProducts["scarf"]}
    />
  );
}
