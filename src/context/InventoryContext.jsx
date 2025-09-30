// src/context/InventoryContext.jsx
"use client";
import { createContext, useContext, useEffect, useState } from "react";

const InventoryContext = createContext(null);

export function InventoryProvider({ children }) {
  const [inventory, setInventory] = useState([]);
  const [history, setHistory] = useState([]);
  const API = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api").replace(/\/$/, "");

  // Tải inventory và history từ BE khi vào admin
  useEffect(() => {
    (async () => {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const headers = {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token.replace(/^"|"$/g, "")}` } : {}),
        };
        const [invRes, hisRes] = await Promise.all([
          fetch(`${API}/inventory?limit=500`, { headers }),
          fetch(`${API}/inventory/history?limit=500`, { headers }),
        ]);
        const invData = await invRes.json().catch(() => ({}));
        const hisData = await hisRes.json().catch(() => ({}));
        const inv = (invData.data || []).map((i) => ({
          productId: i.id_san_pham,
          code: String(i.id_san_pham), // chuẩn hoá dùng ID làm key thống nhất
          name: i.ten_san_pham,
          branch: i.ten_nha_kho,
          stock: Number(i.so_luong_ton_kho || 0),
          unit: "Cái",
        }));
        const logs = (hisData.data || []).map((h) => ({
          code: String(h.productId || h.id_san_pham || ""), // dùng ID để khớp inventory
          name: h.name || h.ten_san_pham || "",
          qty: Number(h.qty || h.so_luong_nhap || 0),
          unit: "Cái",
          date: h.date ? new Date(h.date).toLocaleString("vi-VN") : new Date().toLocaleString("vi-VN"),
        }));
        setInventory(inv);
        setHistory(logs);
      } catch {}
    })();
  }, []);

  // Seed dữ liệu từ ProductsPage
  const seedFromProducts = (products) => {
    if (!Array.isArray(products) || products.length === 0) return;
    setInventory((prevInv) => {
      if (prevInv && prevInv.length > 0) return prevInv; // đã có dữ liệu từ BE, không override
      const items = products
      .filter((p) => p.initWarehouse)
      .map((p) => ({
        productId: p.id,
        code: String(p.id || p.sku),
        name: p.name,
        branch: p.branch || "Kho mặc định",
        stock: Number(p.stock || 0),
        unit: p.unit || "",
      }));
      return items;
    });

    setHistory((prevHis) => {
      if (prevHis && prevHis.length > 0) return prevHis; // tránh ghi đè lịch sử từ BE
      const logs = products
      .filter((p) => p.initWarehouse)
      .map((p) => ({
        code: String(p.id || p.sku),
        name: p.name,
        qty: Number(p.stock || 0),
        unit: p.unit || "",
        date: new Date().toLocaleString("vi-VN"),
      }));
      return logs;
    });
  };

  // thêm sản phẩm vào kho
  const addToInventory = (product) => {
    const stockQty = Number(product.stock || product.stockQty || 0);
    const key = String(product.id || product.productId || product.sku || "");
    setInventory((prev) => [
      ...prev,
      {
        productId: product.id || product.productId,
        code: key,
        name: product.name,
        branch: product.branch || "Kho mặc định",
        stock: stockQty,
        unit: product.unit || "",
      },
    ]);

    setHistory((prev) => [
      ...prev,
      {
        code: key,
        name: product.name,
        qty: stockQty,
        unit: product.unit || "",
        date: new Date().toLocaleString("vi-VN"),
      },
    ]);
  };

  // cập nhật khi chỉnh sửa
  const updateInventory = (product) => {
    const key = String(product.id || product.productId || product.sku || "");
    setInventory((prev) =>
      prev.map((i) =>
        i.code === key
          ? {
              ...i,
              name: product.name,
              stock: i.stock + (Number(product.diff || 0)),
              unit: product.unit || i.unit,
            }
          : i
      )
    );

    if (product.diff && Number(product.diff) !== 0) {
      setHistory((prev) => [
        ...prev,
        {
          code: key,
          name: product.name,
          qty: Number(product.diff),
          unit: product.unit || "",
          date: new Date().toLocaleString("vi-VN"),
        },
      ]);
    }
  };

  // xoá sản phẩm khỏi kho
  const removeFromInventory = (sku) => {
    setInventory((prev) => prev.filter((i) => i.code !== sku && String(i.productId || "") !== String(sku)));
    setHistory((prev) => prev.filter((h) => h.code !== sku));
  };

  // ✅ bán sản phẩm → trừ kho + ghi log âm
  const sellProduct = (sku, qty) => {
    if (!sku || !qty || qty <= 0) return;

    setInventory((prev) =>
      prev.map((i) =>
        i.code === sku || String(i.productId || "") === String(sku)
          ? { ...i, stock: Math.max(0, i.stock - qty) }
          : i
      )
    );

    setHistory((prev) => [
      ...prev,
      {
        code: sku,
        name: inventory.find((i) => i.code === sku)?.name || "",
        qty: -qty, // log âm để biết là xuất bán
        unit: inventory.find((i) => i.code === sku)?.unit || "",
        date: new Date().toLocaleString("vi-VN"),
      },
    ]);
  };

  return (
    <InventoryContext.Provider
      value={{
        inventory,
        history,
        seedFromProducts,
        addToInventory,
        updateInventory,
        removeFromInventory,
        sellProduct, // expose ra để sau này User site gọi
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const ctx = useContext(InventoryContext);
  if (!ctx)
    throw new Error("useInventory must be used inside InventoryProvider");
  return ctx;
}
