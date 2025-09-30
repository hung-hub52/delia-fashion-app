"use client";

import { useEffect, useMemo, useState } from "react";
import { X, Send, Mail, Loader2 } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

function authHeaders() {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function ShareSaleModal({ open, onClose, sale, customers }) {
  const [subject, setSubject] = useState("");
  const [html, setHtml] = useState("");
  const [sendAll, setSendAll] = useState(false);
  const [selected, setSelected] = useState({}); // {email: true}
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // khởi tạo nội dung mỗi khi mở modal
  useEffect(() => {
    if (!open || !sale) return;
    setSuccessMsg("");
    setErrorMsg("");
    setSelected({});
    setSendAll(false);

    const defaultSubject = `Ưu đãi: ${sale.code}`;
    const defaultBody = `🎉 Ưu đãi <b>${sale.code}</b> — ${sale.description || ""} ${
      sale.endDate ? `(Kết thúc: ${sale.endDate})` : ""
    }. Dùng ngay nhé!`;
    setSubject(defaultSubject);
    setHtml(defaultBody);
  }, [open, sale]);

  const list = useMemo(
    () => (Array.isArray(customers) ? customers.filter(c => !!c.email) : []),
    [customers]
  );

  const toggleOne = (email) =>
    setSelected((prev) => ({ ...prev, [email]: !prev[email] }));

  const chosenEmails = useMemo(
    () => Object.keys(selected).filter((e) => selected[e]),
    [selected]
  );

  async function handleSend() {
    setSuccessMsg("");
    setErrorMsg("");

    // validate nhanh
    if (!subject.trim()) return setErrorMsg("Vui lòng nhập tiêu đề.");
    if (!html.trim()) return setErrorMsg("Vui lòng nhập nội dung email.");
    if (!sendAll && chosenEmails.length === 0)
      return setErrorMsg("Bạn chưa chọn khách hàng nào.");

    try {
      setSubmitting(true);
      const res = await fetch(`${API}/sales/${sale.id}/share-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(),
        },
        body: JSON.stringify({
          subject: subject.trim(),
          message: html, // giữ nguyên HTML người dùng gõ
          sendAll,
          emails: sendAll ? [] : chosenEmails,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);

      // BE trả { ok: true, sent: n }
      setSuccessMsg(`Đã gửi thành công ${data?.sent ?? 0} email.`);
    } catch (e) {
      setErrorMsg(e.message || "Gửi email thất bại");
    } finally {
      setSubmitting(false);
    }
  }

  if (!open || !sale) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div className="flex items-center gap-2">
            <Mail className="text-emerald-600" size={18} />
            <h3 className="text-lg font-semibold">Chia sẻ khuyến mãi qua Email</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-100"
            title="Đóng"
          >
            <X size={18} />
          </button>
        </div>

        {/* Thông báo trong popup */}
        {(successMsg || errorMsg) && (
          <div
            className={`mx-5 mt-4 rounded-md px-3 py-2 text-sm ${
              successMsg
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {successMsg || errorMsg}
          </div>
        )}

        {/* Body */}
        <div className="grid grid-cols-1 gap-4 px-5 py-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Tiêu đề</label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full rounded-md border px-3 py-2"
              placeholder="Tiêu đề email"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Nội dung gửi (có thể dùng HTML cơ bản)
            </label>
            <textarea
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              rows={5}
              className="w-full rounded-md border px-3 py-2"
              placeholder="Ví dụ: <b>Mã SALE20</b> giảm 20%..."
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="sendAll"
              type="checkbox"
              checked={sendAll}
              onChange={(e) => setSendAll(e.target.checked)}
              className="h-4 w-4"
            />
            <label htmlFor="sendAll" className="select-none">
              Gửi tất cả
            </label>
          </div>

          {/* Danh sách khách hàng */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Danh sách khách hàng
            </label>
            <div className="max-h-56 overflow-auto rounded-md border">
              {list.length === 0 && (
                <div className="p-3 text-sm text-gray-500">
                  Chưa có khách hàng nào có email.
                </div>
              )}
              {list.map((c) => (
                <label
                  key={c.email}
                  className={`flex items-center gap-3 border-b px-3 py-2 text-sm last:border-b-0 ${
                    sendAll ? "opacity-50" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    disabled={sendAll}
                    checked={!!selected[c.email]}
                    onChange={() => toggleOne(c.email)}
                    className="h-4 w-4"
                  />
                  <div>
                    <div className="font-medium">{c.ho_ten || c.name || "Khách hàng"}</div>
                    <div className="text-xs text-gray-500">{c.email}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            onClick={handleSend}
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            {submitting ? "Đang gửi..." : "Gửi email"}
          </button>
        </div>
      </div>
    </div>
  );
}
