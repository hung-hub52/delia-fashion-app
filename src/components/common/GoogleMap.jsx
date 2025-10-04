// src/components/common/GoogleMap.jsx
"use client";
import { useState } from "react";

export default function GoogleMap() {
  // Danh sách các địa chỉ (key + link iframe embed)
  const LOCATIONS = {
    danang: {
      name: "Cửa Hàng Đà Nẵng",
      url: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3644.1290546338923!2d108.22030047490426!3d16.074649184605644!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314218307d81c91d%3A0xbc7c14cab8a09c8!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBEdXkgVMOibg!5e1!3m2!1svi!2s!4v1759377368714!5m2!1svi!2s",
    },
    showroom1: {
      name: "Cửa Hàng Quảng Nam",
      url: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d559.5560542763263!2d108.11825725949114!3d15.887671433526657!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314203a1f1aa5907%3A0x3f5d1e2405ac5f5c!2zMTQwIFF1YW5nIFRydW5nLCBLaHUgNSwgxJDhuqFpIEzhu5ljLCBRdeG6o25nIE5hbSwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1759401254134!5m2!1svi!2s",
    },

  };

  const [active, setActive] = useState("danang");

  return (
    <div className="w-full">
      {/* Chọn vị trí */}
      <div className="flex flex-wrap gap-2 mb-4">
        {Object.keys(LOCATIONS).map((key) => (
          <button
            key={key}
            onClick={() => setActive(key)}
            className={`px-3 py-1 rounded text-sm ${
              active === key
                ? "bg-red-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {LOCATIONS[key].name}
          </button>
        ))}
      </div>

      {/* Map hiển thị */}
      <div className="relative w-full h-64 md:h-80 lg:h-96 border rounded-lg overflow-hidden">
        <iframe
          src={LOCATIONS[active].url}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="rounded-lg"
        ></iframe>
      </div>
    </div>
  );
}
