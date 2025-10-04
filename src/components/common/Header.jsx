// src/components/common/Header.jsx
"use client";

import Link from "next/link";
import { User, ShoppingCart, Home, LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import NavItem from "@/components/common/NavItem";
import { nuItems, namItems, collectionSections } from "@/data/menus";
import { useCart } from "@/context/CartContext"; // 👈 import context

// ✅ Helper đọc user từ localStorage (SSR-safe)
function readUser() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// ✅ Helper xoá auth + phát sự kiện cho toàn app
function clearAuthAndBroadcast() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("access_token");
  } finally {
    // Thông báo cho Header/Sidebar... cập nhật UI
    window.dispatchEvent(new Event("userUpdated"));
  }
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef(null);


  const { cart, setCart } = useCart(); // 👈 lấy cart từ context
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0); // 👈 tính tổng số sp

  const [shake, setShake] = useState(false); // 👈 state cho hiệu ứng rung

  // Scroll effect

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🔁 Load user lần đầu + subscribe các sự kiện cập nhật
  useEffect(() => {
    const loadUser = () => setUser(readUser());
    loadUser();

    // cập nhật khi tab/route khác sửa localStorage
    const onStorage = (e) => {
      if (!e.key || e.key === "user" || e.key === "token" || e.key === "access_token") {
        loadUser();
      }
    };
    window.addEventListener("storage", onStorage);

    // cập nhật trong cùng tab (đổi mật khẩu -> logout, cập nhật avatar, v.v.)
    window.addEventListener("userUpdated", loadUser);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("userUpdated", loadUser);
    };
  }, []);

  // 🔁 Khi đổi route cũng đọc lại user (phòng trường hợp vừa logout ở trang khác)
  useEffect(() => {
    setUser(readUser());
  }, [pathname]);

  // Đóng menu user khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 👇 Lắng nghe sự kiện cart-updated
  useEffect(() => {
    const handleCartUpdate = () => {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        setCart(JSON.parse(savedCart)); // update context
      }
      setShake(true);
      setTimeout(() => setShake(false), 500); // reset rung sau 0.5s
    };

    window.addEventListener("cart-updated", handleCartUpdate);
    return () => window.removeEventListener("cart-updated", handleCartUpdate);
  }, [setCart]);

  const handleLogout = () => {
    clearAuthAndBroadcast();
    setUser(null);
    router.push("/"); // về trang chủ
  };

  const avatar =
    user?.avatar || user?.anh_dai_dien || "/images/avatar-user.jpg";
  const displayName =
    user?.name || user?.ho_ten || (user?.email ? user.email.split("@")[0] : "");

  return (
    <header
      className={`w-full top-0 z-50 transition-shadow duration-300 ${
        isScrolled ? "fixed bg-white shadow-md" : "relative bg-white"
      }`}
    >
      {/* Banner chạy chữ */}
      <div className="bg-gray-100 text-gray-800 font-bold py-2 text-sm overflow-hidden relative">
        <div className="marquee flex">
          {Array(4)
            .fill("MIỄN PHÍ SHIP QUẢNG NAM - ĐÀ NẴNG – ĐỔI TRẢ TRONG 7 NGÀY")
            .map((text, i) => (
              <div key={i} className="marquee-content flex">
                <span className="mr-20">{text}</span>
              </div>
            ))}
        </div>
      </div>

      {/* Nav */}
      <nav className="w-full bg-white relative">
        <div className="max-w-full mx-auto flex flex-nowrap items-center justify-between gap-3 lg:gap-4 px-4 lg:px-8 xl:px-12 py-3.5">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="lg:hidden text-gray-800 hover:text-pink-600 flex-shrink-0"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Logo */}
          <Link
            href="/"
            className="text-xl lg:text-2xl xl:text-3xl font-bold tracking-widest text-gray-800 hover:text-pink-600 transition-colors whitespace-nowrap flex-shrink-0"
          >
            DELIA ELLY
          </Link>

          {/* Menu */}
          <ul className="hidden lg:flex items-center space-x-3 xl:space-x-5 flex-shrink-0">
            <Link
              href="/"
              className={`flex items-center gap-1 px-2 py-1 transition-colors ${
                pathname === "/"
                  ? "text-pink-600 border-b-2 border-pink-600"
                  : "text-gray-800 hover:text-pink-600"
              } text-sm lg:text-base font-medium tracking-wide uppercase whitespace-nowrap`}
            >
              <Home size={18} className="mb-0.5" />
              <span>Trang chủ</span>
            </Link>

            <li>
              <NavItem title="Nữ" href="/users/women" items={nuItems} />
            </li>
            <li>
              <NavItem title="Nam" href="/users/men" items={namItems} />
            </li>
            <li>
              <NavItem
                title="Bộ sưu tập"
                href="/users/collection"
                sections={collectionSections}
              />
            </li>
            <li>
              <NavItem title="Tin tức" href="/users/blog" />
            </li>
            <li>
              <NavItem title="Giới thiệu" href="/users/about" />
            </li>
          </ul>

          {/* Search + User + Cart */}
          <div className="flex items-center space-x-4 text-gray-800 relative flex-shrink-0">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="hidden lg:block border rounded-full px-4 py-1.5 focus:outline-none text-sm bg-gray-50 w-36"
            />

            {/* User */}
            {!user ? (
              <Link href="/account/login" className="hover:text-pink-600 flex-shrink-0">
                <User size={20} />
              </Link>
            ) : (
              <div className="relative flex-shrink-0" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="flex items-center gap-2 hover:text-pink-600"
                >
                  <img
                    src={avatar}
                    alt="avatar"
                    className="w-9 h-9 rounded-full object-cover border-2 border-gray-200"
                  />
                  <span className="hidden lg:inline text-sm font-medium whitespace-nowrap">
                    {displayName}
                  </span>
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-md z-50">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                      {user.role === "admin" ? "Quản trị viên" : "Khách hàng"}
                    </div>
                    <Link
                      href={user.role === "admin" ? "/admin" : "/users/menuaccount/profile"}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setMenuOpen(false)}
                    >
                      Trang cá nhân
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <LogOut size={16} /> Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Cart */}

            <Link href="/users/cart" className="relative hover:text-pink-600">
              <ShoppingCart size={22} className={shake ? "shake" : ""} />
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalQty}
              </span>

            </Link>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t shadow-lg absolute w-full left-0 top-full z-40">
            <div className="px-6 py-4 space-y-3">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-2 ${
                  pathname === "/"
                    ? "text-pink-600 font-semibold"
                    : "text-gray-800 hover:text-pink-600"
                }`}
              >
                Trang chủ
              </Link>
              <Link
                href="/users/women"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-gray-800 hover:text-pink-600"
              >
                Nữ
              </Link>
              <Link
                href="/users/men"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-gray-800 hover:text-pink-600"
              >
                Nam
              </Link>
              <Link
                href="/users/collection"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-gray-800 hover:text-pink-600"
              >
                Bộ sưu tập
              </Link>
              <Link
                href="/users/blog"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-gray-800 hover:text-pink-600"
              >
                Tin tức
              </Link>
              <Link
                href="/users/about"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-gray-800 hover:text-pink-600"
              >
                Giới thiệu
              </Link>

              {/* Mobile Search */}
              <div className="pt-2">
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  className="w-full border rounded-full px-4 py-2 focus:outline-none text-sm bg-gray-50"
                />
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
