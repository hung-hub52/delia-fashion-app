"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";
import { CategoriesProvider } from "@/context/CategoriesContext";
import { InventoryProvider } from "@/context/InventoryContext";
import toast from "react-hot-toast";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  // Kiểm tra quyền admin
  useEffect(() => {
    const checkAdminAccess = () => {
      if (typeof window === "undefined") return;

      // Lấy thông tin user từ localStorage
      const userStr = localStorage.getItem("user");
      const token = localStorage.getItem("token") || localStorage.getItem("access_token");

      if (!userStr || !token) {
        toast.error("Vui lòng đăng nhập để truy cập trang quản trị!");
        router.push("/account/login");
        return;
      }

      try {
        const user = JSON.parse(userStr);
        
        // Kiểm tra vai trò admin
        if (user.role !== "admin") {
          toast.error("Bạn không có quyền truy cập trang này!");
          router.push("/");
          return;
        }

        // Kiểm tra trạng thái tài khoản
        if (user.status === 0) {
          toast.error("Tài khoản của bạn đã bị khóa!");
          localStorage.clear();
          router.push("/account/login");
          return;
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error("Error parsing user data:", error);
        toast.error("Đã xảy ra lỗi, vui lòng đăng nhập lại!");
        localStorage.clear();
        router.push("/account/login");
      } finally {
        setLoading(false);
      }
    };

    checkAdminAccess();
  }, [router]);

  // Hiển thị loading trong khi kiểm tra
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-50 to-white">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Kiểm tra quyền truy cập...</p>
        </div>
      </div>
    );
  }

  // Nếu không có quyền, không hiển thị gì
  if (!isAuthorized) {
    return null;
  }

  return (
    <CategoriesProvider>
      <InventoryProvider>
        <div className="min-h-screen flex bg-gradient-to-r from-indigo-50 to-white">
          {/* Sidebar */}
          <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

          {/* Nội dung chính */}
          <main
            className={`flex-1 p-6 bg-gray-50 min-h-screen overflow-x-auto transition-all duration-300 ${
              collapsed ? "ml-20" : "ml-64"
            }`}
          >
            <Header />
            <div className="mt-8">{children}</div>
          </main>
        </div>
      </InventoryProvider>
    </CategoriesProvider>
  );
}
