"use client";
import ProductsPage from "@/components/users/ProductsPage";
import { collectionProducts } from "@/data/collections";

// Gom tất cả sản phẩm có gender = men
const menProducts = Object.values(collectionProducts)
  .flat()
  .filter((p) => Array.isArray(p.gender) && p.gender.includes("men"));

if (menProducts.length === 0) {
  throw new Error("❌ Không có sản phẩm nào cho trang Nam");
}

export default function MenPage() {
  return (
    <ProductsPage slug="men" title="Sản phẩm Nam" products={menProducts} />
  );
}
