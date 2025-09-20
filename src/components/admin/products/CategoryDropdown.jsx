"use client";
import { useState } from "react";
import { useCategoriesContext } from "@/context/CategoriesContext";
import { buildTree } from "@/notify/utils/categoryHelpers";

export default function CategoryDropdown({ value, onChange }) {
  const { categories } = useCategoriesContext();
  const tree = buildTree(categories);

  const [selectedParent, setSelectedParent] = useState("");
  const [selectedChild, setSelectedChild] = useState("");

  // Sync giá trị khi props.value thay đổi
  useState(() => {
    if (value) {
      const [parent, child] = value.split("::");
      setSelectedParent(parent || "");
      setSelectedChild(child || "");
    }
  }, [value]);

  const handleParentChange = (e) => {
    const parent = e.target.value;
    setSelectedParent(parent);
    setSelectedChild("");
    onChange?.(`${parent}::`);
  };

  const handleChildChange = (e) => {
    const child = e.target.value;
    setSelectedChild(child);
    onChange?.(`${selectedParent}::${child}`);
  };

  return (
    <div className="flex gap-3">
      {/* Dropdown cha */}
      <select
        value={selectedParent}
        onChange={handleParentChange}
        className="rounded border px-3 py-2"
      >
        <option value="">-- Chọn danh mục cha --</option>
        {Object.keys(tree).map((parent) => (
          <option key={parent} value={parent}>
            {parent}
          </option>
        ))}
      </select>

      {/* Dropdown con */}
      <select
        value={selectedChild}
        onChange={handleChildChange}
        className="rounded border px-3 py-2"
        disabled={!selectedParent}
      >
        <option value="">-- Chọn danh mục con --</option>
        {selectedParent &&
          tree[selectedParent].map((child) => (
            <option key={child} value={child}>
              {child}
            </option>
          ))}
      </select>
    </div>
  );
}
