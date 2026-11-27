import { useState } from "react";
import Panel from "./Panel";
import Button from "./Button";
import Icon from "./Icon";
import ConfirmDialog from "./ConfirmDialog";
import KpiCard from "./KpiCard";
import { peso, kpeso, daysAgo, withinLastDays } from "../lib/format";
import { toCsv, downloadFile } from "../lib/csv";
import { salesRecords } from "../data/system";

const RANGES = [["1", "Today"], ["7", "7 days"], ["30", "30 days"]];
const PRINT_CSS = `@media print {
  #main-nav, header, .hazard, .no-print { display: none !important; }
  main { grid-column: 1 / -1 !important; max-width: none !important; }
  body { background: #fff !important; }
}`;

const Bars = ({ rows, color }) => {
  const max = Math.max(1, ...rows.map(([, v]) => v));
  return rows.map(([label, value, note]) => (
    <li key={label} className="mb-2.5 list-none">
      <div className="flex justify-between gap-3 text-sm">
        <span className="truncate">{label}</span>
        <span className="shrink-0 text-muted">{note}</span>
      </div>
      <div className="mt-1 h-2 rounded bg-soft">
        <div className={`h-2 rounded ${color}`} style={{ width: `${(value / max) * 100}%` }} />
      </div>
    </li>
  ));
};

export default function Reports({ data, notify }) {
  const { transactions } = data;
  const [range, setRange] = useState("7");
  const [confirmReset, setConfirmReset] = useState(false);
  const days = Number(range);

  const sales = salesRecords.filter((s) => withinLastDays(s.date, days));
  const spent = transactions.filter((t) => t.type === "Cash out" && withinLastDays(t.date, days));
  const revenue = sales.reduce((t, s) => t + s.total, 0);
  const expenses = spent.reduce((t, x) => t + x.amount, 0);

  const perDay = Array.from({ length: days }, (_, i) => {
    const date = daysAgo(days - 1 - i);
    return {
      date,
      sales: sales.filter((s) => s.date === date).reduce((t, s) => t + s.total, 0),
      out: spent.filter((x) => x.date === date).reduce((t, x) => t + x.amount, 0),
    };
  });
  const maxBar = Math.max(1, ...perDay.map((d) => Math.max(d.sales, d.out)));

  const byProduct = {};
  for (const s of sales) for (const it of s.items) {
    const row = (byProduct[it.name] ??= { qty: 0, total: 0 });
    row.qty += it.qty;
    row.total += it.price * it.qty;
  }
  const top = Object.entries(byProduct).sort((a, b) => b[1].total - a[1].total).slice(0, 5)
    .map(([name, r]) => [name, r.total, `${r.qty.toLocaleString()} sold · ${peso(r.total)}`]);

  const byCategory = {};
  for (const x of spent) byCategory[x.category] = (byCategory[x.category] ?? 0) + x.amount;
  const cats = Object.entries(byCategory).sort((a, b) => b[1] - a[1]).map(([c, v]) => [c, v, peso(v)]);

  const exportCsv = () => {
    const rows = [["Sale ID", "Date", "Items", "Total"], ...sales.map((s) => [s.id, s.date, s.items.map((i) => `${i.name} x${i.qty}`).join("; "), s.total.toFixed(2)])];
    downloadFile(`sales-${range === "1" ? "today" : `last-${range}-days`}.csv`, toCsv(rows));
    notify(`Exported ${sales.length} sales`);
  };

  const card = "rounded-xl border border-line bg-surface p-4";
  return (
    <div className="space-y-4">
      <style>{PRINT_CSS}</style>
      <div className="no-print flex flex-wrap items-center gap-2">
        <div role="group" aria-label="Date range" className="flex gap-2">
          {RANGES.map(([v, l]) => (
            <Button key={v} aria-pressed={range === v} variant={range === v ? "primary" : "default"} onClick={() => setRange(v)}>{l}</Button>
          ))}
        </div>
        <div className="ml-auto flex flex-wrap gap-2">
          <Button onClick={exportCsv} disabled={sales.length === 0}><Icon name="download" /> Export sales CSV</Button>
          <Button onClick={() => window.print()}><Icon name="printer" /> Print</Button>
          <Button onClick={() => setConfirmReset(true)}><Icon name="rotate" /> Reset demo data</Button>
        </div>
      </div>

      <div className="grid overflow-hidden rounded-md border border-line bg-surface sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Revenue" value={peso(revenue)} />
        <KpiCard label="Expenses" value={peso(expenses)} />
        <KpiCard label="Net profit" value={peso(revenue - expenses)} warn={revenue - expenses < 0} />
        <KpiCard label="Transactions" value={sales.length} />
      </div>

      <section className={card}>
        <h2 className="m-0 mb-1 font-display text-[22px] font-bold">Sales vs Expenses</h2>
        <div className="mb-3 flex gap-4 text-sm">
          <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded-sm bg-ok" /> Sales</span>
          <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded-sm bg-accent" /> Expenses</span>
        </div>
        <div className="overflow-x-auto">
          <div className="flex h-44 min-w-[420px] items-end gap-1 border-b border-line px-1">
            {perDay.map((d) => (
              <div key={d.date} className="flex h-full min-w-0 flex-1 items-end justify-center gap-0.5">
                <div className="w-full max-w-5 rounded-t bg-ok" style={{ height: `${(d.sales / maxBar) * 92}%` }} title={`${d.date} sales: ${peso(d.sales)}`} />
                <div className="w-full max-w-5 rounded-t bg-accent" style={{ height: `${(d.out / maxBar) * 92}%` }} title={`${d.date} expenses: ${peso(d.out)}`} />
              </div>
            ))}
          </div>
          <div className="mt-1 flex min-w-[420px] gap-1 px-1 text-[11px] text-muted">
            {perDay.map((d, i) => (
              <span key={d.date} className="min-w-0 flex-1 text-center">{days <= 7 || i % 5 === 0 ? d.date.slice(5) : ""}</span>
            ))}
          </div>
        </div>
        <p className="m-0 mt-2 text-xs text-muted">Highest bar: {kpeso(maxBar)}</p>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Top products">
          <ul className="m-0 p-0">
            {top.length ? <Bars rows={top} color="bg-ok" /> : <li className="list-none text-muted">No sales in this period.</li>}
          </ul>
        </Panel>
        <Panel title="Expenses by category">
          <ul className="m-0 p-0">
            {cats.length ? <Bars rows={cats} color="bg-ok" /> : <li className="list-none text-muted">No expenses in this period.</li>}
          </ul>
        </Panel>
      </div>

      <ConfirmDialog
        open={confirmReset}
        title="Reset demo data?"
        message="Inventory, employees, expenses and requests go back to the original sample records."
        confirmLabel="Yes, reset"
        onConfirm={() => { data.resetAll(); setConfirmReset(false); notify("Demo data reset"); }}
        onClose={() => setConfirmReset(false)}
      />
    </div>
  );
}
