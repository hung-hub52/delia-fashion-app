"use client";
import Image from "next/image";

export default function PurchasePage() {
  // Demo data, sau này thay bằng API hoặc localStorage
  const orders = [
    {
      id: 1,
      shop: "xiaowuchen.vn",
      status: "Hoàn thành",
      products: [
        {
          name: "Dép nam mùa hè",
          variant: "Đen, 43/44",
          qty: 1,
          price: 194571,
          finalPrice: 179005,
          img: "/demo/shoes.jpg",
        },
      ],
    },
    {
      id: 2,
      shop: "TOPSportMall",
      status: "Hoàn thành",
      products: [
        {
          name: "Găng tay lái xe chống UV",
          variant: "Màu đen",
          qty: 1,
          price: 70000,
          finalPrice: 39900,
          img: "/demo/gloves.jpg",
        },
        {
          name: "Khăn trùm đầu xe máy",
          variant: "Màu xám",
          qty: 1,
          price: 50000,
          finalPrice: 35000,
          img: "/demo/helmet.jpg",
        },
      ],
    },
  ];

  return (
    <div className="bg-white rounded-lg p-4">
      <h1 className="text-lg font-semibold mb-4">Đơn đã mua</h1>

      {/* Mock UI chưa có đơn hàng */}
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
                {/* Shop header */}
                <div className="flex justify-between items-center px-4 py-2 bg-gray-50 border-b">
                  <span className="font-medium text-sm">{order.shop}</span>
                  <span className="text-sm text-red-500">{order.status}</span>
                </div>

                {/* Product list */}
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

                {/* Footer */}
                <div className="flex justify-between items-center px-4 py-2 border-t bg-gray-50">
                  <p className="text-sm">
                    Tổng số tiền ({totalQty} sản phẩm):{" "}
                    <span className="font-semibold text-red-600">
                      {totalPrice.toLocaleString()}₫
                    </span>
                  </p>
                  <button className="px-4 py-1.5 border border-red-500 text-red-500 rounded text-sm hover:bg-red-50">
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
