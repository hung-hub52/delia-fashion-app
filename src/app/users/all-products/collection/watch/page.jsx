import ProductsPage from "@/components/users/ProductsPage";
import { collectionProducts } from "@/data/collections";

export default function Page() {
  return (
    <ProductsPage
      slug="watch"
      title="Đồng Hồ"
      products={collectionProducts["watch"]}
    />
  );
}
