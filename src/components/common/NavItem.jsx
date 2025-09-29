"use client";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";

export default function NavItem({ title, href, items = [], sections = [] }) {
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

  const hasDropdown = items.length > 0 || sections.length > 0;

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Nút / Link chính */}
      <div className="flex items-center">
        {href ? (
          <Link
            href={href}
            className={`uppercase font-medium px-2 py-1 ${
              open
                ? "text-pink-600 border-b-2 border-pink-600"
                : "text-gray-800 hover:text-pink-600"
            }`}
          >
            {title}
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className={`uppercase font-medium px-2 py-1 ${
              open
                ? "text-pink-600 border-b-2 border-pink-600"
                : "text-gray-800 hover:text-pink-600"
            }`}
          >
            {title}
          </button>
        )}
      </div>

      {/* Dropdown nhỏ */}
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

      {/* Mega menu */}
      <AnimatePresence>
        {open && sections.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-1/2 top-full w-screen -translate-x-1/2 bg-white shadow-lg border-t z-40"
          >
            <div className="max-w-7xl mx-auto grid grid-cols-5 gap-x-10 gap-y-10 px-10 py-6">
              {sections.map((section, idx) => (
                <div key={idx} className="px-2">
                  <div className="flex gap-2">
                    {section.icon && (
                      <section.icon className="w-5 h-5 text-gray-700 mt-1" />
                    )}
                    <div>
                      <Link
                        href={section.href}
                        className="text-sm font-bold text-gray-900 border-b-2 border-pink-500 pb-0.5 mb-2 inline-block hover:text-pink-600"
                      >
                        {section.title}
                      </Link>
                      <ul className="mt-3 space-y-1">
                        {section.items.map((item) => (
                          <li key={item.href}>
                            <Link
                              href={item.href}
                              className="block text-sm text-gray-600 hover:text-pink-600 transition-colors"
                            >
                              {item.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
