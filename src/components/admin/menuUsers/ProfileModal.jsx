"use client";

import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import AvatarUpload from "./AvatarUpload";
import { Pencil, Eye, EyeOff, Lock } from "lucide-react";

const API = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api").replace(/\/$/, "");

/* ----------------- helpers ----------------- */
function looksLikeJwt(s) {
  return typeof s === "string" && s.split(".").length === 3;
}
function getToken() {
  if (typeof window === "undefined") return null;
  const keys = ["token", "access_token", "jwt", "Authorization", "authorization"];
  for (const k of keys) {
    let v = localStorage.getItem(k);
    if (!v) continue;
    try {
      const obj = JSON.parse(v);
      for (const kk of ["access_token", "token", "jwt", "value"]) {
        const cand = obj?.[kk];
        if (typeof cand === "string" && looksLikeJwt(cand)) return cand;
      }
    } catch {}
    v = String(v).replace(/^"(.*)"$/, "$1").trim();
    if (v.startsWith("Bearer ")) v = v.slice(7).trim();
    if (looksLikeJwt(v)) return v;
  }
  return null;
}
function getSavedEmail() {
  try {
    const u = JSON.parse(localStorage.getItem("user") || "{}");
    return (u?.email || "").trim().toLowerCase();
  } catch {
    return "";
  }
}
async function reauthSmart(password) {
  const token = getToken();
  // 1) verify-admin
  let res = await fetch(`${API}/auth/verify-admin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include",
    body: JSON.stringify({ password }),
  }).catch(() => null);
  if (res?.ok) return true;

  // 2) fallback login
  const email = getSavedEmail();
  if (!email) return false;
  res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  }).catch(() => null);
  if (!res?.ok) return false;

  const data = await res.json().catch(() => ({}));
  if (!data?.access_token) return false;
  try {
    localStorage.setItem("token", data.access_token);
    if (data.user) localStorage.setItem("user", JSON.stringify(data.user));
  } catch {}
  return true;
}

/* PATCH /users/me */
async function patchMe(payload) {
  const token = getToken();
  const res = await fetch(`${API}/users/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include",
    body: JSON.stringify(payload),
  }).catch(() => null);
  return !!res?.ok;
}

/* --------------- component ------------------ */
export default function ProfileModal({
  open,
  onClose,
  user,
  previewAvatar,
  fileInputRef,
  handleAvatarChange, // preview
  onAvatarSaved,
}) {
  const [editingField, setEditingField] = useState(null);
  const [editValues, setEditValues] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",
    address: user?.address || "",
  });
  const [unmasked, setUnmasked] = useState({});
  const [reauthUntil, setReauthUntil] = useState(0);
  const [passBuf, setPassBuf] = useState("");
  const [askingFor, setAskingFor] = useState(null);
  const passInputRef = useRef(null);

  /* load lại form khi user thay đổi */
  useEffect(() => {
    setEditValues({
      name: user?.name || "",
      phone: user?.phone || "",
      email: user?.email || "",
      address: user?.address || "",
    });
  }, [user]);

  /* reset mỗi lần mở popup */
  useEffect(() => {
    if (open) {
      setEditingField(null);
      setUnmasked({});
      setReauthUntil(0);
      setAskingFor(null);
      setPassBuf("");
      if (fileInputRef?.current) fileInputRef.current.value = "";
    }
  }, [open, fileInputRef]);

  useEffect(() => {
    if (askingFor && passInputRef.current) passInputRef.current.focus();
  }, [askingFor]);

  if (!open) return null;

  const closeAndReset = () => {
    setEditingField(null);
    setUnmasked({});
    setReauthUntil(0);
    setAskingFor(null);
    setPassBuf("");
    if (fileInputRef?.current) fileInputRef.current.value = "";
    onClose?.();
  };

  const mask = (v = "") => (v ? "*".repeat(Math.max(6, Math.min(24, String(v).length))) : "********");

  const mapFieldToPayload = (field, value) => {
    switch (field) {
      case "name":
        return { ho_ten: value };
      case "phone":
        return { so_dien_thoai: value };
      case "email":
        return { email: value };
      case "address":
        return { dia_chi: value };
      default:
        return {};
    }
  };

  const ensureReauth = async (field) => {
    const now = Date.now();
    if (now < reauthUntil) return true;
    setAskingFor(field);
    return false;
  };

  const confirmPassword = async () => {
    const ok = await reauthSmart(passBuf);
    if (ok) {
      setReauthUntil(Date.now() + 3 * 60 * 1000); // 3 phút
      if (askingFor) setUnmasked((prev) => ({ ...prev, [askingFor]: true }));
      setAskingFor(null);
      setPassBuf("");
    } else {
      alert("Mật khẩu admin không đúng.");
    }
  };

  const handleFieldChange = (field, value) => {
    setEditValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleViewClick = async (field) => {
    const ok = await ensureReauth(field);
    if (ok) setUnmasked((prev) => ({ ...prev, [field]: true }));
  };

  const handleEditClick = async (field) => {
    const ok = await ensureReauth(field);
    if (ok) setEditingField(field);
  };

  /* lấy lại user từ /users/me, sync localStorage */
  const refreshMe = async () => {
    const token = getToken();
    const res = await fetch(`${API}/users/me`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: "include",
    }).catch(() => null);
    const me = await res?.json().catch(() => ({}));
    if (res?.ok && me) {
      try {
        localStorage.setItem("user", JSON.stringify(me));
      } catch {}
      setEditValues({
        name: me.ho_ten || me.name || "",
        phone: me.so_dien_thoai || me.phone || "",
        email: me.email || "",
        address: me.dia_chi || me.address || "",
      });
      return me;
    }
    return null;
  };

  const handleSaveEditLocal = async (field) => {
    setEditingField(null);
    const payload = mapFieldToPayload(field, editValues[field]);
    const ok = await patchMe(payload);
    if (!ok) {
      alert("Cập nhật không thành công trên máy chủ.");
      return;
    }
    // đồng bộ local
    await refreshMe();
    toast.success("Cập nhật thông tin thành công!");
  };

  const handleKeyDown = (e, field) => {
    if (e.key === "Enter") handleSaveEditLocal(field);
  };

  /* Upload avatar (multipart/form-data) */
  const handleSaveAvatar = async () => {
    const file = fileInputRef?.current?.files?.[0];
    if (!file) {
      closeAndReset();
      return;
    }

    const token = getToken();
    const fd = new FormData();
    fd.append("file", file);

    const res = await fetch(`${API}/users/me/avatar`, {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: "include",
      body: fd,
    }).catch(() => null);

    if (!res?.ok) {
      toast.error("Tải ảnh lên thất bại");
      return;
    }

    let avatarUrl = "";
    try {
      const data = await res.json();
      avatarUrl = data?.avatar_url || "";
    } catch {}

    await refreshMe();
    if (avatarUrl) onAvatarSaved?.(avatarUrl);
    toast.success("Cập nhật ảnh đại diện thành công");
    closeAndReset();
  };

  return (
    <div className="fixed inset-0 z-[999] bg-black/40 flex items-center justify-center">
      <div className="bg-white dark:bg-neutral-900 p-8 rounded-2xl shadow-2xl border border-violet-200 dark:border-violet-800 min-w-[340px] max-w-[90vw] relative">
        <button
          onClick={closeAndReset}
          className="absolute top-3 right-3 p-2 rounded-full bg-gray-100 dark:bg-neutral-800 hover:bg-violet-700"
          title="Đóng"
        >
          <span className="font-bold text-xl text-gray-600 dark:text-gray-300">×</span>
        </button>

        {/* Avatar */}
        <AvatarUpload
          previewAvatar={previewAvatar}
          fileInputRef={fileInputRef}
          handleAvatarChange={handleAvatarChange}
        />

        {/* Họ tên + vai trò */}
        <div className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-1 text-center">{editValues.name}</div>
        <div className="flex justify-center mb-4">
          <span className="inline-block bg-violet-100 text-violet-700 dark:bg-violet-700 dark:text-white px-3 py-0.5 rounded-full text-xs">
            {user?.role || "admin"}
          </span>
        </div>

        {/* Trường thông tin */}
        <div className="space-y-3 text-gray-700 dark:text-gray-200 text-[15px] my-4">
          {/* Họ tên */}
          <div className="flex items-center">
            <b>Họ tên:</b>
            {editingField === "name" ? (
              <input
                className="ml-2 border px-2 py-1 rounded"
                value={editValues.name}
                onChange={(e) => handleFieldChange("name", e.target.value)}
                onBlur={() => handleSaveEditLocal("name")}
                onKeyDown={(e) => handleKeyDown(e, "name")}
                autoFocus
              />
            ) : (
              <>
                <span className="ml-2">{editValues.name}</span>
                <button type="button" className="ml-1 p-1 hover:bg-violet-500 rounded" onClick={() => handleEditClick("name")} title="Chỉnh sửa">
                  <Pencil size={16} className="text-white" />
                </button>
              </>
            )}
          </div>

          {/* SĐT */}
          <div className="flex items-center">
            <b>Số điện thoại:</b>
            {editingField === "phone" ? (
              <input
                className="ml-2 border px-2 py-1 rounded"
                value={editValues.phone}
                onChange={(e) => handleFieldChange("phone", e.target.value)}
                onBlur={() => handleSaveEditLocal("phone")}
                onKeyDown={(e) => handleKeyDown(e, "phone")}
                autoFocus
              />
            ) : (
              <>
                <span className="ml-2">{unmasked.phone ? editValues.phone : mask(editValues.phone)}</span>
                <button type="button" className="ml-1 p-1 hover:bg-violet-500 rounded" onClick={() => handleViewClick("phone")} title="Xem">
                  {unmasked.phone ? <EyeOff size={16} className="text-white" /> : <Eye size={16} className="text-white" />}
                </button>
                <button type="button" className="ml-1 p-1 hover:bg-violet-500 rounded" onClick={() => handleEditClick("phone")} title="Chỉnh sửa">
                  <Pencil size={16} className="text-white" />
                </button>
              </>
            )}
          </div>

          {/* Email */}
          <div className="flex items-center">
            <b>Email:</b>
            {editingField === "email" ? (
              <input
                className="ml-2 border px-2 py-1 rounded "
                value={editValues.email}
                onChange={(e) => handleFieldChange("email", e.target.value)}
                onBlur={() => handleSaveEditLocal("email")}
                onKeyDown={(e) => handleKeyDown(e, "email")}
                autoFocus
              />
            ) : (
              <>
                <span className="ml-2">{unmasked.email ? editValues.email : mask(editValues.email)}</span>
                <button type="button" className="ml-1 p-1 hover:bg-violet-500 rounded" onClick={() => handleViewClick("email")} title="Xem">
                  {unmasked.email ? <EyeOff size={16} className="text-white" /> : <Eye size={16} className="text-white" />}
                </button>
                <button type="button" className="ml-1 p-1 hover:bg-violet-500 rounded" onClick={() => handleEditClick("email")} title="Chỉnh sửa">
                  <Pencil size={16} className="text-white" />
                </button>
              </>
            )}
          </div>

          {/* Địa chỉ */}
          <div className="flex items-center">
            <b>Địa chỉ:</b>
            {editingField === "address" ? (
              <input
                className="ml-2 border px-2 py-1 rounded "
                value={editValues.address}
                onChange={(e) => handleFieldChange("address", e.target.value)}
                onBlur={() => handleSaveEditLocal("address")}
                onKeyDown={(e) => handleKeyDown(e, "address")}
                autoFocus
              />
            ) : (
              <>
                <span className="ml-2">{unmasked.address ? editValues.address : mask(editValues.address)}</span>
                <button type="button" className="ml-1 p-1 hover:bg-violet-500 rounded" onClick={() => handleViewClick("address")} title="Xem">
                  {unmasked.address ? <EyeOff size={16} className="text-white" /> : <Eye size={16} className="text-white" />}
                </button>
                <button type="button" className="ml-1 p-1 hover:bg-violet-500 rounded" onClick={() => handleEditClick("address")} title="Chỉnh sửa">
                  <Pencil size={16} className="text-white" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Nút lưu avatar */}
        <div className="flex justify-end mt-6">
          <button className="px-5 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700 font-semibold transition" onClick={handleSaveAvatar}>
            Lưu
          </button>
        </div>

        {/* Inline re-auth */}
        {askingFor && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-2xl">
            <div className="bg-white dark:bg-neutral-900 rounded-xl p-5 w-[90%] max-w-sm border border-violet-300">
              <div className="flex items-center gap-2 mb-2 text-gray-800 dark:text-gray-100">
                <Lock size={18} /> <b>Nhập mật khẩu Admin để tiếp tục</b>
              </div>
              <input
                ref={passInputRef}
                type="password"
                className="w-full border rounded-lg px-3 py-2 mb-3"
                value={passBuf}
                onChange={(e) => setPassBuf(e.target.value)}
                placeholder="Mật khẩu admin"
                onKeyDown={(e) => e.key === "Enter" && passBuf && confirmPassword()}
              />
              <div className="flex justify-end gap-2">
                <button className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200" onClick={() => { setAskingFor(null); setPassBuf(""); }} type="button">
                  Huỷ
                </button>
                <button className="px-4 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700" onClick={confirmPassword} type="button">
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
