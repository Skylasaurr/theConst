import { useState } from "react";
import StatCard from "./StatCard";
import CategoryBrowser from "./CategoryBrowser";
import InventoryTable from "./InventoryTable";
import { stockStatus } from "./StockBadge";
import { peso } from "../lib/format";
import { categories, products } from "../data/inventory";

const outlineBtn =
  "rounded-md border border-ink/20 bg-surface px-4 py-2 text-sm font-medium transition-colors hover:border-ink";

export default function Inventory() {
  const [category, setCategory] = useState("all");

  // stat cards (always count every product)
  const low = products.filter((p) => stockStatus(p)[0] === "low").length;
  const out = products.filter((p) => stockStatus(p)[0] === "out").length;
  const value = products.reduce(
    (sum, p) => sum + p.price * Math.max(0, p.stock),
    0
  );

  const stats = [
    { id: 1, label: "Total Items", value: products.length, note: `Across ${categories.length} categories`, tone: "green", icon: "📦" },
    { id: 2, label: "Low Stock", value: low, note: "Items need attention", tone: "yellow", icon: "⚠️" },
    { id: 3, label: "Out of Stock", value: out, note: "Replenish these items", tone: "red", icon: "❗" },
    { id: 4, label: "Inventory Value", value: peso(value), note: "Total stock valuation", tone: "orange", icon: "₱" },
  ];

  const cats = categories.map((c) => ({
    ...c,
    count: products.filter((p) => p.cat === c.name).length,
  }));

  const shown =
    category === "all" ? products : products.filter((p) => p.cat === category);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap flex-col sm:flex-row gap-2.5">
        <button className={outlineBtn}>Import Excel</button>
        <button className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-ink hover:brightness-95">
          Add Product
        </button>
        <button className={outlineBtn}>Manage Categories</button>
      </div>

      <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.id} {...s} />
        ))}
      </div>

      <CategoryBrowser
        categories={cats}
        selected={category}
        onSelect={setCategory}
      />
      <InventoryTable products={shown} />
    </div>
  );
}