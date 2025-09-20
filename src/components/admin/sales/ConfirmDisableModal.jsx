// src/components/admin/sales/ConfirmDisableModal.jsx
"use client";

import { X, AlertTriangle } from "lucide-react";

export default function ConfirmDisableModal({ open, onClose, onConfirm }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle size={18} />
            <h3 className="font-semibold">Vô hiệu hóa mã khuyến mãi</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-100"
            title="Đóng"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-4 py-4 text-sm text-gray-700">
          Mã sẽ chuyển sang trạng thái <b>Đã vô hiệu hóa</b> và không thể áp
          dụng cho đơn hàng mới. Bạn có chắc muốn tiếp tục?
        </div>

        <div className="flex items-center justify-end gap-2 border-t px-4 py-3">
          <button
            onClick={onClose}
            className="rounded-md border px-3 py-2 text-gray-700 hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="rounded-md bg-red-600 px-3 py-2 text-white hover:bg-red-700"
          >
            Vô hiệu hóa
          </button>
        </div>
      </div>
    </div>
  );
}
