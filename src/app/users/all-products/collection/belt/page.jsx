import ProductsPage from "@/components/users/ProductsPage";
import { collectionProducts } from "@/data/collections";

export default function Page() {
  return (
    <ProductsPage
      slug="belt"
      title="Thắt Lưng"
      products={collectionProducts["belt"]}
    />
  );
}
