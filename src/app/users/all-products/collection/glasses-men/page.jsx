import ProductsPage from "@/components/users/ProductsPage";
import { collectionProducts } from "@/data/collections";

export default function Page() {
  let products = collectionProducts["glasses"] || [];
  // Lọc đúng theo key thay vì chỉ gender
  products = products.filter(p => p.key === "glasses-men");

  return (
    <ProductsPage slug="glasses-men" title="Kính Nửa Gọng Nam" products={products} />
  );
}
