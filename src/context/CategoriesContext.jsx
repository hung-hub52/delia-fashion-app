"use client";
import { createContext, useContext } from "react";
import useCategories from "@/hooks/useCategories";

const CategoriesContext = createContext(null);

export function CategoriesProvider({ children }) {
  const store = useCategories(); // dữ liệu thật từ API + displayName đã xử lý
  return (
    <CategoriesContext.Provider value={store}>
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategoriesContext() {
  const ctx = useContext(CategoriesContext);
  if (!ctx) {
    throw new Error("useCategoriesContext must be used inside CategoriesProvider");
  }
  return ctx;
}
