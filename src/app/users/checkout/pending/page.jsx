"use client";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react"; // dùng icon Lucide cho đẹp

export default function PendingPayment() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-[80vh] bg-gradient-to-br from-pink-500 via-red-500 to-orange-500 text-white text-center px-6">
      <div className="bg-white/20 backdrop-blur-md p-6 rounded-2xl shadow-md max-w-md w-full">
        {/* Icon chúc mừng */}
        <div className="flex justify-center mb-3">
          <CheckCircle2 className="w-14 h-14 text-white drop-shadow-md" />
        </div>

        <h2 className="text-2xl font-bold mb-3">🎉 Đặt Hàng Thành Công!</h2>
        <p className="text-sm mb-4 leading-relaxed">
          Cảm ơn bạn đã tin tưởng mua sắm tại{" "}
          <span className="font-semibold">Delia Elly</span> 💖
          <br />
          Đơn hàng của bạn đang được xử lý. Bạn có thể:
          <br />• Theo dõi tiến trình trong mục <strong>Đơn mua</strong>.
          <br />• Tiếp tục mua sắm hoặc quay lại trang chủ.
        </p>

        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={() => router.push("/")}
            className="px-6 py-2 bg-white text-pink-600 rounded-md font-semibold hover:bg-pink-100 transition"
          >
            Trang chủ
          </button>
          <button
            onClick={() => router.push("/users/menuaccount/purchase")}
            className="px-6 py-2 bg-white text-pink-600 rounded-md font-semibold hover:bg-pink-100 transition"
          >
            Đơn mua
          </button>
        </div>
      </div>
    </div>
  );
}
