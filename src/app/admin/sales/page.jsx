"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import AddSaleModal from "@/components/admin/sales/AddSaleModal";
import ConfirmDisableModal from "@/components/admin/sales/ConfirmDisableModal";
import ConfirmModal from "@/components/common/ConfirmModal";
import SaleStatusBadge from "@/components/admin/sales/SaleStatusBadge";
import ActionMenu from "@/components/admin/sales/ActionMenu";
import ShareSaleModal from "@/components/admin/sales/ShareSaleModal";
import { fetchAPI } from "@/utils/api";

export default function SalesPage() {
  const [sales, setSales] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [openAdd, setOpenAdd] = useState(false);
  const [openDisable, setOpenDisable] = useState(null);
  const [openShare, setOpenShare] = useState(null);

  // ConfirmModal (giống trang KH)
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState(() => async () => {});
  const [confirmSuccessMsg, setConfirmSuccessMsg] = useState("Thao tác thành công");

  function askConfirm(message, action, successMsg = "Thao tác thành công") {
    setConfirmMessage(message);
    setConfirmAction(() => action);
    setConfirmSuccessMsg(successMsg);
    setConfirmOpen(true);
  }

  async function loadSales() {
    const data = await fetchAPI(`/sales`);
    setSales(data || []);
  }

  async function loadCustomers() {
    try {
      const data = await fetchAPI(`/users/customers`);
      if (Array.isArray(data)) setCustomers(data.filter((c) => !!c.email));
    } catch {}
  }

  useEffect(() => {
    loadSales().catch(console.error);
    loadCustomers().catch(console.error);
  }, []);

  async function createSale(newSale) {
    await fetchAPI(`/sales`, {
      method: "POST",
      body: JSON.stringify({
        code: newSale.code,
        description: newSale.description,
        usageLimit: newSale.usageLimit,
        endDate: newSale.endDate,
      }),
    });
    setOpenAdd(false);
    await loadSales();
  }

  async function disableSale(id) {
    await fetchAPI(`/sales/${id}/disable`, { method: "PATCH" });
    setOpenDisable(null);
    await loadSales();
  }

  async function deleteSale(id) {
    await fetchAPI(`/sales/${id}`, { method: "DELETE" });
    await loadSales();
  }

  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const itv = setInterval(() => setNow(Date.now()), 60 * 1000);
    return () => clearInterval(itv);
  }, []);

  const computedAndSorted = useMemo(() => {
    const rank = { "Đang hoạt động": 0, "Chưa bắt đầu": 1, "Hết hạn": 2, "Đã vô hiệu hóa": 3 };
    const status = (s) => {
      if (s.status === "disabled") return "Đã vô hiệu hóa";
      if (!s.endDate) return "Đang hoạt động";
      const [y, m, d] = s.endDate.split("-").map(Number);
      const end = new Date(y, m - 1, d).getTime();
      return Date.now() > end ? "Hết hạn" : "Đang hoạt động";
    };
    return (sales || [])
      .map((s) => ({ ...s, dynamicStatus: status(s) }))
      .sort((a, b) => rank[a.dynamicStatus] - rank[b.dynamicStatus]);
  }, [sales, now]);

  // Pagination 10 hàng/trang
  const PAGE_SIZE = 10;
  const [page, setPage] = useState(1);
  const total = computedAndSorted.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);
  const start = (page - 1) * PAGE_SIZE;
  const rows = computedAndSorted.slice(start, start + PAGE_SIZE);
  const fillerCount = Math.max(0, PAGE_SIZE - rows.length);
  const fmtVN = (d) => (d ? new Date(d).toLocaleDateString("vi-VN") : "—");

  return (
    <div className="p-6 text-gray-800">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý khuyến mãi</h1>
        <button
          onClick={() => setOpenAdd(true)}
          className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg shadow-md"
        >
          <Plus size={18} /> Tạo mã mới
        </button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-red-500 to-orange-300 text-white text-left">
              <th className="p-3">Mã khuyến mãi</th>
              <th className="p-3">Mô tả</th>
              <th className="p-3 text-center">Trạng thái</th>
              <th className="p-3 text-center">Ngày tạo</th>
              <th className="p-3 text-center">Ngày kết thúc</th>
              <th className="p-3 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((s, idx) => (
              <tr key={s.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="p-3 font-semibold">{s.code}</td>
                <td className="p-3">{s.description}</td>
                <td className="p-3 text-center">
                  <SaleStatusBadge status={s.dynamicStatus} />
                </td>
                <td className="p-3 text-center">{fmtVN(s.createdAt)}</td>
                <td className="p-3 text-center">{s.endDate || "—"}</td>
                <td className="p-3 text-center">
                  <ActionMenu
                    onShare={() => setOpenShare(s)}
                    onDisable={() => setOpenDisable(s)}
                    onDelete={() =>
                      askConfirm(
                        `Bạn muốn xoá mã khuyến mãi "${s.code}"?`,
                        async () => await deleteSale(s.id),
                        "Đã xoá mã khuyến mãi"
                      )
                    }
                  />
                </td>
              </tr>
            ))}
            {fillerCount > 0 &&
              Array.from({ length: fillerCount }).map((_, i) => (
                <tr
                  key={`filler-${i}`}
                  className={((rows.length + i) % 2 === 0) ? "bg-white" : "bg-gray-50"}
                >
                  <td className="p-3" colSpan={6}>&nbsp;</td>
                </tr>
              ))}
            {total === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-400 italic">
                  Không có khuyến mãi nào
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* footer phân trang */}
        <div className="flex items-center justify-between px-4 py-3 border-t">
          <div className="text-sm text-gray-500">
            Hiển thị {total === 0 ? 0 : start + 1}–{Math.min(total, start + PAGE_SIZE)} / {total}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(1)}
              disabled={page === 1}
              className="px-2 py-1 rounded border text-sm disabled:opacity-50"
            >
              «
            </button>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 rounded border text-sm disabled:opacity-50"
            >
              Trang trước
            </button>
            <span className="text-sm text-gray-600">
              Trang <b>{page}</b> / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 rounded border text-sm disabled:opacity-50"
            >
              Trang sau
            </button>
            <button
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
              className="px-2 py-1 rounded border text-sm disabled:opacity-50"
            >
              »
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {openShare && (
        <ShareSaleModal
          open={!!openShare}
          sale={openShare}
          customers={customers}
          onClose={() => setOpenShare(null)}
          onSent={() => {}}
        />
      )}

      {openAdd && (
        <AddSaleModal
          open={openAdd}
          onClose={() => setOpenAdd(false)}
          onAdd={createSale}
        />
      )}

      {openDisable && (
        <ConfirmDisableModal
          open={openDisable}
          onClose={() => setOpenDisable(null)}
          onConfirm={() => disableSale(openDisable.id)}
        />
      )}

      {/* ConfirmModal chung */}
      <ConfirmModal
        open={confirmOpen}
        message={confirmMessage}
        successMessage={confirmSuccessMsg}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={confirmAction}
      />
    </div>
  );
}
