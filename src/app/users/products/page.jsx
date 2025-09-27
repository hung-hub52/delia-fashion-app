import ProductGrid from "@/components/users/ProductGrid";

const products = [
  {
    id: "ETM28",
    name: "Túi xách nam cao cấp da thật ELLY HOMME – ETM28",
    images: ["/products/bag1.jpg", "/products/bag1-2.jpg"],
    oldPrice: 3199000,
    price: 1599500,
    discount: 50,
  },
  {
    id: "ETM29",
    name: "Túi xách nam da thật ELLY HOMME – ETM29",
    images: ["/products/bag2.jpg", "/products/bag2-2.jpg"],
    oldPrice: 1999000,
    price: 999500,
    discount: 50,
  },
  {
    id: "ETM30",
    name: "Túi xách nam cao cấp da thật ELLY HOMME – ETM30",
    images: ["/products/bag3.jpg", "/products/bag3-2.jpg"],
    oldPrice: 2099000,
    price: 1049500,
    discount: 50,
  },
  {
    id: "ETM31",
    name: "Túi xách nam cao cấp da thật ELLY HOMME – ETM31",
    images: ["/products/bag4.jpg", "/products/bag4-2.jpg"],
    oldPrice: 2499000,
    price: 1249500,
    discount: 50,
  },
  {
    id: "ETM32",
    name: "Túi xách nam cao cấp da thật ELLY HOMME – ETM32",
    images: ["/products/bag5.jpg", "/products/bag5-2.jpg"],
    oldPrice: 2899000,
    price: 1449500,
    discount: 50,
  },
  {
    id: "ETM33",
    name: "Túi xách nam cao cấp da thật ELLY HOMME – ETM33",
    images: ["/products/bag6.jpg", "/products/bag6-2.jpg"],
    oldPrice: 2199000,
    price: 1099500,
    discount: 50,
  },
];

export default function Page() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 ">
      <nav className="text-sm text-gray-500 mb-4">
        <span className="hover:underline cursor-pointer">Trang chủ</span> /{" "}
        <span className="hover:underline cursor-pointer">Sản phẩm</span> /{" "}
        <span className="text-gray-900 font-medium">Túi Xách Nam</span>
      </nav>

      <h1 className="text-2xl font-bold text-pink-600 mb-6">Túi Xách Nam</h1>

      <ProductGrid products={products} />
    </div>
  );
}
