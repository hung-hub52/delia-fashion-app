"use client";
import ProductsPage from "@/components/users/ProductsPage";
import { collectionProducts } from "@/data/collections";

const womenProducts = Object.values(collectionProducts)
  .flat()
  .filter((p) => p.gender === "women");

export default function WomenPage() {
  return (
    <ProductsPage slug="women" title="Sản phẩm Nữ" products={womenProducts} />
  );
}
