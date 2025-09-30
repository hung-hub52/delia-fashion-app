"use client";
import { useState, useCallback, useEffect, useMemo } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

// Bỏ dấu + chuẩn hoá khoảng trắng, lower-case
const normalize = (s = "") =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();

/** Trả về tên con đã bỏ prefix là tên cha (nếu có) */
const getDisplayName = (name = "", parentName = "") => {
  if (!parentName) return name;
  const nName = normalize(name);
  const nParent = normalize(parentName);
  if (nName.startsWith(nParent + " ")) {
    // Cắt đúng độ dài theo tên gốc (giữ nguyên chữ hoa/thường & dấu)
    return name.slice(parentName.length).trimStart();
  }
  return name;
};

export default function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const res = await fetch(`${API}/categories?page=1&limit=1000`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        cache: "no-store",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Không lấy được danh mục");

      const raw = Array.isArray(data) ? data : (data.items || []);

      // B1: chuẩn hóa -> {id, name, parentId}
      const items = raw.map((c) => ({
        id: c.id_danh_muc,
        name: c.ten_danh_muc,
        parentId: c.parent_id ?? 0,
      }));

      // B2: map id->name để tìm parentName
      const nameById = new Map(items.map((x) => [x.id, x.name]));

      // B3: gắn parentName + displayName
      const withNames = items.map((x) => {
        const parentName =
          x.parentId && x.parentId !== 0 ? (nameById.get(x.parentId) || "") : "";
        const displayName = getDisplayName(x.name, parentName);
        return { ...x, parentName, displayName };
      });

      setCategories(withNames);
    } catch (e) {
      setError(e.message || "Lỗi không xác định");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  // Sắp xếp: theo parentName rồi theo displayName
  const sorted = useMemo(() => {
    return [...categories].sort((a, b) => {
      const pa = a.parentName || "";
      const pb = b.parentName || "";
      if (pa === pb) return a.displayName.localeCompare(b.displayName, "vi");
      return pa.localeCompare(pb, "vi");
    });
  }, [categories]);

  // Ghi chú: các hàm ghi gọi xong sẽ refresh lại list
  const addCategory = useCallback(async (payload) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API}/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "Không thêm được danh mục");
    await fetchCategories();
    return data;
  }, [fetchCategories]);

  const updateCategory = useCallback(async (id, payload) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API}/categories/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "Không sửa được danh mục");
    await fetchCategories();
    return data;
  }, [fetchCategories]);

  const deleteCategory = useCallback(async (id) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API}/categories/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data?.message || "Không xoá được danh mục");
    }
    await fetchCategories();
  }, [fetchCategories]);

  return {
    // ⬇️ Dùng `displayName` để render cột "Tên danh mục"
    categories: sorted, // mỗi item: {id, name, parentId, parentName, displayName}
    loading,
    error,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
  };
}
