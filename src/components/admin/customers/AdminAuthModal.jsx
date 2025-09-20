"use client";
import { useEffect, useRef, useState } from "react";

export default function AdminAuthModal({ open, onClose, onSuccess }) {
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef(null);

  // ✅ Mỗi lần open=true -> reset ô nhập & focus vào input
  useEffect(() => {
    if (open) {
      setPassword("");
      setSubmitting(false);
      // focus sau khi modal render
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!password) return;
    setSubmitting(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/auth/verify-admin`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        }
      );
      const data = await res.json();
      if (!res.ok || !data?.ok) {
        alert(data?.message || "Sai mật khẩu admin!");
        return;
      }
      onSuccess();
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-lg p-6 shadow w-96">
        <h2 className="text-lg text-black font-bold mb-4 text-center">Xác thực Admin</h2>
        <input
          ref={inputRef}
          type="password"
          placeholder="Nhập mật khẩu admin"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border text-black px-4 py-2 rounded mb-4"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              setPassword(""); // ✅ xóa luôn khi bấm Hủy
              onClose();
            }}
            className="px-4 py-2 rounded text-black bg-gray-200 hover:bg-gray-300"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting || !password}
            className="px-4 py-2 rounded bg-pink-600 text-white hover:bg-pink-500 disabled:opacity-60"
          >
            {submitting ? "Đang kiểm tra..." : "Xác nhận"}
          </button>
        </div>
      </div>
    </div>
  );
}
