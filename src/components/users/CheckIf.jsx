//src/components/users/CheckIf.jsx

"use client";

export default function CheckIf({ onClose }) {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="font-semibold text-lg mb-4 text-red-600">
          📌 Điều kiện mã giảm giá
        </h2>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>🟢 Fennik: Freeship toàn bộ đơn hàng</li>
          <li>🟡 Veera: Đơn &lt; 200k → giảm 50k & giảm 35k phí vận chuyển</li>
          <li>🔵 Yorn: Đơn ≥ 300k → giảm 200k & giảm 35k phí vận chuyển</li>
          <li>🟣 Alice: Đơn ≥ 500k → giảm 400k & giảm 35k phí vận chuyển</li>
          <li>🔴 Qi: Đơn ≥ 1 triệu → giảm 800k & miễn phí vận chuyển</li>
        </ul>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
