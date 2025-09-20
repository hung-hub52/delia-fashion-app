"use client";

import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const stats = [];           // Backend trả về số liệu tổng hợp từng mục
const topProducts = [];     // Backend trả về top sản phẩm bán chạy
const notifications = [];   // Backend trả về danh sách thông báo hệ thống

export default function AdminDashboard({ revenueOrders = [] }) {
  
  const [showTable, setShowTable] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);

  // Lọc data nếu có selectedDate, không thì trả toàn bộ mảng
  const filteredData = selectedDate
    ? revenueOrders.filter(
        (item) =>
          new Date(item.date).toDateString() === selectedDate.toDateString()
      )
    : revenueOrders;

  return (
    <div>
      {/* Section Thống kê tổng */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((item, idx) => (
          <div
            key={idx}
            className={`rounded-2xl p-6 shadow-lg flex items-center gap-4 ${item.color} text-white`}
          >
            <div className="text-3xl">{item.icon}</div>
            <div>
              <div className="text-2xl font-bold">{item.value}</div>
              <div className="opacity-80">{item.label}</div>
            </div>
          </div>
        ))}
      </section>

      <section className="flex flex-col md:flex-row gap-8">
        {/* Bảng thông báo */}
        <div className="flex-1 bg-white rounded-2xl shadow-lg p-7 min-w-[300px]">
          <h2 className="font-semibold text-lg mb-3 text-indigo-500 flex items-center gap-2">
            <span>📢</span> Thông báo hệ thống
          </h2>
          <ul className="space-y-4">
            {notifications.map((n, idx) => (
              <li key={idx} className="flex items-center gap-3">
                <span className="inline-block w-2 h-2 rounded-full bg-violet-400"></span>
                <div>
                  <div className="font-bold text-gray-800">{n.message}</div>
                  <div className="text-gray-500 text-xs">{n.time}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Top sản phẩm bán chạy */}
        <div className="flex-1 bg-white rounded-2xl shadow-lg p-7">
          <h2 className="font-semibold text-lg mb-3 text-indigo-500 flex items-center gap-2">
            <span>🔥</span> Top sản phẩm bán chạy
          </h2>
          <ul className="divide-y">
            {topProducts.map((p, idx) => (
              <li key={idx} className="flex items-center gap-4 py-3">
                <img
                  src={p.img}
                  alt={p.name}
                  className="w-12 h-12 rounded-lg border shadow-sm object-cover"
                />
                <div className="flex-1">
                  <div className="font-bold text-gray-800">{p.name}</div>
                  <div className="text-xs text-gray-600">
                    Đã bán: <b>{p.sales}</b>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded-lg ${
                    idx === 0
                      ? "bg-yellow-100 text-yellow-700"
                      : idx === 1
                      ? "bg-slate-200"
                      : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {["🥇", "🥈", "🥉"][idx]}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* BẢNG DOANH THU & ĐƠN HÀNG */}
      <div className="mt-10">
        {/* Tiêu đề & chọn ngày */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-indigo-600 flex items-center gap-2">
              🧾 Bảng doanh thu & đơn hàng
            </h2>
            {/* DatePicker: CHỈNH THÊM Ở ĐÂY */}
            <DatePicker
              selected={selectedDate}
              onChange={setSelectedDate}
              placeholderText="Chọn ngày"
              dateFormat="dd/MM/yyyy"
              className="border border-violet-300 rounded px-3 py-1 text-black focus:outline-none focus:ring-2 focus:ring-violet-400"
              maxDate={new Date()}
              isClearable
            />
            {selectedDate && (
              <button
                className="text-xs text-gray-500 underline ml-1"
                onClick={() => setSelectedDate(null)}
              >
                Xóa lọc
              </button>
            )}
          </div>
          <button
            className="text-sm px-4 py-2 bg-violet-600 hover:bg-violet-800 text-white rounded-lg font-semibold transition-all"
            onClick={() => setShowTable((v) => !v)}
          >
            {showTable ? "Ẩn bảng" : "Hiện bảng"}
          </button>
        </div>
        {showTable && (
          <div className="bg-white rounded-2xl shadow-lg p-8 animate-fadeIn">
            <table className="w-full text-left">
              <thead>
                <tr className="text-violet-700 border-b">
                  <th className="p-3">Ngày</th>
                  <th className="p-3 text-center">Số đơn hàng</th>
                  <th className="p-3 text-right">Doanh thu</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 && (
                  <tr>
                    <td
                      colSpan={3}
                      className="text-center py-8 text-gray-400 italic"
                    >
                      Không có dữ liệu cho ngày này
                    </td>
                  </tr>
                )}
                {filteredData.map((item, idx) => (
                  <tr key={idx} className="hover:bg-violet-50 transition">
                    <td className="p-3 font-medium">
                      {new Date(item.date).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="p-3 text-center">{item.orders}</td>
                    <td className="p-3 text-right text-blue-700 font-bold">
                      {item.revenue.toLocaleString("vi-VN")}₫
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
