import ProductsPage from "@/components/users/ProductsPage";
import { collectionProducts } from "@/data/collections";

export default function Page() {
  let products = collectionProducts["watch"] || [];
  // Lọc đúng theo key thay vì chỉ gender
  products = products.filter(p => p.key === "watch-men");

  return (
    <ProductsPage slug="watch-men" title="Đồng Hồ GShock Nam" products={products} />
  );
}
