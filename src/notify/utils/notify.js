"use client";
import Swal from "sweetalert2";

// Giữ nguyên nhóm modal:
function modalSuccess(title = "Thành công", text = "") {
  return Swal.fire({
    icon: "success",
    title,
    text,
    timer: 1800,
    showConfirmButton: false,
  });
}
function modalError(title = "Có lỗi xảy ra", text = "") {
  return Swal.fire({ icon: "error", title, text });
}
function modalInfo(title = "Thông báo", text = "") {
  return Swal.fire({ icon: "info", title, text });
}

export const notify = {
  // Xác nhận vẫn dùng SweetAlert2 (modal)
  async confirm({
    title = "Xác nhận",
    text = "",
    confirmText = "Đồng ý",
    cancelText = "Hủy",
    icon = "question",
  } = {}) {
    const res = await Swal.fire({
      title,
      text,
      icon,
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      confirmButtonColor: "#7c3aed", // violet-600
      cancelButtonColor: "#6b7280", // gray-500
    });
    return res.isConfirmed;
  },

  // Nhóm modal cũ để dùng khi bạn muốn popup nằm giữa
  success: modalSuccess,
  error: modalError,
  info: modalInfo,

  // Nhóm TOAST mới: phát event để NotifyToast.jsx bắt và hiển thị
  toast: {
    success(message = "Thao tác thành công", duration = 2600) {
      window.dispatchEvent(
        new CustomEvent("app:notify", {
          detail: { type: "success", message, duration },
        })
      );
    },
    error(message = "Có lỗi xảy ra", duration = 2600) {
      window.dispatchEvent(
        new CustomEvent("app:notify", {
          detail: { type: "error", message, duration },
        })
      );
    },
    info(message = "Thông báo", duration = 2600) {
      window.dispatchEvent(
        new CustomEvent("app:notify", {
          detail: { type: "info", message, duration },
        })
      );
    },
  },
};

export default notify;