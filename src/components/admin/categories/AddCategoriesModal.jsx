// src/components/admin/categories/AddCategoriesModal.jsx
"use client";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

export default function AddCategoriesModal({
  open,
  onClose,
  onAdd,
  presetParent = "",
  lockParent = false,
  parentOptions = [],
}) {
  const [form, setForm] = useState({ name: "", parentName: "", note: "" });
  const [touched, setTouched] = useState({ name: false, parentName: false });
  const nameRef = useRef(null);

  // Khi mở modal: prefill + focus
  useEffect(() => {
    if (!open) return;
    setForm({ name: "", parentName: presetParent || "", note: "" });
    setTouched({ name: false, parentName: false });
    // focus tên danh mục
    setTimeout(() => nameRef.current?.focus(), 0);
  }, [open, presetParent]);

  if (!open) return null;

  // Bắt buộc: name luôn bắt buộc; parentName chỉ bắt buộc nếu KHÔNG khóa
  const requiredInvalid =
    !form.name.trim() || (!lockParent && !form.parentName.trim());

  const handleSubmit = (e) => {
    e.preventDefault();
    // đánh dấu đã chạm để hiện lỗi
    setTouched({ name: true, parentName: true });
    if (requiredInvalid) return;

    const newCat = {
      id: Date.now(),
      name: form.name.trim(),
      parentName: (form.parentName || "").trim(),
      note: (form.note || "").trim(),
    };
    onAdd?.(newCat);
    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Thêm Danh Mục</h3>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-violet-100"
            aria-label="Đóng"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tên danh mục */}
          <div>
            <label className="mb-1 block font-medium">
              Tên danh mục <span className="text-red-500">*</span>
            </label>
            <input
              ref={nameRef}
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              onBlur={() => setTouched((t) => ({ ...t, name: true }))}
              className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-violet-400"
              placeholder="Nhập tên danh mục..."
            />
            {touched.name && !form.name.trim() && (
              <p className="mt-1 text-xs text-red-500">
                Vui lòng nhập tên danh mục
              </p>
            )}
          </div>

          {/* Danh mục cha */}
          <div>
            <label className="mb-1 block font-medium">
              Danh mục cha{" "}
              {!lockParent && <span className="text-red-500">*</span>}
            </label>
            <input
              value={form.parentName}
              onChange={(e) =>
                setForm((f) => ({ ...f, parentName: e.target.value }))
              }
              onBlur={() => setTouched((t) => ({ ...t, parentName: true }))}
              className={`w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 ${
                lockParent
                  ? "bg-gray-50 text-gray-600 focus:ring-gray-200"
                  : "focus:ring-violet-400"
              }`}
              placeholder="Nhập danh mục cha..."
              readOnly={lockParent}
              tabIndex={lockParent ? -1 : 0}
            />
            {!lockParent && touched.parentName && !form.parentName.trim() && (
              <p className="mt-1 text-xs text-red-500">
                Vui lòng nhập danh mục cha
              </p>
            )}
          </div>

          {/* Ghi chú */}
          <div>
            <label className="mb-1 block font-medium">Ghi chú</label>
            <textarea
              value={form.note}
              onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
              className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-violet-400"
              rows={3}
              placeholder="Nhập ghi chú..."
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-gray-100 px-4 py-2"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={requiredInvalid}
              className={`rounded-lg px-4 py-2 font-semibold text-white transition ${
                requiredInvalid
                  ? "cursor-not-allowed bg-violet-300"
                  : "bg-violet-600 hover:bg-violet-700"
              }`}
            >
              Thêm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
