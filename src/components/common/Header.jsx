import Link from "next/link";
import { User, ShoppingCart } from "lucide-react";

export default function Header() {
  return (
    <header className="border-b w-full bg-white">
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
          <div className="text-2xl font-bold tracking-widest text-gray-800">
            DELIA ELLY
          </div>

          {/* Menu */}
          <ul className="hidden md:flex space-x-6 uppercase font-medium text-gray-700">
            {["Trang chủ", "Nữ", "Nam", "Bộ sưu tập", "Sale", "Tin tức"].map(
              (item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="hover:text-pink-600 transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              )
            )}
          </ul>

          {/* Search + User + Cart */}
          <div className="flex items-center space-x-4 text-gray-800">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="border rounded-full px-4 py-1 focus:outline-none text-sm bg-gray-50"
            />

            {/* Icon user thay cho chữ Đăng nhập */}
            <Link href="/account/login" className="hover:text-pink-600">
              <User size={22} />
            </Link>

            {/* Giỏ hàng */}
            <button className="hover:text-pink-600">
              <ShoppingCart size={22} />
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
