//src/components/common/Header.jsx

"use client";
import Link from "next/link";
import { User, ShoppingCart, Home } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import NavItem from "@/components/common/NavItem"; // ✅ component mới gộp

// Import menu data
import { nuItems, namItems, collectionSections } from "@/data/menus";

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
            {/* Trang chủ */}
            <li>
              <Link
                href="/"
                className={`flex items-center px-2 transition-colors ${
                  pathname === "/"
                    ? "text-pink-600 border-b-2 border-pink-600 pb-1"
                    : "text-gray-800 hover:text-pink-600"
                } text-sm md:text-base font-medium tracking-wide uppercase`}
              >
                <Home size={18} className="mr-1.5" />
                Trang chủ
              </Link>
            </li>

            {/* Menu Nữ */}
            <li>
              <NavItem title="Nữ" href="/users/women" items={nuItems} />
            </li>

            {/* Menu Nam */}
            <li>
              <NavItem title="Nam" href="/users/men" items={namItems} />
            </li>

            {/* Bộ sưu tập */}
            <li>
              <NavItem
                title="Bộ sưu tập"
                href="/users/collection"
                sections={collectionSections}
              />
            </li>

            {/* Tin tức */}
            <li>
              <Link
                href="/users/blog"
                className={`px-2 transition-colors ${
                  pathname.startsWith("users/blog")
                    ? "text-pink-600 border-b-2 border-pink-600 pb-1"
                    : "text-gray-800 hover:text-pink-600"
                } text-sm md:text-base font-medium tracking-wide uppercase`}
              >
                Tin tức
              </Link>
            </li>

            {/* Giới thiệu */}
            <li>
              <Link
                href="/users/about"
                className={`px-2 transition-colors ${
                  pathname.startsWith("/users/about")
                    ? "text-pink-600 border-b-2 border-pink-600 pb-1"
                    : "text-gray-800 hover:text-pink-600"
                } text-sm md:text-base font-medium tracking-wide uppercase`}
              >
                Giới Thiệu
              </Link>
            </li>
          </ul>

          {/* Search + User + Cart */}
          <div className="flex items-center space-x-4 text-gray-800">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="border rounded-full px-4 py-1 focus:outline-none text-sm bg-gray-50"
            />
            <Link href="/account/login" className="hover:text-pink-600">
              <User size={22} />
            </Link>
            <button className="hover:text-pink-600">
              <ShoppingCart size={22} />
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
