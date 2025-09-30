// src/components/users/Profile hồ sơ cá nhân

"use client";
import { useState, useEffect } from "react";

export default function Profile() {
  const [form, setForm] = useState({
    username: "nmzmc1r3h2",
    name: "Hung",
    email: "namnguyen@gmail.com",
    phone: "",
    gender: "",
    birthday: { day: "", month: "", year: "" },
  });

  // State kiểm soát đổi username
  const [editState, setEditState] = useState({
    count: 0,
    lastChanged: null,
    lockedUntil: null,
  });

  // Load editState từ localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("usernameEditState");
      if (saved) setEditState(JSON.parse(saved));
    }
  }, []);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleBirthdayChange = (field, value) => {
    setForm({
      ...form,
      birthday: { ...form.birthday, [field]: value },
    });
  };

  // Xử lý đổi username
  const handleUsernameChange = (value) => {
    const now = new Date();
    let updated = { ...editState };

    // Reset số lần nếu qua ngày mới
    if (
      updated.lastChanged &&
      new Date(updated.lastChanged).toDateString() !== now.toDateString()
    ) {
      updated.count = 0;
    }

    // Nếu đã quá 3 lần → khóa 3 ngày
    if (updated.count >= 3) {
      updated.lockedUntil = new Date(
        now.getTime() + 3 * 24 * 60 * 60 * 1000
      ).toISOString();
      setEditState(updated);
      localStorage.setItem("usernameEditState", JSON.stringify(updated));
      return;
    }

    // Cập nhật username
    setForm({ ...form, username: value });

    // Tăng số lần đổi
    updated.count += 1;
    updated.lastChanged = now.toISOString();

    setEditState(updated);
    localStorage.setItem("usernameEditState", JSON.stringify(updated));
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (form.phone && form.phone.length !== 10) {
      alert("Số điện thoại phải gồm đúng 10 chữ số!");
      return;
    }

    alert("Đã lưu thông tin hồ sơ!");
    console.log(form);
  };

  const isLocked =
    editState.lockedUntil && new Date(editState.lockedUntil) > new Date();

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
            {/* Username */}
            <div className="space-y-1">
              <label className="block text-sm font-medium">Tên đăng nhập</label>
              <input
                type="text"
                value={form.username}
                onChange={(e) => handleUsernameChange(e.target.value)}
                disabled={isLocked}
                className={`w-full border px-3 py-1.5 rounded text-sm ${
                  isLocked ? "bg-gray-100" : ""
                }`}
              />
              {isLocked ? (
                <p className="text-xs text-red-500">
                  Bạn đã hết lượt đổi trong hôm nay, vui lòng đợi 3 ngày sau
                </p>
              ) : (
                <p className="text-xs text-gray-500">
                  Bạn chỉ có thể đổi tối đa 3 lần/ngày.
                </p>
              )}
            </div>

            {/* Name */}
            <div className="space-y-1">
              <label className="block text-sm font-medium">Tên</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full border px-3 py-1.5 rounded text-sm"
              />
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full border px-3 py-1.5 rounded text-sm"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <label className="block text-sm font-medium">Số điện thoại</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => {
                  const onlyNums = e.target.value.replace(/\D/g, "");
                  setForm({ ...form, phone: onlyNums });
                }}
                placeholder="Nhập số điện thoại"
                className="w-full border px-3 py-1.5 rounded text-sm"
              />
              {form.phone && form.phone.length !== 10 && (
                <p className="text-xs text-red-500">
                  Số điện thoại phải gồm đúng 10 chữ số
                </p>
              )}
            </div>
          </div>

          {/* Avatar */}
          <div className="flex flex-col items-center space-y-2">
            <img
              src="/images/avatar-user.jpg"
              alt="avatar"
              className="w-24 h-24 rounded-full object-cover"
            />
            <button
              type="button"
              className="border px-3 py-1 text-sm rounded hover:bg-gray-100"
            >
              Chọn Ảnh
            </button>
            <p className="text-xs text-gray-500 text-center">
              Dung lượng file tối đa 1 MB <br /> Định dạng: .JPEG, .PNG
            </p>
          </div>
        </div>

        {/* Gender + Year of birth */}
        <div className="flex items-center gap-56">
          {/* Gender */}
          <div className="flex flex-col gap-2">
            <label className="block text-sm font-medium mb-1">Giới tính</label>
            <div className="flex gap-4">
              {["Nam", "Nữ", "Khác"].map((g) => (
                <label key={g} className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="gender"
                    checked={form.gender === g}
                    onChange={() => handleChange("gender", g)}
                  />
                  {g}
                </label>
              ))}
            </div>
          </div>

          {/* Year */}
          <div className="flex flex-col gap-2">
            <label className="block text-sm font-medium">Năm sinh</label>
            <select
              value={form.birthday.year}
              onChange={(e) => handleBirthdayChange("year", e.target.value)}
              className="border rounded px-2 py-1"
            >
              <option value="">Chọn năm</option>
              {Array.from({ length: 60 }, (_, i) => 1965 + i).map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4">
          <button
            type="submit"
            className="bg-red-500 text-white px-5 py-1.5 rounded text-sm hover:bg-red-400"
          >
            Lưu
          </button>
        </div>
      </form>
    </>
  );
}
