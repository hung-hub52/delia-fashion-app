//src\app\admin\categories\page.jsx

"use client";

import { useMemo, useState } from "react";
import { Pencil } from "lucide-react";
import AddCategoriesModal from "@/components/admin/categories/AddCategoriesModal";
import CateExcelButtons from "@/components/admin/categories/CateExcelButtons";
import DeleteAllButton from "@/components/admin/categories/DeleteAllButton";
import DeleteOneButton from "@/components/admin/categories/DeleteOneButton";
import EditCategoryModal from "@/components/admin/categories/EditCategoryModal";
import NotifyToast from "@/notify/ui/NotifyToast";
import notify from "@/notify/utils/notify";
import { useCategoriesContext } from "@/context/CategoriesContext";

export default function CategoriesPage() {
  const {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    clearCategories,
  } = useCategoriesContext();

  const [searchName, setSearchName] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const handleEdit = (row) => {
    setEditItem(row);
    setEditOpen(true);
  };

  const handleSaveEdit = (updated) => {
    updateCategory(updated);
  };

  const handleAddCategory = (newCat) => {
    addCategory(newCat);
  };

  const handleDeleteOne = (id) => {
    deleteCategory(id);
    notify.info("Đã xóa 1 danh mục.");
  };

  const filtered = useMemo(() => {
    const q = searchName.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.parentName || "").toLowerCase().includes(q)
    );
  }, [categories, searchName]);

  return (
    <div className="p-4 sm:p-6 text-gray-800">
      <NotifyToast />

      {/* Thanh công cụ */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => setShowAddModal(true)}
          className="rounded-lg bg-violet-600 px-4 py-2 font-semibold text-white hover:bg-violet-700"
        >
          + Thêm danh mục
        </button>

        <CateExcelButtons
          data={categories}
          onImported={(rows) => rows.forEach((r) => addCategory(r))}
        />

        <div className="ml-auto flex flex-wrap items-center gap-2">
          <input
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder="Tên danh mục hoặc danh mục cha"
            className="w-75 rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-sky-400"
          />
        </div>
      </div>

      {/* Bảng */}
      <div className="mt-5 overflow-hidden rounded-xl border shadow-sm">
        <div className="flex items-center justify-between bg-teal-500 px-4 py-3 text-white">
          <div className="font-semibold uppercase">Quản lý danh mục</div>
          <DeleteAllButton onDeleteAll={clearCategories} />
        </div>

        <div className="w-full overflow-x-auto bg-white">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50 text-gray-700">
                <th className="w-20 p-2 text-left">STT</th>
                <th className="w-60 p-2 text-left">Danh mục cha</th>
                <th className="p-2 text-left">Tên danh mục</th>
                <th className="w-40 p-2 text-center"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, idx) => (
                <tr
                  key={row.id}
                  className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="p-2">{idx + 1}</td>
                  <td className="p-2">{row.parentName}</td>
                  <td className="p-2">{row.name}</td>
                  <td className="p-2">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEdit(row)}
                        className="inline-flex items-center gap-1 rounded-md bg-sky-500 px-2 py-1 text-white hover:bg-sky-600"
                      >
                        <Pencil size={16} />
                      </button>
                      <DeleteOneButton item={row} onDelete={handleDeleteOne} />
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-gray-400">
                    Chưa có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal thêm */}
      <AddCategoriesModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddCategory}
      />

      {/* Modal sửa */}
      <EditCategoryModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        item={editItem}
        onSave={handleSaveEdit}
      />
    </div>
  );
}
