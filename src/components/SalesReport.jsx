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
const PAGE_SIZE = 20;
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
  const [page, setPage] = useState(1);
  const [dailyPage, setDailyPage] = useState(1);
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

  const dailyPages = Math.max(1, Math.ceil(dailyTotals.length / PAGE_SIZE));
  const dailyCurrent = Math.min(dailyPage, dailyPages);
  const dailyRows = dailyTotals.slice(
    (dailyCurrent - 1) * PAGE_SIZE,
    dailyCurrent * PAGE_SIZE,
  );
  const dailyRangeStart = dailyTotals.length
    ? (dailyCurrent - 1) * PAGE_SIZE + 1
    : 0;
  const dailyRangeEnd = Math.min(dailyCurrent * PAGE_SIZE, dailyTotals.length);

  const q = query.trim().toLowerCase();
  const shown = q
    ? sales.filter(
        (s) =>
          s.id.toLowerCase().includes(q) ||
          s.items.some((i) => i.name.toLowerCase().includes(q)),
      )
    : sales;

  const pages = Math.max(1, Math.ceil(shown.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const pageRows = shown.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const rangeStart = shown.length ? (current - 1) * PAGE_SIZE + 1 : 0;
  const rangeEnd = Math.min(current * PAGE_SIZE, shown.length);

  const renderSalesRows = (rows, showViewButton) =>
    rows.map((s) => (
      <tr key={s.id} className="border-b border-line even:bg-soft">
        <td className="px-2 py-2 whitespace-nowrap text-muted">{s.id}</td>
        <td className="px-2 py-2 whitespace-nowrap">{shortDate(s.date)}</td>
        <td className="px-2 py-2">
          <span className="block max-w-[260px] truncate">
            {s.items.map((i) => i.name).join(", ")}
          </span>
        </td>
        <td className="px-2 py-2 whitespace-nowrap text-right">
          {itemCount(s)}
        </td>
        <td className="px-2 py-2 whitespace-nowrap text-right">
          {peso(s.total)}
        </td>
        {showViewButton && (
          <td className="no-print px-2 py-2 text-right">
            <Button
              small
              onClick={() => setReceipt(s)}
              aria-label={`View sale ${s.id}`}
            >
              <Icon name="eye" /> View
            </Button>
          </td>
        )}
      </tr>
    ));

  const renderSalesTable = (rows, showViewButton, className) => {
    const columns = ["Sale ID", "Date", "Items", "Qty", "Total"];

    return (
      <table
        className={`w-full min-w-[640px] border-collapse text-left text-sm ${className}`}
      >
        <thead>
          <tr>
            {[...columns, ...(showViewButton ? [""] : [])].map((column, index) => (
              <th
                key={`${column}-${index}`}
                className={`sticky top-0 z-10 border-b border-line bg-surface px-2 py-2 text-[13px] font-semibold text-muted print:static ${
                  [3, 4].includes(index) ? "text-right" : ""
                } ${showViewButton && index === 5 ? "no-print" : ""}`}
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length ? (
            renderSalesRows(rows, showViewButton)
          ) : (
            <tr>
              <td
                colSpan={columns.length + (showViewButton ? 1 : 0)}
                className="px-2 py-4 text-center text-muted"
              >
                No sales match.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    );
  };

  const renderDailyTotalsTable = (rows, className) => (
    <table
      className={`w-full min-w-[420px] border-collapse text-left text-sm ${className}`}
    >
      <thead>
        <tr>
          {["Date", "Transactions", "Total"].map((column, index) => (
            <th
              key={column}
              className={`sticky top-0 z-10 border-b border-line bg-surface px-2 py-2 text-[13px] font-semibold text-muted print:static ${
                index > 0 ? "text-right" : ""
              }`}
            >
              {column}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map(([date, count, amount]) => (
          <tr key={date} className="border-b border-line even:bg-soft">
            <td className="px-2 py-2 whitespace-nowrap text-muted">{date}</td>
            <td className="px-2 py-2 whitespace-nowrap text-right">{count}</td>
            <td className="px-2 py-2 whitespace-nowrap text-right">{amount}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

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
              onClick={() => {
                setRange(v);
                setPage(1);
                setDailyPage(1);
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
            <>
              <div className="max-h-[480px] overflow-auto print:max-h-none print:overflow-visible">
                {renderDailyTotalsTable(dailyRows, "print:hidden")}
                {renderDailyTotalsTable(dailyTotals, "hidden print:table")}
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <p className="m-0 text-xs text-muted">
                  <span className="print:hidden">
                    Showing {dailyRangeStart}-{dailyRangeEnd} of{" "}
                    {dailyTotals.length} dates
                  </span>
                  <span className="hidden print:inline">
                    Showing 1-{dailyTotals.length} of {dailyTotals.length} dates
                  </span>
                </p>
                {dailyPages > 1 && (
                  <div className="no-print flex items-center gap-2 text-sm">
                    <Button
                      small
                      onClick={() => setDailyPage(dailyCurrent - 1)}
                      disabled={dailyCurrent <= 1}
                    >
                      Previous
                    </Button>
                    <span className="text-muted">
                      Page {dailyCurrent} of {dailyPages}
                    </span>
                    <Button
                      small
                      onClick={() => setDailyPage(dailyCurrent + 1)}
                      disabled={dailyCurrent >= dailyPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </div>
            </>
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
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search sale ID or product"
            aria-label="Search sales"
            className="w-full max-w-sm rounded border border-line bg-surface px-3 py-2"
          />
        </div>
        <div className="max-h-[480px] overflow-auto print:max-h-none print:overflow-visible">
          {renderSalesTable(pageRows, true, "print:hidden")}
          {renderSalesTable(shown, false, "hidden print:table")}
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <p className="m-0 text-xs text-muted">
            <span className="print:hidden">
              Showing {rangeStart}-{rangeEnd} of {shown.length} sales
            </span>
            <span className="hidden print:inline">
              Showing {shown.length ? 1 : 0}-{shown.length} of {shown.length} sales
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
