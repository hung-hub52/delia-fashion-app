"use client";

import { useState } from "react";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";

export default function AdminLayout({ children }) {
  // State lưu trạng thái sidebar
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex bg-gradient-to-r from-indigo-50 to-white">
      {/* Truyền prop collapsed + setCollapsed xuống Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <main
        className={`flex-1 p-6 bg-gray-50 min-h-screen overflow-x-auto transition-all duration-300 ${
          collapsed ? "ml-20" : "ml-64"
        }`}
      >
        <Header />
        <div className="mt-8">{children}</div>
      </main>
    </div>
  );
}
