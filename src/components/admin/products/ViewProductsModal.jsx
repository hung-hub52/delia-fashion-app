// src/components/admin/products/ViewProductsModal.jsx
"use client";
import { useState, useEffect } from "react";
import { X, Pencil, Save, Undo2 } from "lucide-react";
import { useCategoriesContext } from "@/context/CategoriesContext";
import { useInventory } from "@/context/InventoryContext";

export default function ViewProductsModal({
  open,
  onClose,
  product,
  onUpdate,
}) {
  const [closing, setClosing] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(product || {});
  const { categories } = useCategoriesContext();
  const [selectedParent, setSelectedParent] = useState(
    draft.parentCategory || ""
  );
  const { updateInventory } = useInventory();

  const parentOptions = [
    ...new Set(categories.map((c) => c.parentName).filter(Boolean)),
  ];
  const childOptions = categories.filter(
    (c) => c.parentName === selectedParent
  );

  useEffect(() => {
    if (open) setClosing(false);
  }, [open]);

  useEffect(() => {
    setDraft(product || {});
    setEditing(false);
  }, [product]);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      onClose?.();
      setClosing(false);
    }, 300);
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setDraft((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      const url = URL.createObjectURL(f);
      setDraft((prev) => ({ ...prev, image: url }));
    }
  };

  const handleSave = () => {
    const oldStock = Number(product.stock || 0);
    const addQty =
      draft.stock === "" || draft.stock == null ? 0 : Number(draft.stock);

    // ✅ cộng dồn số lượng thêm vào tồn kho
    const newStock = oldStock + addQty;

    const payload = {
      ...product,
      name: draft.name || "",
      parentCategory: draft.parentCategory || "",
      category: draft.category || "",
      retailPrice:
        draft.retailPrice === "" || draft.retailPrice == null
          ? 0
          : Number(draft.retailPrice),
      importPrice:
        draft.importPrice === "" || draft.importPrice == null
          ? 0
          : Number(draft.importPrice),
      description: draft.description || "",
      image: draft.image || "",
      stock: newStock, // ✅ lưu tồn kho mới (cộng dồn)
      unit: draft.unit || product.unit || "",
      branch: draft.branch || "Kho mặc định",
    };

    // cập nhật lại ProductsPage
    onUpdate?.(payload);

    // cập nhật Inventory (log diff để vào lịch sử)
    if (addQty !== 0) {
      updateInventory({ ...payload, diff: addQty });
    }

    setEditing(false);
  };

  if (!open && !closing) return null;
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div
        className={`relative w-full max-w-4xl rounded-2xl bg-white shadow-2xl transform transition-all ${
          closing ? "animate-slideDown" : "animate-slideUp"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between rounded-t-2xl bg-gradient-to-r from-indigo-500 to-sky-500 px-6 py-4">
          <h2 className="text-lg font-bold text-white uppercase tracking-wide">
            📖 Thông tin sản phẩm
          </h2>
          <button
            onClick={handleClose}
            className="rounded-full bg-red-500 p-2 text-white hover:bg-red-600 shadow"
            title="Đóng"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nội dung */}
        <div className="max-h-[80vh] overflow-y-auto px-6 py-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Tên */}
            <div className="relative p-4 rounded-lg border bg-gray-50">
              <p className="font-semibold text-gray-600">Tên sản phẩm</p>
              {!editing ? (
                <p className="text-gray-800 text-lg">{product.name || "---"}</p>
              ) : (
                <input
                  name="name"
                  value={draft.name || ""}
                  onChange={onChange}
                  className="mt-1 w-full rounded-md border p-2"
                  placeholder="Nhập tên sản phẩm"
                />
              )}
              {!editing && (
                <button
                  className="absolute right-3 top-3 rounded-md bg-sky-500 p-2 text-white hover:bg-sky-600"
                  onClick={() => setEditing(true)}
                  title="Chỉnh sửa"
                >
                  <Pencil size={16} />
                </button>
              )}
            </div>

            {/* Mã sản phẩm */}
            <div className="p-4 rounded-lg border bg-gray-50">
              <p className="font-semibold text-gray-600">Mã sản phẩm</p>
              <p className="text-gray-800">{product.sku || "---"}</p>
            </div>

            {/* Danh mục */}
            <div className="p-4 rounded-lg border bg-gray-50">
              <p className="font-semibold text-gray-600">Danh mục sản phẩm</p>
              {!editing ? (
                <p className="text-gray-800">
                  {product.parentCategory
                    ? `${product.parentCategory} → ${product.category}`
                    : product.category || "---"}
                </p>
              ) : (
                <div className="mt-1 flex gap-2">
                  <select
                    value={selectedParent}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSelectedParent(val);
                      setDraft((prev) => ({
                        ...prev,
                        parentCategory: val,
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
                    value={draft.category || ""}
                    onChange={(e) =>
                      setDraft((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
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
              )}
            </div>

            {/* Giá bán */}
            <div className="p-4 rounded-lg border bg-gray-50">
              <p className="font-semibold text-gray-600">Giá bán</p>
              {!editing ? (
                <p className="text-green-600 font-bold">
                  {product.retailPrice || product.retailPrice === 0
                    ? `${Number(product.retailPrice).toLocaleString("vi-VN")} ₫`
                    : "---"}
                </p>
              ) : (
                <input
                  type="number"
                  name="retailPrice"
                  value={draft.retailPrice ?? ""}
                  onChange={onChange}
                  className="mt-1 w-full rounded-md border p-2"
                  placeholder="Giá bán"
                />
              )}
            </div>

            {/* Giá nhập */}
            <div className="p-4 rounded-lg border bg-gray-50">
              <p className="font-semibold text-gray-600">Giá nhập</p>
              {!editing ? (
                <p className="text-blue-600 font-bold">
                  {product.importPrice || product.importPrice === 0
                    ? `${Number(product.importPrice).toLocaleString("vi-VN")} ₫`
                    : "---"}
                </p>
              ) : (
                <input
                  type="number"
                  name="importPrice"
                  value={draft.importPrice ?? ""}
                  onChange={onChange}
                  className="mt-1 w-full rounded-md border p-2"
                  placeholder="Giá nhập"
                />
              )}
            </div>

            {/* Số lượng + Đơn vị */}
            <div className="p-4 rounded-lg border bg-gray-50">
              <p className="font-semibold text-gray-600">Số lượng + Đơn vị</p>
              {!editing ? (
                <p className="text-gray-800">
                  {product.stock != null
                    ? `${product.stock} ${product.unit || ""}`
                    : "---"}
                </p>
              ) : (
                <div className="mt-1 flex gap-2">
                  <input
                    type="number"
                    name="stock"
                    value={draft.stock ?? ""}
                    onChange={onChange}
                    className="w-1/2 rounded-md border p-2"
                    placeholder="Nhập số lượng cần thêm"
                  />
                  <select
                    name="unit"
                    value={draft.unit || ""}
                    onChange={onChange}
                    className="w-1/2 rounded-md border p-2"
                  >
                    <option value="">--Đơn vị--</option>
                    <option value="Cái">Cái</option>
                  </select>
                </div>
              )}
            </div>

            {/* Vị trí */}
            <div className="p-4 rounded-lg border bg-gray-50">
              <p className="font-semibold text-gray-600">Vị trí</p>
              {!editing ? (
                <p className="text-gray-800">
                  {product.branch || "Kho mặc định"}
                </p>
              ) : (
                <input
                  name="branch"
                  value={draft.branch || "Kho mặc định"}
                  onChange={onChange}
                  className="mt-1 w-full rounded-md border p-2"
                  placeholder="Kho"
                />
              )}
            </div>

            {/* Mô tả */}
            <div className="col-span-2 p-4 rounded-lg border bg-gray-50">
              <p className="font-semibold text-gray-600">Mô tả</p>
              {!editing ? (
                <p className="text-gray-800 whitespace-pre-line">
                  {product.description || "---"}
                </p>
              ) : (
                <textarea
                  name="description"
                  value={draft.description || ""}
                  onChange={onChange}
                  rows={4}
                  className="mt-1 w-full rounded-md border p-2"
                  placeholder="Mô tả sản phẩm"
                />
              )}
            </div>

            {/* Hình ảnh */}
            <div className="col-span-2 p-4 rounded-lg border bg-gray-50">
              <p className="font-semibold text-gray-600">Hình ảnh</p>
              {!editing ? (
                product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="mt-2 h-60 w-full rounded-lg border object-contain shadow"
                  />
                ) : (
                  <p className="text-gray-400">Chưa có ảnh</p>
                )
              ) : (
                <div className="mt-2 flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6">
                  {draft.image ? (
                    <img
                      src={draft.image}
                      alt="preview"
                      className="mb-3 h-40 object-contain rounded-lg"
                    />
                  ) : (
                    <span className="mb-3 text-gray-400">
                      Kéo & thả hoặc chọn tệp
                    </span>
                  )}
                  <label className="cursor-pointer rounded bg-sky-500 px-4 py-2 text-white hover:bg-sky-600">
                    Chọn tệp tải lên
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Nút lưu / hủy */}
          {editing && (
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setDraft(product);
                  setEditing(false);
                }}
                className="inline-flex items-center gap-2 rounded-md bg-gray-100 px-4 py-2 hover:bg-gray-200"
              >
                <Undo2 size={16} /> Hủy
              </button>
              <button
                onClick={handleSave}
                className="inline-flex items-center gap-2 rounded-md bg-emerald-500 px-4 py-2 text-white hover:bg-emerald-600"
              >
                <Save size={16} /> Lưu
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
