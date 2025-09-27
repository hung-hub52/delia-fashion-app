import ProductsPage from "@/components/users/ProductsPage";
import { collectionProducts } from "@/data/collections";

export default function Page() {
  let products = collectionProducts["hat"] || [];
  // Lọc đúng theo key thay vì chỉ gender
  products = products.filter(p => p.key === "hat-women");

  return (
    <ProductsPage slug="hat-women" title="Mũ Vành, Cụp Nữ" products={products} />
  );
}
