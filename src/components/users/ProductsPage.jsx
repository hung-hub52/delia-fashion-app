"use client";
import Link from "next/link";
import ProductGrid from "./ProductGrid";

export default function ProductsPage({
  title,
  parent,
  parentHref,
  products = [],
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-white text-black">
      {/* breadcrumb */}
      <nav className="text-sm text-gray-600 mb-4 flex flex-wrap gap-1">
        <Link href="/" className="hover:underline cursor-pointer">
          Trang chủ
        </Link>
        <span>/</span>
        <Link
          href="/users/collection"
          className="hover:underline cursor-pointer"
        >
          Bộ sưu tập
        </Link>

        {parent && parentHref && (
          <>
            <span>/</span>
            <Link href={parentHref} className="hover:underline cursor-pointer">
              {parent}
            </Link>
          </>
        )}

        <span>/</span>
        <span className="text-gray-900 font-medium">{title}</span>
      </nav>

      {/* grid sản phẩm */}
      <ProductGrid products={products} />
    </div>
  );
}
