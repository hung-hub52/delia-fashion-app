// src/app/admin/payments/page.jsx
"use client";

import { useState, useMemo } from "react";

const INITIAL_PAYMENTS = [
  {
    id: 1,
    code: "PMT1001",
    orderCode: "DH1001",
    method: "Momo",
    amount: 350000,
    status: "Thành công",
    date: "2025-07-19",
  },
  {
    id: 2,
    code: "PMT1002",
    orderCode: "DH1002",
    method: "Tiền mặt",
    amount: 210000,
    status: "Thất bại",
    date: "2025-07-20",
  },
];

export default function PaymentsPage() {
  const [payments, setPayments] = useState(INITIAL_PAYMENTS);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return payments;
    return payments.filter(
      (p) =>
        p.code.toLowerCase().includes(q) ||
        p.orderCode.toLowerCase().includes(q)
    );
  }, [payments, search]);

  // Cập nhật trạng thái
  const handleChangeStatus = (id, newStatus) => {
    setPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
    );
  };

  return (
    <div className="p-4 sm:p-6 text-gray-800">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Tìm theo mã thanh toán hoặc mã đơn hàng"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-md px-3 py-2 w-80 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-green-800 to-yellow-300 text-white font-semibold uppercase px-4 py-3 rounded-t-xl">
        Quản lý thanh toán
      </div>

      {/* Table */}
      <div className="bg-white rounded-b-xl shadow overflow-x-auto">
        <table className="min-w-full text-sm text-gray-800">
          <thead>
            <tr className="border-b bg-gray-50 text-gray-700">
              <th className="p-2 w-12 text-center">STT</th>
              <th className="p-2 w-32 text-left">Mã thanh toán</th>
              <th className="p-2 w-32 text-left">Mã đơn hàng</th>
              <th className="p-2 w-28 text-left">Phương thức</th>
              <th className="p-2 w-32 text-right">Số tiền</th>
              <th className="p-2 w-36 text-center">Trạng thái</th>
              <th className="p-2 w-40 text-center">Ngày thanh toán</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, idx) => (
              <tr
                key={p.id}
                className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="p-2 text-center">{idx + 1}</td>
                <td className="p-2">{p.code}</td>
                <td className="p-2">{p.orderCode}</td>
                <td className="p-2">{p.method}</td>
                <td className="p-2 text-right">
                  {p.amount.toLocaleString("vi-VN")} ₫
                </td>
                <td className="p-2 text-center">
                  <select
                    value={p.status}
                    onChange={(e) => handleChangeStatus(p.id, e.target.value)}
                    className={`border rounded-md px-2 py-1 text-sm ${
                      p.status === "Thành công"
                        ? "text-green-600"
                        : p.status === "Đang xử lý"
                        ? "text-blue-600"
                        : p.status === "Thất bại"
                        ? "text-red-600"
                        : "text-gray-600"
                    }`}
                  >
                    <option>Thành công</option>
                    <option>Đang xử lý</option>
                    <option>Thất bại</option>
                  </select>
                </td>
                <td className="p-2 text-center">{p.date}</td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="p-6 text-center text-gray-400 italic"
                >
                  Không tìm thấy thanh toán nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
