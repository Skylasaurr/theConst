import { useState } from "react";

const fromISO = (s) => new Date(s + "T00:00:00");
const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const pad = (n) => String(n).padStart(2, "0");

export default function Calendar({ value, onPick, onClose }) {
  const [shown, setShown] = useState(() =>
    value ? fromISO(value) : new Date(),
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