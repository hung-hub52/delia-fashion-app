"use client";

import { useMemo, useState } from "react";
import { Eye, Plus } from "lucide-react";
import ViewOrderModal from "@/components/admin/orders/ViewOrderModal";
import AddOrderModal from "@/components/admin/orders/AddOrderModal";

const INITIAL_ORDERS = [
  {
    id: 1,
    code: "DH1001",
    buyer: "Hà G",
    customer: "Nguyễn Văn A",
    phone: "0987 123 456",
    address: "123 Lê Lợi, Quận 1, TP.HCM",
    date: "2025-07-19",
    items: [
      { name: "Mũ nam QC", qty: 2, price: 150000 },
      { name: "Áo thun nam", qty: 1, price: 200000 },
    ],
    itemCount: 2,
    quantity: 3,
    total: 500000,
    status: "Chờ xử lý",
    paymentStatus: "Chưa thanh toán",
    note: "Giao giờ hành chính",
  },
  {
    id: 2,
    code: "DH1002",
    buyer: "Phan An",
    customer: "Trần Thị B",
    phone: "0912 345 678",
    address: "456 Hai Bà Trưng, Quận 3, TP.HCM",
    date: "2025-07-20",
    items: [
      { name: "Túi xách nữ cao cấp", qty: 1, price: 500000 },
      { name: "Ví da nữ", qty: 2, price: 150000 },
    ],
    itemCount: 2,
    quantity: 3,
    total: 800000,
    status: "Hoàn thành",
    paymentStatus: "Đã thanh toán",
    note: "Khách đã nhận hàng",
  },
];

function getStatusClass(status) {
  switch (status) {
    case "Chờ xử lý":
      return "text-yellow-600 font-medium";
    case "Đang xử lý":
      return "text-blue-600 font-medium";
    case "Đang giao":
      return "text-purple-600 font-medium";
    case "Hoàn thành":
      return "text-green-600 font-medium";
    case "Đã hủy":
      return "text-red-600 font-medium";
    default:
      return "text-gray-600 font-medium";
  }
}

export default function OrdersPage() {
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [search, setSearch] = useState("");
  const [viewOpen, setViewOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // lọc theo mã đơn hàng hoặc người nhận
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return orders;
    return orders.filter(
      (o) =>
        o.code.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q)
    );
  }, [orders, search]);

  return (
    <div>
      {/* Toolbar tìm kiếm + nút thêm */}
      <div className="flex items-center py-2 justify-between mb-4 text-gray-800">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Tìm theo mã đơn hoặc người nhận"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-md px-3 py-2 w-72 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <button
            onClick={() => setAddOpen(true)}
            className="flex items-center gap-2 rounded-md bg-green-500 px-3 py-2 text-white hover:bg-green-600"
          >
            <Plus size={16} /> Tạo đơn hàng
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold uppercase px-4 py-3 rounded-t-xl">
        Quản lý đơn hàng
      </div>

      {/* Bảng */}
      <div className="bg-white rounded-b-xl shadow overflow-x-auto">
        <table className="min-w-full text-sm text-gray-800">
          <thead>
            <tr className="border-b bg-gray-50 text-gray-700">
              <th className="p-2 text-center w-12">STT</th>
              <th className="p-2 text-left">Mã đơn hàng</th>
              <th className="p-2 text-left">Người mua</th>
              <th className="p-2 text-left">Người nhận</th>
              <th className="p-2 text-left">Địa chỉ</th>
              <th className="p-2 text-left">Trạng thái</th>
              <th className="p-2 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o, idx) => (
              <tr
                key={o.id}
                className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="p-2 text-center">{idx + 1}</td>
                <td className="p-2">{o.code}</td>
                <td className="p-2">{o.buyer}</td>
                <td className="p-2">{o.customer}</td>
                <td className="p-2">{o.address}</td>
                <td className={`p-2 ${getStatusClass(o.status)}`}>
                  {o.status}
                </td>
                <td className="p-2 text-center">
                  <button
                    className="rounded-md bg-sky-500 p-1 text-white hover:bg-sky-600"
                    title="Xem chi tiết"
                    onClick={() => {
                      setSelectedOrder(o);
                      setViewOpen(true);
                    }}
                  >
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="p-6 text-center text-gray-400 italic"
                >
                  Không tìm thấy đơn hàng nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal xem đơn */}
      <ViewOrderModal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        order={selectedOrder}
        onUpdate={(updatedOrder) => {
          setOrders((prev) =>
            prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
          );
          setSelectedOrder(updatedOrder);
        }}
      />

      {/* Modal thêm đơn */}
      <AddOrderModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSave={(newOrder) => setOrders((prev) => [...prev, newOrder])}
      />
    </div>
  );
}
