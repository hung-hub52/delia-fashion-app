// src/components/admin/sales/ActionMenu.jsx
"use client";

import { useState, useRef, useEffect } from "react";
import { MoreHorizontal, Tag, Ban } from "lucide-react";

export default function ActionMenu({ onApply, onDisable }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const close = (e) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center rounded-md border px-2 py-1.5 hover:bg-gray-50"
        title="Hành động"
      >
        <MoreHorizontal size={18} />
      </button>

      {open && (
        <div className="absolute right-0 z-10 mt-2 w-44 origin-top-right rounded-lg border bg-white shadow-lg">
       
          <button
            onClick={() => {
              setOpen(false);
              onDisable?.();
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50"
          >
            <Ban size={16} className="text-red-600" />
            Vô hiệu hóa
          </button>
        </div>
      )}
    </div>
  );
}
