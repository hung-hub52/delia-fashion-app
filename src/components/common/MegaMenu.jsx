"use client";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect, useState as ReactUseState } from "react";

export default function MegaMenu({ title, sections }) {
  const [open, setOpen] = useState(false);
  const [arrowPos, setArrowPos] = ReactUseState(0);
  const btnRef = useRef(null);

  useEffect(() => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      // Lấy giữa nút menu để đặt mũi tên
      setArrowPos(rect.left + rect.width / 2);
    }
  }, [open]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Nút title */}
      <button
        ref={btnRef}
        className={`uppercase font-medium px-2 py-1 ${
          open
            ? "text-pink-600 border-b-2 border-pink-600"
            : "text-gray-700 hover:text-pink-600"
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
            <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 p-8">
              {sections.map((section, idx) => (
                <div key={idx}>
                  <h4 className="font-semibold text-gray-800 mb-3 border-b pb-1">
                    {section.title}
                  </h4>
                  <ul className="space-y-2">
                    {section.items.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="block text-sm text-gray-600 hover:text-pink-600"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
