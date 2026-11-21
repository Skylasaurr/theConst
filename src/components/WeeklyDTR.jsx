import { Component, useState } from "react";
import Panel from "./Panel";
import Button from "./Button";
import { users } from "../data/system";

const fromISO = (s) => new Date(s + "T00:00:00");
const addDays = (d, n) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};
const LONG = { month: "long", day: "numeric", year: "numeric" };
const fmt = (d, opts = LONG) => d.toLocaleDateString("en-PH", opts);

const WORK_DAYS = 5;
const LOADING_MS = 1500;

function getWeekRows(start) {
  return Array.from({ length: WORK_DAYS }, (_, i) => {
    const d = addDays(start, i);
    return {
      day: fmt(d, { weekday: "long" }),
      date: fmt(d, { month: "short", day: "numeric", year: "numeric" }),
      timeIn: "8:00 AM",
      timeOut: "5:00 PM",
      hours: 8,
    };
  });
}

const PAGE_CSS = `
@keyframes dtr-fill { from { width: 0 } to { width: 100% } }
@media print {
  html, body { background: #fff !important; }
  body * { visibility: hidden; }
  #dtr-paper, #dtr-paper * { visibility: visible; }
  #dtr-paper {
    position: absolute; left: 0; top: 0; width: 100%;
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
  }
}
`;

const field = "mt-1 w-full rounded border border-line px-3 py-2 text-ink";
const label = "block text-sm font-semibold";
const hint = "m-0 mt-1 text-[13px] text-muted";
const off = "disabled:cursor-not-allowed disabled:opacity-50";

export default function WeeklyDtr({ employee, onBack }) {
  const [employeeId, setEmployeeId] = useState(employee?.id ?? "");
  const [weekStart, setWeekStart] = useState("");
  const [calOpen, setCalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);

  const person = users.find((u) => u.id === employeeId);
  const start = weekStart ? fromISO(weekStart) : null;
  const end = start ? addDays(start, 6) : null;
  const canGenerate = Boolean(person && start);

  const withLoading = (done) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      done();
    }, LOADING_MS);
  };

  const generate = () =>
    withLoading(() => {
      const rows = getWeekRows(start);
      setReport({
        person,
        start,
        end,
        rows,
        total: rows.reduce((sum, r) => sum + r.hours, 0),
      });
    });

  const print = () => withLoading(() => window.print());

  const reset = () => {
    setEmployeeId("");
    setWeekStart("");
    setReport(null);
  };

  return (
    <>
      <div className="grid items-start gap-4 md:grid-cols-[280px_1fr]">
        {}
        <Panel title="Generate weekly DTR">
          <label htmlFor="dtr-employee" className={label}>
            Employee
          </label>
          <select
            id="dtr-employee"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            className={`${field} bg-surface`}
          >
            <option value="">Select an employee</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>

          <div className={`${label} mt-4`}>Week start</div>
          <div className="relative">
            <div
              className={`${field} flex items-center justify-between bg-surface`}
            >
              <span className={start ? "" : "text-muted"}>
                {start ? fmt(start) : "Select a date"}
              </span>
              <button
                type="button"
                onClick={() => setCalOpen(true)}
                aria-label="Open calendar"
                className="cursor-pointer text-muted hover:text-ink"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <rect x="3" y="5" width="18" height="16" rx="2" />
                  <path d="M3 10h18M8 3v4M16 3v4" />
                </svg>
              </button>
            </div>
            {calOpen && (
              <CalendarGuard
                fallback={(error) => (
                  <CalendarFallback
                    error={error}
                    value={weekStart}
                    onPick={setWeekStart}
                    onClose={() => setCalOpen(false)}
                  />
                )}
              >
                <Calendar
                  value={weekStart}
                  onPick={setWeekStart}
                  onClose={() => setCalOpen(false)}
                />
              </CalendarGuard>
            )}
          </div>
          <p className={hint}>Select the start of the week</p>

          <div className={`${label} mt-4`}>Week end</div>
          <div className={`${field} bg-soft`}>{end ? fmt(end) : "-"}</div>
          <p className={hint}>Automatically selected</p>

          <div className="mt-8 flex justify-end gap-2">
            <Button type="button" onClick={reset}>
              Reset
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={generate}
              disabled={!canGenerate}
              className={off}
            >
              Generate DTR
            </Button>
          </div>
        </Panel>
        {}
        <Panel className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="m-0 font-display text-[22px] font-bold">
              Weekly DTR preview
            </h2>
            <div className="flex gap-2">
              <Button type="button" onClick={onBack}>
                Go back
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={print}
                disabled={!report}
                className={off}
              >
                Print
              </Button>
            </div>
          </div>
          {}
          <div className="overflow-x-auto">
            <DtrPaper report={report} />
          </div>
        </Panel>
      </div>

      {loading && <LoadingModal />}
      <style>{PAGE_CSS}</style>
    </>
  );
}

function DtrPaper({ report }) {
  const { person, start, end, rows, total } = report ?? {};
  const tableRows = rows ?? Array.from({ length: WORK_DAYS }, () => null);
  const border = "border border-[#1B2328]";
  return (
    <div
      id="dtr-paper"
      className="min-w-[460px] rounded-xl bg-[#FDEFEC] p-5 text-[#1B2328]"
    >
      <h3 className="m-0 text-center font-display text-3xl font-bold uppercase">
        Daily time record
      </h3>
      <p className="m-0 border-b border-[#1B2328] pb-2 text-center text-[10px] font-semibold uppercase">
        Weekly attendance summary
      </p>

      <div className="mt-3 grid grid-cols-[1fr_auto] gap-x-8 gap-y-1 text-[11px] font-semibold uppercase">
        <div>Employee name: {person?.name}</div>
        <div>Employee ID: {person?.no}</div>
        <div>Employee position: {person?.pos}</div>
        <div>
          Week covered:{" "}
          {report &&
            `${fmt(start, { month: "short", day: "numeric" })} - ${fmt(end)}`}
        </div>
      </div>

      <table className="mt-3 w-full border-collapse text-center text-xs">
        <thead>
          <tr className="bg-[#D9D9D9] text-[10px] uppercase">
            {["Day", "Date", "Time in", "Time out", "Total hours"].map((h) => (
              <th key={h} className={`${border} py-1`}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableRows.map((r, i) => (
            <tr key={i} className="h-9 bg-[#EFE6E4]">
              <td className={border}>{r?.day}</td>
              <td className={border}>{r?.date}</td>
              <td className={border}>{r?.timeIn}</td>
              <td className={border}>{r?.timeOut}</td>
              <td className={border}>{r?.hours}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-3 flex justify-between text-[11px] font-bold uppercase">
        <span>Total hours for the week: {report && `${total} hours`}</span>
        <span>
          Days of attendance:{" "}
          {report && `${rows.filter((r) => r.hours > 0).length}/${WORK_DAYS}`}
        </span>
      </div>

      <div className="mt-8 flex justify-between text-center text-[9px] uppercase">
        <div className="w-40 border-t border-[#1B2328] pt-1">
          Employee signature
        </div>
        <div className="w-40 border-t border-[#1B2328] pt-1">
          Authorized signature
        </div>
      </div>
    </div>
  );
}

function LoadingModal() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-50 grid place-items-center bg-black/55"
    >
      <div className="w-72 rounded-md border-2 border-ink bg-surface p-4 font-mono text-ink">
        <div className="text-2xl font-bold tracking-widest">LOADING...</div>
        <div className="my-2 h-7 border-2 border-ink p-0.5">
          <div
            className="h-full bg-ink"
            style={{ animation: `dtr-fill ${LOADING_MS}ms steps(5) forwards` }}
          />
        </div>
        <div className="text-center text-sm tracking-widest">PLEASE WAIT</div>
      </div>
    </div>
  );
}

class CalendarGuard extends Component {
  state = { error: null };
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    return this.state.error
      ? this.props.fallback(this.state.error)
      : this.props.children;
  }
}

function CalendarFallback({ error, value, onPick, onClose }) {
  return (
    <>
      <div className="fixed inset-0 z-20" onClick={onClose} />
      <div className="absolute left-0 z-30 mt-1 w-72 rounded-md border-2 border-ink bg-surface p-3 text-ink shadow-lg">
        <input
          type="date"
          value={value}
          onChange={(e) => {
            onPick(e.target.value);
            onClose();
          }}
          className={`${field} bg-surface`}
        />
        <p className="m-0 mt-2 text-[13px] text-bad">
          Calendar error: {String(error?.message ?? error)}
        </p>
        <Button type="button" small className="mt-2" onClick={onClose}>
          Close
        </Button>
      </div>
    </>
  );
}

const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const pad = (n) => String(n).padStart(2, "0");

function Calendar({ value, onPick, onClose }) {
  const [shown, setShown] = useState(() =>
    value ? new Date(value + "T00:00:00") : new Date(),
  );
  const year = shown.getFullYear();
  const month = shown.getMonth();

  const blanks = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [
    ...Array(blanks).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const move = (n) => setShown(new Date(year, month + n, 1));
  const pick = (iso) => {
    onPick(iso);
    onClose();
  };

  return (
    <>
      {}
      <div className="fixed inset-0 z-20" onClick={onClose} />

      <div
        role="dialog"
        aria-label="Choose the start of the week"
        className="absolute left-0 z-30 mt-1 w-72 rounded-md border-2 border-ink bg-surface p-2 text-ink shadow-lg"
      >
        <div className="mb-2 flex items-center justify-between">
          <button
            type="button"
            onClick={() => move(-1)}
            aria-label="Previous month"
            className="cursor-pointer px-2 text-xl"
          >
            &lsaquo;
          </button>
          <strong className="font-display text-2xl uppercase">
            {shown.toLocaleDateString("en-PH", {
              month: "long",
              year: "numeric",
            })}
          </strong>
          <button
            type="button"
            onClick={() => move(1)}
            aria-label="Next month"
            className="cursor-pointer px-2 text-xl"
          >
            &rsaquo;
          </button>
        </div>

        <div className="grid grid-cols-7 bg-soft text-center text-[10px] font-bold">
          {DAYS.map((d) => (
            <div key={d} className="border border-line py-0.5">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {cells.map((day, i) => {
            if (!day) return <div key={i} className="h-9 border border-line" />;
            const iso = `${year}-${pad(month + 1)}-${pad(day)}`;
            return (
              <button
                key={i}
                type="button"
                onClick={() => pick(iso)}
                className={`h-9 cursor-pointer border border-line p-1 text-left align-top text-xs hover:bg-accent hover:text-accent-ink ${iso === value ? "bg-accent font-bold text-accent-ink" : ""}`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
