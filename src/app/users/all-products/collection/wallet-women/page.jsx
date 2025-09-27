import ProductsPage from "@/components/users/ProductsPage";
import { collectionProducts } from "@/data/collections";

export default function Page() {
  let products = collectionProducts["wallet"] || [];
  // Lọc đúng theo key thay vì chỉ gender
  products = products.filter(p => p.key === "wallet-women");

  return (
    <ProductsPage slug="wallet-women" title="Ví Cầm Tay Nữ" products={products} />
  );
}
