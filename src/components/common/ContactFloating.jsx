// src/components/common/ContactButtons.jsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Floating contact buttons (Zalo + Facebook)
 * - Zalo: icon vuông bo nhẹ (giống ảnh bạn gửi)
 * - Facebook: icon tròn (giống ảnh bạn gửi)
 * Tuỳ chỉnh link qua ENV hoặc props
 */
export default function ContactButtons({
  zaloHref = "https://zalo.me/0367184745",
  facebookHref = "https://www.facebook.com/le.quang.truong.773125",
}) {
  const pathname = usePathname();

  // ❌ Ẩn trên toàn bộ trang admin
  if (pathname?.startsWith("/admin")) return null;

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="fixed right-4 lg:right-6 bottom-24 lg:bottom-28 z-[1000] flex flex-col items-center gap-4">
      {/* Zalo */}
      <Link
        href={zaloHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Liên hệ Zalo"
        className="group relative block"
      >
        <span
          className="
            flex items-center justify-center
            w-14 h-14 lg:w-16 lg:h-16                     /* nút to rõ */
            rounded-full bg-white shadow-[0_6px_20px_rgba(0,0,0,.2)]
            ring-1 ring-black/5
            transition-transform duration-200 hover:scale-110
          "
        >
          <img
            src="/icons/zalo.png"
            alt="Zalo"
            className="
              w-10 h-10 lg:w-12 lg:h-12
              rounded-md                                  /* vuông bo nhẹ như mẫu */
              object-cover
            "
            draggable={false}
          />
        </span>
      </Link>

      {/* Facebook */}
      <Link
        href={facebookHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Liên hệ Facebook"
        className="group relative block"
      >
        <span
          className="
            flex items-center justify-center
            w-14 h-14 lg:w-16 lg:h-16
            rounded-full bg-white shadow-[0_6px_20px_rgba(0,0,0,.2)]
            ring-1 ring-black/5
            transition-transform duration-200 hover:scale-110
          "
        >
          <img
            src="/icons/facebook.png"
            alt="Facebook"
            className="w-10 h-10 lg:w-12 lg:h-12 rounded-full object-cover"
            draggable={false}
          />
        </span>
      </Link>
    </div>
  );
}
