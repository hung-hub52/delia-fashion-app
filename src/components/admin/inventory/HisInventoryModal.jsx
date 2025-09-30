// src/components/admin/inventory/HisInventoryModal.jsx
"use client";
import { X } from "lucide-react";

export default function HisInventoryModal({ open, onClose, history, title = "📜 Lịch sử nhập kho" }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl p-6 text-gray-800">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-full bg-red-500 text-white px-3 py-1 hover:bg-red-600"
          >
            <X size={16} />
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-center">STT</th>
                <th className="p-2 text-left">Mã sản phẩm</th>
                <th className="p-2 text-left">Tên sản phẩm</th>
                <th className="p-2 text-left">Số lượng nhập</th>
                <th className="p-2 text-left">Ngày nhập</th>
              </tr>
            </thead>
            <tbody>
              {history.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-gray-400">
                    Chưa có lịch sử
                  </td>
                </tr>
              ) : (
                history.map((h, idx) => (
                  <tr
                    key={idx}
                    className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="p-2 text-center">{idx + 1}</td>
                    <td className="p-2">{h.code}</td>
                    <td className="p-2">{h.name}</td>
                    <td className="p-2">{h.qty}</td>
                    <td className="p-2">{h.date}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
