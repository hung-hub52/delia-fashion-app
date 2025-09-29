import ProductsPage from "@/components/users/ProductsPage";
import { collectionProducts } from "@/data/collections";

export default function Page() {
  let products = collectionProducts["hat"] || [];
  // Lọc đúng theo key thay vì chỉ gender
  products = products.filter(p => p.key === "hat-men");

  return (
    <ProductsPage slug="hat-men" title="Mũ Lưỡi Trai Nam" products={products} />
  );
}
