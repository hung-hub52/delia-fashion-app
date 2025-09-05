"use client";
import { useState } from "react";
import CustomerDetailModal from "@/components/admin/customers/CustomerDetailModal";

const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

export default function CustomerListPage() {
  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: "Nguyễn Văn A",
      phone: "0987654321",
      group: "VIP",
      status: "Đang hoạt động",
      address: "123 Đường ABC, Quận 1, TP.HCM",
      email: "a.nguyen@example.com",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    {
      id: 2,
      name: "Lê Thị B",
      phone: "0912345678",
      group: "Thường",
      status: "Đang hoạt động",
      address: "123 Đường Số 1, Quận 5, TP.HCM",
      email: "b.le@example.com",
      avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    },
  ]);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Hàm xử lý khóa/mở lại
  const handleToggleLockCustomer = (id) => {
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        // Đang hoạt động -> Khóa
        if (c.status === "Đang hoạt động") {
          return { ...c, status: "Đã ngưng hoạt động", lockedAt: Date.now() };
        }
        // Đã ngưng hoạt động và dưới 30 ngày => Mở lại
        if (
          c.status === "Đã ngưng hoạt động" &&
          c.lockedAt &&
          Date.now() - c.lockedAt < THIRTY_DAYS
        ) {
          return { ...c, status: "Đang hoạt động", lockedAt: null };
        }
        // Đã ngưng hoạt động đủ 30 ngày => chuyển Ngừng sử dụng
        if (
          c.status === "Đã ngưng hoạt động" &&
          c.lockedAt &&
          Date.now() - c.lockedAt >= THIRTY_DAYS
        ) {
          return { ...c, status: "Ngừng sử dụng" };
        }
        return c;
      })
    );
  };

  // Hàm kiểm tra đã đủ 30 ngày chưa
  const isEnough30Days = (c) =>
    c.status === "Đã ngưng hoạt động" &&
    c.lockedAt &&
    Date.now() - c.lockedAt >= THIRTY_DAYS;

  return (
    <div>
      <h1 className="mb-5 text-2xl font-bold text-gray-800">
        Danh sách khách hàng
      </h1>
      <div className="bg-white rounded-xl text-gray-800">
        <table className="min-w-full">
          <thead>
            <tr className="text-left font-bold text-gray-800 border-b">
              <th className="p-2">#</th>
              <th className="p-2">Tên khách</th>
              <th className="p-2">SĐT</th>
              <th className="p-2">Email</th>
              <th className="p-2">Địa chỉ</th>
              <th className="p-2">Trạng thái</th>
              <th className="p-2 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c, idx) => {
              // Nếu đã ngưng hoạt động và đủ 30 ngày thì tự động set status
              if (isEnough30Days(c) && c.status !== "Ngừng sử dụng") {
                setTimeout(() => {
                  setCustomers((prev) =>
                    prev.map((x) =>
                      x.id === c.id ? { ...x, status: "Ngừng sử dụng" } : x
                    )
                  );
                }, 500); // Cho phép re-render sau 0.5s để tránh setState trong render
              }
              return (
                <tr
                  key={c.id}
                  className=" hover:bg-violet-50 transition duration-100"
                >
                  <td className="p-2">{idx + 1}</td>
                  <td className="p-2 font-semibold">{c.name}</td>
                  <td className="p-2">{c.phone}</td>
                  <td className="p-2">{c.email}</td>
                  <td className="p-2">{c.address}</td>
                  <td className="p-2">
                    <span
                      className={
                        c.status === "Đang hoạt động"
                          ? "text-green-600 font-medium"
                          : c.status === "Đã ngưng hoạt động"
                          ? "text-orange-600 font-medium"
                          : "text-gray-400 font-medium"
                      }
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="p-2 text-center">
                    <button
                      className="text-blue-600 hover:underline font-medium"
                      onClick={() => {
                        setSelectedCustomer(c);
                        setShowDetail(true);
                      }}
                    >
                      Xem
                    </button>
                    {/* Hiện nút Khóa nếu đang hoạt động */}
                    {c.status === "Đang hoạt động" && (
                      <button
                        className="ml-2 text-pink-500 hover:underline font-medium"
                        onClick={() => handleToggleLockCustomer(c.id)}
                      >
                        Khóa
                      </button>
                    )}
                    {/* Hiện nút Mở lại nếu đã ngưng hoạt động và chưa đủ 30 ngày */}
                    {c.status === "Đã ngưng hoạt động" &&
                      c.lockedAt &&
                      Date.now() - c.lockedAt < THIRTY_DAYS && (
                        <button
                          className="ml-2 text-green-600 hover:underline font-medium"
                          onClick={() => handleToggleLockCustomer(c.id)}
                        >
                          Mở lại
                        </button>
                      )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {showDetail && selectedCustomer && (
        <CustomerDetailModal
          customer={selectedCustomer}
          onClose={() => setShowDetail(false)}
        />
      )}
    </div>
  );
}
