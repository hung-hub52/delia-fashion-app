// src/components/users/address.jsx địa chỉ 
"use client";
import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";

export default function AddressPage() {
  // form rỗng chuẩn
  const emptyForm = {
    name: "",
    phone: "",
    city: "",
    ward: "",
    detail: "",
    type: "",
    isDefault: false,
  };

  const [addresses, setAddresses] = useState([]);
  const [editId, setEditId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  // Load từ localStorage
  useEffect(() => {
    const saved = localStorage.getItem("addresses");
    if (saved) setAddresses(JSON.parse(saved));
  }, []);

  // Save vào localStorage
  const saveAddresses = (newList) => {
    setAddresses(newList);
    localStorage.setItem("addresses", JSON.stringify(newList));
  };

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.city || !form.detail) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    let newList = [...addresses];

    if (editId) {
      // cập nhật
      newList = newList.map((a) =>
        a.id === editId ? { ...form, id: editId } : a
      );
    } else {
      // thêm mới
      if (form.isDefault) {
        newList = newList.map((a) => ({ ...a, isDefault: false }));
      }
      newList.push({ ...form, id: Date.now() });
    }

    saveAddresses(newList);
    setIsModalOpen(false);
    setForm(emptyForm); // reset
    setEditId(null);
  };

  return (
    <div className="bg-white rounded-lg p-6 relative">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-6">
        <h1 className="text-lg font-semibold">Địa chỉ của tôi</h1>
        <button
          onClick={() => {
            setForm(emptyForm);
            setEditId(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-red-600 text-white text-sm font-medium px-4 py-2 rounded hover:bg-red-700"
        >
          <Plus size={16} /> Thêm địa chỉ mới
        </button>
      </div>

      {/* Nếu chưa có địa chỉ */}
      {addresses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-16 h-16 text-gray-300 mb-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 10.5c0 7.5-7.5 10.5-7.5 10.5S4.5 18 4.5 10.5a7.5 7.5 0 1115 0z"
            />
          </svg>
          <p>Bạn chưa có địa chỉ.</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {addresses.map((addr) => (
            <li
              key={addr.id}
              className="border rounded p-4 flex justify-between items-start"
            >
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
                  <p>
                    {addr.ward && `Phường ${addr.ward}, `}TP. {addr.city}
                  </p>
                  <p className="text-xs text-gray-500">Loại: {addr.type}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setForm({ ...emptyForm, ...addr }); // merge
                    setEditId(addr.id);
                    setIsModalOpen(true);
                  }}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Cập nhật
                </button>
                <button
                  onClick={() =>
                    saveAddresses(addresses.filter((a) => a.id !== addr.id))
                  }
                  className="text-sm text-red-600 hover:underline"
                >
                  Xóa
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Modal popup */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6 relative">
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
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Họ và tên"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="border rounded px-3 py-2 text-sm"
                />
                <input
                  type="text"
                  placeholder="Số điện thoại"
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="border rounded px-3 py-2 text-sm"
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
    </div>
  );
}
