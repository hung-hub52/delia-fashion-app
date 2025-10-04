// src/components/users/ProductCard.jsx khung sản phẩm
"use client";
import Image from "next/image";
import Link from "next/link";
import { calculateDiscount } from "@/utils/price";

// ✅ Format số tiền nhất quán (không dùng toLocaleString)
function formatPrice(price) {
  if (!price) return "0";
  return String(price).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
}

export default function ProductCard({ product }) {
  // Tính % giảm tự động
  const discountPercent = calculateDiscount(product.oldPrice, product.price);
  const hasDiscount = discountPercent > 0;

  return (
    <div className="bg-white border border-gray-200 hover:border-gray-300 rounded-lg shadow-sm hover:shadow-md transition relative flex flex-col">
      {/* Badge giảm giá */}
      {hasDiscount && (
        <span className="absolute top-2 left-2 z-10 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
          -{discountPercent}%
        </span>
      )}

      {/* Hình ảnh */}
      <Link href={`/users/products/${product.id}`}>
        <div className="w-full aspect-[4/5] relative overflow-hidden rounded-t-lg bg-gray-50">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>

      {/* Nội dung */}
      <div className="p-3 flex flex-col flex-1">
        <h3 className="text-gray-800 text-sm font-medium line-clamp-2 min-h-[40px] mb-1">
          {product.name}
        </h3>

        {/* Lượt bán */}
        {product.sold !== undefined && (
          <p className="text-xs text-gray-500 mb-1">
            Đã bán: <span className="font-medium">{product.sold}</span> lượt
          </p>
        )}

                {/* Giá */}
        <div className="flex items-center gap-2" suppressHydrationWarning>
          {hasDiscount && (
            <span className="text-gray-400 text-sm line-through" suppressHydrationWarning>
              {formatPrice(product.oldPrice)}₫
            </span>
          )}
          <span className="text-red-600 font-bold" suppressHydrationWarning>
            {formatPrice(product.price)}₫
          </span>
        </div>

        {/* Free ship */}
        <div className="text-xs text-orange-600 mt-1">FREESHIP đơn ở QN-ĐN</div>
      </div>
    </div>
  );
}
