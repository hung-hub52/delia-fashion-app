"use client";
const tickets = [
  {
    id: 1,
    customer: "Nguyễn Văn A",
    phone: "0987...",
    content: "Yêu cầu đổi hàng",
    status: "Mới",
  },
  {
    id: 2,
    customer: "Lê Thị B",
    phone: "0912...",
    content: "Hỏi tồn kho",
    status: "Đã xử lý",
  },
];
export default function SupportPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-5 text-gray-800">
        Chăm sóc khách hàng
      </h1>
      <div className="bg-white rounded-xl shadow p-5 text-gray-800">
        <table className="min-w-full">
          <thead>
            <tr className="text-left font-semibold border-b">
              <th className="p-2">Khách hàng</th>
              <th className="p-2">SĐT</th>
              <th className="p-2">Nội dung</th>
              <th className="p-2">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((t) => (
              <tr key={t.id} className=" hover:bg-indigo-50">
                <td className="p-2">{t.customer}</td>
                <td className="p-2">{t.phone}</td>
                <td className="p-2">{t.content}</td>
                <td className="p-2">
                  <span
                    className={
                      t.status === "Mới" ? "text-pink-600" : "text-green-600"
                    }
                  >
                    {t.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
