// src/app/admin/sales/page.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import AddSaleModal from "@/components/admin/sales/AddSaleModal";
import ConfirmDisableModal from "@/components/admin/sales/ConfirmDisableModal";
import SaleStatusBadge from "@/components/admin/sales/SaleStatusBadge";
import ActionMenu from "@/components/admin/sales/ActionMenu";

const INITIAL_SALES = [
  {
    id: 1,
    code: "SALE20",
    description: "Giảm 20% toàn bộ giày",
    discount: "20%",
    status: "Đang hoạt động",
    startDate: "2025-08-01",
    endDate: "2025-08-30",
  },
  {
    id: 2,
    code: "FREESHIP",
    description: "Miễn phí vận chuyển đơn > 200k",
    discount: "Freeship",
    status: "Hết hạn",
    startDate: "2025-06-01",
    endDate: "2025-06-30",
  },
];

function parseYMD(d) {
  // Dùng 00:00 local để so ngày cho chính xác
  const [y, m, day] = d.split("-").map(Number);
  return new Date(y, m - 1, day, 0, 0, 0, 0);
}

function computeStatus(sale, now = Date.now()) {
  // Nếu đã bị vô hiệu hóa thì không tự tính nữa
  if (sale.status === "Đã vô hiệu hóa") return "Đã vô hiệu hóa";
  const start = parseYMD(sale.startDate).getTime();
  const end = parseYMD(sale.endDate).getTime();

  if (now < start) return "Chưa bắt đầu";
  if (now > end) return "Hết hạn";
  return "Đang hoạt động";
}

// Thứ tự ưu tiên khi sắp xếp: hoạt động > chưa bắt đầu > hết hạn > vô hiệu hóa
const STATUS_ORDER = {
  "Đang hoạt động": 0,
  "Chưa bắt đầu": 1,
  "Hết hạn": 2,
  "Đã vô hiệu hóa": 3,
};

export default function SalesPage() {
  const [sales, setSales] = useState(INITIAL_SALES);
  const [openAdd, setOpenAdd] = useState(false);
  const [openApply, setOpenApply] = useState(null);
  const [openDisable, setOpenDisable] = useState(null);

  // Nhịp thời gian để UI tự cập nhật trạng thái theo phút
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const itv = setInterval(() => setNow(Date.now()), 60 * 1000);
    return () => clearInterval(itv);
  }, []);

  // Thêm mã mới
  const handleAdd = (newSale) => {
    setSales((prev) => [
      ...prev,
      { id: Date.now(), status: "Chưa bắt đầu", ...newSale },
    ]);
    setOpenAdd(false);
  };

  // Vô hiệu hóa mã
  const handleDisable = (id) => {
    setSales((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: "Đã vô hiệu hóa" } : s))
    );
    setOpenDisable(null);
  };

  // Dùng useMemo để tính trạng thái động + sắp xếp
  const computedAndSorted = useMemo(() => {
    const withStatus = sales.map((s) => {
      const dynamicStatus = computeStatus(s, now);
      return { ...s, dynamicStatus };
    });
    return withStatus.sort(
      (a, b) => STATUS_ORDER[a.dynamicStatus] - STATUS_ORDER[b.dynamicStatus]
    );
  }, [sales, now]);

  return (
    <div className="p-6 text-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý khuyến mãi</h1>
        <button
          onClick={() => setOpenAdd(true)}
          className="flex items-center gap-2 bg-orange-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md"
        >
          <Plus size={18} /> Tạo mã mới
        </button>
      </div>

      {/* Bảng */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-red-500 to-orange-300 text-white text-left">
              <th className="p-3">Mã khuyến mãi</th>
              <th className="p-3">Mô tả</th>
              <th className="p-3 text-center">Trạng thái</th>
              <th className="p-3 text-center">Ngày bắt đầu</th>
              <th className="p-3 text-center">Ngày kết thúc</th>
              <th className="p-3 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {computedAndSorted.map((s, idx) => (
              <tr
                key={s.id}
                className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="p-3 font-semibold">{s.code}</td>
                <td className="p-3">{s.description}</td>
                <td className="p-3 text-center">
                  <SaleStatusBadge status={s.dynamicStatus} />
                </td>
                <td className="p-3 text-center">{s.startDate}</td>
                <td className="p-3 text-center">{s.endDate}</td>
                <td className="p-3 text-center">
                  <ActionMenu
                    onApply={() => setOpenApply(s)}
                    onDisable={() => setOpenDisable(s)}
                  />
                </td>
              </tr>
            ))}

            {computedAndSorted.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="p-6 text-center text-gray-400 italic"
                >
                  Không có khuyến mãi nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {openAdd && (
        <AddSaleModal
          open={openAdd}
          onClose={() => setOpenAdd(false)}
          onAdd={handleAdd}
        />
      )}
      {openDisable && (
        <ConfirmDisableModal
          open={openDisable}
          onClose={() => setOpenDisable(null)}
          onConfirm={() => handleDisable(openDisable.id)}
        />
      )}
    </div>
  );
}
