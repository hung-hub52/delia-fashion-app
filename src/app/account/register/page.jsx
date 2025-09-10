"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { notifyUser } from "@/notify/NotifyUser";
import TermsModal from "@/components/common/TermsModal";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [agree, setAgree] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showTerms, setShowTerms] = useState(false);


  // OTP modal
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();

    if (!agree) {
      alert("Bạn cần đồng ý với điều khoản & chính sách dịch vụ");
      return;
    }

    // Sau khi validate cơ bản → hiển thị modal OTP
    setShowOtpModal(true);
  };

const handleConfirmOtp = () => {
  if (otp.trim() === "") {
    notifyUser.error("⚠️ Vui lòng nhập mã xác nhận");
    return;
  }

  notifyUser.success("🎉 ĐÃ ĐĂNG KÝ TÀI KHOẢN THÀNH CÔNG");

  setShowOtpModal(false);

  setTimeout(() => {
    router.push("/account/login");
  }, 1200);
};  
  return (
    <section className="w-full bg-white px-6 py-12">
      <div className="max-w-md mx-auto text-gray-800">
        {/* Khung xám bao quanh form */}
        <div className="bg-gray-50 p-8 rounded-lg shadow">
          <h1 className="text-2xl font-bold mb-6 text-center uppercase">
            Đăng ký
          </h1>

          <form className="space-y-4" onSubmit={handleRegister}>
            {/* Họ tên */}
            <div>
              <label className="block text-sm font-medium mb-1">Họ tên *</label>
              <input
                type="text"
                placeholder="Nhập họ tên"
                className="w-full border px-4 py-2 rounded focus:outline-none focus:border-pink-500"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1">Email *</label>
              <input
                type="email"
                placeholder="Nhập email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border px-4 py-2 rounded focus:outline-none focus:border-pink-500"
                required
              />
            </div>

            {/* Số điện thoại */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Số điện thoại *
              </label>
              <input
                type="tel"
                placeholder="Nhập số điện thoại"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border px-4 py-2 rounded focus:outline-none focus:border-pink-500"
                required
              />
            </div>

            {/* Mật khẩu */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Mật khẩu *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Tạo mật khẩu"
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

            {/* Checkbox đồng ý */}
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

            {/* Button */}
            <button
              type="submit"
              className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-500 transition"
            >
              Đăng ký
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
              <h2 className="text-xl font-bold mb-4 text-center">
                Nhập mã xác nhận
              </h2>
              <input
                type="text"
                placeholder="Nhập mã OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full border px-4 py-2 rounded focus:outline-none focus:border-pink-500 mb-4"
              />
              <button
                onClick={handleConfirmOtp}
                className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-500 transition"
              >
                Xác nhận
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

        {/* Modal điều khoản */}
        <TermsModal open={showTerms} onClose={() => setShowTerms(false)} />
          
      </div>
    </section>
  );
}
