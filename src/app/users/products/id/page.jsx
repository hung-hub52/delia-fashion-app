"use client";
import Image from "next/image";
import { useParams } from "next/navigation";

export default function ProductDetailPage() {
  const { id } = useParams();

  // BE sẽ fetch dữ liệu theo id ở đây
  const product = {
    id,
    name: "",
    images: ["/products/bag/.jpg", "/products/bag/.jpg"],
    oldPrice: 0,
    price: 0,
    discount: 0,
    description: "Mô tả sản phẩm...",
    size: "20 x 24 x 10 cm",
    color: "Đen, xanh, hồng",
    warranty: "03 tháng",
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Ảnh sản phẩm */}
      <div>
        <Image
          src={product.images[0]}
          alt={product.name}
          width={500}
          height={500}
          className="rounded-lg border"
        />
        <div className="flex gap-2 mt-4">
          {product.images.map((img, i) => (
            <Image
              key={i}
              src={img}
              alt={`thumb-${i}`}
              width={100}
              height={100}
              className="border rounded cursor-pointer"
            />
          ))}
        </div>
      </div>

      {/* Thông tin sản phẩm */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          {product.name}
        </h1>

        {/* Giá */}
        <div className="flex items-center gap-3 mb-4">
          {product.oldPrice > 0 && (
            <span className="line-through text-gray-400">
              {product.oldPrice.toLocaleString()}₫
            </span>
          )}
          <span className="text-red-600 text-xl font-bold">
            {product.price.toLocaleString()}₫
          </span>
          {product.discount > 0 && (
            <span className="bg-red-600 text-white px-2 py-1 text-sm rounded">
              -{product.discount}%
            </span>
          )}
        </div>

        {/* Thông tin chi tiết */}
        <ul className="text-sm text-gray-700 space-y-2 mb-6">
          <li>
            <strong>Màu sắc:</strong> {product.color}
          </li>
          <li>
            <strong>Kích thước:</strong> {product.size}
          </li>
          <li>
            <strong>Bảo hành:</strong> {product.warranty}
          </li>
        </ul>

        {/* Nút hành động */}
        <div className="flex gap-4">
          <button className="bg-red-600 text-white px-6 py-3 rounded hover:bg-red-700">
            ĐẶT HÀNG NHANH
          </button>
          <button className="border border-gray-400 px-6 py-3 rounded hover:bg-gray-100">
            THÊM VÀO GIỎ HÀNG
          </button>
        </div>
      </div>
    </div>
  );
}
