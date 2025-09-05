//src/components/admin/orders/ViewOrderModal.jsx

"use client";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import PrintInvoice from "./PrintInvoice";

export default function ViewOrderModal({ open, onClose, order, onUpdate }) {
  const [status, setStatus] = useState(order?.status || "Chờ xử lý");

  useEffect(() => {
    if (order) setStatus(order.status || "Chờ xử lý");
  }, [order]);

  if (!open || !order) return null;

  const handleChangeStatus = (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    onUpdate?.({ ...order, status: newStatus });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800 uppercase">
            📦 Chi tiết đơn hàng
          </h2>
          <div className="flex items-center gap-2">
            <PrintInvoice order={order} />
            <button
              onClick={onClose}
              className="rounded-full bg-red-500 p-2 text-white hover:bg-red-600"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Nội dung hiển thị */}
        <div className="space-y-2 text-gray-700 mb-4">
          <p>
            <b>Mã đơn hàng:</b> {order.code}
          </p>
          <p>
            <b>Người mua:</b> {order.buyer || "---"}
          </p>
          <p>
            <b>Người nhận:</b> {order.customer}
          </p>
          <p>
            <b>Địa chỉ:</b> {order.address}
          </p>
          <p>
            <b>Số điện thoại:</b> {order.phone || "---"}
          </p>
          <p>
            <b>Ngày mua:</b> {order.date || "---"}
          </p>
        </div>

        {/* Danh sách mặt hàng */}
        <div className="overflow-x-auto mb-4">
          <table className="min-w-full text-sm border rounded-md">
            <thead>
              <tr className="bg-green-500 text-white">
                <th className="p-2 text-left">Tên mặt hàng</th>
                <th className="p-2 text-center">Số lượng</th>
                <th className="p-2 text-right">Đơn giá</th>
                <th className="p-2 text-right">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map((item, idx) => (
                <tr key={idx} className="border-b text-gray-700">
                  <td className="p-2">{item.name}</td>
                  <td className="p-2 text-center">{item.qty}</td>
                  <td className="p-2 text-right">
                    {item.price.toLocaleString("vi-VN")} ₫
                  </td>
                  <td className="p-2 text-right">
                    {(item.qty * item.price).toLocaleString("vi-VN")} ₫
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Thống kê */}
        <div className="space-y-2 text-gray-700">
          <p>
            <b>Tổng số sản phẩm:</b> {order.quantity ?? "---"}
          </p>
          <p>
            <b>Tổng tiền:</b>{" "}
            {order.total ? `${order.total.toLocaleString("vi-VN")} ₫` : "---"}
          </p>
          <p>
            <b>Trạng thái đơn:</b>{" "}
            <select
              value={status}
              onChange={handleChangeStatus}
              className="ml-2 border rounded-md px-2 py-1"
            >
              <option>Chờ xử lý</option>
              <option>Đang xử lý</option>
              <option>Đang giao</option>
              <option>Hoàn thành</option>
              <option>Đã hủy</option>
            </select>
          </p>
          <p>
            <b>Ghi chú:</b> {order.note || "---"}
          </p>
        </div>
      </div>
    </div>
  );
}
