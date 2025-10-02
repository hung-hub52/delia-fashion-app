"use client";
import { useState } from "react";
import Image from "next/image";

export default function CartPage() {
  const [cart, setCart] = useState([
    {
      id: 1,
      name: "COMBO TRI ÂN gồm 10 chân gà + 1 hũ đùi gà – ĂN CÙNG BẠN",
      img: "/demo/chicken.jpg",
      price: 200000,
      finalPrice: 102000,
      qty: 1,
    },
    {
      id: 2,
      name: "Bánh tráng trộn siêu cay",
      img: "/demo/snack.jpg",
      price: 50000,
      finalPrice: 30000,
      qty: 2,
    },
  ]);

  const [selectedItems, setSelectedItems] = useState([]);

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
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Cập nhật số lượng
  const handleQty = (id, type) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              qty: type === "inc" ? item.qty + 1 : Math.max(1, item.qty - 1),
            }
          : item
      )
    );
  };

  // Xóa sản phẩm
  const handleDelete = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    setSelectedItems((prev) => prev.filter((i) => i !== id));
  };

  // Xóa tất cả sản phẩm đã chọn
  const handleDeleteSelected = () => {
    setCart((prev) => prev.filter((item) => !selectedItems.includes(item.id)));
    setSelectedItems([]);
  };

  // Tính tổng tiền dựa trên sản phẩm đã chọn
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
            <div className="grid grid-cols-6 gap-4 px-4 py-3 border-b text-sm font-medium text-gray-600">
              <div className="col-span-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={
                    selectedItems.length === cart.length && cart.length > 0
                  }
                  onChange={handleSelectAll}
                />
                <span>Sản phẩm</span>
              </div>
              <span>Đơn giá</span>
              <span>Số lượng</span>
              <span>Số tiền</span>
              <span>Thao tác</span>
            </div>
          </div>

          {/* 2. Danh sách sản phẩm */}
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-sm border border-gray-100"
              >
                {/* Main row */}
                <div className="grid grid-cols-6 gap-4 px-4 py-3 items-center border-b border-gray-100">
                  <div className="col-span-2 flex items-center gap-3">
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

                  <div>
                    <p className="text-gray-400 line-through text-sm">
                      {item.price.toLocaleString()}₫
                    </p>
                    <p className="text-red-500 font-semibold">
                      {item.finalPrice.toLocaleString()}₫
                    </p>
                  </div>

                  <div className="flex items-center border rounded w-max border-gray-200">
                    <button
                      onClick={() => handleQty(item.id, "dec")}
                      className="px-2 py-1 text-gray-600"
                    >
                      -
                    </button>
                    <span className="px-3">{item.qty}</span>
                    <button
                      onClick={() => handleQty(item.id, "inc")}
                      className="px-2 py-1 text-gray-600"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-red-600 font-semibold">
                    {(item.finalPrice * item.qty).toLocaleString()}₫
                  </div>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-sm text-red-500 hover:underline"
                  >
                    Xóa
                  </button>
                </div>

                {/* Shop Voucher */}
                <div className="px-12 py-2 bg-gray-50 text-sm text-gray-600 flex items-center gap-2 rounded-b-lg">
                  <span className="text-green-600">🚚 Miễn phí vận chuyển</span>
                  <span className="text-gray-500">
                    Giảm 500.000₫ phí vận chuyển đơn tối thiểu 0₫
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* 3. Khuyến mãi toàn sàn */}
          <div className="px-12 py-2 bg-gray-200 border-t border-gray-100 text-sm text-gray-600 flex items-center gap-3 mt-3">
            <span className="text-red-500">🏷️ Thêm Shop Voucher</span>
            <input
              type="text"
              placeholder="Nhập mã giảm giá"
              className="border rounded px-3 py-1 text-sm border-gray-300"
            />
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
                disabled={selectedItems.length === 0}
                className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 text-sm disabled:opacity-50"
              >
                Mua hàng
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
