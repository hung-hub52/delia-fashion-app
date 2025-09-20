// src/app/admin/categories/page.jsx
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
    categories,          // {id, name, parentId, parentName, displayName}
    addCategory,
    updateCategory,
    deleteCategory,
  } = useCategoriesContext();

  const [searchName, setSearchName] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const handleEdit = (row) => {
    setEditItem(row);
    setEditOpen(true);
  };

  const handleSaveEdit = async (updated) => {
    try {
      await updateCategory(updated.id, {
        ten_danh_muc: updated.name,
        parent_id: updated.parentId,
      });
      notify.success("Đã cập nhật danh mục");
    } catch (e) {
      notify.error(e.message || "Không cập nhật được danh mục");
    }
  };


  // handler thêm từ modal
  const normalize = (s = "") =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, " ").trim();

const existsSameLevel = (name, parentId) => {
  const key = normalize(name);
  return categories.some((c) => c.parentId === parentId && normalize(c.name) === key);
};

const handleAddFromModal = async (payload) => {
  try {
    if (payload.mode === "create-child") {
      const { parentId, subCategoryName } = payload;
      if (existsSameLevel(subCategoryName, parentId)) {
        notify.warn("Tên danh mục con đã tồn tại trong cấp này.");
        return;
      }
      await addCategory({ ten_danh_muc: subCategoryName.trim(), parent_id: parentId });
      notify.success("Đã thêm danh mục con");
      return;
    }

    if (payload.mode === "create-root-and-child") {
      const { newRootCategoryName, subCategoryName } = payload;

      // tạo/tìm gốc
      let parentId = 0;
      const existedRoot = categories.find(
        (c) => c.parentId === 0 && normalize(c.name) === normalize(newRootCategoryName)
      );
      if (existedRoot) {
        parentId = existedRoot.id;
      } else {
        const createdRoot = await addCategory({ ten_danh_muc: newRootCategoryName.trim(), parent_id: 0 });
        parentId = createdRoot?.id_danh_muc ?? createdRoot?.id ?? 0;
      }

      // thêm con
      if (existsSameLevel(subCategoryName, parentId)) {
        notify.warn("Tên danh mục con đã tồn tại trong cấp này.");
        return;
      }
      await addCategory({ ten_danh_muc: subCategoryName.trim(), parent_id: parentId });
      notify.success("Đã tạo gốc & thêm danh mục con");
    }
  } catch (e) {
    notify.error(e.message || "Không thêm được danh mục");
  }
};


  const handleDeleteOne = async (id) => {
    await deleteCategory(id);
    notify.info("Đã xóa 1 danh mục.");
  };

  // ✅ ẨN danh mục gốc + filter theo ô tìm kiếm
  const visible = useMemo(() => {
    const q = searchName.trim().toLowerCase();
    const onlyChildren = categories.filter((c) => c.parentId !== 0);
    if (!q) return onlyChildren;
    return onlyChildren.filter(
      (c) =>
        (c.displayName || c.name || "").toLowerCase().includes(q) ||
        (c.parentName || "").toLowerCase().includes(q)
    );
  }, [categories, searchName]);

  const rootCategories = useMemo(
  () => categories
        .filter((c) => c.parentId === 0)
        .map((c) => ({ id: c.id, ten_danh_muc: c.name })),
  [categories]
);

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
          data={categories} // hoặc visible nếu bạn chỉ muốn export danh mục con
          onImported={async (rows) => {
            for (const r of rows) {
              await addCategory({
                ten_danh_muc: r.name,
                parent_id: r.parentId ?? 0,
              });
            }
            notify.success("Đã import danh mục từ file");
          }}
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
          <DeleteAllButton
            onDeleteAll={async () => {
              for (const c of categories) {
                try { await deleteCategory(c.id); } catch {}
              }
              notify.info("Đã xóa tất cả danh mục.");
            }}
          />
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
              {visible.map((row, idx) => (
                <tr
                  key={row.id}
                  className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  {/* ✅ STT bắt đầu lại từ 1 theo danh sách đã ẩn gốc */}
                  <td className="p-2">{idx + 1}</td>

                  <td className="p-2">{row.parentName}</td>
                  <td className="p-2">{row.displayName || row.name}</td>

                  <td className="p-2">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEdit(row)}
                        className="inline-flex items-center gap-1 rounded-md bg-sky-500 px-2 py-1 text-white hover:bg-sky-600"
                        title="Chỉnh sửa"
                      >
                        <Pencil size={16} />
                      </button>
                      <DeleteOneButton item={row} onDelete={handleDeleteOne} />
                    </div>
                  </td>
                </tr>
              ))}

              {visible.length === 0 && (
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
        onAdd={handleAddFromModal}
        rootCategories={rootCategories}
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
