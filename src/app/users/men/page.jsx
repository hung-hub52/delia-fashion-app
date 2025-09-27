"use client";
import ProductsPage from "@/components/users/ProductsPage";
import { collectionProducts } from "@/data/collections";

const menProducts = Object.values(collectionProducts)
  .flat()
  .filter((p) => p.gender === "men");

export default function MenPage() {
  return (
    <ProductsPage slug="men" title="Sản phẩm Nam" products={menProducts} />
  );
}
