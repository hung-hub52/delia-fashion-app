// src/context/InventoryContext.jsx
"use client";
import { createContext, useContext, useState } from "react";

const InventoryContext = createContext(null);

export function InventoryProvider({ children }) {
  const [inventory, setInventory] = useState([]);
  const [history, setHistory] = useState([]);

  // Seed dữ liệu từ ProductsPage
  const seedFromProducts = (products) => {
    const items = products
      .filter((p) => p.initWarehouse)
      .map((p) => ({
        code: p.sku,
        name: p.name,
        branch: p.branch || "Kho mặc định",
        stock: Number(p.stock || 0),
        unit: p.unit || "",
      }));
    setInventory(items);

    const logs = products
      .filter((p) => p.initWarehouse)
      .map((p) => ({
        code: p.sku,
        name: p.name,
        qty: Number(p.stock || 0),
        unit: p.unit || "",
        date: new Date().toLocaleString("vi-VN"),
      }));
    setHistory(logs);
  };

  // thêm sản phẩm vào kho
  const addToInventory = (product) => {
    const stockQty = Number(product.stock || 0);
    setInventory((prev) => [
      ...prev,
      {
        code: product.sku,
        name: product.name,
        branch: product.branch || "Kho mặc định",
        stock: stockQty,
        unit: product.unit || "",
      },
    ]);

    setHistory((prev) => [
      ...prev,
      {
        code: product.sku,
        name: product.name,
        qty: stockQty,
        unit: product.unit || "",
        date: new Date().toLocaleString("vi-VN"),
      },
    ]);
  };

  // cập nhật khi chỉnh sửa
  const updateInventory = (product) => {
    setInventory((prev) =>
      prev.map((i) =>
        i.code === product.sku
          ? {
              ...i,
              name: product.name,
              stock: i.stock + (product.diff || 0),
              unit: product.unit || i.unit,
            }
          : i
      )
    );

    if (product.diff && product.diff !== 0) {
      setHistory((prev) => [
        ...prev,
        {
          code: product.sku,
          name: product.name,
          qty: product.diff,
          unit: product.unit || "",
          date: new Date().toLocaleString("vi-VN"),
        },
      ]);
    }
  };

  // xoá sản phẩm khỏi kho
  const removeFromInventory = (sku) => {
    setInventory((prev) => prev.filter((i) => i.code !== sku));
    setHistory((prev) => prev.filter((h) => h.code !== sku));
  };

  // ✅ bán sản phẩm → trừ kho + ghi log âm
  const sellProduct = (sku, qty) => {
    if (!sku || !qty || qty <= 0) return;

    setInventory((prev) =>
      prev.map((i) =>
        i.code === sku ? { ...i, stock: Math.max(0, i.stock - qty) } : i
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
