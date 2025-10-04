"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import CheckIf from "@/components/users/CheckIf"; // Modal điều kiện

export default function CheckoutPage() {
  const [payment, setPayment] = useState("COD");
  const [items, setItems] = useState([]);
  const [voucher, setVoucher] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [shopVoucher, setShopVoucher] = useState("");

  // Load dữ liệu từ localStorage
  useEffect(() => {
    const storedItems = localStorage.getItem("checkoutItems");
    const storedVoucher = localStorage.getItem("shopVoucher");
    if (storedItems) setItems(JSON.parse(storedItems));
    if (storedVoucher) setShopVoucher(storedVoucher.trim());
  }, []);

  // ================== Tính tổng ==================
  const total = items.reduce(
    (sum, item) => sum + item.finalPrice * item.qty,
    0
  );

  // Mặc định ship
  const defaultShipping = 40000;
  let totalShipping = items.reduce(
    (sum, item) => sum + (item.shipping ?? defaultShipping),
    0
  );

  let discount = 0;
  let shopDiscount = 0;

  // ================== Áp dụng mã giảm toàn đơn ==================
  totalShipping = 0; // Fennik auto freeship

  if (voucher === "Veera" && total < 100000) {
    totalShipping = 2000;
  }

  if (voucher === "Yorn" && total >= 300000) {
    discount += 200000;
    totalShipping = 5000;
  }

  if (voucher === "Alice" && total >= 500000) {
    discount += 400000;
    totalShipping = 5000;
  }

  if (voucher === "Qi" && total >= 1000000) {
    discount += 800000;
    totalShipping = 0;
  }

  // ================== Áp dụng voucher shop ==================
  switch (shopVoucher.toLowerCase()) {
    case "sale100":
      shopDiscount = 100000;
      break;
    case "sale200":
      shopDiscount = 200000;
      break;
    case "vip300":
      shopDiscount = 300000;
      break;
    default:
      shopDiscount = 0;
  }

  // Tổng thanh toán cuối cùng
  const grandTotal = Math.max(
    0,
    total + totalShipping - discount - shopDiscount
  );

  // ================== Render ==================
  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow text-gray-800">
      {/* Địa chỉ nhận hàng */}
      <div className="pb-4 mb-4 border-b">
        <h2 className="font-semibold text-lg mb-2 text-red-600">
          📍 Địa Chỉ Nhận Hàng
        </h2>
        <div className="flex justify-between items-center">
          <p>
            <span className="font-semibold">Nam Nguyễn (+84) 987 045 732</span>
            <br />
            Số 2, Đường Số 2, Lạc Thành Đông, Điện Hồng, Quảng Nam
            <span className="ml-2 bg-red-100 text-red-600 px-2 py-0.5 rounded text-xs">
              Mặc Định
            </span>
          </p>
          <button className="text-blue-600 hover:underline">Thay đổi</button>
        </div>
      </div>

      {/* Danh sách sản phẩm */}
      <h2 className="font-semibold text-lg mb-2">🛍️ Sản phẩm</h2>
      {items.length === 0 ? (
        <p className="text-gray-500">Không có sản phẩm nào.</p>
      ) : (
        items.map((item) => (
          <div key={item.id} className="border rounded mb-3 bg-white">
            <div className="flex items-center gap-4 p-3 border-b">
              <Image
                src={item.img}
                alt={item.name}
                width={60}
                height={60}
                className="rounded"
              />
              <div className="flex-1">
                <p className="font-medium">{item.name}</p>
              </div>
              <p className="w-24 text-right">
                {item.finalPrice.toLocaleString("vi-VN")}₫
              </p>
              <p className="w-16 text-center">x{item.qty}</p>
              <p className="w-24 text-right font-semibold">
                {(item.finalPrice * item.qty).toLocaleString("vi-VN")}₫
              </p>
            </div>
          </div>
        ))
      )}

      {/* Voucher chọn mã */}
      <div className="border-b pb-4 mb-4 mt-4 flex justify-between items-center">
        <div>
          <h2 className="font-semibold text-lg mb-2">
            🏷️ Chọn mã giảm giá toàn đơn
          </h2>
          <div className="flex flex-wrap gap-3">
            {["Veera", "Yorn", "Alice", "Qi"].map((code) => (
              <button
                key={code}
                onClick={() => setVoucher(code)}
                className={`px-4 py-2 border rounded transition ${
                  voucher === code
                    ? "border-red-500 text-red-600 font-medium"
                    : "hover:bg-gray-50"
                }`}
              >
                {code}
              </button>
            ))}
            <span className="text-green-600 ml-3">
              (* Fennik: Freeship auto)
            </span>
          </div>
        </div>

        {/* Link mở modal */}
        <button
          onClick={() => setShowModal(true)}
          className="text-blue-600 underline text-sm"
        >
          Điều kiện mã giảm
        </button>
      </div>

      {/* Modal điều kiện */}
      {showModal && <CheckIf onClose={() => setShowModal(false)} />}

      {/* Phương thức thanh toán */}
      <div className="border-b pb-4 mb-4 mt-4">
        <h2 className="font-semibold text-lg mb-2">
          💳 Phương thức thanh toán
        </h2>
        <div className="flex flex-wrap gap-3">
          {["COD", "Ví MoMo", "VNPay"].map((m) => (
            <button
              key={m}
              onClick={() => setPayment(m)}
              className={`px-4 py-2 border rounded transition ${
                payment === m
                  ? "border-red-500 text-red-600 font-medium"
                  : "hover:bg-gray-50"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Tổng kết */}
      <div className="flex justify-between items-center">
        <div className="text-gray-600 text-sm space-y-1">
          <p>Tổng tiền hàng: {total.toLocaleString("vi-VN")}₫</p>
          <p>Phí vận chuyển: {totalShipping.toLocaleString("vi-VN")}₫</p>

          {shopVoucher && (
            <p className="text-blue-600">
              Voucher Shop: {shopVoucher}{" "}
              {shopDiscount > 0 &&
                `(-${shopDiscount.toLocaleString("vi-VN")}₫)`}
            </p>
          )}

          {discount > 0 && (
            <p className="text-green-600">
              Giảm giá toàn đơn: -{discount.toLocaleString("vi-VN")}₫
            </p>
          )}

          <p className="font-semibold text-lg text-red-600 pt-1">
            Tổng thanh toán: {grandTotal.toLocaleString("vi-VN")}₫
          </p>
        </div>

        <button className="bg-red-600 text-white px-6 py-3 rounded hover:bg-red-700 transition">
          Đặt Hàng
        </button>
      </div>
    </div>
  );
}
