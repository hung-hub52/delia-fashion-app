import { X } from "lucide-react";

export default function CustomerDetailModal({ customer, onClose }) {
  if (!customer) return null;

  return (
    <div className="fixed inset-0 bg-black/30 z-[999] flex items-center justify-center">
      <div className="bg-white dark:bg-neutral-500 rounded-2xl shadow-xl p-8 min-w-[340px] max-w-[90vw] relative">
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 rounded-full  hover:bg-violet-400"
        >
          <X size={20} />
        </button>
        {/* Avatar */}
        <div className="flex flex-col items-center mb-4">
          <img
            src={customer.avatar || "/default-avatar.png"}
            alt="avatar"
            className="w-20 h-20 rounded-full border-4 border-violet-400 shadow mb-2 object-cover"
          />
        </div>
        {/* Thông tin khách hàng */}
        <div className="space-y-2 text-[15px]">
          <div>
            <b>Tên:</b> {customer.name}
          </div>
          <div>
            <b>SĐT:</b> {customer.phone}
          </div>
          <div>
            <b>Email:</b> {customer.email}
          </div>
          <div>
            <b>Địa chỉ:</b> {customer.address}
          </div>
          <div>
            <b>Mật khẩu:</b>{" "}
            <span className="tracking-widest">
              {customer.password || "******"}
            </span>
          </div>
          <div>
            <b>Phân Loại:</b>{" "}
            <span
              className={
                customer.group === "VIP"
                  ? "bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full"
                  : "bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full"
              }
            >
              {customer.group}
            </span>
          </div>
          <div>
            <b>Trạng thái:</b>{" "}
            <span
              className={
                customer.status === "Đang hoạt động"
                  ? "text-green-600"
                  : "text-gray-400"
              }
            >
              {customer.status}
            </span>
          </div>
        </div>
        {/* Lịch sử mua hàng */}
        <div className="mt-4">
          <b>Lịch sử mua hàng:</b>
          <ul className="list-disc pl-5 mt-2 text-[15px]">
            {(customer.history || []).length === 0 ? (
              <li>Chưa có dữ liệu</li>
            ) : (
              customer.history.map((h, idx) => <li key={idx}>{h}</li>)
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
