import ProductsPage from "@/components/users/ProductsPage";
import { collectionProducts } from "@/data/collections";

export default function Page() {
  let products = collectionProducts["bracelet"] || [];
  // Lọc đúng theo key thay vì chỉ gender
  products = products.filter(p => p.key === "bracelet-women-2");

  return (
    <ProductsPage slug="bracelet-women-2" title="Lắc Chân Vàng Bạc" products={products} />
  );
}
