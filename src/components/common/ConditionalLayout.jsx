"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();

  // Kiểm tra admin path
  const isAdmin = pathname.startsWith("/admin");
  const isHome = pathname === "/";

  if (isAdmin) {
    // Nếu là admin → chỉ render children, không Header/Footer user
    return <>{children}</>;
  }

  return (
    <>
      {!isHome && <Header />}
      <main>{children}</main>
      {!isHome && <Footer />}
    </>
  );
}
