// src/components/admin/Sidebar.jsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Warehouse,
  Tag,
  ClipboardList,
  ListOrdered,
  DollarSign,
  Headset,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes"; // ✅ dùng next-themes

const menu = [
  { label: "Dashboard", href: "/admin", icon: <LayoutDashboard size={19} /> },
  {
    label: "Khách hàng",
    icon: <Users size={19} />,
    children: [
      { label: "Danh sách khách", href: "/admin/customers/list" },
      { label: "Phân loại khách", href: "/admin/customers/classify" },
    ],
  },
  {
    label: "Danh mục, sản phẩm",
    href: "/admin/categories",
    icon: <Tag size={19} />,
    children: [
      { label: "Quản Lý Danh Mục", href: "/admin/categories" },
      { label: "Quản Lý Sản Phẩm", href: "/admin/products" },
    ],
  },
  { label: "Kho", href: "/admin/inventory", icon: <Warehouse size={19} /> },
  {
    label: "Đơn hàng",
    href: "/admin/orders",
    icon: <ClipboardList size={19} />,
  },
  {
    label: "Thanh toán",
    href: "/admin/payments",
    icon: <DollarSign size={19} />,
  },
  {
    label: "Khuyến mãi",
    href: "/admin/sales",
    icon: <ListOrdered size={19} />,
  },
  { label: "Chăm sóc KH", href: "/admin/support", icon: <Headset size={19} /> },
];

// ✅ 5 avatar mẫu để chọn
const AVATARS = [
  "https://i.pravatar.cc/100?img=1",
  "https://i.pravatar.cc/100?img=2",
  "https://i.pravatar.cc/100?img=3",
  "https://i.pravatar.cc/100?img=4",
  "https://i.pravatar.cc/100?img=5",
];

// Icon cho dropdown mũi tên
function ChevronDownIcon({ size = 20 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      width={size}
      height={size}
      className="inline-block"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

// **MenuItem nhận thêm router**
function MenuItem({ item, pathname, collapsed, router }) {
  const [open, setOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const isActive =
    pathname === item.href ||
    (hasChildren && item.children.some((child) => child.href === pathname));

  const handleMenuClick = () => {
    if (hasChildren) setOpen((o) => !o);
    else router.push(item.href);
  };

  return (
    <li>
      <div
        className={`relative flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer
          font-medium transition-all duration-200
          ${
            isActive
              ? "bg-gradient-to-r from-fuchsia-500 to-violet-600 text-white shadow-xl"
              : "text-violet-100 hover:bg-violet-700/60 hover:text-white"
          }
          ${collapsed ? "justify-center" : ""}
        `}
        onClick={handleMenuClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && handleMenuClick()}
      >
        <span className="flex items-center gap-3">
          {item.icon}
          {!collapsed && <span>{item.label}</span>}
        </span>

        {!collapsed && hasChildren && (
          <span
            className={`transition-transform duration-300 ${
              open ? "rotate-180" : "rotate-0"
            }`}
          >
            <ChevronDownIcon size={16} />
          </span>
        )}
      </div>

      {hasChildren && open && !collapsed && (
        <ul className="pl-10 space-y-1 bg-violet-900/20 rounded-md my-1">
          {item.children.map((child) => {
            const childActive = pathname === child.href;
            return (
              <li key={child.href}>
                <Link
                  href={child.href}
                  className={`block px-4 py-2 rounded-md cursor-pointer transition-colors duration-200
                    ${
                      childActive
                        ? "bg-violet-700 text-white font-semibold"
                        : "text-violet-200 hover:bg-violet-700/60"
                    }`}
                >
                  {child.label}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </li>
  );
}

export default function Sidebar({ collapsed, setCollapsed }) {
  const pathname = usePathname();
  const router = useRouter();

  // ✅ next-themes
  const { resolvedTheme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = (mounted ? resolvedTheme : systemTheme) === "dark";

  const toggleDarkMode = () => setTheme(isDark ? "light" : "dark");

  // ✅ Avatar state + popup
  const [shopLogo, setShopLogo] = useState(AVATARS[0]);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  // 🔹 Load logo từ localStorage khi mở app
  useEffect(() => {
    const savedLogo = localStorage.getItem("shopLogo");
    if (savedLogo) setShopLogo(savedLogo);
  }, []);

  // 🔹 Lưu logo vào localStorage khi thay đổi
  const handleSelectAvatar = (url) => {
    setShopLogo(url);
    localStorage.setItem("shopLogo", url);
    setShowAvatarPicker(false);
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-screen z-40 transition-all duration-300
        ${collapsed ? "w-20" : "w-64"}
        ${
          isDark
            ? "bg-gray-900 text-white"
            : "bg-gradient-to-b from-indigo-900/90 to-purple-900/80 text-violet-100"
        }
      `}
    >
      <div
        className={`h-full backdrop-blur-[6px] shadow-2xl border-r border-violet-800/40 transition-all duration-300 flex flex-col
          ${collapsed ? "items-center" : ""}
        `}
      >
        {/* Logo + avatar picker */}
        <div
          className={`relative flex items-center ${
            collapsed ? "justify-center" : "gap-3"
          } mt-6 mb-8`}
        >
          <img
            src={shopLogo}
            alt="logo"
            onClick={() => setShowAvatarPicker((v) => !v)}
            className={`transition-transform duration-300 border-4 border-white shadow-lg bg-white/40 rounded-full w-12 h-12
              ${
                collapsed ? "hover:scale-110" : "hover:scale-105"
              } cursor-pointer`}
          />
          {!collapsed && (
            <div>
              <div className="font-bold text-lg tracking-wider drop-shadow-md">
                DELIA Admin
              </div>
              <div className="text-xs opacity-70">Fashion Manager</div>
            </div>
          )}

          {/* Popup chọn avatar */}
          {showAvatarPicker && (
            <div className="absolute top-16 left-0 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-3 grid grid-cols-5 gap-2 z-50">
              {AVATARS.map((url) => (
                <img
                  key={url}
                  src={url}
                  alt="avatar"
                  onClick={() => handleSelectAvatar(url)}
                  className="w-10 h-10 rounded-full border-2 border-transparent hover:border-violet-500 cursor-pointer"
                />
              ))}
            </div>
          )}
        </div>

        {/* Toggle collapse */}
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="absolute -right-3 top-8 w-7 h-7 bg-white/30 border border-violet-600 rounded-full shadow flex items-center justify-center transition-all duration-300 z-50 hover:scale-110"
        >
          {collapsed ? (
            <ChevronRight className="text-violet-700" size={20} />
          ) : (
            <ChevronLeft className="text-violet-700" size={20} />
          )}
        </button>

        {/* Dark mode toggle */}
        {!collapsed && (
          <button
            onClick={toggleDarkMode}
            className="mx-auto mb-4 px-4 py-1 bg-violet-700 rounded-md text-white hover:bg-violet-600 transition-colors duration-300"
            aria-label="Toggle dark mode"
            disabled={!mounted}
          >
            {isDark ? "Light Mode" : "Dark Mode"}
          </button>
        )}

        {/* Menu */}
        <nav className={`flex-1 w-full ${collapsed ? "mt-10" : ""}`}>
          <ul className="space-y-1">
            {menu.map((item, idx) => (
              <MenuItem
                key={item.href || item.label || idx}
                item={item}
                pathname={pathname}
                collapsed={collapsed}
                router={router}
              />
            ))}
          </ul>
        </nav>

        <div
          className={`mb-6 ${
            collapsed ? "mx-auto" : "text-center"
          } text-xs opacity-90`}
        >
          {!collapsed && <span>&copy; 2025 DELIA Admin</span>}
        </div>
      </div>
    </aside>
  );
}
