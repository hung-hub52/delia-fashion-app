//src/context/CategoriesContext.jsx dùng chung của danh mục, sản phẩm

"use client";
import { createContext, useContext } from "react";
import useCategories from "@/hooks/useCategories";

const CategoriesContext = createContext(null);

export function CategoriesProvider({ children }) {
  const categoriesStore = useCategories([
    { id: 1, name: "Giày nữ", parentName: "Thời trang nữ" },
    { id: 2, name: "Túi xách nữ", parentName: "Phụ kiện" },
    { id: 3, name: "Áo sơ mi", parentName: "Thời trang nam" },
  ]);

  return (
    <CategoriesContext.Provider value={categoriesStore}>
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategoriesContext() {
  const ctx = useContext(CategoriesContext);
  if (!ctx)
    throw new Error(
      "useCategoriesContext must be used inside CategoriesProvider"
    );
  return ctx;
}
