import { useMemo, useState } from "react";
import Panel from "./Panel";
import Button from "./Button";
import Icon from "./Icon";
import KpiCard from "./KpiCard";
import BarList from "./BarList";
import DataTable from "./DataTable";
import StockBadge, { stockStatus } from "./StockBadge";
import { peso } from "../lib/format";
import { toCsv, downloadFile } from "../lib/csv";
import { salesRecords } from "../data/system";

const PRINT_CSS = `@media print {
  #main-nav, header, .hazard, .no-print { display: none !important; }
  main { grid-column: 1 / -1 !important; max-width: none !important; }
  body { background: #fff !important; }
}`;
const PAGE_SIZE = 20;
const STOCK_COLUMNS = [
  "Code",
  "Product",
  "Category",
  "Stock",
  "Min",
  "Sold (30d)",
  "Value",
  "Status",
];
const FILTERS = [
  ["all", "All"],
  ["low", "Low stock"],
  ["out", "Out of stock"],
  ["ok", "In stock"],
];

/* Inventory report: stock levels, stock value and items that need restocking.
   Reads the live product list, so it reflects stock changes and approved requests. */
export default function InventoryReport({ data, notify, preparedBy }) {
  const { products } = data;
  const [filter, setFilter] = useState("all");
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const sold30 = useMemo(() => {
    const m = {};
    for (const s of salesRecords)
      for (const it of s.items) m[it.productId] = (m[it.productId] ?? 0) + it.qty;
    return m;
  }, []);

  const counts = { ok: 0, low: 0, out: 0 };
  let units = 0;
  let value = 0;
  for (const p of products) {
    counts[stockStatus(p)[0]] += 1;
    units += p.stock;
    value += p.stock * p.price;
  }

  const categories = useMemo(
    () => [...new Set(products.map((p) => p.cat))].sort(),
    [products],
  );

  const byCategory = useMemo(() => {
    const m = {};
    for (const p of products) {
      const row = (m[p.cat] ??= { items: 0, value: 0 });
      row.items += 1;
      row.value += p.stock * p.price;
    }
    return Object.entries(m)
      .sort((a, b) => b[1].value - a[1].value)
      .map(([label, r]) => ({
        label,
        value: r.value,
        text: `${r.items} items · ${peso(r.value)}`,
      }));
  }, [products]);

  const needsRestock = useMemo(
    () =>
      products
        .filter((p) => stockStatus(p)[0] !== "ok")
        .sort((a, b) => a.stock - a.min - (b.stock - b.min))
        .slice(0, 8),
    [products],
  );

  const q = query.trim().toLowerCase();
  const shown = products
    .filter(
      (p) =>
        (filter === "all" || stockStatus(p)[0] === filter) &&
        (category === "all" || p.cat === category) &&
        (!q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)),
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  const pages = Math.max(1, Math.ceil(shown.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const pageRows = shown.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const rangeStart = shown.length ? (current - 1) * PAGE_SIZE + 1 : 0;
  const rangeEnd = Math.min(current * PAGE_SIZE, shown.length);

  const renderStockRows = (rows) =>
    rows.map((p) => (
      <tr key={p.id} className="border-b border-line even:bg-soft">
        <td className="px-2 py-2 whitespace-nowrap text-muted">{p.sku}</td>
        <td className="px-2 py-2 whitespace-nowrap font-semibold">{p.name}</td>
        <td className="px-2 py-2 whitespace-nowrap">{p.cat}</td>
        <td className="px-2 py-2 whitespace-nowrap text-right">
          {p.stock} {p.unit}
        </td>
        <td className="px-2 py-2 whitespace-nowrap text-right">{p.min}</td>
        <td className="px-2 py-2 whitespace-nowrap text-right">
          {sold30[p.id] ?? 0}
        </td>
        <td className="px-2 py-2 whitespace-nowrap text-right">
          {peso(p.stock * p.price)}
        </td>
        <td className="px-2 py-2 whitespace-nowrap">
          <StockBadge product={p} />
        </td>
      </tr>
    ));

  const renderStockTable = (rows, className) => (
    <table
      className={`w-full min-w-[760px] border-collapse text-left text-sm ${className}`}
    >
      <thead>
        <tr>
          {STOCK_COLUMNS.map((column, index) => (
            <th
              key={column}
              className={`sticky top-0 z-10 border-b border-line bg-surface px-2 py-2 text-[13px] font-semibold text-muted print:static ${
                [3, 4, 5, 6].includes(index) ? "text-right" : ""
              }`}
            >
              {column}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.length ? (
          renderStockRows(rows)
        ) : (
          <tr>
            <td colSpan={STOCK_COLUMNS.length} className="px-2 py-4 text-center text-muted">
              No products match.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );

  const exportCsv = () => {
    const rows = [
      ["Code", "Product", "Category", "Unit", "Price", "Stock", "Minimum", "Status", "Stock value", "Sold (30 days)"],
      ...shown.map((p) => [
        p.sku, p.name, p.cat, p.unit, p.price.toFixed(2), p.stock, p.min,
        stockStatus(p)[1], (p.stock * p.price).toFixed(2), sold30[p.id] ?? 0,
      ]),
    ];
    downloadFile("inventory-report.csv", toCsv(rows));
    notify?.(`Exported ${shown.length} products`);
  };

  return (
    <div className="space-y-4">
      <style>{PRINT_CSS}</style>

      <div className="no-print flex flex-wrap items-center gap-2">
        <div role="group" aria-label="Stock status" className="flex flex-wrap gap-2">
          {FILTERS.map(([v, l]) => (
            <Button
              key={v}
              aria-pressed={filter === v}
              variant={filter === v ? "primary" : "default"}
              onClick={() => {
                setFilter(v);
                setPage(1);
              }}
            >
              {l}
            </Button>
          ))}
        </div>
        <div className="ml-auto flex flex-wrap gap-2">
          <Button onClick={exportCsv} disabled={shown.length === 0}>
            <Icon name="download" /> Export CSV
          </Button>
          <Button onClick={() => window.print()}>
            <Icon name="printer" /> Print
          </Button>
        </div>
      </div>

      <p className="m-0 hidden text-sm text-muted print:block">
        Inventory report · Prepared by {preparedBy} · {new Date().toLocaleDateString("en-PH")}
      </p>

      <div className="grid overflow-hidden rounded-md border border-line bg-surface sm:grid-cols-2 xl:grid-cols-5">
        <KpiCard label="Products" value={products.length} />
        <KpiCard label="Units in stock" value={units.toLocaleString()} />
        <KpiCard label="Stock value" value={peso(value)} />
        <KpiCard label="Low stock" value={counts.low} warn={counts.low > 0} />
        <KpiCard label="Out of stock" value={counts.out} warn={counts.out > 0} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Needs restocking">
          {needsRestock.length ? (
            <DataTable
              head={["Product", "Stock", "Min", "Status"]}
              right={[1, 2]}
              rows={needsRestock.map((p) => [p.name, p.stock, p.min, <StockBadge key={p.id} product={p} />])}
            />
          ) : (
            <p className="m-0 text-muted">Every product is above its minimum.</p>
          )}
        </Panel>
        <Panel title="Stock value by category">
          <BarList items={byCategory} />
        </Panel>
      </div>

      <Panel title="Stock list">
        <div className="no-print mb-3 flex flex-wrap gap-2">
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search product or code"
            aria-label="Search products"
            className="w-full max-w-xs rounded border border-line bg-surface px-3 py-2"
          />
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            aria-label="Category"
            className="max-w-full rounded border border-line bg-surface px-3 py-2"
          >
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="max-h-[480px] overflow-auto print:max-h-none print:overflow-visible">
          {renderStockTable(pageRows, "print:hidden")}
          {renderStockTable(shown, "hidden print:table")}
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <p className="m-0 text-xs text-muted">
            <span className="print:hidden">
              Showing {rangeStart}-{rangeEnd} of {shown.length} products
            </span>
            <span className="hidden print:inline">
              Showing {shown.length ? 1 : 0}-{shown.length} of {shown.length} products
            </span>
          </p>
          {pages > 1 && (
            <div className="no-print flex items-center gap-2 text-sm">
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
      </Panel>
    </div>
  );
}
