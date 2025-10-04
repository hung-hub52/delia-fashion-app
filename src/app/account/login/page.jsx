// src/app/account/login/page.jsx
"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

const API = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api").replace(/\/$/, "");

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Validate
    if (!email.trim()) {
      toast.error("Vui lòng nhập email");
      return;
    }
    if (!password || password.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    setLoading(true);

    try {
      // Gọi API login
      const response = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Đăng nhập thất bại");
      }

            // Lưu token
      if (data.access_token) {
+   // dọn dẹp token cũ tránh xung đột key khác
+   localStorage.removeItem("jwt");
+   localStorage.removeItem("authToken");
+   localStorage.removeItem("Authorization");
        const token = data.access_token;
        localStorage.setItem("token", token);
        localStorage.setItem("access_token", token);
        console.log("✅ Token saved:", token.substring(0, 30) + "...");
      }

      if (data.user) {
        // Map vai_tro từ DB sang role cho frontend
        const userInfo = {
          id: data.user.id_nguoidung,
          name: data.user.ho_ten || data.user.name || "User",
          email: data.user.email,
          role: data.user.vai_tro, // 'admin' hoặc 'khachhang'
          phone: data.user.so_dien_thoai || "",
          address: data.user.dia_chi || "",
          avatar: data.user.anh_dai_dien || "/images/avatar-user.jpg",
          status: data.user.trang_thai,
        };
        
        localStorage.setItem("user", JSON.stringify(userInfo));
        console.log("✅ User info saved:", userInfo);
        
        // Dispatch event để Header update
        window.dispatchEvent(new Event("userUpdated"));

        // Chuyển hướng dựa vào vai trò
        toast.success(`Đăng nhập thành công! Xin chào ${userInfo.name}`);
        
        setTimeout(() => {
          if (userInfo.role === "admin") {
            router.push("/admin");
          } else {
            router.push("/"); // Khách hàng về trang chủ
          }
        }, 500);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.message || "Sai email hoặc mật khẩu!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full bg-white px-6 py-12">
      <div className="max-w-md mx-auto text-gray-800">
        <div className="bg-gray-50 p-8 rounded-lg shadow">
          <h1 className="text-2xl font-bold mb-6 text-center uppercase">
            Đăng nhập
          </h1>


          <form className="space-y-4" onSubmit={handleLogin}>
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

            <div>

              <label className="block text-sm font-medium mb-1">
                Mật khẩu *
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu"
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


              {/* Link quên mật khẩu */}
              <div className="text-right mt-1">
                <Link
                  href="/account/forgot-password"
                  className="text-sm text-pink-600 hover:underline"
                >
                  Quên mật khẩu?
                </Link>
              </div>
            </div>


                        <button
              type="submit"
              disabled={loading}
              className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-500 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Đang đăng nhập...
                </>
              ) : (
                "Đăng nhập"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm">
            Chưa có tài khoản?{" "}

            <Link
              href="/account/register"
              className="text-pink-600 font-medium"
            >

              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
