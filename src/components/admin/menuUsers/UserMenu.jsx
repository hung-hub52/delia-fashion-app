"use client";
import { useState, useRef, useEffect } from "react";
import { LogOut, Key, History, Edit3 } from "lucide-react";
import ProfileModal from "./ProfileModal";
import ActivityList from "./ActivityList";
import ChangePasswordModal from "./ChangePasswordModal";

// (Demo) User fake, thực tế lấy từ context/api truyền props vô là xong!
const mockUser = {
  name: "Nguyễn Văn Admin",
  email: "admin@gmail.com",
  role: "Admin",
  avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  phone: "0987 654 321",
  address: "123 Đường Thời Trang, Quận 1, TP.HCM",
  password: "1234567890", // Chỉ hiển thị kiểu mask
  activities: [
    { time: "2 phút trước", action: "Đăng nhập hệ thống" },
    { time: "10 phút trước", action: "Sửa sản phẩm 'Áo thun Delia'" },
    { time: "1 giờ trước", action: "Tạo đơn hàng mới" },
  ],
};

export default function UserMenu() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("info");
  const ref = useRef();
  const [user, setUser] = useState(mockUser);
  const [showProfileDetail, setShowProfileDetail] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState(user.avatar);
  const fileInputRef = useRef();
  const [showChangePassword, setShowChangePassword] = useState(false);

  // Xử lý đổi avatar
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (ev) => setPreviewAvatar(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  // Hàm lưu avatar mới (thực tế: call API upload & update)
  const handleSaveAvatar = () => {
    // Ở đây chỉ update local preview (demo)
    user.avatar = previewAvatar;
    setShowProfileDetail(false);
    // Có thể gọi API backend để cập nhật thật ở đây!
  };

  // Đóng popup khi click ra ngoài
  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    if (open) window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Đổi mật khẩu/modal demo
  const handlePasswordChange = async (newPass) => {
    // Ở đây update local, sau này gắn API thì đổi đoạn này thôi!
    setUser({ ...user, password: newPass });
    // toast.success("Đổi mật khẩu thành công!"); // Nếu dùng react-hot-toast
  };

  // Đăng xuất/modal demo
  const handleLogout = () => {
    alert("Đã đăng xuất (chỗ này redirect hoặc xóa token tuỳ bạn)!");
  };

  return (
    <div className="relative" ref={ref}>
      {/* Nút avatar + tên (hover rung lắc + glow) */}
      <button
        className="flex items-center gap-2 focus:outline-none group"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="font-medium text-gray-800">
          Xin chào, <span className="font-bold">Admin</span>
        </span>
        <span className="relative flex items-center">
          <img
            src={user.avatar}
            alt="avatar"
            className="w-10 h-10 rounded-full border-2 border-white shadow-md object-cover
          group-hover:animate-wiggle
          ring-2 ring-violet-300/70 group-hover:ring-4 group-hover:ring-pink-400/80
          transition-all duration-300"
          />
          {/* Glow hiệu ứng */}
          <span className="absolute inset-0 rounded-full blur-[6px] bg-pink-400/30 opacity-60 group-hover:scale-110 group-hover:opacity-90 transition-all duration-300 pointer-events-none"></span>
        </span>
      </button>

      {/* Popup Account Info */}
      {open && (
        <div
          className="absolute right-0 mt-3 w-80 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl shadow-2xl p-6 z-50 animate-fade-in-up"
          style={{ minWidth: 320 }}
        >
          {/* Tabs */}
          <div className="flex gap-2 mb-5 border-b border-violet-100 dark:border-violet-800 pb-2">
            <button
              className={`px-3 py-1 rounded-lg text-sm font-semibold transition-all duration-200 ${
                tab === "info"
                  ? "bg-violet-600 text-white shadow"
                  : "text-violet-700 dark:text-violet-200 hover:bg-violet-100 dark:hover:bg-violet-800"
              }`}
              onClick={() => setTab("info")}
            >
              <Edit3 className="inline mr-1" size={16} /> Thông tin
            </button>
            <button
              className={`px-3 py-1 rounded-lg text-sm font-semibold transition-all duration-200 ${
                tab === "history"
                  ? "bg-pink-600 text-white shadow"
                  : "text-pink-700 dark:text-pink-200 hover:bg-pink-100 dark:hover:bg-pink-800"
              }`}
              onClick={() => setTab("history")}
            >
              <History className="inline mr-1" size={16} /> Lịch sử
            </button>
          </div>

          {tab === "info" && (
            <>
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={user.avatar}
                  alt="avatar"
                  className="w-16 h-16 rounded-full border-4 border-violet-400 shadow"
                />
                <div>
                  <div
                    className="text-lg font-bold text-gray-800 dark:text-gray-100 cursor-pointer hover:underline"
                    onClick={() => setShowProfileDetail(true)}
                    title="Xem chi tiết tài khoản"
                  >
                    {user.name}
                  </div>
                  <div className="text-sm text-gray-400">{user.email}</div>
                  <span className="inline-block bg-violet-100 text-violet-700 dark:bg-violet-700 dark:text-white px-3 py-0.5 rounded-full text-xs mt-1">
                    {user.role}
                  </span>
                </div>
              </div>
              <div className="space-y-2 mt-3">
                <button
                  className="w-full py-2 px-4 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                  onClick={() => setShowChangePassword(true)}
                >
                  <Key size={18} /> Đổi mật khẩu
                </button>

                <button
                  className="w-full py-2 px-4 bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded-xl font-semibold text-gray-700 dark:text-gray-200 transition-all flex items-center justify-center gap-2"
                  onClick={handleLogout}
                >
                  <LogOut size={18} /> Đăng xuất
                </button>
              </div>
            </>
          )}
          {/* Tab lịch sử hoạt động dùng ActivityList */}
          {tab === "history" && <ActivityList activities={user.activities} />}
        </div>
      )}

      {/* Modal thông tin tài khoản */}
      <ProfileModal
        open={showProfileDetail}
        onClose={() => setShowProfileDetail(false)}
        user={user}
        previewAvatar={previewAvatar}
        fileInputRef={fileInputRef}
        handleAvatarChange={handleAvatarChange}
        handleSaveAvatar={handleSaveAvatar}
      />

      <ChangePasswordModal
        open={showChangePassword}
        onClose={() => setShowChangePassword(false)}
        onChangePassword={handlePasswordChange}
        user={user}
      />

      {/* Animation Keyframes (wiggle + fade) */}
      <style>{`
        .animate-fade-in-up {
          animation: fadeInUp 0.24s cubic-bezier(.45,1.35,.32,1) both;
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(20px);}
          100% { opacity: 1; transform: translateY(0);}
        }
        .animate-wiggle {
          animation: wiggle 0.5s ease-in-out;
        }
        @keyframes wiggle {
          0% { transform: rotate(-8deg) scale(0.96);}
          15% { transform: rotate(7deg) scale(1.08);}
          35% { transform: rotate(-5deg);}
          60% { transform: rotate(3deg);}
          80% { transform: rotate(-2deg);}
          100% { transform: rotate(0) scale(1);}
        }
      `}</style>
    </div>
  );
}
