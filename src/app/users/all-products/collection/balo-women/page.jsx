import ProductsPage from "@/components/users/ProductsPage";
import { collectionProducts } from "@/data/collections";

export default function Page() {
  let products = collectionProducts["balo"] || [];
  // Lọc đúng theo key thay vì chỉ gender
  products = products.filter(p => p.key === "balo-women");

  return (
    <ProductsPage slug="balo-women" title="Balo Da Nữ" products={products} />
  );
}
