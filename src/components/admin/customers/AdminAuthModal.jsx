"use client";

import { useEffect, useRef, useState } from "react";
import { API_URL as API } from "@/utils/api";

function getToken() {
  if (typeof window === "undefined") return null;
  const keys = ["token", "access_token", "jwt", "Authorization", "authorization"];
  for (const k of keys) {
    let v = localStorage.getItem(k);
    if (!v) continue;
    try {
      const obj = JSON.parse(v);
      for (const kk of ["access_token", "token", "jwt", "value"]) {
        const cand = obj?.[kk];
        if (typeof cand === "string" && cand.split(".").length === 3) return cand;
      }
    } catch {}
    v = String(v).replace(/^"(.*)"$/, "$1").trim();
    if (v.startsWith("Bearer ")) v = v.slice(7).trim();
    if (v.split(".").length === 3) return v;
  }
  return null;
}

function getSavedEmail() {
  try {
    const u = JSON.parse(localStorage.getItem("user") || "{}");
    return (u?.email || "").trim().toLowerCase() || "";
  } catch {
    return "";
  }
}

export default function AdminAuthModal({ open, onClose, onSuccess }) {
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setPassword("");
      setSubmitting(false);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!password) return;
    setSubmitting(true);
    try {
      // 1) Thử verify-admin (tự đính kèm token thủ công để tránh redirect auto)
      const token = getToken();
      const res = await fetch(`${API}/auth/verify-admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ password }),
        credentials: "include",
      });

      if (res.ok) {
        onSuccess?.();
        onClose?.();
        return;
      }

      // 2) Fallback: đăng nhập lại bằng email đang lưu + password vừa nhập
      const email = getSavedEmail();
      if (!email) {
        const data = await res.json().catch(() => ({}));
        alert(data?.message || "Unauthorized");
        return;
      }

      const res2 = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data2 = await res2.json().catch(() => ({}));

      if (!res2.ok || !data2?.access_token) {
        alert(data2?.message || "Sai mật khẩu admin!");
        return;
      }

      try {
        // dọn token cũ tránh xung đột
        localStorage.removeItem("jwt");
        localStorage.removeItem("authToken");
        localStorage.removeItem("Authorization");
        // lưu token mới
        localStorage.setItem("token", data2.access_token);
        localStorage.setItem("access_token", data2.access_token);
        if (data2.user) localStorage.setItem("user", JSON.stringify(data2.user));
      } catch {}

      onSuccess?.();
      onClose?.();
    } catch (e) {
      alert("Không thể xác thực. Vui lòng thử lại!");
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
          onKeyDown={(e) => {
            if (e.key === "Enter" && !submitting && password) handleSubmit();
          }}
          className="w-full border text-black px-4 py-2 rounded mb-4"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              setPassword("");
              onClose?.();
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
