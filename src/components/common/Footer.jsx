import { Truck, Headphones, Tag, Gem } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white text-gray-800">
      {/* Hàng trên - Icons */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 py-10 px-6 text-center">
        <div>
          <Truck className="mx-auto mb-3" size={28} />
          <h4 className="font-semibold">Miễn phí ship</h4>
          <p className="text-sm text-gray-600">
            Toàn quốc cho đơn hàng từ 150K+
          </p>
        </div>
        <div>
          <Headphones className="mx-auto mb-3" size={28} />
          <h4 className="font-semibold">Tư vấn nhiệt tình</h4>
          <p className="text-sm text-gray-600">Junie sẵn sàng hỗ trợ 24/7</p>
        </div>
        <div>
          <Tag className="mx-auto mb-3" size={28} />
          <h4 className="font-semibold">Ưu đãi ngập tràn</h4>
          <p className="text-sm text-gray-600">Sản phẩm luôn có giá tốt nhất</p>
        </div>
        <div>
          <Gem className="mx-auto mb-3" size={28} />
          <h4 className="font-semibold">Đảm bảo chất lượng</h4>
          <p className="text-sm text-gray-600">Junie cam kết hài lòng</p>
        </div>
      </div>

      {/* Hàng dưới */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 px-6 py-12">
        
        {/* Khám phá */}
        <div>
          <h4 className="font-semibold mb-4">Khám phá</h4>
          <ul className="space-y-2 text-sm">
            {["Bông tai", "Dây chuyền", "Vòng tay", "Nhẫn", "Lắc chân"].map(
              (item) => (
                <li key={item} className="hover:text-pink-600 cursor-pointer">
                  {item}
                </li>
              )
            )}
          </ul>
        </div>

        {/* Chính sách */}
        <div>
          <h4 className="font-semibold mb-4">Chính sách</h4>
          <ul className="space-y-2 text-sm">
            {[
              "Thanh Toán",
              "Vận Chuyển & Đồng Kiểm",
              "Đổi Trả & Bảo Hành",
              "Bảo Mật",
              "Điều Khoản Dịch Vụ",
            ].map((item) => (
              <li key={item} className="hover:text-pink-600 cursor-pointer">
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Hộ kinh doanh */}
        <div>
          <h4 className="font-semibold mb-4">Hộ kinh doanh JUNIE</h4>
          <p className="text-sm text-gray-700">
            742 Lê Thanh Nghị, TP. Hải Dương, Hải Dương
          </p>
          <p className="text-sm text-gray-700 mt-2">
            ĐKKD số 0448018757 cấp ngày 07/10/2021 tại Hải Dương • MST:
            8411247921
          </p>
          <p className="text-sm font-semibold mt-3">
            Hotline:{" "}
            <span className="text-pink-600 font-bold">08 626 58643</span>
          </p>
        </div>
      </div>
      <div className="text-center mt-6 text-sm text-gray-600 py-4">
        © 2025 DELIA ELLY. All rights reserved.
      </div>
    </footer>
  );
}
