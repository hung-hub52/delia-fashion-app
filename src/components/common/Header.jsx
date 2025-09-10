"use client";
import Link from "next/link";
import { User, ShoppingCart, Home } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  const menuItems = [
    {
      name: "Trang chủ",
      href: "/",
      icon: <Home size={16} className="inline-block mr-1" />,
    },
    { name: "Nữ", href: "/nu" },
    { name: "Nam", href: "/nam" },
    { name: "Bộ sưu tập", href: "/collection" },
    { name: "Sale", href: "/sale" },
    { name: "Tin tức", href: "/blog" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
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
          <div className="marquee-content flex">
            <span className="mr-20">
              MIỄN PHÍ SHIP QUẢNG NAM - ĐÀ NẴNG – ĐỔI TRẢ TRONG 7 NGÀY
            </span>
            <span className="mr-20">
              MIỄN PHÍ SHIP QUẢNG NAM - ĐÀ NẴNG – ĐỔI TRẢ TRONG 7 NGÀY
            </span>
            <span className="mr-20">
              MIỄN PHÍ SHIP QUẢNG NAM - ĐÀ NẴNG – ĐỔI TRẢ TRONG 7 NGÀY
            </span>
          </div>
          <div className="marquee-content flex">
            <span className="mr-20">
              MIỄN PHÍ SHIP QUẢNG NAM - ĐÀ NẴNG – ĐỔI TRẢ TRONG 7 NGÀY
            </span>
            <span className="mr-20">
              MIỄN PHÍ SHIP QUẢNG NAM - ĐÀ NẴNG – ĐỔI TRẢ TRONG 7 NGÀY
            </span>
            <span className="mr-20">
              MIỄN PHÍ SHIP QUẢNG NAM - ĐÀ NẴNG – ĐỔI TRẢ TRONG 7 NGÀY
            </span>
          </div>
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
          <ul className="hidden md:flex space-x-6 uppercase font-medium">
            {menuItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center transition-colors ${
                      isActive
                        ? "text-pink-600 font-semibold border-b-2 border-pink-600 pb-1"
                        : "text-gray-700 hover:text-pink-600"
                    }`}
                  >
                    {item.icon && item.icon}
                    {item.name}
                  </Link>
                </li>
              );
            })}
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
