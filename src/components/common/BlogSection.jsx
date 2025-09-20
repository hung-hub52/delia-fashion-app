export default function BlogSection() {
  return (
    <section className="w-full bg-white px-6 py-16">
      <div className="max-w-7xl mx-auto">
        {/* Tiêu đề */}
        <h2 className="text-3xl font-bold mb-10 text-center uppercase tracking-wide text-gray-800">
          TIN TỨC NỔI BẬT
        </h2>

        {/* Grid blog */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <article
              key={i}
              className="bg-white rounded shadow-sm hover:shadow-xl transition overflow-hidden border"
            >
              {/* Ảnh */}
              <div className="h-56 bg-gray-100 flex items-center justify-center text-gray-400">
                Ảnh Blog {i}
              </div>

              {/* Nội dung */}
              <div className="p-5">
                <h3 className="font-semibold text-lg mb-2 text-gray-800 hover:text-pink-600 cursor-pointer">
                  Tiêu đề bài viết {i}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  Mô tả ngắn gọn bài viết {i} sẽ hiển thị ở đây. Sau này sẽ đổ
                  dữ liệu thật từ DB hoặc API.
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
