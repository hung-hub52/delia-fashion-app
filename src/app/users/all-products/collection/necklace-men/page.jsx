import ProductsPage from "@/components/users/ProductsPage";
import { collectionProducts } from "@/data/collections";

export default function Page() {
  let products = collectionProducts["necklace"] || [];
  // Lọc đúng theo key thay vì chỉ gender
  products = products.filter(p => p.key === "necklace-men");

  return (
    <ProductsPage slug="necklace-men" title="Dây Chuyền Bạc Nam" products={products} />
  );
}
