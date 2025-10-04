"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { notifyUser } from "@/notify/NotifyUser";
import TermsModal from "@/components/common/TermsModal";

const API = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api").replace(/\/$/, "");

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  // OTP modal
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [otpExpire, setOtpExpire] = useState(0); // giây còn hiệu lực OTP

  // B1: Gửi yêu cầu OTP
  const handleRegister = async (e) => {
    e.preventDefault();

    if (!agree) {
      notifyUser.error("⚠️ Bạn cần đồng ý với điều khoản & chính sách dịch vụ");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/register/request-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ho_ten: fullName,
          email,
          password,
          so_dien_thoai: phone,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Gửi OTP thất bại");

      notifyUser.success("✅ Đã gửi OTP tới email, vui lòng kiểm tra hộp thư.");
      setShowOtpModal(true);
      startResendCountdown();
      startOtpExpireCountdown(300); // 5 phút = 300 giây
    } catch (err) {
      notifyUser.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // B2: Xác minh OTP
  const handleConfirmOtp = async () => {
    if (!otp.trim()) {
      notifyUser.error("⚠️ Vui lòng nhập mã xác nhận");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/register/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Xác minh OTP thất bại");

            notifyUser.success("🎉 Đăng ký thành công!");
      setShowOtpModal(false);

      // Lưu thông tin đăng nhập
      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("access_token", data.access_token);
      }

      if (data.user) {
        const userInfo = {
          id: data.user.id_nguoidung,
          name: data.user.ho_ten,
          email: data.user.email,
          role: data.user.vai_tro || "khachhang",
          phone: data.user.so_dien_thoai || "",
          address: data.user.dia_chi || "",
          avatar: data.user.anh_dai_dien || "/images/avatar-user.jpg",
          status: data.user.trang_thai,
        };
        localStorage.setItem("user", JSON.stringify(userInfo));
      }

      setTimeout(() => router.push("/"), 1200);
    } catch (err) {
      notifyUser.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Gửi lại OTP
  const handleResendOtp = async () => {
    if (resendCountdown > 0) return;
    try {
      const res = await fetch(`${API}/auth/register/request-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ho_ten: fullName,
          email,
          password,
          so_dien_thoai: phone,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Gửi lại OTP thất bại");
      notifyUser.success("✅ Đã gửi lại OTP.");
      startResendCountdown();
      startOtpExpireCountdown(300); // reset thời gian OTP mới
    } catch (err) {
      notifyUser.error(err.message);
    }
  };

  // Helpers
  const startResendCountdown = () => {
    setResendCountdown(60);
    const timer = setInterval(() => {
      setResendCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startOtpExpireCountdown = (seconds) => {
    setOtpExpire(seconds);
    const timer = setInterval(() => {
      setOtpExpire((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const formatTime = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <section className="w-full bg-white px-6 py-12">
      <div className="max-w-md mx-auto text-gray-800">
        <div className="bg-gray-50 p-8 rounded-lg shadow">
          <h1 className="text-2xl font-bold mb-6 text-center uppercase">
            Đăng ký
          </h1>

          {/* Form đăng ký */}
          <form className="space-y-4" onSubmit={handleRegister}>
            <div>
              <label className="block text-sm font-medium mb-1">Họ tên *</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full border px-4 py-2 rounded focus:outline-none focus:border-pink-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border px-4 py-2 rounded focus:outline-none focus:border-pink-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Số điện thoại *
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border px-4 py-2 rounded focus:outline-none focus:border-pink-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Mật khẩu *</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border px-4 py-2 rounded focus:outline-none focus:border-pink-500 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-pink-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="agree"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="h-4 w-4"
              />
              <label htmlFor="agree" className="text-sm">
                Tôi đồng ý với{" "}
                <button
                  type="button"
                  onClick={() => setShowTerms(true)}
                  className="text-pink-600 hover:underline"
                >
                  điều khoản & chính sách dịch vụ
                </button>
              </label>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-500 transition disabled:opacity-70"
            >
              {loading ? "Đang xử lý..." : "Đăng ký"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm">
            Đã có tài khoản?{" "}
            <Link href="/account/login" className="text-pink-600 font-medium">
              Đăng nhập ngay
            </Link>
          </p>
        </div>

        {/* OTP Modal */}
        {showOtpModal && (
          <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-white/30 z-50 text-gray-800">
            <div className="bg-white rounded-lg shadow-xl p-6 w-96">
              <h2 className="text-xl font-bold mb-2 text-center">Nhập mã xác nhận</h2>
              {otpExpire > 0 && (
                <p className="text-sm text-center text-gray-600 mb-3">
                  OTP còn hiệu lực trong{" "}
                  <span className="font-semibold text-pink-600">
                    {formatTime(otpExpire)}
                  </span>
                </p>
              )}
              <input
                type="text"
                placeholder="Nhập mã OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full border px-4 py-2 rounded focus:outline-none focus:border-pink-500 mb-4"
              />
              <button
                onClick={handleConfirmOtp}
                disabled={loading}
                className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-500 transition disabled:opacity-70"
              >
                {loading ? "Đang xác minh..." : "Xác nhận"}
              </button>
              <button
                onClick={handleResendOtp}
                disabled={resendCountdown > 0}
                className="w-full mt-2 text-gray-600 hover:text-pink-600 text-sm disabled:opacity-50"
              >
                {resendCountdown > 0
                  ? `Gửi lại OTP sau ${resendCountdown}s`
                  : "Gửi lại OTP"}
              </button>
              <button
                onClick={() => setShowOtpModal(false)}
                className="w-full mt-2 text-gray-600 hover:text-pink-600 text-sm"
              >
                Hủy
              </button>
            </div>
          </div>
        )}

        <TermsModal open={showTerms} onClose={() => setShowTerms(false)} />
      </div>
    </section>
  );
}
