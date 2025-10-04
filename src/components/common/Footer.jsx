// src/components/common/Footer.jsx
"use client";
import { Truck, Headphones, Tag, Gem } from "lucide-react";
import GoogleMap from "@/components/common/GoogleMap"; // 👈 import GoogleMap

export default function Footer() {
  return (
    <footer className="bg-white text-gray-800">
      {/* Hàng trên - Icons */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 py-10 px-6 text-center">
        <div>
          <Truck className="mx-auto mb-3" size={28} />
          <h4 className="font-semibold">Miễn phí ship</h4>
          <p className="text-sm text-gray-600">
            Quảng Nam - Đà Nẵng cho tất cả đơn hàng
          </p>
        </div>
        <div>
          <Headphones className="mx-auto mb-3" size={28} />
          <h4 className="font-semibold">Tư vấn nhiệt tình</h4>
          <p className="text-sm text-gray-600">DELIA ELLY hỗ trợ 24/7</p>
        </div>
        <div>
          <Tag className="mx-auto mb-3" size={28} />
          <h4 className="font-semibold">Ưu đãi ngập tràn</h4>
          <p className="text-sm text-gray-600">Sản phẩm luôn có giá tốt nhất</p>
        </div>
        <div>
          <Gem className="mx-auto mb-3" size={28} />
          <h4 className="font-semibold">Đảm bảo chất lượng</h4>
          <p className="text-sm text-gray-600">DELIA ELLY luôn uy tín</p>
        </div>
      </div>

      {/* Hàng dưới */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 px-6 py-12">
        {/* Khám phá */}
        <div>
          <h4 className="font-semibold mb-4">Khám phá</h4>
          <ul className="space-y-2 text-sm">
            {["Nam", "Nữ", "Bộ Sưu Tập"].map((item) => (
              <li key={item} className="hover:text-pink-600 cursor-pointer">
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Chính sách */}
        <div>
          <h4 className="font-semibold mb-4">Chính sách</h4>
          <ul className="space-y-2 text-sm">
            {[
              "Thanh Toán",
              "Vận Chuyển & Đồng Kiểm",
              "Đổi Trả",
              "Bảo Mật",
              "Điều Khoản Dịch Vụ",
            ].map((item) => (
              <li key={item} className="hover:text-pink-600 cursor-pointer">
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Hộ kinh doanh */}
        <div>
          <h4 className="font-semibold mb-4">Hộ kinh doanh DELIA ELLY</h4>
          <p className="text-sm text-gray-700">
            Số 92, Đ. QUẢNG NAM, P. NGŨ HÀNH SƠN, TP. ĐÀ NẴNG
          </p>
          <p className="text-sm text-gray-700 mt-2">
            ĐKKD số 30041975 cấp ngày 30/04/2025 tại ĐÀ NẴNG
          </p>
          <p className="text-sm text-gray-700 mt-2">MST: 8402091945</p>
          <p className="text-sm font-semibold mt-3">
            Hotline:{" "}
            <span className="text-pink-600 font-bold">08 555 9999</span>
          </p>
        </div>
      </div>

      {/* Google Map full width */}
      <div className="w-full h-72 md:h-96 px-3">
        <GoogleMap />
      </div>

      {/* Copyright */}
      <div className="text-center mt-6 text-sm text-gray-600 py-4">
        © 2025 DELIA ELLY. All rights reserved.
      </div>
    </footer>
  );
}
