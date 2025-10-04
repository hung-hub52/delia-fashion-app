// src/components/users/EditPass.jsx đổi mật khẩu (API thật)

"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

// ==== Config API ====
const API =
  (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api").replace(
    /\/$/,
    ""
  );

// ==== Helpers ====
function getToken() {
  if (typeof window === "undefined") return null;
  const keys = [
    "token",
    "access_token",
    "jwt",
    "authToken",
    "Authorization",
    "authorization",
    "user",
    "auth",
    "session",
  ];
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

function clearAuth() {
  try {
    localStorage.removeItem("token");
    localStorage.removeItem("access_token");
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
  } catch {}
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("userUpdated"));
  }
}

// ==== Component ====
export default function EditPass({ onBack }) {
  const router = useRouter();

  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // State toggle hiển thị
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Random captcha
  const generateCaptcha = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  useEffect(() => {
    setCaptcha(generateCaptcha());
  }, []);

  async function callChangePasswordAPI(currentPassword, newPassword) {
    const token = getToken();
    const res = await fetch(`${API}/auth/change-password`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data?.message || `HTTP ${res.status}`);
    }
    return true;
  }

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");

    if (!oldPass || !newPass || !confirmPass) {
      setError("Vui lòng nhập đầy đủ các trường bắt buộc!");
      return;
    }
    if (newPass.length < 6) {
      setError("Mật khẩu mới phải ít nhất 6 ký tự!");
      return;
    }
    if (newPass !== confirmPass) {
      setError("Mật khẩu mới nhập lại không khớp!");
      return;
    }
    if (captchaInput.trim() !== captcha) {
      setError("Captcha không chính xác!");
      setCaptcha(generateCaptcha());
      setCaptchaInput("");
      return;
    }

    setSubmitting(true);
    try {
      await callChangePasswordAPI(oldPass, newPass);

      // Thông báo + điều hướng Login
      toast.success("Đổi mật khẩu thành công! Vui lòng đăng nhập lại!");
      clearAuth();
      router.replace("/account/login");
    } catch (err) {
      setError(err.message || "Đổi mật khẩu thất bại!");
      setCaptcha(generateCaptcha());
      setCaptchaInput("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4">Đổi mật khẩu</h2>

      <form onSubmit={handleUpdate} className="space-y-4">
        {/* Mật khẩu cũ */}
        <div>
          <label className="block text-sm font-medium mb-1">Mật khẩu cũ</label>
          <div className="relative">
            <input
              type={showOld ? "text" : "password"}
              value={oldPass}
              onChange={(e) => setOldPass(e.target.value)}
              className="border rounded px-3 py-2 text-sm w-full pr-10"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowOld(!showOld)}
              className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
            >
              {showOld ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Mật khẩu mới */}
        <div>
          <label className="block text-sm font-medium mb-1">Mật khẩu mới</label>
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              className="border rounded px-3 py-2 text-sm w-full pr-10"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
            >
              {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Nhập lại mật khẩu mới */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Nhập lại mật khẩu mới
          </label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              className="border rounded px-3 py-2 text-sm w-full pr-10"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Captcha */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Nhập mã xác nhận
          </label>
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={captchaInput}
              onChange={(e) => setCaptchaInput(e.target.value)}
              className="border rounded px-3 py-2 text-sm w-28 text-center tracking-widest"
              placeholder="••••••"
              maxLength={6}
            />
            <div className="relative inline-block">
              <span className="px-4 py-2 bg-gray-100 border rounded font-mono font-bold text-xl tracking-widest text-green-700 opacity-90 select-none relative z-10">
                {captcha}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setCaptcha(generateCaptcha())}
              className="text-sm text-blue-600 hover:underline"
            >
              Đổi mã
            </button>
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 border rounded text-sm"
            disabled={submitting}
          >
            Trở lại
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:opacity-60"
          >
            {submitting ? "Đang cập nhật..." : "Cập nhật"}
          </button>
        </div>
      </form>
    </div>
  );
}
