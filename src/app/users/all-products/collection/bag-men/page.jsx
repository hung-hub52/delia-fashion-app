import ProductsPage from "@/components/users/ProductsPage";
import { collectionProducts } from "@/data/collections";

export default function Page() {
  let products = collectionProducts["bag"] || [];
  // Lọc đúng theo key thay vì chỉ gender
  products = products.filter(p => p.key === "bag-men");

  return (
    <ProductsPage slug="bag-men" title="Túi Xách Chéo Nam" products={products} />
  );
}
