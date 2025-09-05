// /src/components/admin/categories/CateExcelButtons.jsx
"use client";


import * as XLSX from "xlsx";
import { Download } from "lucide-react";

/**
 * Props:
 * - data: [{id, name, parentName, note}]
 * - onImported(rows): callback khi import xong
 * - className: string (optional)
 *
 * YÊU CẦU FILE EXCEL (sheet đầu):
 * Cột: Name | Parent | Note (không phân biệt hoa/thường; có thể dùng "Tên danh mục", "Danh mục cha", "Ghi chú")
 */
export default function CateExcelButtons({
  data = [],
  className = "",
}) {



const handleExport = () => {
  const rows = (data || []).map((c) => ({
    "Tên danh mục": c.name || "",
    "Danh mục cha": c.parentName || "",
    "Ghi chú": c.note || "",
  }));

  const ws = XLSX.utils.json_to_sheet(rows, {
    header: ["Tên danh mục", "Danh mục cha", "Ghi chú"], // đảm bảo thứ tự
  });
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Categories");

  const stamp = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, `categories-${stamp}.xlsx`);
};


  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Import */}

      {/* Export */}
      <button
        onClick={handleExport}
        className="inline-flex items-center gap-2 rounded-md bg-amber-400 px-3 py-2 text-white hover:bg-amber-500"
      >
        <Download size={18} />
        Xuất file Excel
      </button>
    </div>
  );
}
