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

const menu = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: <LayoutDashboard size={19} />,
  },
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

  {
    label: "Kho",
    href: "/admin/inventory",
    icon: <Warehouse size={19} />,
  },

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
  {
    label: "Chăm sóc KH",
    href: "/admin/support",
    icon: <Headset size={19} />,
  },
];

// **MenuItem nhận thêm router**
function MenuItem({ item, pathname, collapsed, router }) {
  const [open, setOpen] = useState(false);  
  const hasChildren = item.children && item.children.length > 0;
  const isActive =
    pathname === item.href ||
    (hasChildren && item.children.some((child) => child.href === pathname));

  const handleMenuClick = () => {
    if (hasChildren) {
      setOpen((o) => !o);
    } else {
      router.push(item.href);
    }
  };

  return (
    <li>
      <div
        className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer
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
        onKeyDown={(e) => {
          if (e.key === "Enter") handleMenuClick();
        }}
      >
        <span className={`flex items-center gap-3`}>
          {item.icon && (
            <span
              className={`transition-all duration-300 ${
                isActive
                  ? "text-yellow-300 scale-125 drop-shadow-glow"
                  : "group-hover:text-yellow-100"
              }`}
            >
              {item.icon}
              {isActive && (
                <span className="absolute -inset-1 blur-[2.5px] bg-yellow-400 opacity-30 rounded-full animate-pulse" />
              )}
            </span>
          )}
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

  // Dark mode state
  const [darkMode, setDarkMode] = useState(false);

  // Sync với hệ thống
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setDarkMode(mq.matches);
    const handler = (e) => setDarkMode(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Toggle thủ công dark mode
  const toggleDarkMode = () => {
    setDarkMode((d) => !d);
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-screen z-40 transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      } ${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-b from-indigo-900/90 to-purple-900/80 text-violet-100"
      }`}
    >
      <div
        className={`h-full backdrop-blur-[6px] shadow-2xl border-r border-violet-800/40 transition-all duration-300 flex flex-col ${
          collapsed ? "items-center" : ""
        }`}
      >
        <div
          className={`flex items-center ${
            collapsed ? "justify-center" : "gap-3"
          } mt-6 mb-8`}
        >
          <img
            src="https://chrysanthemumgarden.com/wp-content/uploads/wp-user-manager-uploads/2023/08/18f2df5ed05ac4e9cb2b5805698c2901.jpg"
            alt="logo"
            className={`transition-transform duration-300 border-4 border-white shadow-lg bg-white/40 rounded-full w-12 h-12 ${
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
        </div>
        {/* Toggle Button */}
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
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        )}

        {/* Menu */}
        <nav className={`flex-1 w-full ${collapsed ? "mt-10" : ""}`}>
          <ul className="space-y-1">
            {menu.map((item, idx) => (
              <MenuItem
                key={item.href || item.label || idx} // Ưu tiên href, không có thì label, không có thì index
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
