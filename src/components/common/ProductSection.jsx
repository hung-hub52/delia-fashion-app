import Link from "next/link";

export default function ProductSection({ title }) {
  const collections = [
    { id: 1, name: "Túi Xách", img: "/images/bag.jpg" },
    { id: 2, name: "Ví Da", img: "/images/wallet.jpg" },
    { id: 3, name: "Balo", img: "/images/balo.jpg" },
    { id: 4, name: "Kính Mắt", img: "/images/glasses.jpg" },
    { id: 5, name: "Thắt Lưng", img: "/images/belt.jpg" },
    { id: 6, name: "Đồng Hồ", img: "/images/rolex.jpg" },
    { id: 7, name: "Dây Chuyền", img: "/images/necklace.jpg" },
    { id: 8, name: "Vòng Tay", img: "/images/bracelet.jpg" },
    { id: 9, name: "Khăn Len Vải Đầu/Cổ", img: "/images/pinner.jpg" },
    { id: 10, name: "Mũ", img: "/images/hat.jpg" },
  ];

  const isCollection = title === "BỘ SƯU TẬP";

  return (
    <section className="w-full bg-white px-6 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Tiêu đề + nút Xem tất cả (chỉ hiện với NAM/NỮ) */}
        <div className="relative mb-6">
          <h2 className="text-2xl font-bold uppercase text-gray-800 tracking-wide text-center">
            {title}
          </h2>
          {!isCollection && (
            <Link
              href="#"
              className="absolute right-0 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-600 hover:text-pink-600 transition"
            >
              Xem tất cả →
            </Link>
          )}
        </div>

        {/* Bộ sưu tập = grid danh mục nổi bật */}
        {isCollection ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {collections.map((item) => (
              <div
                key={item.id}
                className="flex flex-col items-center text-center p-4 border rounded hover:shadow transition"
              >
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-24 h-24 rounded-full object-cover mb-3"
                />
                <p className="text-sm text-gray-700">{item.name}</p>
              </div>
            ))}
          </div>
        ) : (
          // NAM, NỮ = grid sản phẩm
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="border rounded-md p-4 h-64 flex items-center justify-center text-gray-400 bg-gray-50"
              >
                Khung sản phẩm {i}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
