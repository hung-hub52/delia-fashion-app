// src/components/admin/orders/AddOrderModal.jsx
"use client";
import { useState } from "react";
import { X } from "lucide-react";

export default function AddOrderModal({ open, onClose, onSave }) {
  const [code, setCode] = useState(`DH${Date.now()}`);
  const [buyer, setBuyer] = useState("");
  const [customer, setCustomer] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [note, setNote] = useState("");
  const [items, setItems] = useState([{ name: "", qty: 0, price: 0 }]);

  // cập nhật giá trị từng ô trong bảng
  const updateItem = (index, field, value) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, [field]: field === "name" ? value : Number(value) }
          : item
      )
    );
  };

  // tính tổng số lượng & tổng tiền
  const totalQuantity = items.reduce((sum, i) => sum + (i.qty || 0), 0);
  const totalPrice = items.reduce((sum, i) => sum + (i.qty * i.price || 0), 0);

  const handleSave = () => {
    const order = {
      id: Date.now(),
      code,
      buyer,
      customer,
      phone,
      address,
      date,
      items,
      itemCount: items.length,
      quantity: totalQuantity,
      total: totalPrice,
      status: "Chờ xử lý", // trạng thái mặc định
      paymentStatus: "Chưa thanh toán",
      note,
    };
    onSave(order);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800 uppercase">
            ➕ Thêm đơn hàng
          </h2>
          <button
            onClick={onClose}
            className="rounded-full bg-red-500 p-2 text-white hover:bg-red-600"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form nhập thông tin */}
        <div className="space-y-3 text-gray-700 mb-4">
          <input
            type="text"
            placeholder="Người mua"
            value={buyer}
            onChange={(e) => setBuyer(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
          />
          <input
            type="text"
            placeholder="Người nhận"
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
          />
          <input
            type="text"
            placeholder="Số điện thoại"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
          />
          <input
            type="text"
            placeholder="Địa chỉ"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        {/* Danh sách mặt hàng */}
        <div className="mb-4">
          <h3 className="font-semibold text-gray-800 mb-2 flex items-center justify-between">
            🛒 Thêm mặt hàng
            <button
              type="button"
              onClick={() =>
                setItems((prev) => [...prev, { name: "", qty: 0, price: 0 }])
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
                  <th className="p-2 text-left">Tên mặt hàng</th>
                  <th className="p-2 text-center w-24">Số lượng</th>
                  <th className="p-2 text-right w-32">Đơn giá</th>
                  <th className="p-2 text-right w-32">Thành tiền</th>
                  <th className="p-2 text-center w-16">Xóa</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={idx} className="border-b text-gray-800">
                    <td className="p-2">
                      <input
                        type="text"
                        placeholder="Tên mặt hàng"
                        value={item.name}
                        onChange={(e) =>
                          updateItem(idx, "name", e.target.value)
                        }
                        className="w-full border rounded-md px-2 py-1"
                      />
                    </td>
                    <td className="p-2 text-center">
                      <input
                        type="number"
                        min="0"
                        placeholder="Số lượng"
                        value={item.qty}
                        onChange={(e) => updateItem(idx, "qty", e.target.value)}
                        className="w-20 border rounded-md px-2 py-1 text-center"
                      />
                    </td>
                    <td className="p-2 text-right">
                      <input
                        type="number"
                        min="0"
                        placeholder="Đơn giá"
                        value={item.price}
                        onChange={(e) =>
                          updateItem(idx, "price", e.target.value)
                        }
                        className="w-28 border rounded-md px-2 py-1 text-right"
                      />
                    </td>
                    <td className="p-2 text-right">
                      {(item.qty * item.price).toLocaleString("vi-VN")} ₫
                    </td>
                    <td className="p-2 text-center">
                      <button
                        type="button"
                        onClick={() =>
                          setItems((prev) => prev.filter((_, i) => i !== idx))
                        }
                        className="rounded-md bg-red-500 px-2 py-1 text-white hover:bg-red-600 text-xs"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tổng kết */}
        <div className="space-y-2 text-gray-700 mb-4">
          <p>
            <b>Tổng số sản phẩm:</b> {totalQuantity}
          </p>
          <p>
            <b>Tổng tiền:</b> {totalPrice.toLocaleString("vi-VN")} ₫
          </p>
          <textarea
            placeholder="Ghi chú"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        {/* Footer buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-md bg-gray-200 px-4 py-2 hover:bg-gray-300 text-gray-800"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            className="rounded-md bg-green-500 px-4 py-2 text-white hover:bg-green-600"
          >
            Lưu đơn hàng
          </button>
        </div>
      </div>
    </div>
  );
}
