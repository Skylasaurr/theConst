import { useMemo, useState } from "react";
import Panel from "./Panel";
import Button from "./Button";
import Icon from "./Icon";
import Modal from "./Modal";
import KpiCard from "./KpiCard";
import BarList from "./BarList";
import DataTable from "./DataTable";
import SalesChart from "./SalesChart";
import { peso, daysAgo, withinLastDays } from "../lib/format";
import { toCsv, downloadFile } from "../lib/csv";
import { salesRecords } from "../data/system";

const RANGES = [
  ["1", "Today"],
  ["7", "7 days"],
  ["30", "30 days"],
];
const PRINT_CSS = `@media print {
  #main-nav, header, .hazard, .no-print { display: none !important; }
  main { grid-column: 1 / -1 !important; max-width: none !important; }
  body { background: #fff !important; }
}`;

const shortDate = (iso) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
  });
const dayLabel = (iso) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-PH", { weekday: "short" });
const itemCount = (sale) => sale.items.reduce((t, i) => t + i.qty, 0);

/* Sales report for the cashier: read-only view of the sales records. */
export default function SalesReport({ notify, cashierName }) {
  const [range, setRange] = useState("7");
  const [query, setQuery] = useState("");
  const [receipt, setReceipt] = useState(null);
  const days = Number(range);

  const sales = useMemo(
    () =>
      salesRecords
        .filter((s) => withinLastDays(s.date, days))
        .sort((a, b) => (a.id < b.id ? 1 : -1)),
    [days],
  );

  const total = sales.reduce((t, s) => t + s.total, 0);
  const itemsSold = sales.reduce((t, s) => t + itemCount(s), 0);
  const average = sales.length ? total / sales.length : 0;

  const chartData = useMemo(() => {
    const span = Math.min(days, 7);
    return Array.from({ length: span }, (_, i) => {
      const date = daysAgo(span - 1 - i);
      return {
        label: dayLabel(date),
        value: salesRecords
          .filter((s) => s.date === date)
          .reduce((t, s) => t + s.total, 0),
      };
    });
  }, [days]);

  const topProducts = useMemo(() => {
    const byName = {};
    for (const s of sales)
      for (const it of s.items) {
        const row = (byName[it.name] ??= { qty: 0, amount: 0 });
        row.qty += it.qty;
        row.amount += it.price * it.qty;
      }
    return Object.entries(byName)
      .sort((a, b) => b[1].amount - a[1].amount)
      .slice(0, 6)
      .map(([label, r]) => ({
        label,
        value: r.amount,
        text: `${r.qty.toLocaleString()} sold · ${peso(r.amount)}`,
      }));
  }, [sales]);

  const dailyTotals = useMemo(() => {
    const byDate = {};
    for (const s of sales) {
      const row = (byDate[s.date] ??= { count: 0, amount: 0 });
      row.count += 1;
      row.amount += s.total;
    }
    return Object.entries(byDate)
      .sort((a, b) => (a[0] < b[0] ? 1 : -1))
      .map(([date, r]) => [shortDate(date), r.count, peso(r.amount)]);
  }, [sales]);

  const q = query.trim().toLowerCase();
  const shown = q
    ? sales.filter(
        (s) =>
          s.id.toLowerCase().includes(q) ||
          s.items.some((i) => i.name.toLowerCase().includes(q)),
      )
    : sales;

  const exportCsv = () => {
    const rows = [
      ["Sale ID", "Date", "Items", "Qty", "Total"],
      ...shown.map((s) => [
        s.id,
        s.date,
        s.items.map((i) => `${i.name} x${i.qty}`).join("; "),
        itemCount(s),
        s.total.toFixed(2),
      ]),
    ];
    downloadFile(
      `sales-report-${range === "1" ? "today" : `last-${range}-days`}.csv`,
      toCsv(rows),
    );
    notify?.(`Exported ${shown.length} sales`);
  };

  const rangeName = RANGES.find(([v]) => v === range)[1].toLowerCase();

  return (
    <div className="space-y-4">
      <style>{PRINT_CSS}</style>

      <div className="no-print flex flex-wrap items-center gap-2">
        <div role="group" aria-label="Date range" className="flex gap-2">
          {RANGES.map(([v, l]) => (
            <Button
              key={v}
              aria-pressed={range === v}
              variant={range === v ? "primary" : "default"}
              onClick={() => setRange(v)}
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
        Sales report ({rangeName}) · Prepared by {cashierName}
      </p>

      <div className="grid overflow-hidden rounded-md border border-line bg-surface sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Total sales" value={peso(total)} />
        <KpiCard label="Transactions" value={sales.length} />
        <KpiCard label="Items sold" value={itemsSold.toLocaleString()} />
        <KpiCard label="Average sale" value={peso(average)} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title={days === 1 ? "Sales, today" : "Sales, last 7 days"}>
          <SalesChart data={chartData} />
        </Panel>
        <Panel title="Top products">
          <BarList items={topProducts} empty="No sales in this period." />
        </Panel>
      </div>

      {days > 1 && (
        <Panel title="Daily totals">
          {dailyTotals.length ? (
            <DataTable
              head={["Date", "Transactions", "Total"]}
              rows={dailyTotals}
              right={[1, 2]}
            />
          ) : (
            <p className="m-0 text-muted">No sales in this period.</p>
          )}
        </Panel>
      )}

      <Panel title="Transactions">
        <div className="no-print mb-3">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search sale ID or product"
            aria-label="Search sales"
            className="w-full max-w-sm rounded border border-line bg-surface px-3 py-2"
          />
        </div>
        {shown.length ? (
          <DataTable
            head={["Sale ID", "Date", "Items", "Qty", "Total", ""]}
            right={[3, 4]}
            rows={shown.map((s) => [
              s.id,
              shortDate(s.date),
              <span key="i" className="block max-w-[260px] truncate">
                {s.items.map((i) => i.name).join(", ")}
              </span>,
              itemCount(s),
              peso(s.total),
              <Button
                key="v"
                small
                className="no-print"
                onClick={() => setReceipt(s)}
              >
                <Icon name="eye" /> View
              </Button>,
            ])}
          />
        ) : (
          <p className="m-0 text-muted">No sales match.</p>
        )}
      </Panel>

      <Modal
        open={!!receipt}
        title={receipt ? `Sale ${receipt.id}` : ""}
        onClose={() => setReceipt(null)}
      >
        {receipt && (
          <>
            <p className="m-0 mb-3 text-sm text-muted">
              {new Date(`${receipt.date}T00:00:00`).toLocaleDateString("en-PH", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <DataTable
              head={["Product", "Qty", "Price", "Amount"]}
              right={[1, 2, 3]}
              rows={receipt.items.map((i) => [
                i.name,
                i.qty,
                peso(i.price),
                peso(i.price * i.qty),
              ])}
            />
            <div className="mt-3 flex justify-between border-t border-line pt-3 text-lg font-bold">
              <span>Total</span>
              <span>{peso(receipt.total)}</span>
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={() => setReceipt(null)}>Close</Button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
