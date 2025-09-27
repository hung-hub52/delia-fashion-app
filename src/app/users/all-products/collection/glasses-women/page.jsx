import ProductsPage from "@/components/users/ProductsPage";
import { collectionProducts } from "@/data/collections";

export default function Page() {
  let products = collectionProducts["glasses"] || [];
  // Lọc đúng theo key thay vì chỉ gender
  products = products.filter(p => p.key === "glasses-women");

  return (
    <ProductsPage slug="glasses-women" title="Kính Mát Nữ Thời Trang" products={products} />
  );
}
