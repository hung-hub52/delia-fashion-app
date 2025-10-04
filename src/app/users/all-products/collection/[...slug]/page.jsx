// Dynamic catch-all route cho collection
// Xử lý cả parent và child categories
// /users/all-products/collection/tui-xach -> parent category
// /users/all-products/collection/tui-xach/tui-xach-nam -> child category

"use client";
import { useParams } from "next/navigation";
import ProductsPage from "@/components/users/ProductsPage";
import { useEffect, useState } from "react";
import { fetchAPI } from "@/utils/api";

// Helper: chuyển slug thành tên chuẩn
function toSlug(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function CollectionDynamicPage() {
  const params = useParams();
  const slugArray = params.slug || [];
  
  const [category, setCategory] = useState(null);
  const [parentCategory, setParentCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        
        // Load tất cả categories
        const catsData = await fetchAPI("/categories?page=1&limit=1000");
        const categories = Array.isArray(catsData) 
          ? catsData 
          : (catsData.items || catsData.data || []);

        let foundCategory = null;
        let foundParent = null;

        if (slugArray.length === 1) {
          // /users/all-products/collection/[slug] -> Parent category
          const slug = slugArray[0];
          
          foundCategory = categories.find((cat) => {
            const catSlug = toSlug(cat.ten_danh_muc);
            return catSlug === slug && (!cat.parent_id || cat.parent_id === 0);
          });

        } else if (slugArray.length === 2) {
          // /users/all-products/collection/[parent]/[child] -> Child category
          const [parentSlug, childSlug] = slugArray;

          // Tìm parent
          foundParent = categories.find((cat) => {
            return toSlug(cat.ten_danh_muc) === parentSlug && (!cat.parent_id || cat.parent_id === 0);
          });

          if (foundParent) {
            // Tìm child
            foundCategory = categories.find((cat) => {
              return toSlug(cat.ten_danh_muc) === childSlug && cat.parent_id === foundParent.id_danh_muc;
            });
          }
        }

        if (foundCategory) {
          setCategory(foundCategory);
          setParentCategory(foundParent);

          // Load products thuộc category này
          try {
            const productsData = await fetchAPI(
              `/products?category=${foundCategory.id_danh_muc}&limit=100`
            );
            const productsList = Array.isArray(productsData)
              ? productsData
              : (productsData.items || productsData.data || []);

            // Map products từ BE sang UI format
            const mappedProducts = productsList.map((p) => ({
              id: p.id_san_pham ?? p.id,
              name: p.ten_san_pham ?? p.name ?? "",
              images: [p.hinh_anh || "/products/placeholder.jpg"],
              price: Number(p.gia_ban ?? p.price ?? 0),
              oldPrice: Number(p.gia_cu ?? p.old_price ?? 0),
              sold: Number(p.da_ban ?? p.sold ?? 0),
            }));

            setProducts(mappedProducts);
          } catch (err) {
            console.error("Error loading products:", err);
          }
        }
      } catch (error) {
        console.error("Error loading category:", error);
      } finally {
        setLoading(false);
      }
    }

    if (slugArray.length > 0) {
      loadData();
    }
  }, [slugArray]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-20">
          <div className="inline-block w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-center py-20 text-gray-500">Không tìm thấy danh mục</p>
      </div>
    );
  }

  // Xác định parent info cho breadcrumb
  const parentInfo = parentCategory
    ? {
        name: parentCategory.ten_danh_muc,
        href: `/users/all-products/collection/${slugArray[0]}`,
      }
    : {
        name: "Bộ sưu tập",
        href: "/users/collection",
      };

  return (
    <ProductsPage
      title={category.ten_danh_muc}
      parent={parentInfo.name}
      parentHref={parentInfo.href}
      products={products}
    />
  );
}
