// src/components/users/address.jsx
"use client";
import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import { toast } from "react-hot-toast";

const API =
  (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api").replace(
    /\/$/,
    ""
  );

function getToken() {
  if (typeof window === "undefined") return null;
  const keys = [
    "token",
    "access_token",
    "jwt",
    "authToken",
    "Authorization",
    "authorization",
  ];
  for (const k of keys) {
    let v = localStorage.getItem(k);
    if (!v) continue;
    try {
      const obj = JSON.parse(v);
      for (const kk of ["access_token", "token", "jwt", "value"]) {
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

function getUser() {
  try {
    const u = JSON.parse(localStorage.getItem("user") || "{}");
    return u && typeof u === "object" ? u : null;
  } catch {
    return null;
  }
}

/* ---------- Confirm Dialog (popup nhỏ) ---------- */
function ConfirmDialog({ open, title, message, onCancel, onConfirm }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-sm rounded-xl shadow-2xl p-5">
        <div className="flex items-start justify-between">
          <h3 className="text-base font-semibold text-gray-900">
            {title || "Xác nhận"}
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Đóng"
          >
            <X size={18} />
          </button>
        </div>
        <p className="mt-3 text-sm text-gray-700">{message}</p>
        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded border text-sm hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-600 text-white text-sm hover:bg-red-700"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
}

/* ----------------------- Component chính ----------------------- */
export default function AddressPage() {
  const emptyForm = {
    name: "",
    phone: "",
    city: "",
    ward: "",
    detail: "",
    type: "Nhà Riêng",
    isDefault: false,
  };

  const [addresses, setAddresses] = useState([]);
  const [editId, setEditId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [me, setMe] = useState(null);

  // popup confirm xoá
  const [confirm, setConfirm] = useState({ open: false, addrId: null });

  // lấy user & preset 2 trường (không cho sửa)
  useEffect(() => {
    const u = getUser();
    setMe(u || null);
    setForm((prev) => ({
      ...prev,
      name: u?.name || u?.ho_ten || "",
      phone: u?.phone || u?.so_dien_thoai || "",
    }));
  }, []);

  // demo list hiển thị local
  useEffect(() => {
    const saved = localStorage.getItem("addresses");
    if (saved) setAddresses(JSON.parse(saved));
  }, []);
  const saveAddresses = (list) => {
    setAddresses(list);
    localStorage.setItem("addresses", JSON.stringify(list));
  };

  const handleChange = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  // CREATE -> POST /users/:id/addresses
  async function createAddress() {
    try {
      if (!me?.id && !me?.id_nguoidung) {
        toast.error("Chưa xác định được người dùng");
        return;
      }
      const userId = me.id || me.id_nguoidung;

      const payload = {
        city: (form.city || "").trim(),
        ward: (form.ward || "").trim(),
        detail: (form.detail || "").trim(),
        name: (form.name || "").trim(),
        phone: (form.phone || "").trim(),
        type: form.type || "Nhà Riêng",
        isDefault: !!form.isDefault,
      };

      if (!payload.city || !payload.detail) {
        toast.error("Vui lòng nhập Thành phố và Địa chỉ cụ thể");
        return;
      }

      const token = getToken();
      const res = await fetch(`${API}/users/${userId}/addresses`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        console.error("createAddress failed:", res.status, data);
        toast.error(data?.message || "Thêm địa chỉ thất bại");
        return;
      }

      const mergedText =
        data?.dia_chi ||
        `${payload.detail} - ${
          payload.ward ? `Phường/Xã ${payload.ward} - ` : ""
        }Thành phố/Tỉnh ${payload.city}`;

      // cập nhật danh sách hiển thị local
      const newList = [
        ...addresses.map((a) => ({
          ...a,
          isDefault: payload.isDefault ? false : a.isDefault,
        })),
        {
          id: Date.now(),
          name: payload.name,
          phone: payload.phone,
          city: payload.city,
          ward: payload.ward,
          detail: mergedText,
          type: payload.type,
          isDefault: !!payload.isDefault,
        },
      ];
      saveAddresses(newList);

      // sync user.dia_chi -> localStorage
      try {
        const u = getUser() || {};
        u.dia_chi = mergedText;
        localStorage.setItem("user", JSON.stringify(u));
        window.dispatchEvent(new Event("userUpdated"));
      } catch {}

      toast.success("Cập nhật địa chỉ thành công!");
      setIsModalOpen(false);
      setForm((f) => ({ ...emptyForm, name: f.name, phone: f.phone }));
      setEditId(null);
    } catch (e) {
      console.error(e);
      toast.error("Không thể kết nối đến server");
    }
  }

  // DELETE -> DELETE /users/:id/addresses
  async function deleteAddressOnServer() {
    try {
      if (!me?.id && !me?.id_nguoidung) return false;
      const userId = me.id || me.id_nguoidung;
      const token = getToken();
      const res = await fetch(`${API}/users/${userId}/addresses`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        console.error("deleteAddress failed:", res.status, data);
        toast.error(data?.message || "Xoá địa chỉ thất bại");
        return false;
      }
      // clear user.dia_chi trong localStorage
      try {
        const u = getUser() || {};
        delete u.dia_chi;
        localStorage.setItem("user", JSON.stringify(u));
        window.dispatchEvent(new Event("userUpdated"));
      } catch {}
      return true;
    } catch (e) {
      console.error(e);
      toast.error("Không thể kết nối đến server");
      return false;
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    createAddress();
  };

  // mở popup xác nhận xoá
  function askDelete(addrId) {
    setConfirm({ open: true, addrId });
  }

  // xử lý khi xác nhận trong popup
  async function confirmDelete() {
    const addrId = confirm.addrId;
    setConfirm({ open: false, addrId: null });

    const ok = await deleteAddressOnServer();
    if (!ok) return;

    const newList = addresses.filter((a) => a.id !== addrId);
    saveAddresses(newList);
    toast.success("Xóa địa chỉ thành công!");
  }

  return (
    <div className="bg-white rounded-lg p-6 relative">
      <div className="flex items-center justify-between pb-4 mb-6">
        <h1 className="text-lg font-semibold">Địa chỉ của tôi</h1>
        <button
          onClick={() => {
            setForm((f) => ({
              ...emptyForm,
              name: me?.name || me?.ho_ten || "",
              phone: me?.phone || me?.so_dien_thoai || "",
            }));
            setEditId(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-red-600 text-white text-sm font-medium px-4 py-2 rounded hover:bg-red-700"
        >
          <Plus size={16} /> Thêm địa chỉ mới
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
               strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-gray-300 mb-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.5-7.5 10.5-7.5 10.5S4.5 18 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
          <p>Bạn chưa có địa chỉ.</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {addresses.map((addr) => (
            <li key={addr.id} className="border rounded p-4 flex justify-between items-start">
              <div>
                <p className="font-semibold">
                  {addr.name} - {addr.phone}
                  {addr.isDefault && (
                    <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded">
                      Mặc định
                    </span>
                  )}
                </p>
                <div className="text-gray-600 space-y-1">
                  <p>{addr.detail}</p>
                  <p className="text-xs text-gray-500">Loại: {addr.type}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setForm({
                      name: addr.name,
                      phone: addr.phone,
                      city: addr.city || "",
                      ward: addr.ward || "",
                      detail: "",
                      type: addr.type || "Nhà Riêng",
                      isDefault: !!addr.isDefault,
                    });
                    setEditId(addr.id);
                    setIsModalOpen(true);
                  }}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Cập nhật
                </button>
                <button
                  onClick={() => askDelete(addr.id)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Xóa
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Modal thêm/cập nhật địa chỉ */}
      {isModalOpen && (

        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">

            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
            <h2 className="text-lg font-semibold mb-4">
              {editId ? "Cập nhật địa chỉ" : "Địa chỉ mới"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Input form */}
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Họ và tên"
                  value={form.name}
                  disabled
                  className="border rounded px-3 py-2 text-sm bg-gray-100 cursor-not-allowed"
                />
                <input
                  type="text"
                  placeholder="Số điện thoại"
                  value={form.phone}
                  disabled
                  className="border rounded px-3 py-2 text-sm bg-gray-100 cursor-not-allowed"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Thành phố"
                  value={form.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  className="border rounded px-3 py-2 text-sm"
                />
                <input
                  type="text"
                  placeholder="Phường/Xã"
                  value={form.ward}
                  onChange={(e) => handleChange("ward", e.target.value)}
                  className="border rounded px-3 py-2 text-sm"
                />
              </div>

              <input
                type="text"
                placeholder="Địa chỉ cụ thể"
                value={form.detail}
                onChange={(e) => handleChange("detail", e.target.value)}
                className="border rounded px-3 py-2 text-sm w-full"
              />

              {/* Radio chọn */}
              <div className="flex gap-4">
                {["Nhà Riêng", "Văn Phòng"].map((t) => (
                  <label key={t} className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="type"
                      value={t}
                      checked={form.type === t}
                      onChange={() => handleChange("type", t)}
                    />
                    {t}
                  </label>
                ))}
              </div>

              {/* Checkbox */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={form.isDefault}
                  onChange={(e) => handleChange("isDefault", e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor="isDefault" className="text-sm text-gray-700">
                  Đặt làm địa chỉ mặc định
                </label>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded text-sm"
                >
                  Trở lại
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                >
                  Hoàn thành
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Popup xác nhận xoá */}
      <ConfirmDialog
        open={confirm.open}
        title="Xóa địa chỉ"
        message="Bạn muốn xóa địa chỉ này?"
        onCancel={() => setConfirm({ open: false, addrId: null })}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
