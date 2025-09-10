"use client";
import toast from "react-hot-toast";

export const notifyUser = {
  success: (msg) =>
    toast.success(msg, {
      style: {
        borderRadius: "10px",
        background: "#fff",
        color: "#16a34a", // xanh
        border: "1px solid #16a34a",
        fontWeight: "500",
      },
      iconTheme: {
        primary: "#16a34a",
        secondary: "#fff",
      },
    }),
  error: (msg) =>
    toast.error(msg, {
      style: {
        borderRadius: "10px",
        background: "#fff",
        color: "#dc2626", // đỏ
        border: "1px solid #dc2626",
        fontWeight: "500",
      },
      iconTheme: {
        primary: "#dc2626",
        secondary: "#fff",
      },
    }),
  info: (msg) =>
    toast(msg, {
      style: {
        borderRadius: "10px",
        background: "#fff",
        color: "#2563eb", // xanh dương
        border: "1px solid #2563eb",
        fontWeight: "500",
      },
    }),
};
