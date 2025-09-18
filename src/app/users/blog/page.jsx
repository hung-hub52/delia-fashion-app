"use client";
import VideoCard from "@/components/common/VideoCard";

const videos = [
  {
    title: "10 Loại Phụ Kiện Thời Trang Mọi Tín Đồ Nên Có?",
    src: "/news/phu-kien-thoi-trang.mp4",
    slides: [
      `Phong cách thời trang không chỉ được quyết định bởi quần áo bạn mặc, mà các chi tiết nhỏ nhưng đầy sức mạnh chính là phụ kiện. 
      Chỉ cần một chiếc túi xách, một đôi kính mát hay chiếc đồng hồ tinh tế, bạn đã có thể biến hóa diện mạo từ đơn giản thành nổi bật.
      Phụ kiện không chỉ làm đẹp, mà còn kể câu chuyện về bạn về cá tính, phong cách và sự tự tin trong từng khoảnh khắc.
      Thời trang thay đổi mỗi ngày, nhưng một bộ sưu tập phụ kiện tinh tế sẽ luôn là chìa khóa để bạn giữ trọn nét cuốn hút riêng.
      Vậy bạn đã sẵn sàng khám phá 10 món phụ kiện “quyền lực” mà bất kỳ tín đồ thời trang nào cũng nên sở hữu chưa?`,

      `1. Đồng Hồ
        Không chỉ là công cụ quản lý thời gian, đồng hồ còn được xem như biểu tượng của sự lịch lãm và phong cách cá nhân. 
        Một chiếc đồng hồ da cổ điển mang đến vẻ trang nhã, trong khi đồng hồ kim loại lại toát lên sự mạnh mẽ, hiện đại và chuyên nghiệp.`,
      `2. Túi Xách 
        Túi xách vừa là vật dụng thiết yếu là điểm nhấn quan trọng của bộ trang phục. 
        Từ túi clutch nhỏ gọn cho những buổi tiệc tối mỗi kiểu dáng đều thể hiện cá tính và phong cách riêng của người dùng.`,

      `3. Kính Mát
        Ngoài khả năng bảo vệ mắt khỏi ánh nắng, kính mát còn là phụ kiện giúp tăng thêm sự bí ẩn và sành điệu. 
        Một cặp kính có kiểu dáng phù hợp sẽ dễ dàng nâng tầm diện mạo, mang đến phong thái cuốn hút cho người đeo.`,

      `4. Mũ
        Mũ không chỉ giúp che nắng, giữ ấm còn là phụ kiện tạo điểm nhấn độc đáo. 
        Từ mũ lưỡi trai năng động đến mũ rộng vành sang trọng mỗi kiểu mũ đều mang lại một phong thái riêng biệt cho người đội.`,

      `5. Dây Chuyền
        Một chiếc dây chuyền mảnh tinh tế có thể làm sáng bừng vùng cổ, mang lại vẻ thanh lịch và nhẹ nhàng. 
        Trong khi đó, một chiếc statement necklace lại giúp bạn khẳng định cá tính mạnh mẽ và trở thành tâm điểm của outfit.`,

      `6. Khuyên Tai  
        Dù nhỏ xinh thanh lịch hay to bản thời thượng, khuyên tai đều có khả năng tôn lên những đường nét trên gương mặt. 
        Chỉ một đôi khuyên phù hợp cũng đủ khiến diện mạo của bạn trở nên rạng rỡ và cuốn hút hơn.`,

      `7. Thắt Lưng
        Thắt lưng không chỉ giữ vai trò cố định trang phục mà còn giúp tạo sự cân đối cho vóc dáng. 
        Đây cũng là chi tiết nhấn nhá tinh tế, mang đến vòng eo gọn gàng và góp phần hoàn thiện tổng thể trang phục.`,

      `8. Vòng Tay 
        Một chiếc vòng tay hay lắc tay, dù đơn giản bằng da hay cầu kỳ đính đá, đều góp phần tạo nên sự tinh tế cho outfit. 
        Phụ kiện này vừa giúp tô điểm đôi tay vừa mang lại cảm giác sinh động và thời trang.`,

      `9. Bờm Cài Tóc 
        Từng gắn liền với vẻ nữ tính nhẹ nhàng, bờm nay đã trở lại mạnh mẽ với phiên bản caro đang gây sốt. 
        Họa tiết trẻ trung giúp các nàng biến hóa phong cách từ đáng yêu đến sang chảnh, 
        gợi nhớ hình ảnh những nữ sinh sành điệu trong phim Mỹ.`,

      `10. Lắc Chân
        Lắc chân là món phụ kiện nhỏ nhưng tạo nên sức hút lớn, mang lại nét duyên dáng và quyến rũ cho phái đẹp. 
        Một chiếc lắc bạc, vàng hay đính charm nhỏ xinh có thể dễ dàng kết hợp cùng sneaker giúp bạn toát lên vẻ trẻ trung và tràn đầy sức sống.`,
    ],
  },
  {
    title: "Mẹo Phối Màu Phụ Kiện Dành Cho Bạn",
    src: "/news/phoimau-phukien.mp4",
    slides: [
      `Phối màu phụ kiện trong thời trang không chỉ là việc chọn những món đồ đẹp mắt.
    Nghệ thuật kết hợp tinh tế để làm nổi bật trang phục và khẳng định phong cách cá nhân. 
    Nguyên tắc cơ bản nhất lựa chọn phụ kiện có tông màu cùng, gần với trang phục chính để trở nên hài hòa và sang trọng.`,

      `Cuối cùng, phụ kiện cần phù hợp với bối cảnh và cá tính riêng. 
    Một chiếc clutch ánh kim có thể hoàn hảo cho buổi tiệc tối, nhưng lại không phù hợp khi đi làm hằng ngày. 
    Hãy coi màu sắc của phụ kiện như “ngôn ngữ thầm lặng” kể câu chuyện về chính bạn: năng động, tinh tế hay quyến rũ.`,

      `Khi đi làm, bạn có thể chọn túi xách màu be phối cùng giày đen để tạo sự chuyên nghiệp. 
    Ra phố, hãy thử kính mát nâu kết hợp với sneaker trắng cho vẻ trẻ trung, năng động. 
    Còn trong buổi tiệc tối, một đôi giày cao gót ánh kim cùng clutch đen nhỏ gọn sẽ khiến bạn nổi bật mà vẫn tinh tế.`,
    ],
  },
];

export default function BlogPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* ✅ Tiêu đề + mô tả */}
        <h1 className="text-3xl font-bold text-center text-pink-600 uppercase mb-6">
          Tin Tức & Xu Hướng Phụ Kiện
        </h1>

        <p className="text-center text-gray-700 mb-12 max-w-2xl mx-auto">
          Cập nhật những xu hướng phụ kiện thời trang mới nhất cùng DELIA ELLY –
          nơi bạn tìm thấy cảm hứng phối đồ và các mẹo hay để làm đẹp phong cách
          mỗi ngày. Dưới đây có các bài viết sẽ giúp cho bạn phối những món phụ kiện 
          trở nên sang trọng nhất
        </p>

        {/* ✅ Danh sách video */}
        <div className="space-y-20">
          {videos.map((video, idx) => (
            <VideoCard key={idx} video={video} reversed={idx % 2 === 1} />
          ))}
        </div>
      </div>
    </div>
  );
}
