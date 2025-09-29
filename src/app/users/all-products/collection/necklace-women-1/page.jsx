import ProductsPage from "@/components/users/ProductsPage";
import { collectionProducts } from "@/data/collections";

export default function Page() {
  let products = collectionProducts["necklace"] || [];
  // Lọc đúng theo key thay vì chỉ gender
  products = products.filter(p => p.key === "necklace-women-1");

  return (
    <ProductsPage slug="necklace-women-1" title="Dây Chuyền Vàng Nữ" products={products} />
  );
}
