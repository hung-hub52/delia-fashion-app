// src/components/admin/orders/AddOrderModal.jsx
"use client";
import { useEffect, useRef, useState, useMemo } from "react";
import { X } from "lucide-react";
import PrintInvoice from "./PrintInvoice";

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3001").replace(/\/$/, "");

const fmt = (n) =>
  (Number(n) || 0).toLocaleString("vi-VN", { maximumFractionDigits: 0 }) + " ₫";

const useDebounced = (value, delay = 250) => {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
};

export default function AddOrderModal({ open, onClose }) {
  const [code] = useState(`DH${Date.now()}`);
  const [customer, setCustomer] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [note, setNote] = useState("");

  // mỗi item: { productId, name, qty, price }
  const [items, setItems] = useState([{ productId: null, name: "", qty: 0, price: 0 }]);

  // khóa cuộn nền + Esc để đóng
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const updateItem = (index, field, value) => {
    setItems((prev) =>
      prev.map((it, i) =>
        i === index
          ? {
              ...it,
              [field]:
                field === "name"
                  ? value
                  : field === "qty" || field === "price"
                  ? Math.max(0, Number(value || 0))
                  : value,
            }
          : it
      )
    );
  };

  const totalQuantity = items.reduce((s, i) => s + (Number(i.qty) || 0), 0);
  const totalPrice = items.reduce((s, i) => s + (Number(i.qty) * Number(i.price) || 0), 0);

  const draftItems = items
    .filter((i) => i.name && Number(i.qty) > 0)
    .map((i) => ({ ...i, amount: Number(i.qty) * Number(i.price) }));

  const draftOrder = {
    id: Date.now(),
    code,
    customer,
    phone,
    address,
    date,
    items: draftItems,
    itemCount: draftItems.length,
    quantity: draftItems.reduce((s, it) => s + it.qty, 0),
    total: draftItems.reduce((s, it) => s + it.amount, 0),
    status: "Chờ xử lý",
    paymentStatus: "Chưa thanh toán",
    note,
  };

  const canPrint = draftItems.length > 0 && draftOrder.total > 0;

  if (!open) return null;

  return (
    // backdrop: click ra ngoài để đóng
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="relative bg-white rounded-xl shadow-xl w-[min(100vw-2rem,900px)] p-6 text-gray-800 max-h-[95vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // chặn đóng khi click trong modal
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold uppercase">➕ Thêm đơn hàng</h2>
          <button
            onClick={onClose}
            className="rounded-full bg-red-500 p-2 text-white hover:bg-red-600"
            aria-label="Đóng"
          >
            <X size={18} />
          </button>
        </div>

        {/* Thông tin chung */}
        <div className="grid grid-cols-1 gap-3 mb-4">
          <input className="w-full border rounded-md px-3 py-2" placeholder="Khách hàng"
            value={customer} onChange={(e) => setCustomer(e.target.value)} />
          <input className="w-full border rounded-md px-3 py-2" placeholder="Số điện thoại"
            value={phone} onChange={(e) => setPhone(e.target.value)} />
          <input className="w-full border rounded-md px-3 py-2" placeholder="Địa chỉ"
            value={address} onChange={(e) => setAddress(e.target.value)} />
          <input type="date" className="w-full border rounded-md px-3 py-2"
            value={date} onChange={(e) => setDate(e.target.value)} />
        </div>

        {/* Bảng mặt hàng */}
        <div className="mb-4">
          <h3 className="font-semibold text-gray-800 mb-2 flex items-center justify-between">
            🛒 Thêm mặt hàng
            <button
              type="button"
              onClick={() =>
                setItems((prev) => [...prev, { productId: null, name: "", qty: 0, price: 0 }])
              }
              className="flex items-center gap-1 rounded-md bg-green-500 px-3 py-1 text-white hover:bg-green-600 text-sm"
            >
              + Thêm dòng
            </button>
          </h3>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border rounded-md">
              <thead>
                <tr className="bg-gray-100 text-gray-700 border-b">
                  <th className="p-2 text-left w-[42%]">Tên mặt hàng</th>
                  <th className="p-2 text-center w-24">Số lượng</th>
                  <th className="p-2 text-right w-32">Đơn giá</th>
                  <th className="p-2 text-right w-32">Thành tiền</th>
                  <th className="p-2 text-center w-16">Xóa</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <RowItem
                    key={idx}
                    idx={idx}
                    item={item}
                    onPickProduct={(p) => {
                      setItems((prev) =>
                        prev.map((it, i) =>
                          i === idx
                            ? {
                                ...it,
                                productId: p.id,
                                name: p.name,
                                price: Number(p.price) || 0,
                                qty: it.qty > 0 ? it.qty : 1,
                              }
                            : it
                        )
                      );
                    }}
                    onChange={(field, value) => updateItem(idx, field, value)}
                    onRemove={() =>
                      setItems((prev) => prev.filter((_, i) => i !== idx))
                    }
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tổng kết */}
        <div className="space-y-2 text-gray-700 mb-4">
          <p><b>Tổng số sản phẩm:</b> {totalQuantity}</p>
          <p><b>Tổng tiền:</b> {fmt(totalPrice)}</p>
          <textarea
            placeholder="Ghi chú"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        {/* Footer: In hóa đơn */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-md bg-gray-200 px-4 py-2 hover:bg-gray-300 text-gray-800"
          >
            Hủy
          </button>
          <div className={`${!canPrint ? "opacity-50 pointer-events-none" : ""}`}>
            <PrintInvoice order={draftOrder} />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Hàng sản phẩm với typeahead từ BE (không preload) */
function RowItem({ idx, item, onPickProduct, onChange, onRemove }) {
  const [q, setQ] = useState(item.name || "");
  const [openList, setOpenList] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggests, setSuggests] = useState([]);
  const debounced = useDebounced(q, 250);
  const boxRef = useRef(null);
  const controllerRef = useRef(null);

  useEffect(() => setQ(item.name || ""), [item.name]);

  // fetch gợi ý khi debounced thay đổi
  useEffect(() => {
    if (!debounced) { setSuggests([]); return; }
    controllerRef.current?.abort?.();
    const ac = new AbortController();
    controllerRef.current = ac;

    (async () => {
      try {
        setLoading(true);
        const token =
   typeof window !== "undefined" ? localStorage.getItem("token") : null;
 const res = await fetch(
   `${API_BASE}/api/products/suggest?q=${encodeURIComponent(debounced)}&limit=12`,
   {
     signal: ac.signal,
     credentials: "include", // nếu BE dùng cookie-session
     headers: token
       ? { Authorization: `Bearer ${String(token).replace(/^"|"$/g, "")}` }
       : {},
  }
 );
        if (!res.ok) throw new Error();
        const rows = await res.json();
        const norm = (Array.isArray(rows) ? rows : rows?.items || []).map((p) => ({
          id: p.id ?? p.id_san_pham ?? p.product_id,
          name: p.name ?? p.ten_san_pham ?? "",
          price: Number(p.price ?? p.gia_ban ?? 0),
        })).filter((x) => x.id && x.name);
        setSuggests(norm);
      } catch (e) {
        if (!ac.signal.aborted) setSuggests([]);
      } finally {
        setLoading(false);
      }
    })();

    return () => ac.abort();
  }, [debounced]);

  // click outside -> đóng
  useEffect(() => {
    const onDoc = (e) => { if (boxRef.current && !boxRef.current.contains(e.target)) setOpenList(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const amount = (Number(item.qty) || 0) * (Number(item.price) || 0);

  return (
    <tr className="border-b text-gray-800 align-top">
      <td className="p-2">
        <div className="relative" ref={boxRef}>
          <input
            type="text"
            placeholder="Tìm sản phẩm..."
            value={q}
            onChange={(e) => { setQ(e.target.value); onChange("name", e.target.value); setOpenList(true); }}
            onFocus={() => setOpenList(true)}
            className="w-full border rounded-md px-2 py-1"
            autoComplete="off"
          />
          {openList && (
            <div className="absolute z-20 mt-1 w-full bg-white border rounded-md shadow-lg max-h-72 overflow-auto">
              <div className="px-3 py-2 text-xs text-gray-500 flex items-center gap-2">
                <span className="inline-block w-4 text-center">🏬</span>
                Tìm “{q}”
              </div>
              {loading ? (
                <div className="px-3 py-2 text-sm text-gray-500">Đang tìm...</div>
              ) : suggests.length === 0 ? (
                <div className="px-3 py-2 text-sm text-gray-500">Không có kết quả</div>
              ) : (
                suggests.map((p) => (
                  <button
                    key={`${p.id}`}
                    type="button"
                    className="w-full text-left px-3 py-2 hover:bg-violet-50"
                    onClick={() => {
                      onPickProduct(p);
                      setQ(p.name);
                      setOpenList(false);
                    }}
                  >
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-gray-500">Mã: {p.id} • Giá: {fmt(p.price)}</div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </td>

      <td className="p-2 text-center">
        <input
          type="number" min="0"
          value={item.qty}
          onChange={(e) => onChange("qty", Math.max(0, Number(e.target.value || 0)))}
          className="w-20 border rounded-md px-2 py-1 text-center"
        />
      </td>

      <td className="p-2 text-right">
        <input
          type="number" min="0"
          value={item.price}
          onChange={(e) => onChange("price", Math.max(0, Number(e.target.value || 0)))}
          className="w-28 border rounded-md px-2 py-1 text-right"
        />
      </td>

      <td className="p-2 text-right">{fmt(amount)}</td>

      <td className="p-2 text-center">
        <button
          type="button"
          onClick={onRemove}
          className="rounded-md bg-red-500 px-2 py-1 text-white hover:bg-red-600 text-xs"
        >
          Xóa
        </button>
      </td>
    </tr>
  );
}
