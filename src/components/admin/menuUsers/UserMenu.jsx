// src/components/admin/menuUsers/UserMenu.jsx
"use client";
import { useState, useRef, useEffect } from "react";
import { LogOut, Key, History, Edit3 } from "lucide-react";
import ProfileModal from "./ProfileModal";
import ActivityList from "./ActivityList";
import ChangePasswordModal from "./ChangePasswordModal";

const API = "http://localhost:3001/api";

/* helpers */
function decodeJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

function getToken() {
  if (typeof window === "undefined") return null;
  const keys = ["token","access_token","jwt","authToken","Authorization","authorization","user","auth","session"];
  for (const k of keys) {
    let v = localStorage.getItem(k);
    if (!v) continue;
    try {
      const obj = JSON.parse(v);
      for (const kk of ["access_token","token","jwt","value"]) {
        const cand = obj?.[kk];
        if (typeof cand === "string" && cand.split(".").length === 3) return cand;
      }
    } catch {}
    v = String(v).replace(/^"(.*)"$/, "$1").trim();
    if (v.startsWith("Bearer ")) v = v.slice(7).trim();
    if (v.split(".").length === 3) return v;
  }
  return null;
}
const authHeaders = () => {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
};
async function getJSON(url, options = {}) {
  const res = await fetch(url, {
    credentials: "include",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
      ...(options.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || `Request failed: ${res.status}`);
  return data;
}

/* component */
export default function UserMenu() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("info");
  const ref = useRef();

  const [user, setUser] = useState({
    name: "Admin",
    email: "",
    role: "admin",
    avatar: "",
    phone: "",
    address: "",
    password: "********",
    activities: [],
  });

  const [showProfileDetail, setShowProfileDetail] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState("");
  const fileInputRef = useRef();
  const [showChangePassword, setShowChangePassword] = useState(false);

  /* load profile */
  useEffect(() => {
    (async () => {
      const saved = typeof window !== "undefined" ? localStorage.getItem("user") : null;
      if (saved) {
        try {
          const u = JSON.parse(saved);
          setUser({
            name: u.ho_ten || u.name || "Admin",
            email: u.email || "",
            role: u.vai_tro || u.role || "admin",
            avatar: u.anh_dai_dien || u.avatar || "",
            phone: u.so_dien_thoai || u.phone || "",
            address: u.dia_chi || u.address || "",
            password: "********",
            activities: [],
          });
          setPreviewAvatar(u.anh_dai_dien || u.avatar || "");
          return;
        } catch {}
      }
      try {
        const me = await getJSON(`${API}/users/me`);
        setUser({
          name: me.ho_ten || me.name || "Admin",
          email: me.email || "",
          role: me.vai_tro || me.role || "admin",
          avatar: me.anh_dai_dien || me.avatar || "",
          phone: me.so_dien_thoai || me.phone || "",
          address: me.dia_chi || me.address || "",
          password: "********",
          activities: [],
        });
        setPreviewAvatar(me.anh_dai_dien || me.avatar || "");
        localStorage.setItem("user", JSON.stringify(me));
      } catch {
        const t = getToken();
        const p = t ? decodeJwt(t) : null;
        setUser((prev) => ({ ...prev, email: p?.email || prev.email, role: p?.role || prev.role }));
      }
    })();
  }, []);

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    if (open) window.addEventListener("mousedown", h);
    return () => window.removeEventListener("mousedown", h);
  }, [open]);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPreviewAvatar(String(ev.target?.result || ""));
    reader.readAsDataURL(file);
  };

  const handleSaveAvatar = async () => {
    const next = { ...user, avatar: previewAvatar };
    setUser(next);
    try {
      localStorage.setItem(
        "user",
        JSON.stringify({
          ho_ten: next.name,
          email: next.email,
          vai_tro: next.role,
          anh_dai_dien: next.avatar,
          so_dien_thoai: next.phone,
          dia_chi: next.address,
        })
      );
    } finally {
      setShowProfileDetail(false);
    }
  };

  const handlePasswordChange = async () => {
    setUser((u) => ({ ...u, password: "********" }));
  };

  const handleLogout = async () => {
    ["token","access_token","jwt","authToken","Authorization","authorization","user","auth","session"]
      .forEach((k) => localStorage.removeItem(k));
    window.location.href = "/account/login";
  };

  return (
    <div className="relative" ref={ref}>
      <button className="flex items-center gap-2 focus:outline-none group" onClick={() => setOpen(v => !v)}>
        <span className="font-medium text-gray-800">
          Xin chào, <span className="font-bold">{user.name || "Admin"}</span>
        </span>
        <span className="relative flex items-center">
          <span className="w-10 h-10 rounded-full overflow-hidden border-2 border-white ring-2 ring-violet-300/70 shadow-md shrink-0">
            <img
              src={ user.avatar || user.anh_dai_dien || "https://ui-avatars.com/api/?name=Admin&background=7367F0&color=fff" }
              alt="avatar"
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </span>
        </span>
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl shadow-2xl p-6 z-50 animate-fade-in-up" style={{ minWidth: 320 }}>
          <div className="flex gap-2 mb-5 border-b border-violet-100 dark:border-violet-800 pb-2">
            <button
              className={`px-3 py-1 rounded-lg text-sm font-semibold transition-all duration-200 ${tab === "info" ? "bg-violet-600 text-white shadow" : "text-violet-700 dark:text-violet-200 hover:bg-violet-100 dark:hover:bg-violet-800"}`}
              onClick={() => setTab("info")}
            >
              <Edit3 className="inline mr-1" size={16} /> Thông tin
            </button>
            <button
              className={`px-3 py-1 rounded-lg text-sm font-semibold transition-all duration-200 ${tab === "history" ? "bg-pink-600 text-white shadow" : "text-pink-700 dark:text-pink-200 hover:bg-pink-100 dark:hover:bg-pink-800"}`}
              onClick={() => setTab("history")}
            >
              <History className="inline mr-1" size={16} /> Lịch sử
            </button>
          </div>

          {tab === "info" && (
            <>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-16 h-16 rounded-full overflow-hidden border-4 border-violet-400 shadow shrink-0">
                  <img
                    src={ previewAvatar || user.avatar || user.anh_dai_dien || "https://ui-avatars.com/api/?name=Admin&background=7367F0&color=fff" }
                    alt="avatar"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </span>
                <div>
                  <div
                    className="text-lg font-bold text-gray-800 dark:text-gray-100 cursor-pointer hover:underline"
                    onClick={() => setShowProfileDetail(true)}
                    title="Xem chi tiết tài khoản"
                  >
                    {user.name || "Admin"}
                  </div>
                  <div className="text-sm text-gray-400">{user.email || "—"}</div>
                  <span className="inline-block bg-violet-100 text-violet-700 dark:bg-violet-700 dark:text-white px-3 py-0.5 rounded-full text-xs mt-1">
                    {user.role || "admin"}
                  </span>
                </div>
              </div>

              <div className="space-y-2 mt-3">
                <button
                  className="w-full py-2 px-4 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                  onClick={() => setShowChangePassword(true)}
                >
                  <Key size={18} /> Đổi mật khẩu
                </button>

                <button
                  className="w-full py-2 px-4 bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded-xl font-semibold text-gray-700 dark:text-gray-200 transition-all flex items-center justify-center gap-2"
                  onClick={handleLogout}
                >
                  <LogOut size={18} /> Đăng xuất
                </button>
              </div>
            </>
          )}

          {tab === "history" && <ActivityList activities={user.activities || []} />}
        </div>
      )}

      <ProfileModal
        open={showProfileDetail}
        onClose={() => setShowProfileDetail(false)}
        user={user}
        previewAvatar={previewAvatar}
        fileInputRef={fileInputRef}
        handleAvatarChange={handleAvatarChange}
        handleSaveAvatar={handleSaveAvatar}
        onAvatarSaved={(url) => {
          setUser((prev) => ({ ...prev, avatar: url, anh_dai_dien: url }));
          setPreviewAvatar(url || "");
        }}
      />

      <ChangePasswordModal
        open={showChangePassword}
        onClose={() => setShowChangePassword(false)}
        onChangePassword={() => {}}
        user={user}
      />

      <style>{`
        .animate-fade-in-up { animation: fadeInUp 0.24s cubic-bezier(.45,1.35,.32,1) both; }
        @keyframes fadeInUp { 0% { opacity: 0; transform: translateY(20px);} 100% { opacity: 1; transform: translateY(0);} }
        .animate-wiggle { animation: wiggle 0.5s ease-in-out; }
        @keyframes wiggle {
          0% { transform: rotate(-8deg) scale(0.96); }
          15% { transform: rotate(7deg) scale(1.08); }
          35% { transform: rotate(-5deg); }
          60% { transform: rotate(3deg); }
          80% { transform: rotate(-2deg); }
          100% { transform: rotate(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
