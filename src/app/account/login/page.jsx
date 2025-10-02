"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const API = "http://localhost:3001/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);


  const handleLogin = (e) => {
    e.preventDefault();
    const adminEmail = "admin@delia.com";
    const customerEmail = "customer@delia.com";
    const customerPassword = "123456";

    if (email === adminEmail) {
      localStorage.setItem(
        "user",
        JSON.stringify({ role: "admin", email: adminEmail })
      );
      router.push("/admin");
    } else if (email === customerEmail && password === customerPassword) {
      localStorage.setItem(
        "user",
        JSON.stringify({ role: "customer", email: customerEmail })
      );
      router.push("/"); // về trang chủ
    } else {
      alert("Sai tài khoản hoặc mật khẩu!");
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
              className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-500 transition"
            >
              Đăng nhập
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
