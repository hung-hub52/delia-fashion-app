"use client";
import { X } from "lucide-react";

export default function CustomerClassifyModal({
  open,
  onClose,
  group,
  customers,
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm">
      <div className="rounded-2xl shadow-2xl border border-violet-200 p-8 min-w-[350px] max-w-full relative bg-white/90 text-gray-900">
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 rounded-full p-2 bg-gray-300 dark:bg-neutral-200 hover:bg-gray-300"
        >
          <X size={20} />
        </button>
        {/* Tiêu đề */}
        <div className="text-2xl font-bold text-violet-700 text-center mb-3">
          {group}
        </div>
        <div className="overflow-auto max-h-[60vh]">
          <table className="min-w-full">
            <thead>
              <tr className="border-b font-semibold">
                <th className="p-2 text-left">Mã KH</th>
                <th className="p-2 text-left">Tên KH</th>
                <th className="p-2 text-center">Tổng đơn</th>
                {group === "Ngừng dịch vụ" ? (
                  <th className="p-2 text-center">Thời gian ngừng</th>
                ) : group === "Vãng lai" ? (
                  <th className="p-2 text-center">Lần ghé gần nhất</th>
                ) : null}
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-6 opacity-50">
                    Không có dữ liệu nhóm này
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr
                    key={c.id}
                    className="border-b hover:bg-yellow-400 text-[15px] transition"
                  >
                    <td className="p-2 font-mono font-semibold">{c.code}</td>
                    <td className="p-2">{c.name}</td>
                    <td className="p-2 text-center">{c.totalOrders}</td>
                    {group === "Ngừng dịch vụ" && (
                      <td className="p-2 text-center">{c.stopDate || "—"}</td>
                    )}
                    
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <style>{`
        .animate-slide-in {
          animation: slideInRight 0.34s cubic-bezier(.45,1.25,.32,1) both;
        }
        @keyframes slideInRight {
          0% { opacity: 0; transform: translateX(80px) scale(.95);}
          100% { opacity: 1; transform: translateX(0) scale(1);}
        }
      `}</style>
    </div>
  );
}
