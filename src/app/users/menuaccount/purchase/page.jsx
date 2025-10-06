"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";


export default function PurchasePage() {
  const [orders, setOrders] = useState([]);
  const router = useRouter();


  // ✅ Hàm load lại danh sách đơn
  const loadOrders = () => {
    const stored = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(stored);
  };

  useEffect(() => {
    loadOrders();

    // 🔔 Lắng nghe khi đơn hàng được cập nhật từ CheckoutPage
    const handleOrdersUpdate = () => loadOrders();
    window.addEventListener("ordersUpdated", handleOrdersUpdate);

    // Cleanup khi unmount
    return () =>
      window.removeEventListener("ordersUpdated", handleOrdersUpdate);
  }, []);

  // ======= Xử lý MUA LẠI =======
  const handleBuyAgain = (products) => {
    const currentCart = JSON.parse(localStorage.getItem("cart")) || [];

    // Gộp sản phẩm — nếu đã có thì tăng số lượng
    const updatedCart = [...currentCart];
    products.forEach((p) => {
      const existingIndex = updatedCart.findIndex((c) => c.id === p.id);
      if (existingIndex !== -1) {
        updatedCart[existingIndex].qty += p.qty;
      } else {
        updatedCart.push({ ...p });
      }
    });

    // ✅ Lưu lại giỏ hàng
    localStorage.setItem("cart", JSON.stringify(updatedCart));

   toast.success("🛒 Sản phẩm đã được thêm lại vào giỏ hàng!");
   window.dispatchEvent(new Event("cartUpdated"));
   setTimeout(() => router.push("/users/cart"), 800);

  };

  return (
    <div className="bg-white rounded-lg p-4">
      <h1 className="text-lg font-semibold mb-4">Đơn đã mua</h1>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <Image
            src="/icons/empty-order.png"
            alt="empty"
            width={80}
            height={80}
            className="mb-4 opacity-70"
          />
          <p>Chưa có đơn hàng</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const totalQty = order.products.reduce((sum, p) => sum + p.qty, 0);
            const totalPrice = order.products.reduce(
              (sum, p) => sum + p.finalPrice * p.qty,
              0
            );

            return (
              <div
                key={order.id}
                className="border rounded-lg overflow-hidden shadow-sm"
              >
                <div className="flex justify-between items-center px-4 py-2 bg-gray-50 border-b">
                  <span className="font-medium text-sm">{order.shop}</span>
                  <span className="text-sm text-red-500">{order.status}</span>
                </div>

                {order.products.map((product, idx) => (
                  <div
                    key={idx}
                    className="flex gap-3 p-4 border-b last:border-b-0"
                  >
                    <div className="w-20 h-20 relative flex-shrink-0">
                      <Image
                        src={product.img}
                        alt={product.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium line-clamp-1">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {product.variant} x{product.qty}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm line-through text-gray-400">
                        {product.price.toLocaleString()}₫
                      </p>
                      <p className="text-base font-semibold text-red-600">
                        {product.finalPrice.toLocaleString()}₫
                      </p>
                    </div>
                  </div>
                ))}

                <div className="flex justify-between items-center px-4 py-2 border-t bg-gray-50">
                  <p className="text-sm">
                    Tổng ({totalQty} SP):{" "}
                    <span className="font-semibold text-red-600">
                      {totalPrice.toLocaleString()}₫
                    </span>
                  </p>
                  <button
                    onClick={() => handleBuyAgain(order.products)}
                    className="px-4 py-1.5 border border-red-500 text-red-500 rounded text-sm hover:bg-red-50 transition"
                  >
                    Mua lại
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
