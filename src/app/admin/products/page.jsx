"use client";

import { useState, useMemo, useEffect } from "react";
import { Eye, Trash2 } from "lucide-react";
import AdminAuthModal from "@/components/admin/customers/AdminAuthModal";
import NotifyToast from "@/notify/ui/NotifyToast";
import AddProductsModal from "@/components/admin/products/AddProductsModal";
import ViewProductsModal from "@/components/admin/products/ViewProductsModal";
import { toast } from "react-hot-toast";
import { useInventory } from "@/context/InventoryContext";
import { fetchAPI } from "@/utils/api";

export default function ProductsPage() {
  const {
    seedFromProducts,
    removeFromInventory,
    sellProduct,
    addToInventory,
  } = useInventory() || {};

  // dùng fetchAPI cho toàn bộ API call
  async function fetchJSON(endpoint, options = {}) {
    // endpoint: "/products?..." (relative)
    return fetchAPI(endpoint, options);
  }

  // ==== STATE ====
  const [products, setProducts] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchCategory] = useState("");
  const [searchStatus] = useState("");
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [targetId, setTargetId] = useState(null);
  const [needReauth, setNeedReauth] = useState(false);

  // Danh mục để map "Parent - Child" -> id
  const [catById, setCatById] = useState({});

  // ---- LOAD CATEGORIES ----
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchJSON(`/categories?page=1&limit=1000`);
        const list = Array.isArray(data) ? data : data.data || data.items || [];
        const map = {};
        list.forEach((c) => {
          const id = c.id_danh_muc ?? c.id ?? c.category_id;
          map[id] = {
            id,
            name: c.ten_danh_muc ?? c.name ?? c.displayName ?? "",
            parentId: c.parent_id ?? c.parentId ?? null,
            displayName: c.displayName ?? c.ten_danh_muc ?? c.name ?? "",
          };
        });
        Object.values(map).forEach((c) => {
          c.parentName = c.parentId && map[c.parentId] ? map[c.parentId].name : "";
        });
        setCatById(map);
      } catch (e) {
        console.warn("Load categories failed:", e?.message);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- MAP 1 ITEM BE -> UI ROW ----
  const mapFromBE = (it) => {
    const id = it.id_san_pham ?? it.id ?? it.product_id;
    const catId =
      (typeof it.id_danh_muc === "object"
        ? it.id_danh_muc?.id_danh_muc
        : it.id_danh_muc) ?? it.category_id;

    const cat = catId ? catById[catId] : null;
    const parentCategory = cat?.parentName || "";
    const childCategory = cat?.displayName || "";

    const stock =
      it.so_luong_ton ??
      it.so_luong ??
      (typeof it.inventory === "object" ? it.inventory?.so_luong_ton_kho : undefined) ??
      0;

    const retailPrice = Number(it.gia_ban ?? it.price ?? 0);
    const importPrice = Number(it.gia_nhap ?? it.import_price ?? 0);

    const normalizedStatus =
      (it.trang_thai || "").toString().toLowerCase() === "inactive"
        ? "Hết hàng"
        : stock > 0
        ? "Còn hàng"
        : "Hết hàng";

    return {
      id,
      name: it.ten_san_pham ?? it.name ?? "",
      sku: it.sku ?? `SP${id}`,
      parentCategory,
      category: childCategory,
      retailPrice,
      importPrice,
      description: it.mo_ta ?? "",
      image: it.hinh_anh ?? "",
      initWarehouse: stock > 0,
      stock,
      unit: "Cái",
      branch: "Kho mặc định",
      status: normalizedStatus,
      _catId: catId || undefined,
    };
  };

  // ---- LOAD PRODUCTS ----
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchJSON(`/products?page=1&limit=200`);
        const raw = Array.isArray(data) ? data : data.items || data.data || [];
        const mapped = raw.map(mapFromBE);
        setProducts(mapped);
        if (typeof seedFromProducts === "function" && mapped.length) {
          seedFromProducts(mapped);
        }
      } catch (e) {
        toast.error(e.message || "Lỗi tải danh sách sản phẩm");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Object.keys(catById).length]);

  // ---- Tìm id danh mục theo tên ----
  const findCategoryIdByNames = (parentName, childName) => {
    const both = Object.values(catById).find(
      (c) =>
        (c.parentName || "") === (parentName || "") &&
        (c.displayName || c.name || "") === (childName || "")
    );
    if (both?.id) return both.id;
    const child = Object.values(catById).find(
      (c) => (c.displayName || c.name || "") === (childName || "")
    );
    return child?.id;
  };

  // ==== thêm SP mới ====
  const handleAddProduct = async (data) => {
    try {
      const [pName, cName] = data.category?.includes("-")
        ? data.category.split("-")
        : ["", data.category];

      const parentCategory = (pName || "").trim();
      const childCategory = (cName || "").trim();

      const stockQty = data.initWarehouse
        ? Number(data.initialStock || data.weight || 0)
        : 0;

      const id_danh_muc = findCategoryIdByNames(parentCategory, childCategory);

      if (!id_danh_muc) {
        throw new Error("Vui lòng chọn đúng danh mục cha và danh mục con");
      }

      const payload = {
        ten_san_pham: data.name,
        id_danh_muc,
        gia_ban: Number(data.retailPrice || 0),
        gia_nhap: Number(data.importPrice || 0),
        mo_ta: data.description || "",
        hinh_anh: data.image || "",
        so_luong_nhap: Number(data.weight || 0),
        so_luong_ton: stockQty,
        trang_thai: stockQty > 0 ? "active" : "inactive",
      };

      const created = await fetchJSON(`/products`, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const newRow = mapFromBE(created);
      newRow.sku = data.sku || newRow.sku;

      setProducts((prev) => [newRow, ...prev]);

      // Khởi tạo kho ngay khi bật initWarehouse
      if (data.initWarehouse && typeof addToInventory === "function") {
        const qty =
          Number(data.initialStock || data.weight || 0) > 0
            ? Number(data.initialStock || data.weight || 0)
            : 0;

        addToInventory({
          sku: newRow.sku,
          name: newRow.name,
          productId: newRow.id,
          unit: data.unit || "Cái",
          branch: "Kho mặc định",
          stockQty: qty,
          importPrice: Number(data.importPrice || 0),
          retailPrice: Number(data.retailPrice || 0),
          category: newRow.category,
          parentCategory: newRow.parentCategory,
          image: newRow.image || "",
          description: newRow.description || "",
        });
      }

      toast.success("✅ Thêm sản phẩm thành công!");
    } catch (e) {
      toast.error(e.message || "Lỗi thêm sản phẩm");
    }
  };

  // ✅ Hàm bán sản phẩm (được gọi khi user mua hàng)
  const handleSellProduct = (sku, qty) => {
    if (!sku || !qty || qty <= 0) return;

    if (typeof sellProduct === "function") {
      sellProduct(sku, qty);
    }

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
    setNeedReauth(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await fetchJSON(`/products/${targetId}`, { method: "DELETE" });

      setProducts((prev) => prev.filter((p) => p.id !== targetId));

      const deleted = products.find((p) => p.id === targetId);
      if (deleted?.sku) {
        removeFromInventory(deleted.sku);
      }

      toast.success("🗑️ Xóa sản phẩm thành công!");
      setDeleteOpen(false);
    } catch (e) {
      toast.error(e.message || "Lỗi xoá sản phẩm");
      setDeleteOpen(false);
    }
  };

  const handleCancelDelete = () => {
    toast.error("❌ Đã hủy thao tác xoá");
    setDeleteOpen(false);
  };

  const uiStatusToBE = (s) =>
    (s || "").toLowerCase() === "còn hàng" ? "active" : "inactive";

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
                <th className="p-2 text-center">Trạng thái</th>
                <th className="p-2 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, idx) => {
                const autoStatus = row.stock > 0 ? "Còn hàng" : "Hết hàng";
                const status = row.status || autoStatus;

                return (
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

                    <td className="p-2">
                      {row.stock != null
                        ? `${row.stock} ${row.unit || ""}`
                        : "---"}
                    </td>

                    <td className="p-2">
                      {row.retailPrice != null
                        ? `${Number(row.retailPrice).toLocaleString("vi-VN")} ₫`
                        : "-"}
                    </td>

                    <td className="p-2 text-center">
                      <select
                        value={status}
                        onChange={async (e) => {
                          const newStatus = e.target.value;
                          const prev = row.status;
                          // Cập nhật lạc quan
                          setProducts((prevList) =>
                            prevList.map((p) =>
                              p.id === row.id ? { ...p, status: newStatus } : p
                            )
                          );
                          try {
                            await fetchJSON(`/products/${row.id}`, {
                              method: "PATCH",
                              body: JSON.stringify({
                                trang_thai: uiStatusToBE(newStatus),
                              }),
                            });
                          } catch (err) {
                            toast.error(
                              err.message || "Cập nhật trạng thái thất bại"
                            );
                            // Rollback
                            setProducts((prevList) =>
                              prevList.map((p) =>
                                p.id === row.id ? { ...p, status: prev } : p
                              )
                            );
                          }
                        }}
                        className={`border rounded-md px-2 py-1 text-sm font-medium
                    ${
                      status === "Còn hàng"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                      >
                        <option value="Còn hàng">Còn hàng</option>
                        <option value="Hết hàng">Hết hàng</option>
                        <option value="Ngừng kinh doanh">
                          Ngừng kinh doanh
                        </option>
                      </select>
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
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-gray-400">
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

      {/* Re-auth before delete */}
      <AdminAuthModal
        open={needReauth}
        onClose={() => setNeedReauth(false)}
        onSuccess={() => {
          setNeedReauth(false);
          setDeleteOpen(true);
        }}
      />
    </div>
  );
}
