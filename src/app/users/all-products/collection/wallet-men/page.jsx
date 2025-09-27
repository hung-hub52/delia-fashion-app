import ProductsPage from "@/components/users/ProductsPage";
import { collectionProducts } from "@/data/collections";

export default function Page() {
  let products = collectionProducts["wallet"] || [];
  // Lọc đúng theo key thay vì chỉ gender
  products = products.filter(p => p.key === "wallet-men");

  return (
    <ProductsPage slug="wallet-men" title="Ví Da Cao Cấp Nam" products={products} />
  );
}
