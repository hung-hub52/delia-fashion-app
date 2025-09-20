// src/components/admin/sales/SaleStatusBadge.jsx
"use client";

const MAP = {
  "Đang hoạt động": {
    dot: "bg-green-500",
    text: "text-green-700",
    bg: "bg-green-50",
  },
  "Sắp diễn ra": {
    dot: "bg-blue-500",
    text: "text-blue-700",
    bg: "bg-blue-50",
  },
  "Hết hạn": {
    dot: "bg-gray-400",
    text: "text-gray-700",
    bg: "bg-gray-100",
  },
  "Đã vô hiệu hóa": {
    dot: "bg-red-500",
    text: "text-red-700",
    bg: "bg-red-50",
  },
};

export default function SaleStatusBadge({ status = "Đang hoạt động" }) {
  const style = MAP[status] || MAP["Đang hoạt động"];
  return (
    <span
      className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold ${style.bg} ${style.text}`}
    >
      <span className={`inline-block h-2.5 w-2.5 rounded-full ${style.dot}`} />
      {status}
    </span>
  );
}
