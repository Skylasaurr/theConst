import { useMemo, useState } from "react";
import StockBadge, { stockStatus } from "./StockBadge";
import Button from "./Button";
import Icon from "./Icon";
import { inputClass } from "./Field";
import { peso } from "../lib/format";

const PAGE_SIZE = 20;
const COLUMNS = [
  { label: "Product ID", key: "sku" },
  { label: "Product Name", key: "name" },
  { label: "Category", key: "cat" },
  { label: "Unit", key: "unit" },
  { label: "Selling Price", key: "price" },
  { label: "Available Qty", key: "stock" },
  { label: "Stock Status", key: "status" },
  { label: "Action" },
];
const STATUS_FILTERS = [
  ["all", "All status"],
  ["ok", "In stock"],
  ["low", "Low stock"],
  ["out", "Out of stock"],
];

export default function InventoryTable({
  products,
  category,
  onView,
  onEdit,
  onDelete,
  onAddStock,
  readOnly = false,
}) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState({ key: null, dir: "asc" });
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const rows = products.filter(
      (p) =>
        (status === "all" || stockStatus(p)[0] === status) &&
        (p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)),
    );
    if (!sort.key) return rows;
    const value = (p) =>
      sort.key === "status" ? stockStatus(p)[0] : p[sort.key];
    const dir = sort.dir === "asc" ? 1 : -1;
    return [...rows].sort((a, b) => {
      const x = value(a),
        y = value(b);
      return (
        (typeof x === "number"
          ? x - y
          : String(x).localeCompare(String(y), undefined, { numeric: true })) *
        dir
      );
    });
  }, [products, query, status, sort]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const rows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const toggleSort = (key) => {
    setSort((s) =>
      s.key === key
        ? { key, dir: s.dir === "asc" ? "desc" : "asc" }
        : { key, dir: "asc" },
    );
    setPage(1);
  };

  const action =
    "inline-flex cursor-pointer items-center gap-1 rounded-md px-3 py-1 text-xs font-semibold";

  return (
    <section className="rounded-xl border border-line bg-surface p-4">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="min-w-40 flex-1">
          <h3 className="m-0 font-display text-xl font-bold">
            Inventory Items
          </h3>
          <span className="text-xs text-muted">
            {category === "all" ? "All products" : category}
          </span>
        </div>

        <div className="relative min-w-0 flex-1 basis-56 sm:max-w-72">
          <Icon
            name="search"
            className="pointer-events-none absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-muted"
          />
          <input
            type="search"
            className={`${inputClass} pl-8`}
            placeholder="Search by product name or id"
            aria-label="Search inventory"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          aria-label="Filter by stock status"
          className={`${inputClass} w-auto`}
        >
          {STATUS_FILTERS.map(([v, l]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </select>

        {!readOnly && (
          <Button variant="primary" onClick={() => onAddStock(null)}>
            <Icon name="plus" /> Add Stock
          </Button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] border-collapse text-left text-sm">
          <thead>
            <tr className="bg-steel text-steel-ink">
              {COLUMNS.map((c) => (
                <th
                  key={c.label}
                  scope="col"
                  aria-sort={
                    sort.key === c.key
                      ? sort.dir === "asc"
                        ? "ascending"
                        : "descending"
                      : undefined
                  }
                  className="px-3 py-2.5 font-semibold whitespace-nowrap"
                >
                  {c.key ? (
                    <button
                      onClick={() => toggleSort(c.key)}
                      className="inline-flex cursor-pointer items-center gap-1 font-semibold"
                    >
                      {c.label}
                      <Icon
                        name={
                          sort.key === c.key
                            ? sort.dir === "asc"
                              ? "up"
                              : "down"
                            : "sort"
                        }
                        className="h-3 w-3 opacity-70"
                      />
                    </button>
                  ) : (
                    c.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id} className="border-b border-line even:bg-soft">
                <td className="px-3 py-3 whitespace-nowrap text-muted">
                  {p.sku}
                </td>
                <td className="px-3 py-3 font-semibold">{p.name}</td>
                <td className="px-3 py-3">{p.cat}</td>
                <td className="px-3 py-3">{p.unit}</td>
                <td className="px-3 py-3 whitespace-nowrap">{peso(p.price)}</td>
                <td className="px-3 py-3">{p.stock}</td>
                <td className="px-3 py-3">
                  <StockBadge product={p} />
                </td>
                <td className="px-3 py-3">
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => onView(p)}
                      aria-label={`View ${p.name}`}
                      className={`${action} bg-steel/10 text-ink hover:bg-steel hover:text-steel-ink`}
                    >
                      <Icon name="eye" className="h-3.5 w-3.5" /> View
                    </button>
                    {!readOnly && (
                      <button
                        onClick={() => onEdit(p)}
                        aria-label={`Edit ${p.name}`}
                        className={`${action} bg-ok/15 text-ok hover:bg-ok hover:text-surface`}
                      >
                        <Icon name="edit" className="h-3.5 w-3.5" /> Edit
                      </button>
                    )}
                    {!readOnly && (
                      <button
                        onClick={() => onDelete(p)}
                        aria-label={`Delete ${p.name}`}
                        className={`${action} bg-bad/15 text-bad hover:bg-bad hover:text-surface`}
                      >
                        <Icon name="trash" className="h-3.5 w-3.5" /> Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={COLUMNS.length}
                  className="px-3 py-6 text-center text-muted"
                >
                  {products.length === 0
                    ? "No products in this category yet."
                    : "No products match your search or filter."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <p className="m-0 text-xs text-muted">
          Showing {rows.length} of {filtered.length} items
        </p>
        {pages > 1 && (
          <div className="flex items-center gap-2 text-sm">
            <Button
              small
              onClick={() => setPage(current - 1)}
              disabled={current <= 1}
            >
              Previous
            </Button>
            <span className="text-muted">
              Page {current} of {pages}
            </span>
            <Button
              small
              onClick={() => setPage(current + 1)}
              disabled={current >= pages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
