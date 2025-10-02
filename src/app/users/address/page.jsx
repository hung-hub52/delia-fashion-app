// src/app/users/address/page.jsx
"use client";
import { Plus } from "lucide-react";

export default function AddressPage() {
  return (
    <div className="bg-white border rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4 mb-6">
        <h1 className="text-lg font-semibold">Địa chỉ của tôi</h1>
        <button className="flex items-center gap-2 bg-red-600 text-white text-sm font-medium px-4 py-2 rounded hover:bg-red-700">
          <Plus size={16} /> Thêm địa chỉ mới
        </button>
      </div>

      {/* Empty state */}
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
    </div>
  );
}
