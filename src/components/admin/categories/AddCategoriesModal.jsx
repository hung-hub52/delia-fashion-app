"use client";
import { useEffect, useState } from "react";

export default function AddCategoriesModal({
  open,
  onClose,
  onAdd,               // async (payload) => void
  rootCategories = [], // [{ id, ten_danh_muc }]
}) {
  const [isCreatingNewRootCategory, setIsCreatingNewRootCategory] = useState(
    false
  );
  const [newCategory, setNewCategory] = useState({
    parentId: "",
    newRootCategoryName: "",
    subCategoryName: "",
  });

  useEffect(() => {
    if (!open) return;
    // reset form mỗi lần mở
    setIsCreatingNewRootCategory(false);
    setNewCategory({
      parentId: "",
      newRootCategoryName: "",
      subCategoryName: "",
    });
  }, [open]);

  if (!open) return null;

  const handleCategoryChange = (e) => {
    const { name, value } = e.target;
    setNewCategory((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    const sub = (newCategory.subCategoryName || "").trim();
    const rootName = (newCategory.newRootCategoryName || "").trim();
    const parentId = newCategory.parentId;

    try {
      if (isCreatingNewRootCategory) {
        if (!rootName || !sub) return;
        await onAdd?.({
          mode: "create-root-and-child",
          newRootCategoryName: rootName,
          subCategoryName: sub,
        });
      } else {
        if (!parentId || !sub) return;
        await onAdd?.({
          mode: "create-child",
          parentId: Number(parentId),
          subCategoryName: sub,
        });
      }
      onClose?.();
    } catch (err) {
      // không đóng modal nếu thêm lỗi
      console.error(err);
    }
  };

  const disabled = (() => {
    const sub = (newCategory.subCategoryName || "").trim();
    const rootName = (newCategory.newRootCategoryName || "").trim();
    if (isCreatingNewRootCategory) return !rootName || !sub;
    return !newCategory.parentId || !sub;
  })();

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            THÊM DANH MỤC SẢN PHẨM
          </h3>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-violet-100"
            aria-label="Đóng"
            type="button"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              className="text-gray-700"
            >
              <path
                fill="currentColor"
                d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7A1 1 0 0 0 5.7 7.11L10.59 12l-4.9 4.89a1 1 0 1 0 1.41 1.41L12 13.41l4.89 4.9a1 1 0 0 0 1.41-1.41L13.41 12l4.9-4.89a1 1 0 0 0-.01-1.4Z"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleAddCategory} className="space-y-4">
          {/* Nếu chưa chọn tạo mới, dropdown danh mục gốc đã có */}
          {!isCreatingNewRootCategory && (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Danh mục gốc <span className="text-red-500">*</span>
              </label>
              <select
                name="parentId"
                value={newCategory.parentId}
                onChange={handleCategoryChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-violet-400"
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

          {/* Nếu tick checkbox, hiện ô nhập danh mục gốc mới */}
          {isCreatingNewRootCategory && (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Tên danh mục gốc mới <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="newRootCategoryName"
                value={newCategory.newRootCategoryName || ""}
                onChange={handleCategoryChange}
                placeholder="Nhập tên danh mục gốc mới"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-violet-400"
              />
            </div>
          )}

          {/* Ô nhập danh mục con mới */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Tên danh mục con mới <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="subCategoryName"
              value={newCategory.subCategoryName || ""}
              onChange={handleCategoryChange}
              placeholder="Tên danh mục con mới"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-violet-400"
            />
          </div>


          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200"
            >
              Đóng
            </button>
            <button
              type="submit"
              disabled={disabled}
              className={`rounded-lg px-4 py-2 font-semibold text-white transition ${
                disabled
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
