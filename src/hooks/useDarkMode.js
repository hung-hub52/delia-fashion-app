// src/hooks/useDarkMode.js
"use client";

import { useEffect, useState } from "react";

/**
 * Đồng bộ dark mode toàn trang:
 * - Ưu tiên giá trị lưu trong localStorage: "darkMode" = "true" | "false"
 * - Nếu chưa lưu -> theo system (prefers-color-scheme)
 * - Tự gắn/bỏ class "dark" vào <html> (document.documentElement)
 */
export default function useDarkMode() {
  const [darkMode, setDarkMode] = useState(false);

  // Khởi tạo theo localStorage / system
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const saved = localStorage.getItem("darkMode");

    const initial = saved !== null ? saved === "true" : mq.matches;

    setDarkMode(initial);
    document.documentElement.classList.toggle("dark", initial);

    // Nếu người dùng KHÔNG ghi đè bằng localStorage
    // thì lắng nghe thay đổi từ system để tự đồng bộ
    const handler = (e) => {
      const overridden = localStorage.getItem("darkMode");
      if (overridden === null) {
        setDarkMode(e.matches);
        document.documentElement.classList.toggle("dark", e.matches);
      }
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Toggle thủ công và lưu lại
  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem("darkMode", String(next));
      return next;
    });
  };

  // Cho phép reset về theo system (nếu cần dùng chỗ khác)
  const resetToSystem = () => {
    localStorage.removeItem("darkMode");
    const system = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDarkMode(system);
    document.documentElement.classList.toggle("dark", system);
  };

  return { darkMode, toggleDarkMode, resetToSystem };
}
