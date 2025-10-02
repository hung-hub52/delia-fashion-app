// src/components/users/EditPass.jsx đổi mật khẩu

"use client";
import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function EditPass({ onBack }) {
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");

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

  const handleUpdate = (e) => {
    e.preventDefault();

    // Lấy pass cũ từ localStorage (mock data)
    const savedPass = localStorage.getItem("userPassword") || "123456";

    if (oldPass !== savedPass) {
      alert("Mật khẩu cũ không đúng!");
      return;
    }

    if (newPass.length < 6) {
      alert("Mật khẩu mới phải ít nhất 6 ký tự!");
      return;
    }

    if (newPass !== confirmPass) {
      alert("Mật khẩu mới nhập lại không khớp!");
      return;
    }

    if (captchaInput !== captcha) {
      alert("Captcha không chính xác!");
      return;
    }

    // Lưu mật khẩu mới
    localStorage.setItem("userPassword", newPass);
    alert("Đổi mật khẩu thành công!");
    setOldPass("");
    setNewPass("");
    setConfirmPass("");
    setCaptcha(generateCaptcha());
    setCaptchaInput("");
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
            {/* Ô nhập captcha */}
            <input
              type="text"
              value={captchaInput}
              onChange={(e) => setCaptchaInput(e.target.value)}
              className="border rounded px-3 py-2 text-sm w-28 text-center tracking-widest"
              placeholder="••••••"
              maxLength={6}
            />
            {/* Mã captcha */}
            <div className="relative inline-block">
              {/* Text Captcha */}
              <span className="px-4 py-2 bg-gray-100 border rounded font-mono font-bold text-xl tracking-widest text-green-700 opacity-90 select-none relative z-10">
                {captcha}
              </span>

              {/* Các đường gạch chéo, ngang, dọc */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none z-20"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Đường chéo đậm */}
                <line
                  x1="0%"
                  y1="20%"
                  x2="100%"
                  y2="80%"
                  stroke="rgba(0,128,0,0.5)"
                  strokeWidth="3"
                />
                <line
                  x1="100%"
                  y1="30%"
                  x2="0%"
                  y2="90%"
                  stroke="rgba(0,128,0,0.5)"
                  strokeWidth="3"
                />

                {/* Đường ngang */}
                <line
                  x1="0%"
                  y1="50%"
                  x2="100%"
                  y2="55%"
                  stroke="rgba(0,128,0,0.4)"
                  strokeWidth="2"
                />

                {/* Đường dọc */}
                <line
                  x1="40%"
                  y1="0%"
                  x2="40%"
                  y2="100%"
                  stroke="rgba(0,128,0,0.4)"
                  strokeWidth="2"
                />
                <line
                  x1="70%"
                  y1="0%"
                  x2="70%"
                  y2="100%"
                  stroke="rgba(0,128,0,0.3)"
                  strokeWidth="1.5"
                />
              </svg>
            </div>

            {/* Nút đổi captcha */}
            <button
              type="button"
              onClick={() => setCaptcha(generateCaptcha())}
              className="text-sm text-blue-600 hover:underline"
            >
              Đổi mã
            </button>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 border rounded text-sm"
          >
            Trở lại
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700"
          >
            Cập nhật
          </button>
        </div>
      </form>
    </div>
  );
}
