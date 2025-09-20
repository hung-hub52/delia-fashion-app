"use client";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function ConfirmModal({
  open,
  title = "Xác nhận",
  message,
  onConfirm,                 // phải trả Promise nếu là async
  onCancel,                  // hàm đóng modal từ parent
  successMessage = "Thao tác thành công",
  errorMessage = "Có lỗi xảy ra",
}) {
  const [loading, setLoading] = useState(false);

  // reset loading khi open thay đổi
  useEffect(() => {
    if (!open) setLoading(false);
  }, [open]);

  if (!open) return null;

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await onConfirm();                 // nếu throw => catch
      toast.success(successMessage);     // ✔️ thành công
      onCancel();                        // ✔️ đóng modal
    } catch (err) {
      toast.error(err?.message || errorMessage); // ❌ lỗi -> giữ modal mở
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-lg p-6 shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4 text-gray-800 text-center">
          {title}
        </h2>
        <p className="text-gray-700 mb-6 text-center">{message}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 rounded bg-gray-200 text-black hover:bg-gray-300 disabled:opacity-60"
          >
            Hủy
          </button>
          <button
            onClick={handleConfirm}   
            disabled={loading}
            className="px-4 py-2 rounded bg-pink-600 text-white hover:bg-pink-500 disabled:opacity-60"
          >
            {loading ? "Đang xử lý..." : "Đồng ý"}
          </button>
        </div>
      </div>
    </div>
  );
}
