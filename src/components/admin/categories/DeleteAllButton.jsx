"use client";

import Swal from "sweetalert2";
import { Trash2 } from "lucide-react";

export default function DeleteAllButton({ onDeleteAll }) {
  const handleDeleteAll = () => {
    Swal.fire({
      title: "Xác nhận xóa?",
      text: "Bạn có chắc chắn muốn xóa tất cả danh mục? Hành động này không thể hoàn tác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa tất cả",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        onDeleteAll?.(); // Gọi callback xoá
        Swal.fire({
          icon: "success",
          title: "Đã xóa!",
          text: "Tất cả danh mục đã được xóa thành công.",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    });
  };

  return (
    <button
      onClick={handleDeleteAll}
      className="inline-flex items-center gap-2 rounded-md bg-rose-500 px-3 py-1.5 text-white hover:bg-rose-600"
    >
      <Trash2 size={16} />
      Xóa tất cả
    </button>
  );
}
