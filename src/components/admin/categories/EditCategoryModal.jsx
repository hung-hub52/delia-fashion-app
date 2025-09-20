"use client";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { notify } from "@/notify/utils/notify";

export default function EditCategoryModal({ open, onClose, item, onSave }) {
  const [form, setForm] = useState({ name: "", parentName: "", note: "" });

  useEffect(() => {
    if (open && item) {
      setForm({
        name: item.name ?? "",
        parentName: item.parentName ?? "",
        note: item.note ?? "",
      });
    }
  }, [open, item]);

  if (!open || !item) return null;

  const requiredInvalid = !form.name.trim() || !form.parentName.trim();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (requiredInvalid) return;
    onSave?.({ ...item, ...form });
    onClose?.();
    notify.success("Đã cập nhật", "Danh mục đã được cập nhật.");
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-black/40 flex items-center justify-center">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 rounded-full p-1 hover:bg-gray-100"
          title="Đóng"
        >
          <X size={18} />
        </button>
        <h3 className="mb-4 text-lg font-semibold">Chỉnh sửa danh mục</h3>

        <form onSubmit={handleSubmit} className="space-y-3 text-sm">
          <div>
            <label className="mb-1 block font-medium">Tên danh mục *</label>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full rounded border px-3 py-2 outline-none focus:ring-2 focus:ring-violet-400"
              autoFocus
            />
          </div>
          <div>
           <label className="mb-1 block font-medium">Danh mục cha *</label>
           <input
             value={form.parentName}
             readOnly
             className="w-full rounded border px-3 py-2 outline-none focus:ring-2 focus:ring-violet-400 bg-gray-100 cursor-not-allowed"
            />
          </div>

          
          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 font-semibold text-gray-600 hover:bg-gray-100"
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
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
