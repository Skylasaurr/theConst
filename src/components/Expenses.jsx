import { useState } from "react";
import Modal from "./Modal";
import Button from "./Button";
import Field, { inputClass } from "./Field";
import ConfirmDialog from "./ConfirmDialog";
import Icon from "./Icon";
import { peso, isoDate, daysAgo } from "../lib/format";

const CATEGORIES = [
  "Stock purchase",
  "Fuel & delivery",
  "Utilities",
  "Sales",
  "Repayment",
  "Salaries",
  "Supplies",
  "Other",
];
const card = "rounded-lg border border-line bg-surface p-4";
const sum = (rows, type) =>
  rows.filter((t) => t.type === type).reduce((s, t) => s + t.amount, 0);

function TransactionForm({ initial, submitLabel, onSubmit, onCancel }) {
  const [f, setF] = useState(
    initial
      ? { ...initial, amount: String(initial.amount) }
      : {
          date: isoDate(),
          category: CATEGORIES[0],
          note: "",
          amount: "",
          type: "Cash out",
        },
  );
  const [errors, setErrors] = useState({});
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    const found = {};
    if (!f.date) found.date = "Select a date.";
    if (!(Number(f.amount) > 0))
      found.amount = "Enter an amount greater than 0.";
    setErrors(found);
    if (Object.keys(found).length) return;
    onSubmit({
      date: f.date,
      category: f.category,
      type: f.type,
      note: f.note.trim(),
      amount: Math.round(Number(f.amount) * 100) / 100,
    });
    if (!initial) setF({ ...f, note: "", amount: "" });
  };

  return (
    <form onSubmit={submit} noValidate className="space-y-3">
      <Field label="Date" required error={errors.date}>
        <input
          className={inputClass}
          type="date"
          value={f.date}
          onChange={set("date")}
          aria-invalid={!!errors.date}
        />
      </Field>
      <Field label="Type">
        <select className={inputClass} value={f.type} onChange={set("type")}>
          <option>Cash in</option>
          <option>Cash out</option>
        </select>
      </Field>
      <Field label="Category">
        <select
          className={inputClass}
          value={f.category}
          onChange={set("category")}
        >
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </Field>
      <Field label="Note">
        <input
          className={inputClass}
          value={f.note}
          onChange={set("note")}
          placeholder="Note (optional)"
        />
      </Field>
      <Field label="Amount (₱)" required error={errors.amount}>
        <input
          className={inputClass}
          type="number"
          min="0.01"
          step="0.01"
          value={f.amount}
          onChange={set("amount")}
          placeholder="0.00"
          aria-invalid={!!errors.amount}
        />
      </Field>
      <div className="flex gap-2 pt-1">
        {onCancel && (
          <Button onClick={onCancel} className="flex-1">
            Cancel
          </Button>
        )}
        <Button type="submit" variant="green" className="flex-1 py-2.5">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}

export default function Expenses({ data, notify }) {
  const { transactions } = data;
  const [dialog, setDialog] = useState(null); // { type: "edit" | "delete", item }
  const close = () => setDialog(null);
  const [q, setQ] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [catFilter, setCatFilter] = useState("All");

  const today = isoDate();
  const todays = transactions.filter((t) => t.date === today);
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const date = daysAgo(6 - i);
    const day = transactions.filter((t) => t.date === date);
    return {
      date,
      label: date.slice(5),
      in: sum(day, "Cash in"),
      out: sum(day, "Cash out"),
    };
  });
  const maxBar = Math.max(1, ...last7.map((d) => Math.max(d.in, d.out)));

  const stats = [
    ["Cash in today", peso(sum(todays, "Cash in"))],
    ["Cash out today", peso(sum(todays, "Cash out"))],
    ["Net today", peso(sum(todays, "Cash in") - sum(todays, "Cash out"))],
    ["Net, last 7 days", peso(last7.reduce((s, d) => s + d.in - d.out, 0))],
  ];

  const rows = [...transactions]
    .sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id)
    .filter(
      (t) =>
        (typeFilter === "All" || t.type === typeFilter) &&
        (catFilter === "All" || t.category === catFilter) &&
        `${t.note} ${t.category} ${t.date}`
          .toLowerCase()
          .includes(q.trim().toLowerCase()),
    );

  const add = (values) => {
    data.addTransaction(values);
    notify(`${values.type} of ${peso(values.amount)} recorded`);
  };
  const save = (values) => {
    data.updateTransaction(dialog.item.id, values);
    notify("Transaction updated");
    close();
  };
  const remove = () => {
    data.deleteTransaction(dialog.item.id);
    notify("Transaction deleted");
    close();
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(([label, value]) => (
          <div key={label} className={card}>
            <p className="m-0 text-sm text-muted">{label}</p>
            <h2 className="m-0 mt-2 font-display text-2xl font-bold">
              {value}
            </h2>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <section className={card}>
          <h2 className="m-0 mb-2 font-display text-[22px] font-bold">
            Cash Flow - Last 7 Days
          </h2>
          <div className="mb-4 flex gap-4 text-sm">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm bg-ok" /> Cash in
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm bg-accent" /> Cash out
            </span>
          </div>
          <div className="flex h-52 items-end justify-around gap-2 border-b border-line px-2">
            {last7.map((day) => (
              <div
                key={day.date}
                className="flex h-full flex-1 items-end justify-center gap-1"
              >
                <div
                  className="w-7 max-w-[40%] rounded-t-md bg-ok"
                  style={{ height: `${(day.in / maxBar) * 90}%` }}
                  title={`${day.date} cash in: ${peso(day.in)}`}
                />
                <div
                  className="w-7 max-w-[40%] rounded-t-md bg-accent"
                  style={{ height: `${(day.out / maxBar) * 90}%` }}
                  title={`${day.date} cash out: ${peso(day.out)}`}
                />
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-around text-xs text-muted">
            {last7.map((day) => (
              <span key={day.date}>{day.label}</span>
            ))}
          </div>
        </section>

        <section className={card}>
          <h2 className="m-0 mb-4 font-display text-[22px] font-bold">
            Add Transaction
          </h2>
          <TransactionForm submitLabel="Record transaction" onSubmit={add} />
        </section>
      </div>

      <section className={card}>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <h2 className="m-0 mr-auto font-display text-[22px] font-bold">
            Transaction History
          </h2>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search note, category, date"
            aria-label="Search transactions"
            className={`${inputClass} w-56`}
          />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            aria-label="Filter by type"
            className={`${inputClass} w-auto`}
          >
            {["All", "Cash in", "Cash out"].map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
          <select
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
            aria-label="Filter by category"
            className={`${inputClass} w-auto`}
          >
            {["All", ...CATEGORIES].map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </div>

        <div className="max-h-[420px] overflow-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="sticky top-0 bg-surface">
              <tr className="border-b border-line text-muted">
                {["Date", "Category", "Note", "Type", "Amount", "Action"].map(
                  (h) => (
                    <th key={h} className="p-3">
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {rows.map((t) => (
                <tr key={t.id} className="border-b border-line">
                  <td className="p-3">{t.date}</td>
                  <td className="p-3">{t.category}</td>
                  <td className="p-3">{t.note || "-"}</td>
                  <td
                    className={`p-3 font-semibold ${t.type === "Cash in" ? "text-ok" : "text-bad"}`}
                  >
                    {t.type}
                  </td>
                  <td className="p-3 font-semibold whitespace-nowrap">
                    {t.type === "Cash in" ? "+" : "-"}
                    {peso(t.amount)}
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Button
                        small
                        onClick={() => setDialog({ type: "edit", item: t })}
                        aria-label={`Edit ${t.category} ${t.date}`}
                      >
                        <Icon name="edit" className="h-3.5 w-3.5" /> Edit
                      </Button>
                      <Button
                        small
                        variant="warning"
                        onClick={() => setDialog({ type: "delete", item: t })}
                        aria-label={`Delete ${t.category} ${t.date}`}
                      >
                        <Icon name="trash" className="h-3.5 w-3.5" /> Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-muted">
                    {transactions.length === 0
                      ? "No transactions recorded."
                      : "No transactions match your filters."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <Modal
        open={dialog?.type === "edit"}
        title="Edit transaction"
        subtitle="Update this cash in or cash out record."
        onClose={close}
      >
        {dialog?.item && (
          <TransactionForm
            initial={dialog.item}
            submitLabel="Save Changes"
            onSubmit={save}
            onCancel={close}
          />
        )}
      </Modal>
      <ConfirmDialog
        open={dialog?.type === "delete"}
        title="Delete transaction?"
        message="This action can't be undone."
        detail={
          dialog?.item &&
          `${dialog.item.date} · ${dialog.item.category} · ${peso(dialog.item.amount)}`
        }
        onConfirm={remove}
        onClose={close}
      />
    </div>
  );
}
