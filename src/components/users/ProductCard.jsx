"use client";
import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ product }) {
  return (
    <div className="bg-white border rounded-lg shadow-sm hover:shadow-md transition relative flex flex-col">
      {/* Badge giảm giá */}
      {product.discount > 0 && (
        <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
          -{product.discount}%
        </span>
      )}

      {/* Hình ảnh */}
      <Link href={`/users/products/${product.id}`}>
        <div className="w-full h-64 relative flex justify-center items-center">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-contain p-4"
          />
        </div>
      </Link>

      {/* Nội dung */}
      <div className="p-3 flex flex-col flex-1">
        {/* Tên sản phẩm */}
        <h3 className="text-gray-800 text-sm font-medium line-clamp-2 min-h-[40px] mb-2">
          {product.name}
        </h3>

        {/* Giá */}
        <div className="flex items-center gap-2">
          {product.oldPrice > 0 && (
            <span className="text-gray-400 text-sm line-through">
              {product.oldPrice.toLocaleString()}₫
            </span>
          )}
          <span className="text-red-600 font-bold">
            {product.price.toLocaleString()}₫
          </span>
        </div>

        {/* Free ship */}
        <div className="text-xs text-orange-600 mt-1">
          FREESHIP đơn ở QN-ĐN  
        </div>
      </div>
    </div>
  );
}
