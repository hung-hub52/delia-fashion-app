// src/app/admin/inventory/page.jsx
"use client";
import { useState, useMemo } from "react";
import { useInventory } from "@/context/InventoryContext";
import { Clock } from "lucide-react";
import HisInventoryModal from "@/components/admin/inventory/HisInventoryModal";

export default function InventoryPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const { inventory, history } = useInventory();

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  let filtered = inventory.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.code.toLowerCase().includes(search.toLowerCase())
  );

  const PER_PAGE = 10;
  const totalPage = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const dataPage = useMemo(
    () => filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE),
    [filtered, page]
  );

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Tìm kiếm tên hàng, mã hàng hóa..."
            className="border px-3 py-2 rounded-xl w-72 mr-4 focus:outline-violet-400 text-gray-800"
            value={search}
            onChange={handleSearch}
          />
          <button className="rounded bg-yellow-300 px-3 py-1 text-gray-800 hover:bg-yellow-400">
            ⬇ Xuất Excel
          </button>
          <button
            onClick={() => setShowHistory(true)}
            className="rounded bg-pink-500 px-3 py-1 text-white hover:bg-pink-600 flex items-center gap-1"
          >
            <Clock size={16} /> Lịch sử
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border shadow">
        <div className="bg-gradient-to-r from-teal-400 to-cyan-500 px-4 py-3 text-white font-semibold uppercase">
          Quản lý sản phẩm kho
        </div>

        <div className="overflow-x-auto bg-white text-gray-800">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50 text-gray-700">
                <th className="p-2 text-center w-12">STT</th>
                <th className="p-2 text-left">Mã sản phẩm</th>
                <th className="p-2 text-left">Tên sản phẩm</th>
                <th className="p-2 text-left">Tên nhà kho</th>
                <th className="p-2 text-left">Số lượng tồn kho</th>
                <th className="p-2 text-left">Số lượng nhập gần nhất</th>
              </tr>
            </thead>
            <tbody>
              {dataPage.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-gray-400">
                    Chưa có dữ liệu
                  </td>
                </tr>
              )}

              {dataPage.map((row, idx) => {
                const lastImport = (history || [])
                  .filter((h) => h.code === row.code)
                  .slice(-1)[0]; // lấy bản ghi cuối

                return (
                  <tr
                    key={idx}
                    className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    onClick={() => {
                      setSelectedItem(row);
                      setShowHistory(true);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <td className="p-2 text-center">
                      {(page - 1) * PER_PAGE + idx + 1}
                    </td>
                    <td className="p-2">{row.code}</td>
                    <td className="p-2">{row.name}</td>
                    <td className="p-2">{row.branch}</td>

                    {/* tồn kho từ context */}
                    <td className="p-2">
                      {row.stock} {row.unit || ""}
                    </td>

                    {/* lần nhập gần nhất */}
                    <td className="p-2">
                      {lastImport
                        ? `${lastImport.qty} ${lastImport.unit || ""}`
                        : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-end items-center gap-2 p-3 bg-gray-50">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className={`px-3 py-1 rounded ${
              page <= 1
                ? "bg-gray-200 text-gray-400"
                : "bg-gray-100 hover:bg-violet-100 text-violet-700"
            }`}
          >
            Trang trước
          </button>
          <span>
            Trang <b>{page}</b> / {totalPage}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPage, p + 1))}
            disabled={page >= totalPage}
            className={`px-3 py-1 rounded ${
              page >= totalPage
                ? "bg-gray-200 text-gray-400"
                : "bg-gray-100 hover:bg-violet-100 text-violet-700"
            }`}
          >
            Trang sau
          </button>
        </div>
      </div>

      <HisInventoryModal
        open={showHistory}
        onClose={() => {
          setShowHistory(false);
          setSelectedItem(null);
        }}
        history={selectedItem ? history.filter((h) => h.code === selectedItem.code) : history}
        title={selectedItem ? `Lịch sử nhập kho - ${selectedItem.name}` : "📜 Lịch sử nhập kho"}
      />
    </div>
  );
}
