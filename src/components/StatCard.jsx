import { peso } from "../lib/format";

const TONES = {
  green: "bg-emerald-100 text-emerald-800",
  yellow: "bg-amber-100 text-amber-700",
  red: "bg-red-100 text-red-700",
  orange: "bg-orange-100 text-orange-600",
};

export default function StatCard({ icon, label, value, note, tone }) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-ink/15 bg-surface p-5 sm:flex-row sm:items-center sm:gap-3 sm:p-4">
      <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg text-lg ${TONES[tone]}`} >
        {icon}
      </div>
      
      <div className="min-w-0">
        <p className="text-xs text-muted">{label}</p>
        <p className="m-0 font-display text-2xl font-bold leading-none sm:text-[28px]">{value}</p>
        <p className="text-[11px] text-muted break-words">{note}</p>
      </div>
    </div>
  );
}