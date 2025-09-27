import ProductsPage from "@/components/users/ProductsPage";
import { collectionProducts } from "@/data/collections";

export default function Page() {
  let products = collectionProducts["balo"] || [];
  // Lọc đúng theo key thay vì chỉ gender
  products = products.filter(p => p.key === "balo-men");

  return (
    <ProductsPage slug="balo-men" title="Balo Laptop Nam" products={products} />
  );
}
