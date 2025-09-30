"use client";
import { useEffect, useState } from "react";

export default function AddCategoriesModal({
  open,
  onClose,
  onAdd,               // async (payload) => void
  rootCategories = [], // [{ id, ten_danh_muc }]
}) {
  const [isCreatingNewRootCategory, setIsCreatingNewRootCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({
    parentId: "",
    newRootCategoryName: "",
    subCategoryName: "",
  });

  useEffect(() => {
    if (!open) return;
    setIsCreatingNewRootCategory(false);
    setNewCategory({ parentId: "", newRootCategoryName: "", subCategoryName: "" });
  }, [open]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCategory((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const sub = (newCategory.subCategoryName || "").trim();
    const rootName = (newCategory.newRootCategoryName || "").trim();

    try {
      if (isCreatingNewRootCategory) {
        if (!rootName || !sub) return;
        await onAdd?.({
          mode: "create-root-and-child",
          newRootCategoryName: rootName,
          subCategoryName: sub,
        });
      } else {
        if (!newCategory.parentId || !sub) return;
        await onAdd?.({
          mode: "create-child",
          parentId: Number(newCategory.parentId),
          subCategoryName: sub,
        });
      }
      onClose?.(); // chỉ đóng khi thành công
    } catch (err) {
      // giữ modal mở để người dùng sửa lại
      console.error(err);
    }
  };

  const disabled = (() => {
    const sub = (newCategory.subCategoryName || "").trim();
    const root = (newCategory.newRootCategoryName || "").trim();
    return isCreatingNewRootCategory ? !root || !sub : !newCategory.parentId || !sub;
  })();

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">THÊM DANH MỤC SẢN PHẨM</h3>
          <button onClick={onClose} type="button" className="rounded-full p-2 hover:bg-violet-100" aria-label="Đóng">
            <svg width="20" height="20" viewBox="0 0 24 24" className="text-gray-700">
              <path fill="currentColor" d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7A1 1 0 0 0 5.7 7.11L10.59 12l-4.9 4.89a1 1 0 1 0 1.41 1.41L12 13.41l4.89 4.9a1 1 0 0 0 1.41-1.41L13.41 12l4.9-4.89a1 1 0 0 0-.01-1.4Z"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Chọn gốc có sẵn */}
          {!isCreatingNewRootCategory && (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Danh mục gốc <span className="text-red-500">*</span>
              </label>
              <select
                name="parentId"
                value={newCategory.parentId}
                onChange={handleChange}
                className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-violet-400"
                required
              >
                <option value="">Chọn Danh mục gốc đã có</option>
                {rootCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.ten_danh_muc}
                  </option>
                ))}
              </select>
            </div>
          )}


          {/* Tên danh mục con */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Tên danh mục con mới <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="subCategoryName"
              value={newCategory.subCategoryName}
              onChange={handleChange}
              placeholder="Tên danh mục con mới"
              className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-violet-400"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="rounded-lg bg-gray-100 px-4 py-2">Đóng</button>
            <button type="submit" disabled={disabled}
              className={`rounded-lg px-4 py-2 font-semibold text-white ${disabled ? "bg-violet-300 cursor-not-allowed" : "bg-violet-600 hover:bg-violet-700"}`}>
              Thêm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
