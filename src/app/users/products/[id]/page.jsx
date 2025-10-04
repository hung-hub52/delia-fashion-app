//src/app/users/products/[id]/page.jsx

"use client";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";


import { collectionProducts } from "@/data/collections";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [zoomStyle, setZoomStyle] = useState({});

  const product =
    Object.values(collectionProducts)
      .flat()
      .find((p) => p.id === id) || null;

  if (!product) {
    return (
      <p className="text-center py-20 text-gray-500">Không tìm thấy sản phẩm</p>
    );
  }

  const handleMouseMove = (e) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(2)",
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ transform: "scale(1)" });
  };

 const addToCart = () => {
   let cart = JSON.parse(localStorage.getItem("cart")) || [];
   const pid = String(product.id);

   const existingIndex = cart.findIndex((item) => item.id === pid);
   if (existingIndex > -1) {
     cart[existingIndex].qty += 1;
   } else {
     cart.push({
       id: pid,
       name: product.name,
       img: product.images[0],
       price: product.oldPrice || product.price,
       finalPrice: product.price,
       qty: 1,
     });
   }

   localStorage.setItem("cart", JSON.stringify(cart));

  window.dispatchEvent(new Event("cart-updated"));

   toast.success("Đã thêm vào giỏ hàng");
   setTimeout(() => router.push("/users/cart"), 1200);
 };


  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Ảnh sản phẩm */}
      <div>
        <div
          className="relative w-full h-[500px] border rounded-lg overflow-hidden"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-contain transition-transform duration-200 ease-in-out"
            style={zoomStyle}
          />
        </div>

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

        <p className="text-sm text-gray-600 mb-4">
          Đã bán:{" "}
          <span className="font-semibold text-pink-600">
            {product.sold || 0}
          </span>{" "}
          lượt
        </p>

        {/* Giá */}
        <div className="flex items-center gap-3 mb-4">
          {product.oldPrice > product.price && (
            <span className="line-through text-gray-400">
              {product.oldPrice.toLocaleString()}₫
            </span>
          )}
          <span className="text-red-600 text-xl font-bold">
            {product.price.toLocaleString()}₫
          </span>
          {product.oldPrice > product.price && product.discount > 0 && (
            <span className="bg-red-600 text-white px-2 py-1 text-sm rounded">
              -{product.discount}%
            </span>
          )}
        </div>

        {/* Mô tả */}
        <div className="mb-6 text-gray-800">
          <ul className="text-sm text-gray-700 space-y-1">
            <li>
              <strong>- Màu sắc:</strong> {product.color || "Đang cập nhật…"}
            </li>
            <li>
              <strong>- Kích thước:</strong> {product.size || "Đang cập nhật…"}
            </li>
            <li>
              <strong>- Chất liệu:</strong>{" "}
              {product.material || "Đang cập nhật…"}
            </li>
            <li>
              <strong>- Kiểu dáng:</strong> {product.style || "Đang cập nhật…"}
            </li>
            <li>
              <strong>- Bảo hành:</strong>{" "}
              {product.warranty || "Đang cập nhật…"}
            </li>
          </ul>
        </div>

        {/* Nút */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => router.push("/users/checkout")}
            className="bg-red-600 text-white px-6 py-3 rounded hover:bg-red-700"
          >
            ĐẶT HÀNG NHANH
          </button>
          <button
            onClick={() => {
              const user = localStorage.getItem("user");
              if (!user) {
                // ❌ chưa đăng nhập → chuyển tới login
                router.push("/account/login");
              } else {
                // ✅ đã đăng nhập → thêm giỏ hàng
                addToCart();
              }
            }}
            className="border border-gray-400 px-6 py-3 rounded hover:bg-gray-100 text-gray-800"
          >
            THÊM VÀO GIỎ HÀNG
          </button>
        </div>

        {/* Cam kết dịch vụ */}
        <div className="space-y-4 border-t pt-6 text-gray-800">
          <div className="flex items-start gap-3">
            <span className="text-red-600 text-xl">👍</span>
            <div>
              <p className="font-semibold">Cam kết chất lượng</p>
              <p className="text-sm text-gray-600">
                Cam kết sản phẩm đúng chất lượng miêu tả trên website.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-red-600 text-xl">🛡️</span>
            <div>
              <p className="font-semibold">Bảo hành 3 tới 6 tháng</p>
              <p className="text-sm text-gray-600">
                Hỗ trợ bảo dưỡng sản phẩm trọn đời.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-red-600 text-xl">✔️</span>
            <div>
              <p className="font-semibold">
                Kiểm tra hàng trước khi thanh toán
              </p>
              <p className="text-sm text-gray-600">
                Được kiểm tra hàng trước khi nhận & thanh toán, không ưng ý
                không mua, không phải trả bất cứ khoản phí nào.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
