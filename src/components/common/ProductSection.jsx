"use client";
import Link from "next/link";
import Image from "next/image";
import { collectionProducts } from "@/data/collections";
import { calculateDiscount } from "@/utils/price"; // thêm dòng này

export default function ProductSection({ title }) {
  const collections = [
    { id: 1, name: "Túi Xách", img: "/images/bag.jpg", slug: "bag" },
    { id: 2, name: "Ví Da", img: "/images/wallet.jpg", slug: "wallet" },
    { id: 3, name: "Balo", img: "/images/balo.jpg", slug: "balo" },
    { id: 4, name: "Kính Mắt", img: "/images/glasses.jpg", slug: "glasses" },
    { id: 5, name: "Thắt Lưng", img: "/images/belt.jpg", slug: "belt" },
    { id: 6, name: "Đồng Hồ", img: "/images/rolex.jpg", slug: "watch" },
    {
      id: 7,
      name: "Dây Chuyền",
      img: "/images/necklace.jpg",
      slug: "necklace",
    },
    { id: 8, name: "Vòng Tay", img: "/images/bracelet.jpg", slug: "bracelet" },
    { id: 9, name: "Khăn Lụa, Len", img: "/images/pinner.jpg", slug: "scarf" },
    { id: 10, name: "Mũ Nón", img: "/images/hat.jpg", slug: "hat" },
  ];

  const isCollection = title === "BỘ SƯU TẬP";
  const isMen = title === "NAM";
  const isWomen = title === "NỮ";

  // Lấy sản phẩm cho từng nhóm
  const allProducts = Object.values(collectionProducts).flat();
  const menProducts = allProducts
    .filter((p) => p.gender.includes("men"))
    .slice(0, 4);
  const womenProducts = allProducts
    .filter((p) => p.gender.includes("women"))
    .slice(0, 4);

  const productsToShow = isMen ? menProducts : isWomen ? womenProducts : [];

  return (
    <section className="w-full bg-white px-6 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Tiêu đề + nút xem tất cả */}
        <div className="relative mb-6">
          <h2 className="text-2xl font-bold uppercase text-gray-800 tracking-wide text-center">
            {title}
          </h2>

          {(isMen || isWomen) && (
            <Link
              href={isMen ? "/users/men" : "/users/women"}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-600 hover:text-pink-600 transition"
            >
              Xem tất cả →
            </Link>
          )}
        </div>

        {/* Bộ sưu tập */}
        {isCollection ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {collections.map((item) => (
              <Link
                key={item.id}
                href={`/users/all-products/collection/${item.slug}`}
                className="flex flex-col items-center text-center p-4 border rounded hover:shadow transition"
              >
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-24 h-24 rounded-full object-cover mb-3"
                />
                <p className="text-sm text-gray-700">{item.name}</p>
              </Link>
            ))}
          </div>
        ) : (
          // NAM / NỮ = hiển thị sản phẩm thật
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {productsToShow.map((product) => {
              const discountPercent = calculateDiscount(
                product.oldPrice,
                product.price
              );
              const hasDiscount = discountPercent > 0;

              return (
                <Link
                  key={product.id}
                  href={`/users/products/${product.id}`}
                  className="border rounded-md p-3 bg-white hover:shadow-md transition flex flex-col relative"
                >
                  <div className="aspect-[4/5] relative mb-3">
                    {/* Badge giảm giá */}
                    {hasDiscount && (
                      <span className="absolute top-2 left-2 z-10 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                        -{discountPercent}%
                      </span>
                    )}

                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover rounded"
                    />
                  </div>

                  <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-1">
                    {product.name}
                  </h3>

                  <div className="flex items-center gap-2">
                    {hasDiscount && (
                      <span className="text-gray-400 text-sm line-through">
                        {product.oldPrice.toLocaleString()}₫
                      </span>
                    )}
                    <span className="text-red-600 font-bold text-sm">
                      {product.price.toLocaleString()}₫
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
