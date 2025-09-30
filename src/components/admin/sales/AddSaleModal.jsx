"use client";

import { useEffect, useMemo, useState } from "react";
import { X, Percent } from "lucide-react";

/**
 * Props:
 * - open: boolean
 * - onClose: () => void
 * - onAdd: ({ code, description, endDate, quantity }) => Promise|void
 */
export default function AddSaleModal({ open, onClose, onAdd }) {
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");    // số lượng áp dụng (tồn)
  const [endDate, setEndDate] = useState("");      // YYYY-MM-DD

  useEffect(() => {
    if (open) {
      setCode("");
      setDescription("");
      setQuantity("");
      setEndDate("");
    }
  }, [open]);

  const valid = useMemo(() => {
    if (!code.trim() || !description.trim()) return false;
    if (!endDate) return false;
    // endDate phải là ngày hợp lệ trong tương lai/hiện tại
    const d = new Date(endDate);
    if (Number.isNaN(d.getTime())) return false;
    // quantity >= 0
    if (String(quantity).length && Number(quantity) < 0) return false;
    return true;
  }, [code, description, endDate, quantity]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!valid) return;

    await onAdd?.({
      code: code.trim().toUpperCase(),
      description: description.trim(),
      endDate,
      quantity: Number(quantity || 0),
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
            <label className="mb-1 block text-sm font-medium">
              Số lượng (tồn)
            </label>
            <input
              type="number"
              min="0"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="0 = không giới hạn"
              className="w-full rounded-md border px-3 py-2"
            />
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
            <label className="mb-1 block text-sm font-medium">Ngày kết thúc</label>
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
              {endDate ? ` (Kết thúc: ${endDate})` : ""}
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
