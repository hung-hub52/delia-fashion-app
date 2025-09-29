"use client";
import ProductsPage from "@/components/users/ProductsPage";
import { collectionProducts } from "@/data/collections";

// Gom tất cả sản phẩm có gender = women
const womenProducts = Object.values(collectionProducts)
  .flat()
  .filter((p) => Array.isArray(p.gender) && p.gender.includes("women"));

if (womenProducts.length === 0) {
  throw new Error("❌ Không có sản phẩm nào cho trang Nữ");
}

export default function WomenPage() {
  return (
    <ProductsPage slug="women" title="Sản phẩm Nữ" products={womenProducts} />
  );
}
