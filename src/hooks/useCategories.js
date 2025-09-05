//src/hooks/useCategories.js dùng chung của danh mục sản phẩm

"use client";
import { useState, useCallback } from "react";

export default function useCategories(initial = []) {
  const [categories, setCategories] = useState(initial);

  // Thêm mới
  const addCategory = useCallback((cat) => {
    setCategories((prev) => [cat, ...prev]);
  }, []);

  // Sửa
  const updateCategory = useCallback((cat) => {
    setCategories((prev) =>
      prev.map((x) => (x.id === cat.id ? { ...x, ...cat } : x))
    );
  }, []);

  // Xoá
  const deleteCategory = useCallback((id) => {
    setCategories((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const clearCategories = useCallback(() => setCategories([]), []);

  return {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    clearCategories,
  };
}
