// src/app/users/about/page.jsx
"use client";
import Image from "next/image";

const brands = [
  { name: "Casio", logo: "/brands/casio.png", desc: "Nhãn hàng đồng hồ Casio" },
  { name: "Anna", logo: "/brands/anna.png", desc: "Nhãn hàng kính mắt Anna" },
  { name: "Simplecarry", logo: "/brands/simplecarry.png", desc: "Nhãn hàng balo Simplecarry" },
  { name: "Pedro", logo: "/brands/pedro.png", desc: "Nhãn hàng thắt lưng Pedro" },
  { name: "Adidas", logo: "/brands/adidas.png", desc: "Nhãn hàng thời trang Adidas" },
  { name: "Nike", logo: "/brands/nike.png", desc: "Nhãn hàng mũ nón Nike" },
  { name: "Gucci", logo: "/brands/gucci.png", desc: "Nhãn hàng phụ kiện Gucci" },
  { name: "Kydopal", logo: "/brands/kydopal.png", desc: "Nhãn hàng vàng bạc Kydopal" },
  { name: "An Nhien", logo: "/brands/annhien.png", desc: "Nhãn hàng vòng tay Trầm Hương" },
  { name: "Dior", logo: "/brands/dior.png", desc: "Nhãn hàng thời trang Dior" },
];

export default function SalePage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-center mb-10 text-pink-600 uppercase">
          Các Nhãn Hàng Đồng Hành Cùng Delia Elly
        </h1>

        {/* Grid các thương hiệu */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 items-center text-gray-800 mb-16">
          {brands.map((brand) => (
            <div
              key={brand.name}
              className="flex flex-col items-center text-center space-y-3"
            >
              {/* Logo brand */}
              <div className="w-28 h-28 relative bg-white rounded shadow-sm">
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  fill
                  className="object-contain"
                />
              </div>
              <p className="text-sm font-medium">{brand.desc}</p>
            </div>
          ))}
        </div>

        {/* ✅ Giới thiệu cửa hàng */}
        <div className="max-w-4xl mx-auto text-gray-700 space-y-6 px-6">
          <h2 className="text-2xl font-bold text-pink-600 mb-6 text-center uppercase">
            DELIA ELLY – Nơi bạn thể hiện cá tính của bản thân
          </h2>
          <p className="text-justify leading-relaxed">
            Nếu bạn đang tìm kiếm những phụ kiện thời trang vừa đẹp, vừa dễ
            phối, thì DELIA ELLY chính là nơi dành cho bạn. Chúng mình mang đến
            một thế giới phụ kiện đa dạng từ mũ, thắt lưng, túi xách, ví da,
            balo cho đến dây chuyền và nhiều món nhỏ xinh khác. Mỗi sản phẩm đều
            được chọn lựa kỹ để phù hợp với nhiều phong cách, từ năng động, trẻ
            trung cho đến thanh lịch và tinh tế. Ở DELIA ELLY, chúng mình tin
            rằng phụ kiện không chỉ làm đẹp thêm bộ trang phục, mà còn giúp bạn
            thể hiện cá tính và gu riêng trong cuộc sống hàng ngày.
          </p>
          <p className="text-justify leading-relaxed">
            Chúng mình luôn muốn đem đến cho bạn trải nghiệm thoải mái và vui vẻ
            nhất. Không cần quá cầu kỳ, mỗi chiếc túi, mỗi chiếc ví hay chiếc
            thắt lưng ở DELIA ELLY đều được thiết kế để bạn có thể sử dụng hằng
            ngày mà vẫn nổi bật. Bên cạnh chất lượng tốt, chúng mình còn chú ý
            đến những chi tiết nhỏ để sản phẩm vừa bền, vừa tiện lợi, lại mang
            chút gì đó thật riêng. Mỗi phụ kiện giống như một người bạn đồng
            hành, giúp bạn tự tin hơn mỗi khi ra ngoài, đi làm, đi học hay đơn
            giản chỉ là dạo phố cuối tuần.
          </p>
          <p className="text-justify leading-relaxed">
            Với DELIA ELLY, chúng mình không chỉ muốn bán một món phụ kiện, mà
            còn muốn gửi gắm cảm hứng sống tích cực đến bạn. Chúng mình tin rằng
            ai cũng có phong cách riêng, và phụ kiện chính là “gia vị” để làm
            nổi bật điều đó. Hãy để DELIA ELLY đồng hành cùng bạn, biến từng
            ngày trôi qua thành một hành trình tràn đầy năng lượng, phong cách
            và niềm vui. Bởi vì thời trang không chỉ là những gì bạn mặc, mà còn
            là cách bạn thể hiện chính mình.
          </p>
          <p className="text-justify leading-relaxed">
            Toàn bộ cửa hàng DELIA ELLY, xin chân thành cảm ơn các khách hàng 
            là các bạn trẻ, các chị, các cô, ccas mẹ đã tin tưởng ủng hộ sảnphẩm bên
            chúng mình. Nếu nhân viên phục vụ không được chỉnh chu hãy liên hệ 
            ngay bộ phận chăm sóc khác hàng. Delia Elly chúc quý khách hàng trải nghiệm 
            dịch vụ mua sắm tại cửa hàng tốt nhất. 
          </p>
        </div>
      </div>
    </div>
  );
}
