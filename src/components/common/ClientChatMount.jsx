"use client";

import { useEffect, useState } from "react";
import CustomerCareChat from "./CustomerCareChat";
import { usePathname } from "next/navigation";

/* ---- helpers ---- */
function pickId(obj) {
  if (!obj || typeof obj !== "object") return null;
  const v =
    obj.id ??
    obj.userId ??
    obj.user_id ??
    obj.id_user ??
    obj.id_nguoidung ??
    obj.idNguoiDung ??
    obj.sub ??
    null;
  return v != null ? Number(v) : null;
}

function safeParse(json) { try { return JSON.parse(json); } catch { return null; } }

function decodeJwt(token) {
  try {
    const [, payload] = String(token).split(".");
    if (!payload) return null;
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64).split("").map(c => "%" + ("00"+c.charCodeAt(0).toString(16)).slice(-2)).join("")
    );
    return JSON.parse(json);
  } catch { return null; }
}

function findUserFromLocalStorage() {
  const preferred = ["user","currentUser","profile","userInfo","account","me"];
  for (const k of preferred) {
    const v = localStorage.getItem(k);
    if (v) {
      const obj = safeParse(v);
      const id = pickId(obj);
      if (id) return { id, name: obj.name || obj.fullName || obj.username || obj.email };
    }
  }
  for (let i=0;i<localStorage.length;i++){
    const k = localStorage.key(i); if(!k) continue;
    const v = localStorage.getItem(k); if(!v) continue;
    const obj = safeParse(v);
    const id = pickId(obj);
    if (id) return { id, name: obj.name || obj.fullName || obj.username || obj.email };
  }
  let t = localStorage.getItem("token") || localStorage.getItem("access_token") ||
          localStorage.getItem("accessToken") || localStorage.getItem("Authorization") || "";
  if (/^".*"$/.test(t)) t = t.slice(1,-1);
  if (t.startsWith("Bearer ")) t = t.slice(7);
  if (t) {
    const payload = decodeJwt(t);
    const id = pickId(payload);
    if (id) return { id, name: payload?.name || payload?.fullName || payload?.username || payload?.email };
  }
  return null;
}

export default function ClientChatMount() {
  const [user, setUser] = useState(null);
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;
    const resolve = () => {
      const u = findUserFromLocalStorage();
      if (!cancelled) setUser(u);
      // nếu vừa login xong và có cờ -> mở lại chat tự động
      if (u && sessionStorage.getItem("cskh_reopen") === "1") {
        window.dispatchEvent(new Event("cskh:open"));
        sessionStorage.removeItem("cskh_reopen");
      }
    };

    resolve();

    const onStorage = () => resolve();
    const onFocus = () => resolve();

    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", onFocus);

    return () => {
      cancelled = true;
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", onFocus);
    };
  // chạy lại khi đổi route (đăng nhập thường redirect)
  }, [pathname]);

  return <CustomerCareChat user={user} loginHref="/account/login" />;
}
