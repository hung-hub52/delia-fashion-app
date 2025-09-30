"use client";

import { useState, useRef, useEffect } from "react";
import { MoreHorizontal, Trash2, Ban, Share2 } from "lucide-react";

export default function ActionMenu({ onDelete, onDisable, onShare }) {
  const [open, setOpen] = useState(false);
  const [dropUp, setDropUp] = useState(false);
  const wrapRef = useRef(null);
  const btnRef = useRef(null);

  // Đóng khi click ra ngoài
  useEffect(() => {
    const close = (e) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  // Khi mở menu: tính toán nếu gần đáy thì bung lên trên
  useEffect(() => {
    if (!open || !btnRef.current) return;

    const calc = () => {
      const r = btnRef.current.getBoundingClientRect();
      // Ước lượng chiều cao menu ~ 160px
      const estimatedMenuHeight = 160;
      setDropUp(r.bottom + estimatedMenuHeight > window.innerHeight);
    };

    calc();
    window.addEventListener("resize", calc);
    window.addEventListener("scroll", calc, true);
    return () => {
      window.removeEventListener("resize", calc);
      window.removeEventListener("scroll", calc, true);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="relative inline-block text-left">
      <button
        ref={btnRef}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center rounded-md border px-2 py-1.5 hover:bg-gray-50"
        title="Hành động"
      >
        <MoreHorizontal size={18} />
      </button>

      {open && (
        <div
          className={`absolute right-0 z-50 w-48 origin-top-right rounded-lg border bg-white shadow-lg ${
            dropUp ? "bottom-full mb-2" : "top-full mt-2"
          }`}
        >
          {/* Chia sẻ */}
          <button
            onClick={() => {
              setOpen(false);
              onShare?.();
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50"
          >
            <Share2 size={16} className="text-blue-600" />
            Chia sẻ
          </button>

          {/* Vô hiệu hoá */}
          <button
            onClick={() => {
              setOpen(false);
              onDisable?.();
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50"
          >
            <Ban size={16} className="text-amber-600" />
            Vô hiệu hoá
          </button>

          {/* Xoá */}
          <button
            onClick={() => {
              setOpen(false);
              onDelete?.();
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 text-rose-600"
          >
            <Trash2 size={16} />
            Xoá
          </button>
        </div>
      )}
    </div>
  );
}
