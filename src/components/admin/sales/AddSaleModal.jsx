// src/components/admin/sales/AddSaleModal.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { X, Percent } from "lucide-react";

export default function AddSaleModal({ open, onClose, onAdd }) {
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [minOrder, setMinOrder] = useState("");
  const [usageLimit, setUsageLimit] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("Đang hoạt động");

  useEffect(() => {
    if (open) {
      setCode("");
      setDescription("");
      setMinOrder("");
      setUsageLimit("");
      setStartDate("");
      setEndDate("");
      setStatus("Đang hoạt động");
    }
  }, [open]);

  const valid = useMemo(() => {
    if (!code.trim() || !description.trim()) return false;
    if (!startDate || !endDate) return false;
    if (new Date(startDate) > new Date(endDate)) return false;
    return true;
  }, [code, description, startDate, endDate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!valid) return;

    // 🔥 Tự động xét trạng thái theo ngày kết thúc
    const today = new Date();
    const end = new Date(endDate);
    let finalStatus = status;
    if (end < today) {
      finalStatus = "Hết hạn";
    }

    onAdd?.({
      code: code.trim().toUpperCase(),
      description: description.trim(),
      status: finalStatus,
      startDate,
      endDate,
      minOrder: Number(minOrder || 0),
      usageLimit: Number(usageLimit || 0),
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl rounded-xl bg-white shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div className="flex items-center gap-2">
            <Percent className="text-emerald-600" size={18} />
            <h3 className="text-lg font-semibold">Thêm mã khuyến mãi</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-100"
            title="Đóng"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 gap-4 px-5 py-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">
              Mã khuyến mãi
            </label>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="VD: SALE20"
              className="w-full rounded-md border px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Trạng thái</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-md border px-3 py-2"
            >
              <option>Đang hoạt động</option>
              <option>Sắp diễn ra</option>
              <option>Hết hạn</option>
              <option>Đã vô hiệu hóa</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium">Mô tả</label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả ngắn gọn về khuyến mãi"
              className="w-full rounded-md border px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              ĐIỀU KIỆN: Đơn tối thiểu (₫)
            </label>
            <input
              type="number"
              min="0"
              value={minOrder}
              onChange={(e) => setMinOrder(e.target.value)}
              placeholder="VD: 200000"
              className="w-full rounded-md border px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Giới hạn số lượng
            </label>
            <input
              type="number"
              min="0"
              value={usageLimit}
              onChange={(e) => setUsageLimit(e.target.value)}
              placeholder="0 = không giới hạn"
              className="w-full rounded-md border px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Ngày bắt đầu
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-md border px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Ngày kết thúc
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full rounded-md border px-3 py-2"
            />
          </div>

          {/* Preview */}
          <div className="sm:col-span-2">
            <div className="rounded-lg border bg-gray-50 p-3 text-sm text-gray-700">
              <b>Xem trước:</b>{" "}
              <span className="font-semibold">{code || "SALECODE"}</span> —{" "}
              <span>{description || "Mô tả khuyến mãi"}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={!valid}
            className={`rounded-md px-4 py-2 text-white ${
              valid ? "bg-emerald-600 hover:bg-emerald-700" : "bg-gray-300"
            }`}
          >
            Lưu mã
          </button>
        </div>
      </form>
    </div>
  );
}
