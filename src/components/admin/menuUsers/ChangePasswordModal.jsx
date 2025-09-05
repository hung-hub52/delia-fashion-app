import { useState } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";


export default function ChangePasswordModal({
  open,
  onClose,
  onChangePassword,
  user,
}) {
  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!current || !newPass || !confirm) {
      setError("Vui lòng nhập đủ tất cả trường!");
      return;
    }
    if (newPass.length < 6) {
      setError("Mật khẩu mới phải từ 6 ký tự trở lên!");
      return;
    }
    if (newPass !== confirm) {
      setError("Mật khẩu xác nhận không khớp!");
      return;
    }
    if (current !== user.password) {
      setError("Mật khẩu hiện tại không đúng!");
      return;
    }
    setLoading(true);
    try {
      // Call API thực tế ở đây!
      await new Promise((res) => setTimeout(res, 1200));
      onChangePassword(newPass); // (giả sử đổi mật khẩu local, thực tế call API)
      onClose();
      toast.success("Đổi mật khẩu thành công!"); // <-- GỌI TOAST Ở ĐÂY
    } catch (e) {
      setError("Đổi mật khẩu thất bại!");
      toast.error("Đổi mật khẩu thất bại!"); // <-- GỌI TOAST Ở ĐÂY
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-neutral-900 p-8 rounded-2xl shadow-2xl min-w-[340px] max-w-[95vw] relative"
      >
        <button
          onClick={onClose}
          type="button"
          className="absolute top-3 right-3 p-2 rounded-full bg-gray-100 dark:bg-neutral-800 hover:bg-violet-700"
        >
          <X />
        </button>
        <div className="text-xl font-bold mb-4 text-center text-violet-700 dark:text-violet-200">
          Đổi mật khẩu
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Mật khẩu hiện tại</label>
            <div className="relative">
              <input
                type={show1 ? "text" : "password"}
                className="w-full py-3 px-4 rounded-xl border border-gray-300 bg-transparent text-white focus:outline-none focus:border-violet-500"
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-700"
                onClick={() => setShow1((v) => !v)}
                tabIndex={-1}
              >
                {show1 ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Mật khẩu mới</label>
            <div className="relative">
              <input
                type={show2 ? "text" : "password"}
                className="w-full py-3 px-4 rounded-xl border border-gray-300 bg-transparent text-white focus:outline-none focus:border-violet-500"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-700"
                onClick={() => setShow2((v) => !v)}
                tabIndex={-1}
              >
                {show2 ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Nhập lại mật khẩu mới</label>
            <div className="relative">
              <input
                type={show3 ? "text" : "password"}
                className="w-full py-3 px-4 rounded-xl border border-gray-300 bg-transparent text-white focus:outline-none focus:border-violet-500"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-700"
                onClick={() => setShow3((v) => !v)}
                tabIndex={-1}
              >
                {show3 ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        </div>

        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700 font-semibold transition"
        >
          {loading ? "Đang xử lý..." : "Xác nhận"}
        </button>
      </form>
    </div>
  );
}
