"use client";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";

export default function MegaMenu({ title, sections = [] }) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Nút menu */}
      <button
        ref={btnRef}
        className={`uppercase font-medium px-2 py-1 ${
          open
            ? "text-pink-600 border-b-2 border-pink-600"
            : "text-gray-800 hover:text-pink-600"
        }`}
      >
        {title}
      </button>

      {/* Mega dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-1/2 top-full w-screen -translate-x-1/2 bg-white shadow-lg border-t z-40"
          >
            {/* thêm gap-y-10 để giãn cách 2 hàng */}
            <div className="max-w-7xl mx-auto grid grid-cols-5 gap-x-10 gap-y-10 px-10 py-6">
              {sections.map((section, idx) => (
                <div key={idx} className="px-2">
                  <div className="flex gap-2">
                    {/* Icon */}
                    {section.icon && (
                      <section.icon className="w-5 h-5 text-gray-700 mt-1" />
                    )}

                    {/* Text cha + con */}
                    <div>
                      {/* Danh mục cha */}
                      <Link
                        href={section.href}
                        className="text-sm font-bold text-gray-900 border-b-2 border-pink-500 pb-0.5 mb-2 inline-block hover:text-pink-600"
                      >
                        {section.title}
                      </Link>

                      {/* Danh mục con */}
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
