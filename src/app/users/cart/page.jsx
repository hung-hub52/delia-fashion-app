// src/app/users/cart/page.jsx
"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { cart, setCart } = useCart();
  const [selectedItems, setSelectedItems] = useState([]);
  const router = useRouter();

  // Load giỏ hàng từ localStorage khi mở trang
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      const parsed = JSON.parse(savedCart).map((item) => ({
        ...item,
        id: String(item.id),
      }));
      setCart(parsed);
    }
  }, []);

  // Lưu lại localStorage khi cart thay đổi
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
    } else {
      localStorage.removeItem("cart");
    }
  }, [cart]);

  // Chọn/bỏ chọn tất cả
  const handleSelectAll = () => {
    if (selectedItems.length === cart.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cart.map((item) => item.id));
    }
  };

  // Chọn 1 sản phẩm
  const handleSelectOne = (id) => {
    id = String(id);
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // ✅ Hàm cập nhật số lượng
  const handleQty = (id, type) => {
    id = String(id);
    setCart((prev) => {
      const updated = prev.map((item) =>
        item.id === id
          ? {
              ...item,
              qty: type === "inc" ? item.qty + 1 : Math.max(1, item.qty - 1),
            }
          : item
      );
      localStorage.setItem("cart", JSON.stringify(updated)); // lưu lại giỏ
      return updated;
    });
  };

  // Xóa sản phẩm
  const handleDelete = (id) => {
    id = String(id);
    setCart((prev) => prev.filter((item) => item.id !== id));
    setSelectedItems((prev) => prev.filter((i) => i !== id));
  };

  // Xóa tất cả sản phẩm đã chọn
  const handleDeleteSelected = () => {
    setCart((prev) => prev.filter((item) => !selectedItems.includes(item.id)));
    setSelectedItems([]);
  };

  // Tính tổng tiền
  const total = cart
    .filter((item) => selectedItems.includes(item.id))
    .reduce((sum, item) => sum + item.finalPrice * item.qty, 0);

  return (
    <div className="max-w-6xl mx-auto bg-gray-100 py-6 px-4 text-gray-800">
      <h1 className="text-lg font-semibold mb-4">Giỏ hàng</h1>

      {/* Nếu giỏ hàng rỗng */}
      {cart.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-10 text-center text-gray-500 flex flex-col items-center justify-center">
          <Image
            src="/icons/empty-cart.png"
            alt="empty cart"
            width={150}
            height={150}
            className="mb-4 opacity-70"
          />
          <p className="mb-4">Giỏ hàng của bạn còn trống</p>
          <button
            onClick={() => (window.location.href = "/users/collection")}
            className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 text-sm"
          >
            MUA NGAY
          </button>
        </div>
      ) : (
        <>
          {/* 1. Header */}
          <div className="bg-white rounded-t-lg shadow-sm">
            <div className="grid grid-cols-12 gap-4 px-4 py-3 border-b text-sm font-medium text-gray-600">
              <div className="col-span-5 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={
                    selectedItems.length === cart.length && cart.length > 0
                  }
                  onChange={handleSelectAll}
                />
                <span>Sản phẩm</span>
              </div>
              <span className="col-span-2 text-center">Đơn giá</span>
              <span className="col-span-2 text-center">Số lượng</span>
              <span className="col-span-2 text-center">Số tiền</span>
              <span className="col-span-1 text-center">Thao tác</span>
            </div>
          </div>

          {/* 2. Danh sách sản phẩm */}
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-sm border border-gray-100"
              >
                <div className="grid grid-cols-12 gap-4 px-4 py-3 items-center border-b border-gray-100">
                  {/* Cột sản phẩm */}
                  <div className="col-span-5 flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleSelectOne(item.id)}
                    />
                    <div className="flex items-center gap-3">
                      <div className="relative w-16 h-16">
                        <Image
                          src={item.img}
                          alt={item.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <p className="text-sm line-clamp-2">{item.name}</p>
                    </div>
                  </div>

                  {/* Cột đơn giá */}
                  <div className="col-span-2 text-center">
                    <p className="text-gray-400 line-through text-sm">
                      {item.price.toLocaleString()}₫
                    </p>
                    <p className="text-red-500 font-semibold">
                      {item.finalPrice.toLocaleString()}₫
                    </p>
                  </div>

                  {/* Cột số lượng */}
                  <div className="col-span-2 flex items-center justify-center">
                    <div className="flex items-center border rounded-lg overflow-hidden">
                      <button
                        onClick={() => handleQty(item.id, "dec")}
                        className="px-3 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95 transition"
                        disabled={item.qty <= 1}
                      >
                        −
                      </button>
                      <span className="px-4 py-1 text-gray-800 font-medium min-w-[30px] text-center">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => handleQty(item.id, "inc")}
                        className="px-3 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95 transition"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Cột số tiền */}
                  <div className="col-span-2 text-red-600 font-semibold text-center">
                    {(item.finalPrice * item.qty).toLocaleString()}₫
                  </div>

                  {/* Cột thao tác */}
                  <div className="col-span-1 text-center">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-sm text-red-500 hover:underline"
                    >
                      Xóa
                    </button>
                  </div>
                </div>

                {/* Shop Voucher */}
                <div className="px-12 py-2 bg-gray-50 text-sm text-gray-600 flex items-center gap-2 rounded-b-lg">
                  <span className="text-green-600">🚚 Miễn phí vận chuyển</span>
                </div>
              </div>
            ))}
          </div>
          {/* 3. Khuyến mãi toàn sàn */}
          <div className="px-12 py-2 bg-gray-200 border-t border-gray-100 text-sm text-gray-600 flex items-center gap-3 mt-3">
            <span className="text-red-500">🏷️ Thêm Shop Voucher</span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                id="voucherInput"
                placeholder="Nhập mã giảm giá"
                className="border rounded px-3 py-1 text-sm border-gray-300"
              />
              <button
                onClick={() => {
                  const voucher = document
                    .getElementById("voucherInput")
                    .value.trim();
                  if (voucher) {
                    localStorage.setItem("shopVoucher", voucher); // 👉 lưu voucher vào localStorage
                    alert(`Đã áp dụng mã: ${voucher}`);
                  } else {
                    alert("Vui lòng nhập mã hợp lệ");
                  }
                }}
                className="text-blue-600 underline hover:text-blue-800"
              >
                Áp Dụng
              </button>
            </div>
          </div>

          {/* 4. Footer tổng cộng */}
          <div className="bg-white rounded-b-lg shadow-sm mt-3 px-4 py-3 flex justify-between items-center">
            <div className="flex items-center gap-4 text-sm">
              <input
                type="checkbox"
                checked={
                  selectedItems.length === cart.length && cart.length > 0
                }
                onChange={handleSelectAll}
              />
              <span>Chọn tất cả ({cart.length})</span>
              <button
                onClick={handleDeleteSelected}
                className="text-red-500 hover:underline"
              >
                Xóa
              </button>
            </div>
            <div className="flex items-center gap-6">
              <p className="text-sm">
                Tổng cộng ({selectedItems.length} sản phẩm):{" "}
                <span className="text-lg font-semibold text-red-600">
                  {total.toLocaleString()}₫
                </span>
              </p>
              <button
                onClick={() => {
                  if (selectedItems.length === 0) return;
                  const selectedProducts = cart.filter((item) =>
                    selectedItems.includes(item.id)
                  );
                  localStorage.setItem(
                    "checkoutItems",
                    JSON.stringify(selectedProducts)
                  );
                  router.push("/users/checkout");
                }}
                disabled={selectedItems.length === 0}
                className={`px-6 py-3 rounded text-white transition ${
                  selectedItems.length === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                Mua Hàng
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
