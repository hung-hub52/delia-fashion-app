"use client";
import Link from "next/link";
import { User, ShoppingCart, Home, LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import NavItem from "@/components/common/NavItem";
import { nuItems, namItems, collectionSections } from "@/data/menus";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lấy user từ localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    }
  }, []);

  // Auto close khi click ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    router.push("/"); // về trang chủ
  };

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
      <nav className="w-full bg-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-bold tracking-widest text-gray-800 hover:text-pink-600 transition-colors"
          >
            DELIA ELLY
          </Link>

          {/* Menu */}
          <ul className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`flex items-center gap-1 px-2 py-1 transition-colors ${
                pathname === "/"
                  ? "text-pink-600 border-b-2 border-pink-600"
                  : "text-gray-800 hover:text-pink-600"
              } text-sm md:text-base font-medium tracking-wide uppercase`}
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
          <div className="flex items-center space-x-4 text-gray-800 relative">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="border rounded-full px-4 py-1 focus:outline-none text-sm bg-gray-50"
            />

            {/* User */}
            {!user ? (
              <Link href="/account/login" className="hover:text-pink-600">
                <User size={22} />
              </Link>
            ) : (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 hover:text-pink-600"
                >
                  <img
                    src={user.avatar || "/images/avatar-user.jpg"}
                    alt="avatar"
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="hidden md:inline text-sm font-medium">
                    {user.name || user.email.split("@")[0]}
                  </span>
                </button>

                {/* Dropdown menu */}
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-md z-50">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                      {user.role === "admin" ? "Quản trị viên" : "Khách hàng"}
                    </div>

                    <Link
                      href={
                        user.role === "admin"
                          ? "/admin"
                          : "/users/menuaccount/profile"
                      }
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
            <Link href="/users/cart" className="hover:text-pink-600">
              <ShoppingCart size={22} />
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
