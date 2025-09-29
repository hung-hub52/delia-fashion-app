import ProductsPage from "@/components/users/ProductsPage";
import { collectionProducts } from "@/data/collections";

export default function Page() {
  let products = collectionProducts["belt"] || [];
  // Lọc đúng theo key thay vì chỉ gender
  products = products.filter(p => p.key === "belt-women");

  return (
    <ProductsPage slug="belt-women" title="Thắt Lưng Dây Nữ" products={products} />
  );
}
