import ProductsPage from "@/components/users/ProductsPage";
import { collectionProducts } from "@/data/collections";

export default function Page() {
  let products = collectionProducts["bag"] || [];
  // Lọc đúng theo key thay vì chỉ gender
  products = products.filter(p => p.key === "bag-women");

  return (
    <ProductsPage slug="bag-women" title="Túi Xách Công Sở Nữ" products={products} />
  );
}
