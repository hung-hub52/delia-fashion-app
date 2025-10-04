// src/components/users/OtpForgot.jsx mã xác nhận quên mật khẩu

"use client";
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import NewForgot from "./NewForgot";
import toast from "react-hot-toast";

const API = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api").replace(/\/$/, ""); 

export default function OtpForgot({ email, onBack }) {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [timeLeft, setTimeLeft] = useState(60);
    const [showNewPass, setShowNewPass] = useState(false);
  const [error, setError] = useState("");
  const [verifiedOtp, setVerifiedOtp] = useState(""); // Lưu OTP đã xác nhận

  // countdown resend
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleChange = (value, index) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      setError(""); // clear lỗi khi nhập lại

      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

    const handleSubmit = (e) => {
    e.preventDefault();
    const code = otp.join("");

    if (!otp.every((digit) => digit !== "")) {
      setError("Vui lòng nhập đủ 6 số OTP!");
      return;
    }

    // Lưu OTP và chuyển sang bước nhập mật khẩu mới
    setVerifiedOtp(code);
    setShowNewPass(true);
  };

  return (
    <AnimatePresence mode="wait">
      {!showNewPass ? (
        <motion.div
          key="otp-screen"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.4 }}
          className="bg-white w-[380px] rounded shadow-lg overflow-hidden p-6"
        >
          {/* Header */}
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={onBack}
              className="text-gray-600 hover:text-pink-500"
            >
              <ArrowLeft size={20} />
            </button>
            <h2 className="text-lg font-semibold">Nhập mã xác nhận</h2>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            Mã xác minh đã được gửi đến Email <br />
            <span className="font-medium">{email}</span>
          </p>

          {/* OTP input */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-between gap-2">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-${idx}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, idx)}
                  className="w-10 h-12 border rounded text-center text-lg focus:outline-none focus:border-pink-500"
                />
              ))}
            </div>

            {/* Hiển thị lỗi */}
            {error && (
              <p className="text-xs text-red-500 text-center">{error}</p>
            )}

            {timeLeft > 0 ? (
              <p className="text-xs text-gray-400 text-center">
                Vui lòng chờ {timeLeft} giây để gửi lại.
              </p>
            ) : (
                          <button
              type="button"
              onClick={async () => {
                try {
                  const res = await fetch(`${API}/auth/forgot-password`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email }),
                  });
                  
                  const data = await res.json();
                  
                  if (!res.ok) {
                    throw new Error(data?.message || "Gửi lại OTP thất bại");
                  }
                  
                  toast.success("✅ Đã gửi lại mã OTP!");
                  setTimeLeft(60);
                  setOtp(new Array(6).fill(""));
                  setError("");
                } catch (error) {
                  toast.error(error.message);
                }
              }}
              className="text-xs text-pink-600 underline block mx-auto"
            >
              Gửi lại mã
            </button>
            )}

            <button
              type="submit"
              className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700"
            >
              KẾ TIẾP
            </button>
          </form>
        </motion.div>
      ) : (
        <motion.div
          key="newpass-screen"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.4 }}
        >
                    <NewForgot
            email={email}
            otp={verifiedOtp}
            onBack={() => setShowNewPass(false)}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
