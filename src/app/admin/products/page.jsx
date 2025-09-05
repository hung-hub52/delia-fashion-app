// src/app/admin/products/page.jsx
"use client";

import { useState, useMemo, useEffect } from "react";
import { Eye, Trash2 } from "lucide-react";
import NotifyToast from "@/notify/ui/NotifyToast";
import AddProductsModal from "@/components/admin/products/AddProductsModal";
import ViewProductsModal from "@/components/admin/products/ViewProductsModal";
import { toast } from "react-hot-toast";
import { useInventory } from "@/context/InventoryContext";

export default function ProductsPage() {
  const { seedFromProducts, removeFromInventory, sellProduct } =
    useInventory() || {};

  // DỮ LIỆU MẪU (có stock luôn)
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Mũ nam QC",
      sku: "SP001",
      parentCategory: "Mũ",
      category: "Mũ lưỡi trai",
      retailPrice: 150000,
      importPrice: 100000,
      description: "Mũ thời trang nam QC",
      image: "",
      initWarehouse: true,
      stock: 100,
      unit: "Cái",
      branch: "Kho mặc định",
    },
    {
      id: 2,
      name: "Túi xách nữ",
      sku: "SP002",
      parentCategory: "Phụ kiện",
      category: "Túi thời trang",
      retailPrice: 300000,
      importPrice: 200000,
      description: "Túi xách nữ cao cấp",
      image: "",
      initWarehouse: true,
      stock: 50,
      unit: "Cái",
      branch: "Kho mặc định",
    },
  ]);

  // Seed sang kho
  useEffect(() => {
    if (typeof seedFromProducts === "function") {
      seedFromProducts(products);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [searchName, setSearchName] = useState("");
  const [searchCategory] = useState("");
  const [searchStatus] = useState("");
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [targetId, setTargetId] = useState(null);

  // thêm SP mới
  const handleAddProduct = (data) => {
    const [parentCategory, childCategory] = data.category?.includes("-")
      ? data.category.split("-")
      : ["", data.category];

    const stockQty = data.initWarehouse
      ? Number(data.initialStock || data.weight || 0)
      : null;

    const newRow = {
      id: Date.now(),
      name: data.name,
      sku: data.sku || `SP${Date.now()}`,
      parentCategory: (parentCategory || "").trim(),
      category: (childCategory || "").trim(),
      retailPrice: data.retailPrice === "" ? 0 : Number(data.retailPrice),
      importPrice: data.importPrice === "" ? 0 : Number(data.importPrice),
      description: data.description || "",
      image: data.image || "",
      initWarehouse: !!data.initWarehouse,
      stock: stockQty,
      unit: data.initWarehouse ? data.unit : null,
      branch: "Kho mặc định",
    };

    setProducts((prev) => [...prev, newRow]);
  };

  // ✅ Hàm bán sản phẩm (được gọi khi user mua hàng)
  const handleSellProduct = (sku, qty) => {
    if (!sku || !qty || qty <= 0) return;

    // 1. Trừ kho (context)
    if (typeof sellProduct === "function") {
      sellProduct(sku, qty);
    }

    // 2. Trừ luôn cột stock ở ProductsPage
    setProducts((prev) =>
      prev.map((p) =>
        p.sku === sku ? { ...p, stock: Math.max(0, (p.stock || 0) - qty) } : p
      )
    );
  };

  // lọc hiển thị
  const filtered = useMemo(() => {
    return products.filter((p) => {
      return (
        (!searchName ||
          p.name.toLowerCase().includes(searchName.toLowerCase())) &&
        (!searchCategory || p.category === searchCategory) &&
        (!searchStatus || p.status === searchStatus)
      );
    });
  }, [products, searchName, searchCategory, searchStatus]);

  const confirmDelete = (id) => {
    setTargetId(id);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    setProducts((prev) => prev.filter((p) => p.id !== targetId));

    // ✅ tìm sản phẩm để lấy sku xoá trong kho
    const deleted = products.find((p) => p.id === targetId);
    if (deleted?.sku) {
      removeFromInventory(deleted.sku);
    }

    toast.success("🗑️ Xóa sản phẩm thành công!");
    setDeleteOpen(false);
  };

  const handleCancelDelete = () => {
    toast.error("❌ Đã hủy thao tác xoá");
    setDeleteOpen(false);
  };

  return (
    <div className="p-4 sm:p-6 text-gray-800">
      <NotifyToast />

      {/* Thanh nút */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <button
          onClick={() => setOpen(true)}
          className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          + Thêm sản phẩm
        </button>
        <button className="rounded-md bg-amber-300 px-4 py-2 text-gray-900 hover:bg-amber-400">
          Thêm file Excel
        </button>
        <button className="rounded-md bg-orange-400 px-4 py-2 text-gray-900 hover:bg-orange-200">
          Xuất Excel
        </button>

        <div className="flex flex-wrap items-center gap-2 ml-auto">
          <input
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder="Tìm sản phẩm"
            className="rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-sky-400"
          />
        </div>
      </div>

      {/* Bảng sản phẩm */}
      <div className="overflow-hidden rounded-xl border shadow-sm">
        <div className="bg-teal-500 px-4 py-3 text-white font-semibold uppercase">
          Quản lý sản phẩm
        </div>
        <div className="w-full overflow-x-auto bg-white">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50 text-gray-700">
                <th className="p-2 text-left">STT</th>
                <th className="p-2 text-left">Tên sản phẩm</th>
                <th className="p-2 text-left">Danh mục</th>
                <th className="p-2 text-left">Số lượng nhập</th>
                <th className="p-2 text-left">Giá bán</th>
                <th className="p-2 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, idx) => (
                <tr
                  key={row.id || idx}
                  className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="p-2">{idx + 1}</td>
                  <td className="p-2">{row.name}</td>
                  <td className="p-2">
                    {row.parentCategory
                      ? `${row.parentCategory} - ${row.category}`
                      : row.category}
                  </td>

                  {/* ✅ lấy từ stock */}
                  <td className="p-2">
                    {row.stock != null
                      ? `${row.stock} ${row.unit || ""}`
                      : "---"}
                  </td>

                  <td className="p-2">
                    {row.retailPrice != null
                      ? `${row.retailPrice.toLocaleString("vi-VN")} ₫`
                      : "-"}
                  </td>

                  <td className="p-2 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        className="rounded-md bg-sky-500 p-1 text-white hover:bg-sky-600"
                        title="Xem"
                        onClick={() => {
                          setSelectedProduct(row);
                          setViewOpen(true);
                        }}
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="rounded-md bg-red-500 p-1 text-white hover:bg-red-600"
                        title="Xóa"
                        onClick={() => confirmDelete(row.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-gray-400">
                    Chưa có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <AddProductsModal
        open={open}
        onClose={() => setOpen(false)}
        onSave={handleAddProduct}
      />

      <ViewProductsModal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        product={selectedProduct}
        onUpdate={(updated) => {
          setProducts((prev) =>
            prev.map((p) => (p.id === updated.id ? updated : p))
          );
          setSelectedProduct(updated);
        }}
      />

      {deleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 shadow-xl max-w-sm w-full text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Bạn có chắc muốn xoá sản phẩm này?
            </h3>
            <div className="flex justify-center gap-3">
              <button
                onClick={handleCancelDelete}
                className="rounded-md bg-gray-200 px-4 py-2 hover:bg-gray-300"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmDelete}
                className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
              >
                Xoá
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
