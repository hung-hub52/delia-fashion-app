"use client";
import { useState } from "react";
import CustomerClassifyModal from "@/components/admin/customers/CustomerClassifyModal";


// Fake data phân nhóm
const customersFake = [
  // Ví dụ cho từng nhóm, sau này lấy từ BE thay thế mảng này
  {
    id: 1,
    code: "12345",
    name: "Nguyễn Văn A",
    totalOrders: 35,
    stopDate: "01/06/2025",
    lastVisit: "20/07/2025",
    group: "VIP",
  },
  {
    id: 2,
    code: "23456",
    name: "Trần Thị B",
    totalOrders: 21,
    stopDate: "—",
    lastVisit: "10/07/2025",
    group: "Khách mới",
  },
 
];

// Danh sách nhóm và tên hiển thị
const groups = [
  { key: "VIP", name: "Hạng VIP" },
  { key: "Khách mới", name: "Khách mới" },
];

export default function ClassifyPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalGroup, setModalGroup] = useState("");
  const [modalCustomers, setModalCustomers] = useState([]);

  const openDetail = (groupKey, groupName) => {
    const data = customersFake.filter((c) =>
      groupKey === "Khách mới"
        ? c.group === "Khách mới" // hoặc logic khác tùy BE
        : c.group === groupKey
    );
    setModalCustomers(data);
    setModalGroup(groupName);
    setModalOpen(true);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8 text-gray-800">
        Phân loại khách hàng
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-800">
        {groups.map((g) => (
          <div
            key={g.key}
            className="bg-white rounded-xl shadow p-7 flex flex-col items-center gap-2 border border-violet-100"
          >
            <div className="font-bold text-lg mb-2">{g.name}</div>
            <div className="text-3xl font-extrabold text-violet-600 mb-2">
              {
                customersFake.filter((c) =>
                  g.key === "Khách mới"
                    ? c.group === "Khách mới"
                    : c.group === g.key
                ).length
              }
            </div>
            <button
              className="px-4 py-1 rounded-lg bg-violet-100 text-violet-700 font-semibold hover:bg-violet-200 transition"
              onClick={() => openDetail(g.key, g.name)}
            >
              Xem chi tiết
            </button>
          </div>
        ))}
      </div>
      {/* Modal chi tiết nhóm */}
      <CustomerClassifyModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        group={modalGroup}
        customers={modalCustomers}
      />
    </div>
  );
}
