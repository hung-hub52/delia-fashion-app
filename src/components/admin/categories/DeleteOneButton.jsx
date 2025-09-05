"use client";
import { Trash2 } from "lucide-react";
import { notify } from "@/notify/utils/notify";

export default function DeleteOneButton({ item, onDelete }) {
  const handleDelete = async () => {
    const ok = await notify.confirm({
      title: "Xóa danh mục?",
      text: `Bạn chắc chắn muốn xóa "${item.name}"?`,
      confirmText: "Xóa",
      icon: "warning",
    });
    if (!ok) return;
    onDelete?.(item.id);
    notify.success("Đã xóa", `"${item.name}" đã được xóa.`);
  };

  return (
    <button
      onClick={handleDelete}
      className="inline-flex items-center gap-1 rounded-md bg-rose-500 px-2 py-1 text-white hover:bg-rose-600"
      title="Xóa Từng Mục"
    >
      <Trash2 size={16} />
    </button>
  );
}
