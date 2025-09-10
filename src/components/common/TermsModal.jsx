"use client";

import { X } from "lucide-react";

export default function TermsModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 relative animate-fadeIn">
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-pink-600"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold mb-4 text-center">
          Điều khoản & Chính sách dịch vụ
        </h2>

        <div className="space-y-4 text-sm text-gray-700 max-h-[60vh] overflow-y-auto pr-2">
          <p>
            Mua sắm tại website của chúng tôi, bạn vui lòng tham khảo vài điều
            dưới đây để trải nghiệm được trọn vẹn hơn nhé:
          </p>

          <h3 className="font-semibold">Sản phẩm & Giá cả</h3>
          <p>
            Tụi mình luôn cố gắng cập nhật thông tin sản phẩm và giá chính xác
            nhất. Giá có thể thay đổi nhẹ tùy thời điểm và chưa bao gồm phí giao
            hàng (nếu có).
          </p>

          <h3 className="font-semibold">Đặt hàng & Thanh toán</h3>
          <p>
            Để đơn hàng được xác nhận nhanh chóng, bạn nhớ cung cấp đúng thông
            tin liên hệ. Bạn có thể chọn nhiều cách thanh toán tiện lợi như
            chuyển khoản, ví điện tử hoặc thanh toán khi nhận hàng (COD).
          </p>

          <h3 className="font-semibold">Giao hàng & Đổi trả</h3>
          <p>
            Hàng sẽ được giao trong thời gian sớm nhất có thể, tùy khu vực của
            bạn. Nếu sản phẩm chưa dùng, còn nguyên tem mác và bị lỗi từ phía
            chúng tôi, bạn hoàn toàn có thể đổi hoặc trả.
          </p>

          <h3 className="font-semibold">Bảo mật thông tin</h3>
          <p>
            Thông tin cá nhân của bạn được giữ kín, chỉ dùng để xử lý đơn hàng
            và chăm sóc khách hàng.
          </p>

          <h3 className="font-semibold">Giải quyết khi có vấn đề</h3>
          <p>
            Nếu có khúc mắc, bạn hãy liên hệ ngay để tụi mình hỗ trợ. Chúng ta
            sẽ cùng nhau tìm ra cách giải quyết hợp lý nhất.
          </p>

          <p className="mt-4">
            👉 Bằng việc mua sắm trên website, nghĩa là bạn đồng ý với các điều
            khoản trên rồi đó.
          </p>
        </div>
      </div>
    </div>
  );
}
