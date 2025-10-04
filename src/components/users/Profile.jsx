// src/components/users/Profile.jsx
"use client";

import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

const API = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api").replace(/\/$/, "");

// ===== Helpers (độc lập) =====
function looksLikeJwt(s) {
  return typeof s === "string" && s.split(".").length === 3;
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
        if (typeof cand === "string" && looksLikeJwt(cand)) return cand;
      }
    } catch {}
    v = String(v).replace(/^"(.*)"$/, "$1").trim();
    if (v.startsWith("Bearer ")) v = v.slice(7).trim();
    if (looksLikeJwt(v)) return v;
  }
  return null;
}
function updateLocalUser(next) {
  try {
    const cur = JSON.parse(localStorage.getItem("user") || "{}");
    const merged = { ...cur, ...next };
    localStorage.setItem("user", JSON.stringify(merged));
    window.dispatchEvent(new Event("userUpdated"));
  } catch {}
}

export default function Profile() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    avatar: "/images/avatar-user.jpg",
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // avatar state
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  // ===== Hydrate từ localStorage trước cho nhanh =====
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const u = JSON.parse(localStorage.getItem("user") || "{}");
      if (u && (u.name || u.email)) {
        setForm((prev) => ({
          ...prev,
          name: u.ho_ten || u.name || "",
          email: u.email || "",
          phone: u.so_dien_thoai || u.phone || "",
          avatar: u.anh_dai_dien || u.avatar || "/images/avatar-user.jpg",
        }));
      }
    } catch {}
  }, []);

  // ===== Gọi BE /users/me để làm mới =====
  useEffect(() => {
    const t = getToken();
    if (!t) return;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API}/users/me`, {
          credentials: "include",
          headers: { Authorization: `Bearer ${t}` },
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.message || "Không tải được hồ sơ");

        const mapped = {
          name: data.ho_ten ?? data.name ?? "",
          email: data.email ?? "",
          phone: data.so_dien_thoai ?? data.phone ?? "",
          avatar: data.anh_dai_dien || "/images/avatar-user.jpg",
        };
        setForm((prev) => ({ ...prev, ...mapped }));
        updateLocalUser(mapped);
      } catch {
        // giữ UI hiện tại
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleChange = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  // ===== Upload avatar =====
  const handlePickAvatar = () => {
    if (!isEditing || uploading) return;
    fileInputRef.current?.click();
  };

  const handleAvatarSelected = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // validate
    const okType = ["image/png", "image/jpeg"].includes(file.type);
    if (!okType) {
      toast.error("Chỉ chấp nhận ảnh .png hoặc .jpg");
      e.target.value = "";
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Kích thước tối đa 2MB");
      e.target.value = "";
      return;
    }

    // preview tạm thời
    const previewUrl = URL.createObjectURL(file);
    setForm((prev) => ({ ...prev, avatar: previewUrl }));

    try {
      setUploading(true);
      const t = getToken();
      if (!t) throw new Error("Bạn cần đăng nhập lại");

      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch(`${API}/users/me/avatar`, {
        method: "POST",
        credentials: "include",
        headers: { Authorization: `Bearer ${t}` },
        body: fd,
      });
      const data = await res.json().catch(() => ({}));

      if (res.status === 401) {
        toast.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
        return;
      }
      if (!res.ok || !data?.avatar_url) {
        throw new Error(data?.message || "Tải ảnh thất bại");
      }

      // cập nhật URL thật từ server
      setForm((prev) => ({ ...prev, avatar: data.avatar_url }));
      updateLocalUser({ anh_dai_dien: data.avatar_url, avatar: data.avatar_url });
      toast.success("Cập nhật ảnh đại diện thành công!");
    } catch (err) {
      toast.error(err.message || "Tải ảnh thất bại");
      // nếu upload lỗi thì không đổi avatar trong UI
      // có thể reload từ localStorage
      try {
        const u = JSON.parse(localStorage.getItem("user") || "{}");
        setForm((prev) => ({ ...prev, avatar: u.anh_dai_dien || u.avatar || "/images/avatar-user.jpg" }));
      } catch {}
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!isEditing) return;

    // Validate
    if (form.phone && !/^\d{10}$/.test(form.phone)) {
      toast.error("Số điện thoại phải gồm đúng 10 chữ số!");
      return;
    }

    try {
      setSaving(true);
      const t = getToken();
      if (!t) throw new Error("Bạn cần đăng nhập lại");

      // Chỉ cho phép cập nhật name, phone (email khóa)
      const payload = {
        ho_ten: form.name || "",
        so_dien_thoai: form.phone || "",
      };

      const res = await fetch(`${API}/users/me`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${t}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Cập nhật thất bại");

      updateLocalUser({
        ho_ten: payload.ho_ten,
        so_dien_thoai: payload.so_dien_thoai,
        name: payload.ho_ten,
        phone: payload.so_dien_thoai,
      });

      toast.success("Đã cập nhật hồ sơ!");
      setIsEditing(false);
    } catch (err) {
      toast.error(err.message || "Cập nhật thất bại");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <h2 className="text-lg font-bold mb-1">Hồ Sơ Của Tôi</h2>
      <p className="text-sm text-gray-600 mb-6">
        Quản lý thông tin hồ sơ để bảo mật tài khoản
      </p>

      <form onSubmit={handleSave} className="space-y-3">
        <div className="grid grid-cols-3 gap-4">
          {/* Form trái */}
          <div className="col-span-2 space-y-3">
            {/* Name */}
            <div className="space-y-1">
              <label className="block text-sm font-medium">Tên</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                disabled={!isEditing}
                className={`w-full border px-3 py-1.5 rounded text-sm ${
                  !isEditing ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
              />
            </div>

            {/* Email (luôn khóa) */}
            <div className="space-y-1">
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                value={form.email}
                disabled
                className="w-full border px-3 py-1.5 rounded text-sm bg-gray-100 cursor-not-allowed"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <label className="block text-sm font-medium">Số điện thoại</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) =>
                  handleChange("phone", e.target.value.replace(/\D/g, ""))
                }
                disabled={!isEditing}
                placeholder="Nhập số điện thoại"
                className={`w-full border px-3 py-1.5 rounded text-sm ${
                  !isEditing ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
              />
              {isEditing && form.phone && form.phone.length !== 10 && (
                <p className="text-xs text-red-500">
                  Số điện thoại phải gồm đúng 10 chữ số
                </p>
              )}
            </div>
          </div>

          {/* Avatar */}
          <div className="flex flex-col items-center space-y-2">
            <div className="relative">
              <img
                src={form.avatar || "/images/avatar-user.jpg"}
                alt="avatar"
                className="w-24 h-24 rounded-full object-cover border"
              />
              {uploading && (
                <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center text-white text-xs">
                  Đang tải...
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg"
              onChange={handleAvatarSelected}
              className="hidden"
            />

            <button
              type="button"
              onClick={handlePickAvatar}
              disabled={!isEditing || uploading}
              className={`border px-3 py-1 text-sm rounded ${
                !isEditing
                  ? "bg-gray-100 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }`}
              title={!isEditing ? "Bật 'Chỉnh sửa thông tin' để đổi ảnh" : "Chọn ảnh (.png/.jpg ≤ 2MB)"}
            >
              Chọn Ảnh
            </button>
            <p className="text-xs text-gray-500 text-center">
              Dung lượng tối đa 2 MB <br /> Định dạng: .JPEG, .PNG
            </p>
          </div>
        </div>

        {/* Nút hành động */}
        <div className="mt-4 flex items-center gap-3">
          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="border px-5 py-1.5 rounded text-sm hover:bg-gray-100"
              disabled={loading}
            >
              Chỉnh sửa thông tin
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-5 py-1.5 rounded text-sm border hover:bg-gray-100"
                disabled={saving || uploading}
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={saving || uploading}
                className="bg-red-500 text-white px-5 py-1.5 rounded text-sm hover:bg-red-400 disabled:opacity-60"
              >
                {saving ? "Đang lưu..." : "Lưu"}
              </button>
            </>
          )}
        </div>
      </form>
    </>
  );
}
