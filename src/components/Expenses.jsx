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

// Custom Date Picker
function DatePicker({ value, onChange }) {
  const [open, setOpen] = useState(false);

  const [view, setView] = useState(() => {
    const [year, month] = value.split("-").map(Number);
    return new Date(year, month - 1, 1);
  });

  const year = view.getFullYear();
  const month = view.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();

  const selected = value.split("-").map(Number);
  const today = new Date();

  const changeMonth = (amount) => {
    setView(new Date(year, month + amount, 1));
  };

  const chooseDate = (day) => {
    const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    onChange(date);
    setOpen(false);
  };

  const displayDate = value
    ? `${selected[1]}/${selected[2]}/${selected[0]}`
    : "Select a date";

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => {
          const [y, m] = value.split("-").map(Number);
          setView(new Date(y, m - 1, 1));
          setOpen(!open);
        }}
        className={`${inputClass} flex w-full items-center justify-between bg-white text-left`}
      >
        <span>{displayDate}</span>

        {/* Calendar outline icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M16 3v4M8 3v4M3 10h18" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-[386px] max-w-[calc(100vw-32px)] rounded-lg border-2 border-[#1f2937] bg-white p-3 text-[#1f2937] shadow-xl">
          <div className="mb-3 flex items-center justify-between px-1">
            <button
              type="button"
              onClick={() => changeMonth(-1)}
              className="rounded px-2 py-1 text-xl hover:bg-gray-100"
              aria-label="Previous month"
            >
              ‹
            </button>

            <h3 className="m-0 text-xl font-bold uppercase">
              {view.toLocaleString("en-US", { month: "long" })} {year}
            </h3>

            <button
              type="button"
              onClick={() => changeMonth(1)}
              className="rounded px-2 py-1 text-xl hover:bg-gray-100"
              aria-label="Next month"
            >
              ›
            </button>
          </div>

          <div className="grid grid-cols-7 border-l border-t border-[#d1d5db] text-center">
            {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
              <div
                key={day}
                className="flex h-8 items-center justify-center border-b border-r border-[#d1d5db] bg-[#f3f4f6] text-xs font-bold"
              >
                {day}
              </div>
            ))}

            {Array.from({ length: firstDay }, (_, i) => (
              <div
                key={`blank-${i}`}
                className="h-12 border-b border-r border-[#d1d5db]"
              />
            ))}

            {Array.from({ length: days }, (_, i) => {
              const day = i + 1;

              const isSelected =
                selected[0] === year &&
                selected[1] === month + 1 &&
                selected[2] === day;

              const isToday =
                today.getFullYear() === year &&
                today.getMonth() === month &&
                today.getDate() === day;

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => chooseDate(day)}
                  aria-pressed={isSelected}
                  className={`h-12 border-b border-r border-[#d1d5db] text-sm font-semibold transition-colors ${
                    isSelected
                      ? "bg-[#008638] text-white"
                      : "bg-white text-[#1f2937] hover:bg-green-100"
                  } ${isToday && !isSelected ? "font-bold" : ""}`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// Add and Edit Transaction Form
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

  const set = (key) => (e) => setF({ ...f, [key]: e.target.value });

  const submit = (e) => {
    e.preventDefault();

    const found = {};

    if (!f.date) found.date = "Select a date.";

    if (!(Number(f.amount) > 0)) {
      found.amount = "Enter an amount greater than 0.";
    }

    setErrors(found);

    if (Object.keys(found).length) return;

    onSubmit({
      date: f.date,
      category: f.category,
      type: f.type,
      note: f.note.trim(),
      amount: Math.round(Number(f.amount) * 100) / 100,
    });

    if (!initial) {
      setF({ ...f, note: "", amount: "" });
    }
  };

  return (
    <form onSubmit={submit} noValidate className="space-y-3">
      <Field label="Date" required error={errors.date}>
        <DatePicker
          value={f.date}
          onChange={(date) => {
            setF({ ...f, date });
            setErrors({ ...errors, date: "" });
          }}
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

// Expenses and Cash Flow Page
export default function Expenses({ data, notify, role, submittedBy }) {
  const { transactions } = data;

  const [dialog, setDialog] = useState(null);
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
    if (role === "cashier") {
      data.submitTransactionRequest(values, submittedBy);
      notify("Transaction submitted for admin review");
      return;
    }

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
              <span className="h-3 w-3 rounded-sm bg-ok" />
              Cash in
            </span>

            <span className="inline-flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm bg-accent" />
              Cash out
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

          <TransactionForm
            submitLabel={
              role === "cashier" ? "Submit transaction" : "Record transaction"
            }
            onSubmit={add}
          />
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
                {[
                  "Date",
                  "Category",
                  "Note",
                  "Type",
                  "Amount",
                  ...(role === "cashier" ? [] : ["Action"]),
                ].map((h) => (
                  <th key={h} className="p-3">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {rows.map((t) => (
                <tr key={t.id} className="border-b border-line">
                  <td className="p-3">{t.date}</td>
                  <td className="p-3">{t.category}</td>
                  <td className="p-3">{t.note || "-"}</td>

                  <td
                    className={`p-3 font-semibold ${
                      t.type === "Cash in" ? "text-ok" : "text-bad"
                    }`}
                  >
                    {t.type}
                  </td>

                  <td className="p-3 whitespace-nowrap font-semibold">
                    {t.type === "Cash in" ? "+" : "-"}
                    {peso(t.amount)}
                  </td>

                  {role !== "cashier" && (
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button
                          small
                          onClick={() => setDialog({ type: "edit", item: t })}
                          aria-label={`Edit ${t.category} ${t.date}`}
                        >
                          <Icon name="edit" className="h-3.5 w-3.5" />
                          Edit
                        </Button>

                        <Button
                          small
                          variant="warning"
                          onClick={() => setDialog({ type: "delete", item: t })}
                          aria-label={`Delete ${t.category} ${t.date}`}
                        >
                          <Icon name="trash" className="h-3.5 w-3.5" />
                          Delete
                        </Button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}

              {rows.length === 0 && (
                <tr>
                  <td
                    colSpan={role === "cashier" ? 5 : 6}
                    className="p-4 text-center text-muted"
                  >
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
