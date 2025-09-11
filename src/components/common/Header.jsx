"use client";
import Link from "next/link";
import { User, ShoppingCart, Home } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import NavDropdown from "@/components/common/NavDropdown";
import MegaMenu from "@/components/common/MegaMenu";

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  // Dropdown data
  const nuItems = [
    { name: "Đầm", href: "/nu/dam" },
    { name: "Áo nữ", href: "/nu/ao" },
    { name: "Quần nữ", href: "/nu/quan" },
  ];
  const namItems = [
    { name: "Áo sơ mi", href: "/nam/somi" },
    { name: "Quần âu", href: "/nam/quan" },
    { name: "Giày dép", href: "/nam/giay" },
  ];

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
          <div className="marquee-content flex">
            
            <span className="mr-20">
              MIỄN PHÍ SHIP QUẢNG NAM - ĐÀ NẴNG – ĐỔI TRẢ TRONG 7 NGÀY
            </span>
          </div>
          <div className="marquee-content flex">

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

            {/* Dropdown Nữ */}
            <li>
              <NavDropdown title="Nữ" items={nuItems} />
            </li>

            {/* Dropdown Nam */}
            <li>
              <NavDropdown title="Nam" items={namItems} />
            </li>

            {/* Mega menu Bộ sưu tập */}
            <li>
              <MegaMenu
                title="Bộ sưu tập"
                sections={[
                  {
                    title: "Túi Xách",
                    items: [
                      { name: "Túi Xách Nam", href: "/collection/croc" },
                      { name: "Túi Xách Nữ", href: "/collection/fleurs" },
                    ],
                  },
                  {
                    title: "Ví Da",
                    items: [
                      { name: "Ví Da Nữ", href: "/collection/timeless" },
                      { name: "Ví Da Nam", href: "/collection/rotin" },
                    ],
                  },
                  {
                    title: "Paris Vibes",
                    items: [
                      { name: "Le Chic Parisien", href: "/collection/chic" },
                      { name: "ELLY De Paris", href: "/collection/paris" },
                      { name: "Luxe De Paris", href: "/collection/luxe" },
                    ],
                  },
                  {
                    title: "Khác",
                    items: [
                      {
                        name: "Vietnam Heritage",
                        href: "/collection/heritage",
                      },
                      {
                        name: "Classique De Paris",
                        href: "/collection/classique",
                      },
                      { name: "Hommes de Classe", href: "/collection/hommes" },
                    ],
                  },
                ]}
              />
            </li>

            {/* Sale */}
            <li>
              <Link
                href="/sale"
                className={`px-2 transition-colors ${
                  pathname.startsWith("/sale")
                    ? "text-pink-600 border-b-2 border-pink-600 pb-1"
                    : "text-gray-800 hover:text-pink-600"
                } text-sm md:text-base font-medium tracking-wide uppercase`}
              >
                Sale
              </Link>
            </li>

            {/* Tin tức */}
            <li>
              <Link
                href="/blog"
                className={`px-2 transition-colors ${
                  pathname.startsWith("/blog")
                    ? "text-pink-600 border-b-2 border-pink-600 pb-1"
                    : "text-gray-800 hover:text-pink-600"
                } text-sm md:text-base font-medium tracking-wide uppercase`}
              >
                Tin tức
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
