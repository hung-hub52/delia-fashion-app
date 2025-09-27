import ProductsPage from "@/components/users/ProductsPage";
import { collectionProducts } from "@/data/collections";

export default function Page() {
  let products = collectionProducts["scarf"] || [];
  // Lọc đúng theo key thay vì chỉ gender
  products = products.filter(p => p.key === "scarf-men");

  return (
    <ProductsPage slug="scarf-men" title="Khăn Ống Nam" products={products} />
  );
}
