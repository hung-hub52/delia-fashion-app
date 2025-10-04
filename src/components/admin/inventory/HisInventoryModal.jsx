// src/components/admin/inventory/HisInventoryModal.jsx
"use client";
import { useEffect } from "react";
import { X } from "lucide-react";

export default function HisInventoryModal({
  open,
  onClose,
  history = [],
  title = "📜 Lịch sử nhập kho",
}) {
  if (!open) return null;

  // Khóa cuộn nền khi mở modal
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      {/* Modal */}
      <div
        className="
          relative w-[min(100vw-2rem,960px)]
          bg-white text-gray-800 rounded-2xl shadow-2xl border
          flex flex-col
          max-h-[85vh]   /* Giới hạn chiều cao modal */
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header dính */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-3 rounded-t-2xl
                        bg-gradient-to-r from-teal-500 to-cyan-500 text-white">
          <h2 className="text-base font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-white/20 focus:outline-none"
            aria-label="Đóng"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body cuộn được */}
        <div
          className="px-6 py-4 overflow-y-auto
                     [scrollbar-width:thin]
                     [&::-webkit-scrollbar]:w-2
                     [&::-webkit-scrollbar-thumb]:rounded-full
                     [&::-webkit-scrollbar-thumb]:bg-gray-300"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-2 text-center w-14">STT</th>
                  <th className="p-2 text-left">Mã sản phẩm</th>
                  <th className="p-2 text-left">Tên sản phẩm</th>
                  <th className="p-2 text-right">Số lượng nhập</th>
                  <th className="p-2 text-left">Ngày nhập</th>
                </tr>
              </thead>
              <tbody>
                {history?.length ? (
                  history.map((h, idx) => (
                    <tr key={idx} className={idx % 2 ? "bg-gray-50" : ""}>
                      <td className="p-2 text-center">{idx + 1}</td>
                      <td className="p-2">SP{h.code}</td>
                      <td className="p-2">{h.name}</td>
                      <td className="p-2 text-right">{h.qty}</td>
                      <td className="p-2">{h.date || h.createdAt || h.time || ""}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-gray-400">
                      Chưa có lịch sử
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer dính */}
        <div className="sticky bottom-0 px-6 py-3 bg-gray-50 rounded-b-2xl border-t">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
