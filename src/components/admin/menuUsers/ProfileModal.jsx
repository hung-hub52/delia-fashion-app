import { useState } from "react";
import AvatarUpload from "./AvatarUpload";
import { X, Pencil, Eye, EyeOff } from "lucide-react";

export default function ProfileModal({
  open,
  onClose,
  user,
  previewAvatar,
  fileInputRef,
  handleAvatarChange,
  handleSaveAvatar,
}) {
  // === State chỉnh sửa ===
  const [editingField, setEditingField] = useState(null); // 'name', 'phone', 'email', 'address'
  const [editValues, setEditValues] = useState({
    name: user.name,
    phone: user.phone,
    email: user.email,
    address: user.address,
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleFieldChange = (field, value) => {
    setEditValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditClick = (field) => setEditingField(field);

  const handleSaveEdit = (field) => {
    // Gọi API lưu nếu cần
    setEditingField(null);
    // Có thể merge lên backend nếu muốn
  };

  // Xử lý Enter khi edit (tối ưu UX)
  const handleKeyDown = (e, field) => {
    if (e.key === "Enter") {
      handleSaveEdit(field);
    }
  };

  if (!open) return null;


  return (
    <div className="fixed inset-0 z-[999] bg-black/40 flex items-center justify-center">
      <div className="bg-white dark:bg-neutral-900 p-8 rounded-2xl shadow-2xl border border-violet-200 dark:border-violet-800 min-w-[340px] max-w-[90vw] relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 rounded-full bg-gray-100 dark:bg-neutral-800 hover:bg-violet-700"
          title="Đóng"
        >
          <span className="font-bold text-xl text-gray-600 dark:text-gray-300">
            ×
          </span>
        </button>

        {/* Avatar */}
        <AvatarUpload
          previewAvatar={previewAvatar}
          fileInputRef={fileInputRef}
          handleAvatarChange={handleAvatarChange}
        />

        {/* Họ tên + vai trò */}
        <div className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-1 text-center">
          {editValues.name}
        </div>
        <div className="flex justify-center mb-4">
          <span className="inline-block bg-violet-100 text-violet-700 dark:bg-violet-700 dark:text-white px-3 py-0.5 rounded-full text-xs">
            {user.role}
          </span>
        </div>

        {/* Các trường thông tin */}
        <div className="space-y-3 text-gray-700 dark:text-gray-200 text-[15px] my-4">

          {/* Họ tên */}
          <div className="flex items-center">
            <b>Họ tên:</b>
            {editingField === "name" ? (
              <input
                className="ml-2 border px-2 py-1 rounded"
                value={editValues.name}
                onChange={(e) => handleFieldChange("name", e.target.value)}
                onBlur={() => handleSaveEdit("name")}
                onKeyDown={(e) => handleKeyDown(e, "name")}
                autoFocus
              />
            ) : (
              <>
                <span className="ml-2">{editValues.name}</span>
                <button
                  type="button"
                  className="ml-1 p-1 hover:bg-violet-500 rounded"
                  onClick={() => handleEditClick("name")}
                  title="Chỉnh sửa"
                >
                  <Pencil size={16} className="text-white" />
                </button>
              </>
            )}
          </div>

          {/* Số điện thoại */}
          <div className="flex items-center">
            <b>Số điện thoại:</b>
            {editingField === "phone" ? (
              <input
                className="ml-2 border px-2 py-1 rounded"
                value={editValues.phone}
                onChange={(e) => handleFieldChange("phone", e.target.value)}
                onBlur={() => handleSaveEdit("phone")}
                onKeyDown={(e) => handleKeyDown(e, "phone")}
                autoFocus
              />
            ) : (
              <>
                <span className="ml-2">{editValues.phone}</span>
                <button
                  type="button"
                  className="ml-1 p-1 hover:bg-violet-500 rounded"
                  onClick={() => handleEditClick("phone")}
                  title="Chỉnh sửa"
                >
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
                onBlur={() => handleSaveEdit("email")}
                onKeyDown={(e) => handleKeyDown(e, "email")}
                autoFocus
              />
            ) : (
              <>
                <span className="ml-2">{editValues.email}</span>
                <button
                  type="button"
                  className="ml-1 p-1 hover:bg-violet-500 rounded"
                  onClick={() => handleEditClick("email")}
                  title="Chỉnh sửa"
                >
                  <Pencil size={16} className="text-white" />
                </button>
              </>
            )}
          </div>

          {/* Mật khẩu */}
          <div className="flex items-center">
            <b>Mật khẩu:</b>
            <span className="ml-2 tracking-widest">
              {showPassword ? user.password : "**********"}
            </span>
            <button
              type="button"
              className="ml-1 p-1 hover:bg-violet-500 rounded"
              onClick={() => setShowPassword((v) => !v)}
              title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              {showPassword ? (
                <EyeOff size={17} className="text-white" />
              ) : (
                <Eye size={17} className="text-white" />
              )}
            </button>
          </div>

          {/* Địa chỉ */}
          <div className="flex items-center">
            <b>Địa chỉ:</b>
            {editingField === "address" ? (
              <input
                className="ml-2 border px-2 py-1 rounded "
                value={editValues.address}
                onChange={(e) => handleFieldChange("address", e.target.value)}
                onBlur={() => handleSaveEdit("address")}
                onKeyDown={(e) => handleKeyDown(e, "address")}
                autoFocus
              />
            ) : (
              <>
                <span className="ml-2">{editValues.address}</span>
                <button
                  type="button"
                  className="ml-1 p-1 hover:bg-violet-500 rounded"
                  onClick={() => handleEditClick("address")}
                  title="Chỉnh sửa"
                >
                  <Pencil size={16} className="text-white" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Nút lưu avatar */}
        <div className="flex justify-end mt-6">
          <button
            className="px-5 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700 font-semibold transition"
            onClick={handleSaveAvatar}
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
}
