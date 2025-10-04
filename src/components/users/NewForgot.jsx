// src/components/users/NewForgot.jsx nhập mật khẩu mới quên mật khẩu

"use client";
import { useState, useEffect } from "react";
import { ArrowLeft, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const API = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api").replace(/\/$/, "");

export default function NewForgot({ email, otp, onBack }) {
    const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(3); // đếm ngược 3 giây
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // ✅ rule kiểm tra password
  const isValidPassword =
    password.length >= 8 &&
    password.length <= 16 &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password);

    const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isValidPassword) {
      toast.error("⚠️ Mật khẩu không đáp ứng yêu cầu!");
      return;
    }
    
    setLoading(true);
    
    try {
      const res = await fetch(`${API}/auth/forgot-password/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          otp: otp,
          new_password: password,
        }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data?.message || "Đặt lại mật khẩu thất bại");
      }
      
      toast.success("✅ Đặt lại mật khẩu thành công!");
      setSuccess(true);
      setCountdown(3);
      
    } catch (error) {
      toast.error(error.message || "Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  // đếm ngược rồi redirect về login
  useEffect(() => {
    if (success && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (success && countdown === 0) {
      router.push("/account/login"); // ✅ chuyển hướng
    }
  }, [success, countdown, router]);

  if (success) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="success-screen"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="bg-white w-[400px] rounded shadow-lg overflow-hidden p-6 text-center"
        >
          <h2 className="text-lg font-semibold text-green-600 mb-4">
            Mật khẩu đã được đặt lại thành công
          </h2>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <CheckCircle2 className="text-green-500 w-12 h-12 mx-auto mb-4" />
          </motion.div>
          <p className="text-gray-700 mb-2">
            Bạn đã thành công đặt lại mật khẩu cho tài khoản
          </p>
          <p className="text-gray-500 text-sm">
            Bạn sẽ được chuyển hướng đến trang Đăng nhập trong {countdown} giây.
          </p>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <div className="bg-white w-[400px] rounded shadow-lg overflow-hidden p-6 mx-auto">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <button onClick={onBack} className="text-gray-600 hover:text-pink-500">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-lg font-semibold">Thiết Lập Mật Khẩu</h2>
      </div>

      <p className="text-center text-sm text-gray-600 mb-4">Tạo mật khẩu mới</p>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <input
            type={showPass ? "text" : "password"}
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-4 py-2 rounded focus:outline-none focus:border-pink-500 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
          >
            {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Rule gợi ý */}
        <ul className="text-xs text-gray-500 space-y-1">
          <li className={/[a-z]/.test(password) ? "text-green-600" : ""}>
            Ít nhất một kí tự viết thường.
          </li>
          <li className={/[A-Z]/.test(password) ? "text-green-600" : ""}>
            Ít nhất một kí tự viết hoa.
          </li>
          <li
            className={
              password.length >= 8 && password.length <= 16
                ? "text-green-600"
                : ""
            }
          >
            8-16 kí tự số và kí tự đặc biệt "@,#,$,!,..."
          </li>
        </ul>

                <button
          type="submit"
          disabled={!isValidPassword || loading}
          className={`w-full py-2 rounded transition flex items-center justify-center gap-2 ${
            isValidPassword && !loading
              ? "bg-pink-600 text-white hover:bg-pink-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {loading ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Đang xử lý...
            </>
          ) : (
            "TIẾP THEO"
          )}
        </button>
      </form>
    </div>
  );
}
