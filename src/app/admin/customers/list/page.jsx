"use client";
import { useState, useEffect } from "react";
import CustomerDetailModal from "@/components/admin/customers/CustomerDetailModal";
import AdminAuthModal from "@/components/admin/customers/AdminAuthModal";
import ConfirmModal from "@/components/common/ConfirmModal";
import toast from "react-hot-toast";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function CustomerListPage() {
  const [customers, setCustomers] = useState([]);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showAuth, setShowAuth] = useState(false);

  // confirm modal
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState(() => async () => {});
  const [confirmSuccessMsg, setConfirmSuccessMsg] = useState("Thao tác thành công");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API}/users/customers`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Không lấy được khách hàng");

        const mapped = data.map((c) => ({
          id: c.id_nguoidung,
          name: c.ho_ten,
          phone: c.so_dien_thoai,
          email: c.email,
          address: c.dia_chi || "Chưa cập nhật",
          status: c.trang_thai === 1 ? "Đang hoạt động" : "Đã ngưng hoạt động",
          group: "Thường",
          avatar: "https://randomuser.me/api/portraits/lego/2.jpg",
        }));
        setCustomers(mapped);
      } catch (err) {
        toast.error(err.message);
      }
    };
    fetchCustomers();
  }, []);

  // mask helpers
  const maskPhone = (phone) =>
    !phone ? "" : phone.slice(0, -3).replace(/./g, "*") + phone.slice(-3);
  const maskEmail = (email) => {
    if (!email) return "";
    const [name, domain] = email.split("@");
    return name[0] + "*".repeat(Math.max(0, name.length - 1)) + "@" + domain;
  };
  const maskAddress = (address) => (!address ? "" : "*".repeat(address.length));

  // API helpers
  const lockUser = async (id) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API}/users/${id}/lock`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Khóa tài khoản thất bại");
    return data;
  };

  const unlockUser = async (id) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API}/users/${id}/unlock`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Mở khóa tài khoản thất bại");
    return data;
  };

  // state update after actions
  const onLock = async (id) => {
    await lockUser(id);
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "Đã ngưng hoạt động" } : c))
    );
  };

  const onUnlock = async (id) => {
    await unlockUser(id);
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "Đang hoạt động" } : c))
    );
  };

  // open confirm
  const askConfirm = (message, action, successMsg) => {
    setConfirmMessage(message);
    setConfirmAction(() => action);            // action phải là async
    setConfirmSuccessMsg(successMsg || "Thao tác thành công");
    setConfirmOpen(true);
  };

  return (
    <div>
      <h1 className="mb-5 text-2xl font-bold text-gray-800">Danh sách khách hàng</h1>

      <div className="bg-white rounded-xl text-gray-800 shadow">
        <table className="min-w-full">
          <thead>
            <tr className="text-left font-bold text-gray-800 border-b">
              <th className="p-2">#</th>
              <th className="p-2">Tên khách</th>
              <th className="p-2">SĐT</th>
              <th className="p-2">Email</th>
              <th className="p-2">Địa chỉ</th>
              <th className="p-2">Nhóm</th>
              <th className="p-2">Trạng thái</th>
              <th className="p-2 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c, idx) => (
              <tr key={c.id} className="hover:bg-violet-50 transition duration-100">
                <td className="p-2">{idx + 1}</td>
                <td className="p-2 font-semibold flex items-center gap-2">
                  <img
                    src={c.avatar || "https://randomuser.me/api/portraits/lego/2.jpg"}
                    alt={c.name}
                    className="w-8 h-8 rounded-full border"
                  />
                  {c.name}
                </td>
                <td className="p-2">{maskPhone(c.phone)}</td>
                <td className="p-2">{maskEmail(c.email)}</td>
                <td className="p-2">{maskAddress(c.address)}</td>
                <td className="p-2">{c.group}</td>
                <td className="p-2">
                  <span
                    className={
                      c.status === "Đang hoạt động"
                        ? "text-green-600 font-medium"
                        : "text-orange-600 font-medium"
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
                      setShowAuth(true);
                    }}
                  >
                    Xem
                  </button>

                  {c.status === "Đang hoạt động" ? (
                    <button
                      className="ml-2 text-pink-500 hover:underline font-medium"
                      onClick={() =>
                        askConfirm(
                          `Bạn muốn khóa tài khoản "${c.name}"?`,
                          async () => await onLock(c.id),
                          "🚫 Đã khóa tài khoản"
                        )
                      }
                    >
                      Khóa
                    </button>
                  ) : (
                    <button
                      className="ml-2 text-green-600 hover:underline font-medium"
                      onClick={() =>
                        askConfirm(
                          `Bạn muốn mở khóa tài khoản "${c.name}"?`,
                          async () => await onUnlock(c.id),
                          "✅ Đã mở khóa tài khoản"
                        )
                      }
                    >
                      Mở khóa
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal chi tiết KH */}
      {showDetail && selectedCustomer && (
        <CustomerDetailModal
          customer={selectedCustomer}
          onClose={() => setShowDetail(false)}
        />
      )}

      {/* Modal xác thực admin — đặt ngoài map để không render nhiều lần */}
      <AdminAuthModal
        open={showAuth}
        onClose={() => setShowAuth(false)}
        onSuccess={() => setShowDetail(true)}
      />

      {/* Modal xác nhận */}
      <ConfirmModal
        open={confirmOpen}
        message={confirmMessage}
        successMessage={confirmSuccessMsg}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={confirmAction}
      />
    </div>
  );
}
