// src/components/admin/menuUsers/AvatarUpload.jsx
import { Camera } from "lucide-react";

export default function AvatarUpload({ previewAvatar, fileInputRef, handleAvatarChange }) {
  return (
    <div className="flex flex-col items-center mb-4 relative">
      <img
        src={previewAvatar || "https://ui-avatars.com/api/?name=Admin&background=7367F0&color=fff"}
        alt="avatar"
        className="w-20 h-20 rounded-full border-4 border-violet-400 shadow mb-2 object-cover"
      />
      <button
        type="button"
        className="absolute bottom-4 right-[90px] bg-white dark:bg-violet-800 rounded-full border border-violet-300 dark:border-violet-600 p-2 shadow-lg hover:bg-violet-100 dark:hover:bg-violet-700 transition"
        onClick={() => fileInputRef.current?.click()}
        title="Đổi ảnh đại diện"
      >
        <Camera size={18} className="text-violet-700 dark:text-white" />
      </button>
      <input
        type="file"
        accept="image/png,image/jpeg"
        className="hidden"
        ref={fileInputRef}
        onChange={handleAvatarChange}
      />
    </div>
  );
}
