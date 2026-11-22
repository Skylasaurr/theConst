import { useState } from "react";
import StockBadge from "./StockBadge";
import { peso } from "../lib/format"; 

const HEADERS = [
  "Product ID",
  "Product Name",
  "Category",
  "Unit",
  "Selling Price",
  "Available Qty",
  "Stock Status",
  "Action",
];

export default function InventoryTable({ products }) {
  const [query, setQuery] = useState("");

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.sku.toLowerCase().includes(query.toLowerCase())
  );
  const rows = filtered.slice(0, 20);

  return (
    <section className="rounded-xl border border-line bg-surface p-4">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex-1">
          <h3 className="m-0 font-display text-xl font-bold">Inventory Items</h3>
          <span className="text-xs text-muted">All products</span>
        </div>

        <input
          className="min-w-0 flex-2 rounded-md border border-line bg-transparent px-3 py-2 text-sm outline-none focus:border-accent sm:w-72"
          placeholder="Search by product name or id"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <button className="rounded-md bg-accent px-5 py-2 text-sm font-semibold text-accent-ink hover:brightness-95">
          + Add Stock
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left text-sm">
          <thead>
            <tr className="bg-steel text-steel-ink">
              {HEADERS.map((h) => (
                <th key={h} className="whitespace-nowrap px-3 py-2.5 font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
           {rows.map((p) => (
              <tr key={p.id} className="border-b border-line even:bg-soft">
                <td className="whitespace-nowrap px-3 py-3 text-muted">{p.sku}</td>
                <td className="px-3 py-3 font-semibold">{p.name}</td>
                <td className="px-3 py-3">{p.cat}</td>
                <td className="px-3 py-3">{p.unit}</td>
                <td className="whitespace-nowrap px-3 py-3">{peso(p.price)}</td>
                <td className="px-3 py-3">{p.stock}</td>
                <td className="px-3 py-3">
                  <StockBadge product={p} />
                </td>
                <td className="px-3 py-3">
                  <div className="flex gap-1.5">
                    <button
                        onClick={() => setViewing(p)}
                        className="rounded-md bg-steel/10 px-3 py-1 text-xs font-semibold text-ink hover:bg-steel hover:text-steel-ink"
                    >
                        View
                    </button>
                    <button className="rounded-md bg-ok/15 px-3 py-1 text-xs font-semibold text-ok hover:bg-ok hover:text-surface">
                      Edit
                    </button>
                    <button className="rounded-md bg-bad/15 px-3 py-1 text-xs font-semibold text-bad hover:bg-bad hover:text-surface">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-muted">
        Showing {rows.length} of {filtered.length} items
      </p>
    </section>
  );
}