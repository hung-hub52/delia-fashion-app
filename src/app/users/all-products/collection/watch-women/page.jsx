import ProductsPage from "@/components/users/ProductsPage";
import { collectionProducts } from "@/data/collections";

export default function Page() {
  let products = collectionProducts["watch"] || [];
  // Lọc đúng theo key thay vì chỉ gender
  products = products.filter(p => p.key === "watch-women");

  return (
    <ProductsPage slug="watch-women" title="Đồng Hồ Bulova Nữ" products={products} />
  );
}
