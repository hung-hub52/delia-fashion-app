// src/components/admin/menuUsers/ChangePasswordModal.jsx
"use client";

import { useEffect, useState } from "react";
import { X, Eye, EyeOff, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

export default function ChangePasswordModal({
  open,
  onClose,
  onChangePassword,
  user,
}) {
  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Captcha
  const [captcha, setCaptcha] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");

  const genCaptcha = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let out = "";
    for (let i = 0; i < 5; i++) {
      out += chars[Math.floor(Math.random() * chars.length)];
    }
    return out;
  };

  useEffect(() => {
    if (open) {
      setCurrent("");
      setNewPass("");
      setConfirm("");
      setShow1(false);
      setShow2(false);
      setShow3(false);
      setLoading(false);
      setError("");
      setCaptcha(genCaptcha());
      setCaptchaInput("");
    }
  }, [open]);

  if (!open) return null;

  const handleRefreshCaptcha = () => {
    setCaptcha(genCaptcha());
    setCaptchaInput("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!current || !newPass || !confirm || !captchaInput.trim()) {
      setError("Vui lòng nhập đủ tất cả trường và mã xác thực!");
      return;
    }
    if (newPass.length < 6) {
      setError("Mật khẩu mới phải từ 6 ký tự trở lên!");
      return;
    }
    if (newPass !== confirm) {
      setError("Mật khẩu xác nhận không khớp!");
      return;
    }
    if (current !== user.password) {
      setError("Mật khẩu hiện tại không đúng!");
      return;
    }
    if (captchaInput.trim().toUpperCase() !== captcha.toUpperCase()) {
      setError("Mã xác thực không chính xác!");
      handleRefreshCaptcha();
      return;
    }

    setLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 1200));
      onChangePassword?.(newPass);
      onClose?.();
      toast.success("Đổi mật khẩu thành công!");
    } catch (e) {
      setError("Đổi mật khẩu thất bại!");
      toast.error("Đổi mật khẩu thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        // ✅ Khung luôn sáng
        className="bg-gray-50 p-6 rounded-2xl shadow-2xl min-w-[340px] max-w-[95vw] relative border border-violet-200"
      >
        <button
          onClick={onClose}
          type="button"
          className="absolute top-3 right-3 p-2 rounded-full bg-gray-200 hover:bg-violet-100 text-gray-950"
        >
          <X />
        </button>

        <div className="text-xl font-bold mb-4 text-center text-violet-700">
          Đổi mật khẩu
        </div>

        <div className="space-y-3 text-gray-800">
          {/* Current */}
          <div>
            <label className="text-sm font-medium">Mật khẩu hiện tại</label>
            <div className="relative">
              <input
                type={show1 ? "text" : "password"}
                className="w-full py-2.5 px-3 rounded-lg border border-gray-300 focus:outline-none focus:border-violet-500"
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-violet-600"
                onClick={() => setShow1((v) => !v)}
              >
                {show1 ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* New */}
          <div>
            <label className="text-sm font-medium">Mật khẩu mới</label>
            <div className="relative">
              <input
                type={show2 ? "text" : "password"}
                className="w-full py-2.5 px-3 rounded-lg border border-gray-300 focus:outline-none focus:border-violet-500"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-violet-600"
                onClick={() => setShow2((v) => !v)}
              >
                {show2 ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm */}
          <div>
            <label className="text-sm font-medium">Nhập lại mật khẩu mới</label>
            <div className="relative">
              <input
                type={show3 ? "text" : "password"}
                className="w-full py-2.5 px-3 rounded-lg border border-gray-300 focus:outline-none focus:border-violet-500"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-violet-600"
                onClick={() => setShow3((v) => !v)}
              >
                {show3 ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* ✅ Captcha nhỏ gọn với noise */}
          <div className="flex items-center gap-3">
            <div
              className="relative h-10 min-w-[100px] px-2 flex items-center justify-center rounded-md font-mono text-base tracking-[0.3em] select-none
                            bg-gray-100 border border-violet-300 text-violet-700 shadow-inner overflow-hidden"
            >
              {/* noise lines */}
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-full h-[1px] bg-gray-400/30"
                  style={{
                    top: `${Math.random() * 100}%`,
                    transform: `rotate(${Math.random() * 60 - 30}deg)`,
                  }}
                />
              ))}
              {captcha}
            </div>
            <input
              value={captchaInput}
              onChange={(e) => setCaptchaInput(e.target.value.toUpperCase())}
              placeholder="Nhập mã"
              className="flex-1 h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:border-violet-500 text-sm"
              maxLength={5}
            />
            <button
              type="button"
              onClick={handleRefreshCaptcha}
              className="h-10 px-3 inline-flex items-center justify-center rounded-md border border-violet-300 text-violet-700 hover:bg-violet-50 transition text-sm"
              title="Đổi mã khác"
            >
              <RefreshCw size={14} />
            </button>
          </div>
        </div>

        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-5 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-60 font-semibold transition"
        >
          {loading ? "Đang xử lý..." : "Xác nhận"}
        </button>
      </form>
    </div>
  );
}
