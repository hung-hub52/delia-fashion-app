"use client";
import ProductsPage from "@/components/users/ProductsPage";
import { collectionProducts } from "@/data/collections";

const allProducts = Object.values(collectionProducts).flat();

export default function CollectionPage() {
  return (
    <ProductsPage slug="collection" title="Bộ sưu tập" products={allProducts} />
  );
}
