// src/components/admin/products/AddProductsModal.jsx
"use client";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useCategoriesContext } from "@/context/CategoriesContext";
import { useInventory } from "@/context/InventoryContext";

const API = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api").replace(/\/$/, "");

function Label({ children, required = false }) {
  return (
    <label className="block text-sm font-medium text-gray-700">
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
}

const initialForm = {
  name: "",
  sku: "", // sẽ auto-fill
  category: "",
  parentCategory: "",
  retailPrice: "",
  importPrice: "",
  description: "",
  weight: "",           // số lượng nhập
  unit: "Cái",
  branch: "",
  initialStock: "",     // tồn kho ban đầu
  cost: "",
  image: null,
  initWarehouse: false,
};

export default function AddProductsModal({ open, onClose, onSave }) {
  const [closing, setClosing] = useState(false);
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const { categories } = useCategoriesContext();
  const { addToInventory } = useInventory();

  // options DM
  const parentOptions = [
    ...new Set(categories.map((c) => c.parentName).filter(Boolean)),
  ];
  const [selectedParent, setSelectedParent] = useState("");
  const childOptions = categories.filter((c) => c.parentName === selectedParent);

  // ---------- Helper: Lấy SKU tiếp theo ----------
  const computeNextFromList = (items = []) => {
    let maxNum = 0;
    for (const it of items) {
      const raw = it?.sku ?? it?.ma_san_pham ?? it?.ma ?? it?.code ?? "";
      const m = String(raw).match(/^SP(\d+)$/i);
      if (m) {
        const n = parseInt(m[1], 10);
        if (!Number.isNaN(n)) maxNum = Math.max(maxNum, n);
      }
    }
    return `SP${maxNum + 1 || 1}`;
  };

  const fetchNextSku = async () => {
    try {
      // 1) Thử endpoint chuyên dụng (nếu backend có)
      const res = await fetch(`${API}/products/next-sku`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data?.sku) return String(data.sku);
      }
    } catch {}
    try {
      // 2) Fallback: lấy list và tự tính
      const res = await fetch(`${API}/products?page=1&limit=500`, { credentials: "include" });
      const data = await res.json().catch(() => ({}));
      const items = Array.isArray(data) ? data : data.items || data.data || [];
      return computeNextFromList(items);
    } catch {
      // 3) Cuối cùng vẫn đảm bảo trả về SP1+
      return "SP1";
    }
  };

  // Reset + auto SKU khi mở modal
  useEffect(() => {
    let alive = true;
    if (open) {
      setClosing(false);
      setErrors({});
      setSelectedParent("");
      (async () => {
        const nextSku = await fetchNextSku();
        if (!alive) return;
        setFormData({ ...initialForm, sku: nextSku });
      })();
    }
    return () => { alive = false; };
  }, [open]);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      onClose?.();
      setClosing(false);
      setFormData(initialForm);
      setSelectedParent("");
    }, 300);
  };

  // Đồng bộ 2 field số lượng: nhập cái này thì set cái kia
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      let updated = { ...prev, [name]: value };

      if (name === "weight") {
        updated.initialStock = value;
      }
      if (name === "initialStock") {
        updated.weight = value;
      }
      return updated;
    });
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const fd = new FormData();
      fd.append("file", file);
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const res = await fetch(`${API}/products/upload-image`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${String(token).replace(/^"|"$/g, "")}` } : {},
        body: fd,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.image_url) throw new Error(data?.message || "Upload ảnh thất bại");
      setFormData((prev) => ({ ...prev, image: data.image_url }));
    } catch {
      // fallback preview local
      setFormData((prev) => ({ ...prev, image: URL.createObjectURL(file) }));
    }
  };

  const ensureSku = async () => {
    let sku = (formData.sku || "").trim();
    if (!sku) sku = await fetchNextSku();
    // nếu user cố xóa nội dung ô SKU (dù là readOnly), vẫn đảm bảo phát sinh lại
    return sku || "SP1";
  };

  const handleSubmit = async () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Vui lòng nhập tên sản phẩm";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const autoSku = await ensureSku();

    // Chuẩn hoá số
    const normalized = {
      ...formData,
      sku: autoSku,
      retailPrice: formData.retailPrice === "" ? 0 : Number(formData.retailPrice),
      importPrice: formData.importPrice === "" ? 0 : Number(formData.importPrice),
      initialStock:
        formData.initialStock === "" && formData.weight !== ""
          ? Number(formData.weight)
          : Number(formData.initialStock || 0),
      weight:
        formData.weight === "" && formData.initialStock !== ""
          ? Number(formData.initialStock)
          : Number(formData.weight || 0),
      unit: formData.unit || "Cái",
      branch: "Kho mặc định",
    };

    try {
      onSave(normalized);
      if (normalized.initWarehouse) {
        addToInventory(normalized);
      }
    } catch (err) {
      console.error("❌ Lỗi khi thêm sản phẩm:", err);
    } finally {
      setFormData(initialForm);
      handleClose();
    }
  };

  if (!open && !closing) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div
        className={`relative w-full max-w-4xl rounded-2xl bg-white shadow-2xl transform transition-all ${
          closing ? "animate-slideDown" : "animate-slideUp"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between rounded-t-2xl bg-gradient-to-r from-sky-500 to-indigo-500 px-6 py-4">
          <h2 className="text-lg font-bold text-white">➕ SẢN PHẨM MỚI</h2>
          <button
            onClick={handleClose}
            className="rounded-full bg-red-500 p-2 text-white hover:bg-red-600 shadow"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nội dung */}
        <div className="max-h-[80vh] overflow-y-auto px-6 py-6">
          {/* Thông tin sản phẩm */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label required>Tên sản phẩm</Label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-lg border p-2 focus:ring-2 focus:ring-sky-400"
              />
              {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
            </div>

            <div>
              <Label required>Danh mục sản phẩm</Label>
              <div className="flex gap-2">
                <select
                  value={selectedParent}
                  onChange={(e) => {
                    setSelectedParent(e.target.value);
                    setFormData((prev) => ({
                      ...prev,
                      parentCategory: e.target.value,
                      category: "",
                    }));
                  }}
                  className="w-1/2 rounded-lg border p-2 focus:ring-2 focus:ring-sky-400"
                >
                  <option value="">-- Chọn danh mục cha --</option>
                  {parentOptions.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-1/2 rounded-lg border p-2 focus:ring-2 focus:ring-sky-400"
                  disabled={!selectedParent}
                >
                  <option value="">-- Chọn danh mục con --</option>
                  {childOptions.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* SKU: Tự sinh + khóa sửa */}
            <div>
              <Label>Mã sản phẩm</Label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                readOnly
                className="w-full rounded-lg border p-2 bg-gray-100 text-gray-700 cursor-not-allowed"
                onFocus={async () => {
                  // nếu vì lý do gì đó đang rỗng, auto fill lại khi focus
                  if (!formData.sku) {
                    const next = await fetchNextSku();
                    setFormData((prev) => ({ ...prev, sku: next }));
                  }
                }}
              />
              <p className="text-xs text-gray-500 mt-1">Mã được tự động tạo (ví dụ: SP7)</p>
            </div>
          </div>

          {/* Giá */}
          <h3 className="mt-6 text-lg font-semibold text-gray-800">💰 GIÁ SẢN PHẨM</h3>
          <div className="mt-2 grid grid-cols-2 gap-4">
            <div>
              <Label required>Giá bán</Label>
              <input
                type="number"
                name="retailPrice"
                value={formData.retailPrice}
                onChange={handleChange}
                className="w-full rounded-lg border p-2 focus:ring-2 focus:ring-sky-400"
              />
            </div>
            <div>
              <Label required>Giá nhập</Label>
              <input
                type="number"
                name="importPrice"
                value={formData.importPrice}
                onChange={handleChange}
                className="w-full rounded-lg border p-2 focus:ring-2 focus:ring-sky-400"
              />
            </div>
          </div>

          {/* Mô tả + ảnh */}
          <h3 className="mt-6 text-lg font-semibold text-gray-800">📝 MÔ TẢ</h3>
          <div className="mt-2 grid grid-cols-2 gap-4">
            <div>
              <Label>Mô tả sản phẩm</Label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                className="w-full rounded-lg border p-2 focus:ring-2 focus:ring-sky-400"
              />
            </div>
            <div>
              <Label>Ảnh sản phẩm</Label>
              <div className="relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 hover:border-sky-400 transition">
                {formData.image ? (
                  <div className="relative">
                    <img
                      src={formData.image}
                      alt="preview"
                      className="mb-3 h-40 object-contain rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, image: "" }))}
                      className="absolute top-1 right-1 rounded-full bg-red-500 text-white p-1 hover:bg-red-600 shadow"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <span className="mb-3 text-gray-400">Kéo & thả ảnh vào đây</span>
                )}
                <label className="cursor-pointer rounded bg-sky-500 px-4 py-2 text-white hover:bg-sky-600">
                  Chọn tệp tải lên
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              </div>
            </div>
          </div>

          {/* Kho hàng */}
          <div className="mt-6 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">📦 KHO HÀNG</h3>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={formData.initWarehouse || false}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    initWarehouse: e.target.checked,
                  }))
                }
                className="h-4 w-4 accent-sky-500"
              />
              Khởi tạo kho
            </label>
          </div>

          {formData.initWarehouse && (
            <div className="mt-2 grid grid-cols-2 gap-6">
              <div>
                <Label>Số lượng nhập</Label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  className="w-full rounded-lg border p-2 focus:ring-2 focus:ring-sky-400"
                />
              </div>
              <div>
                <Label required>Đơn vị</Label>
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  className="w-full rounded-lg border p-2 focus:ring-2 focus:ring-sky-400"
                >
                  <option value="Cái">Cái</option>
                </select>
              </div>
              <div>
                <Label required>Chi nhánh</Label>
                <input
                  type="text"
                  name="branch"
                  value="Kho mặc định"
                  readOnly
                  className="w-full rounded-lg border p-2 bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div>
                <Label>Tồn kho ban đầu</Label>
                <input
                  type="number"
                  name="initialStock"
                  value={formData.initialStock}
                  onChange={handleChange}
                  className="w-full rounded-lg border p-2 focus:ring-2 focus:ring-sky-400"
                />
              </div>
            </div>
          )}

          {/* Nút */}
          <div className="mt-8 flex justify-end gap-4">
            <button
              onClick={handleSubmit}
              className="rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-2 text-white font-semibold shadow hover:opacity-90"
            >
              ✅ Thêm sản phẩm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
