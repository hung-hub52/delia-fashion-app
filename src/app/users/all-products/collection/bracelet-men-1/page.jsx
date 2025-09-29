import ProductsPage from "@/components/users/ProductsPage";
import { collectionProducts } from "@/data/collections";

export default function Page() {
  let products = collectionProducts["bracelet"] || [];
  // Lọc đúng theo key thay vì chỉ gender
  products = products.filter(p => p.key === "bracelet-men-1");

  return (
    <ProductsPage slug="bracelet-men-1" title="Vòng Tay Trầm Nam" products={products} />
  );
}
