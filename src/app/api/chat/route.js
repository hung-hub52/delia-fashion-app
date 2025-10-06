import { NextResponse } from "next/server";
import { collectionProducts } from "@/data/collections";

// 🧠 Bộ nhớ tạm để nhớ truy vấn sản phẩm gần nhất (chỉ trên server runtime)
let lastCategory = "";

export async function POST(req) {
  try {
    const { message } = await req.json();
    if (!message) {
      return NextResponse.json(
        { error: "Thiếu nội dung tin nhắn" },
        { status: 400 }
      );
    }

    const lowerMsg = message.toLowerCase();

    // 🏷️ Danh mục phổ biến
    const categories = [
      { key: "balo", label: "Balo" },
      { key: "túi xách", label: "Túi xách" },
      { key: "ví", label: "Ví da" },
      { key: "vòng tay", label: "Vòng tay" },
      { key: "kính", label: "Kính mắt" },
      { key: "thắt lưng", label: "Thắt lưng" },
      { key: "đồng hồ", label: "Đồng hồ" },
      { key: "dây chuyền", label: "Dây chuyền" },
      { key: "khăn", label: "Khăn lụa / khăn len" },
      { key: "mũ", label: "Mũ nón" },
    ];

    // ✅ B1: Xác định loại sản phẩm người dùng đang hỏi
    let currentCategory = "";
    for (const cat of categories) {
      if (lowerMsg.includes(cat.key)) {
        currentCategory = cat.key;
        lastCategory = cat.key; // nhớ để hiểu câu sau
        break;
      }
    }

    // ✅ B2: Nếu user hỏi tiếp mà không có từ khóa, dùng danh mục trước
    if (!currentCategory && lastCategory) {
      currentCategory = lastCategory;
    }

    // ✅ B3: Nếu có danh mục → lọc sản phẩm theo đó
    if (currentCategory) {
      const matched = Object.values(collectionProducts)
        .flat()
        .filter(
          (p) =>
            p.name.toLowerCase().includes(currentCategory) ||
            p.category?.toLowerCase().includes(currentCategory)
        )
        .slice(0, 2); // tối đa 2 sản phẩm

      if (matched.length > 0) {
        let reply = "";

        // 🛍️ Nếu chỉ có 1 sản phẩm → trả lời tự nhiên như nhân viên thật
        if (matched.length === 1) {
          const p = matched[0];
          reply = `🛍️ Bên mình có sản phẩm **${
            p.name
          }** giá **${p.price.toLocaleString()}₫**, rất được khách ưa chuộng đó bạn 💫.`;
        } else {
          reply = `👜 Dưới đây là vài mẫu **${currentCategory}** bạn có thể thích:\n\n${matched
            .map((p) => `- **${p.name}** — ${p.price.toLocaleString()}₫`)
            .join("\n")}\n\n✨ Hiện bên mình đều có sẵn hàng các mẫu trên nha!`;
        }

        // 👗 Nếu người dùng hỏi “phối / mix / hợp với” → thêm gợi ý stylist
        if (
          lowerMsg.includes("phối") ||
          lowerMsg.includes("mix") ||
          lowerMsg.includes("hợp với")
        ) {
          let styleTip = "";
          switch (currentCategory) {
            case "dây chuyền":
            case "vòng tay":
              styleTip =
                "💡 Với các mẫu này, bạn nên phối cùng **áo sơ mi trắng hoặc áo thun cổ tròn**, vừa tinh tế vừa nổi bật phong cách đó 😎";
              break;
            case "balo":
            case "túi xách":
              styleTip =
                "💡 Các mẫu này đi cùng **quần jeans, áo phông hoặc váy nhẹ nhàng** đều rất hợp nha 💕";
              break;
            case "ví":
            case "thắt lưng":
            case "đồng hồ":
              styleTip =
                "💡 Phối cùng **áo sơ mi và quần tây** sẽ tạo phong cách lịch lãm, sang trọng nè 👔";
              break;
            case "kính":
            case "mũ":
            case "khăn":
              styleTip =
                "💡 Phối cùng **áo khoác nhẹ hoặc outfit street style** sẽ giúp bạn trông năng động hơn 🌤️";
              break;
            default:
              styleTip =
                "💡 Bạn có thể phối linh hoạt theo sở thích, mình có thể gợi ý nếu bạn mô tả thêm phong cách bạn muốn nhé 💬";
          }
          reply += `\n\n${styleTip}`;
        }

        return NextResponse.json({ reply });
      }
    }

    // ✅ B4: Nếu không phải hỏi sản phẩm → gọi Groq để trả lời chung
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content:
              "Xin chào! Tôi là **Delia**, nhân viên AI **AI** của cửa hàng thời trang **Delia Elly** 💖. Tôi có thể giúp bạn tư vấn sản phẩm (balo, túi xách, ví da, phụ kiện...), gợi ý mix đồ, và hỗ trợ bạn mua hàng. Hãy nói cho tôi biết bạn đang quan tâm gì nhé!",
          },
          { role: "user", content: message },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("❌ Lỗi từ API Groq:", error);
      return NextResponse.json(
        { error: "Lỗi khi gọi API Groq" },
        { status: 500 }
      );
    }

    const data = await res.json();
    const reply =
      data?.choices?.[0]?.message?.content?.trim() ||
      "Xin lỗi, mình chưa hiểu ý bạn 😅";

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("💥 Lỗi Chat API:", err);
    return NextResponse.json({ error: "Lỗi hệ thống" }, { status: 500 });
  }
}
