"use client";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";

export default function NavDropdown({ title, items = [] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Đóng khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Nút chính */}
      <button
        type="button"
        onClick={() => setOpen(!open)} // toggle bằng click
        className={`uppercase font-medium px-2 py-1 ${
          open
            ? "text-pink-600 border-b-2 border-pink-600"
            : "text-gray-800 hover:text-pink-600"
        }`}
      >
        {title}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && items.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 mt-2 w-56 bg-white border rounded-md shadow-lg z-50"
          >
            <ul className="py-2">
              {items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600"
                  >
                    {/* Nếu có icon thì hiển thị */}
                    {item.icon && (
                      <Image
                        src={item.icon}
                        alt={item.name}
                        width={18}
                        height={18}
                        className="object-contain"
                      />
                    )}
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
