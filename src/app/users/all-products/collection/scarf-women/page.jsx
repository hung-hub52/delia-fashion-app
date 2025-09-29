import ProductsPage from "@/components/users/ProductsPage";
import { collectionProducts } from "@/data/collections";

export default function Page() {
  let products = collectionProducts["scarf"] || [];
  // Lọc đúng theo key thay vì chỉ gender
  products = products.filter(p => p.key === "scarf-women");

  return (
    <ProductsPage slug="scarf-women" title="Khăn Turban Đội Đầu Nữ" products={products} />
  );
}
