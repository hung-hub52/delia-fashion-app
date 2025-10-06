"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import CheckIf from "@/components/users/CheckIf"; // Modal điều kiện

export default function CheckoutPage() {
  const [payment, setPayment] = useState("COD");
  const [items, setItems] = useState([]);
  const [voucher, setVoucher] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [shopVoucher, setShopVoucher] = useState("");
  const [note, setNote] = useState(""); // ✅ lời nhắn cho shop
  const router = useRouter();

  // ======= Load dữ liệu từ localStorage =======
  useEffect(() => {
    // ✅ Load sản phẩm đã chọn từ localStorage
    const storedItems = localStorage.getItem("checkoutItems");
    if (storedItems) {
      setItems(JSON.parse(storedItems));
    }

    // ✅ Load voucher chỉ nếu được áp dụng thủ công
    const appliedVoucher = sessionStorage.getItem("appliedShopVoucher");
    if (appliedVoucher) {
      setShopVoucher(appliedVoucher.trim());
      sessionStorage.removeItem("appliedShopVoucher"); // chỉ 1 lần
    }
  }, []);

  // ======= Tính tổng =======
  const total = items.reduce(
    (sum, item) => sum + item.finalPrice * item.qty,
    0
  );

  const defaultShipping = 40000;
  let totalShipping = items.reduce(
    (sum, item) => sum + (item.shipping ?? defaultShipping),
    0
  );

  let discount = 0;

  // ======= Áp dụng mã giảm toàn đơn =======
  if (voucher === "Fennik") {
    totalShipping = 0;
  }

  if (voucher === "Veera" && total <= 200000) {
    discount += 50000;
    totalShipping = 5000;
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

  // Áp dụng voucher shop
  let shopDiscount = 0;
  switch (shopVoucher?.toUpperCase()) {
    case "SALE100":
      shopDiscount = 100000;
      break;
    case "SALE200":
      shopDiscount = 200000;
      break;
    case "VIP300":
      shopDiscount = 300000;
      break;
    default:
      shopDiscount = 0;
  }

  const grandTotal = Math.max(
    0,
    total + totalShipping - discount - shopDiscount
  );

  // ======= Xử lý đặt hàng =======
  const handleCheckout = async () => {
    if (items.length === 0) {
      toast.error("Không có sản phẩm để đặt hàng!");
      return;
    }

    // ✅ 1. Tạo dữ liệu đơn hàng và lưu vào localStorage
    const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];
    const newOrder = {
      id: Date.now(),
      shop: "Delia Elly.vn",
      status:
        payment === "COD"
          ? "Chờ thanh toán"
          : "Hoàn Thành & Thanh Toán Hoàn Tất",
      payment,
      createdAt: new Date().toLocaleString("vi-VN"),
      products: items,
    };

    existingOrders.unshift(newOrder);
    localStorage.setItem("orders", JSON.stringify(existingOrders));

    // ✅ 5. Phát tín hiệu để PurchasePage tự cập nhật
    window.dispatchEvent(new Event("ordersUpdated"));

    // ✅ Xóa giỏ hàng
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const updatedCart = cart.filter(
      (item) => !items.some((checkoutItem) => checkoutItem.id === item.id)
    );
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    localStorage.removeItem("checkoutItems");

    // ✅ Thông báo cho CartPage và context reload
    window.dispatchEvent(new Event("cartUpdated")); 

    // ✅ 3. Nếu thanh toán bằng MoMo → mở sandbox
    if (payment === "Ví MoMo") {
      try {
        const res = await fetch("/api/payment/momo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: grandTotal,
            orderInfo: "Thanh toán đơn hàng Fennik",
          }),
        });

        const data = await res.json();
        console.log("✅ MoMo response:", data);

        if (data?.payUrl) {
          toast.success("Đang mở cổng thanh toán MoMo...");

          // 👉 Mở trang MoMo sandbox trong tab mới
          window.open(data.payUrl, "_blank");

          // 👉 Sau đó quay về trang pending (không reload)
          setTimeout(() => {
            router.push("/users/checkout/pending");
          }, 1000);
        } else {
          toast.error("Không thể tạo liên kết thanh toán MoMo");
        }
      } catch (err) {
        toast.error("Lỗi khi kết nối MoMo sandbox");
        console.error(err);
      }
      return;
    }

    // ✅ 4. Nếu là COD hoặc VNPay → xử lý trực tiếp
    toast.success("🎉 Đặt hàng thành công!");
    setTimeout(() => {
      router.push("/users/checkout/pending");
    }, 1000);
  };

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

      {/* Lời nhắn cho Shop */}
      <div className="border rounded mb-4 bg-white">
        <div className="p-3 border-b flex items-center gap-3">
          <span className="font-semibold text-gray-700 whitespace-nowrap">
            ✍️ Ghi chú
          </span>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Để lại lời nhắn cho shop..."
            className="flex-1 border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
        </div>
      </div>

      {/* Phương thức vận chuyển */}
      <div className="border rounded mb-4 bg-white">
        <div className="p-3 border-b">
          <h2 className="font-semibold text-lg mb-2">
            🚚 Phương thức vận chuyển
          </h2>
          <div className="flex items-start justify-between bg-teal-50 p-3 rounded border border-teal-200">
            <div>
              <p className="font-medium text-teal-700">Nhanh</p>
              <p className="text-xs text-gray-500">
                Nhận voucher trị giá 50.000₫ nếu đơn hàng được giao muộn
              </p>
              <p className="text-xs text-gray-500">Được kiểm tra hàng</p>
            </div>
            <div className="text-right">
              {voucher && (
                <p className="line-through text-gray-400 text-sm">40.000₫</p>
              )}
              <p className="text-green-600 font-medium">
                {voucher
                  ? totalShipping === 0
                    ? "Miễn phí"
                    : `${totalShipping.toLocaleString("vi-VN")}₫`
                  : "40.000₫"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Voucher chọn mã */}
      <div className="border-b pb-4 mb-4 mt-4 flex justify-between items-center">
        <div>
          <h2 className="font-semibold text-lg mb-2">
            🏷️ Chọn mã giảm giá toàn đơn
          </h2>
          <div className="flex flex-wrap gap-3">
            {["Fennik", "Veera", "Yorn", "Alice", "Qi"].map((code) => (
              <button
                key={code}
                onClick={() => setVoucher(code)}
                className={`px-4 py-2 border rounded transition ${
                  voucher === code
                    ? "border-green-400 text-green-500 font-medium"
                    : "hover:bg-gray-50"
                }`}
              >
                {code}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="text-blue-600 underline text-sm"
        >
          Điều kiện mã giảm
        </button>
      </div>

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
                  ? "border-orange-500 text-orange-600 font-medium"
                  : "hover:bg-gray-50"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Tổng kết */}
      <div className="flex justify-between items-center mt-6">
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

        <button
          onClick={handleCheckout}
          className="bg-red-600 text-white px-6 py-3 rounded hover:bg-red-700 transition"
        >
          Đặt Hàng
        </button>
      </div>
    </div>
  );
}
