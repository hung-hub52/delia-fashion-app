import ProductsPage from "@/components/users/ProductsPage";
import { collectionProducts } from "@/data/collections";

export default function Page() {
  return (
    <ProductsPage
      slug="necklace"
      title="Dây Chuyền"
      products={collectionProducts["necklace"]}
    />
  );
}
