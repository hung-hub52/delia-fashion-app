// src/app/users/menuaccount/layout.jsx
"use client";
import { User, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

function readUser() {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function MenuAccountLayout({ children }) {
  const pathname = usePathname();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const load = () => setUser(readUser());
    load(); // lần đầu

    // 🔊 nghe sự kiện cập nhật từ mọi nơi trong app
    window.addEventListener("userUpdated", load);
    window.addEventListener("storage", load); // thay đổi localStorage từ tab/route khác

    return () => {
      window.removeEventListener("userUpdated", load);
      window.removeEventListener("storage", load);
    };
  }, []);

  // 🔁 khi đổi route, đọc lại user (phòng khi header/route khác vừa logout)
  useEffect(() => {
    setUser(readUser());
  }, [pathname]);

  const avatar =
    user?.avatar ||
    user?.anh_dai_dien ||
    "/images/avatar-user.jpg";

  const displayName =
    user?.name || user?.ho_ten || (user?.email ? user.email.split("@")[0] : "Khách");

  return (
    <section className="w-full bg-white px-6 py-12 text-gray-800">
      <div className="max-w-6xl mx-auto flex gap-6">
        {/* Sidebar */}
        <aside className="w-1/4 bg-gray-50 rounded-lg shadow-sm p-6">
          {/* Avatar + Info */}
          <div className="flex flex-col items-center mb-6">
            <img
              src={avatar}
              alt="avatar"
              className="w-20 h-20 rounded-full mb-2 object-cover border"
              referrerPolicy="no-referrer"
            />
            <p className="font-bold">{displayName}</p>
          </div>

          {/* Menu */}
          <ul className="space-y-3 text-gray-700 text-sm">
            {/* Tài khoản */}
            <li className="flex items-center gap-2 font-semibold">
              <User size={16} /> Tài Khoản Của Tôi
            </li>
            <ul className="pl-6 space-y-2 text-gray-600">
              <li>
                <Link
                  href="/users/menuaccount/profile"
                  className={
                    pathname.includes("/menuaccount/profile")
                      ? "text-pink-600 font-semibold"
                      : "hover:text-pink-500"
                  }
                >
                  Hồ Sơ
                </Link>
              </li>
              <li>
                <Link
                  href="/users/menuaccount/address"
                  className={
                    pathname.includes("/menuaccount/address")
                      ? "text-pink-600 font-semibold"
                      : "hover:text-pink-500"
                  }
                >
                  Địa Chỉ
                </Link>
              </li>
              <li>
                <Link
                  href="/users/menuaccount/password"
                  className={
                    pathname.includes("/menuaccount/password")
                      ? "text-pink-600 font-semibold"
                      : "hover:text-pink-500"
                  }
                >
                  Đổi Mật Khẩu
                </Link>
              </li>
            </ul>

            {/* Đơn mua */}
            <li>
              <Link
                href="/users/menuaccount/purchase"
                className={`flex items-center gap-2 px-3 py-2 rounded ${
                  pathname.includes("/menuaccount/purchase")
                    ? "bg-gray-100 text-black font-semibold"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <ShoppingBag size={16} />
                <span>Đơn Mua</span>
              </Link>
            </li>
          </ul>
        </aside>

        {/* Main content */}
        <div className="flex-1 bg-gray-50 rounded-lg shadow-sm p-8">
          {children}
        </div>
      </div>
    </section>
  );
}
