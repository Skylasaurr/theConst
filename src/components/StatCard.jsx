import Icon from "./Icon";

const TONES = {
  green: "bg-ok/15 text-ok",
  yellow: "bg-warn/15 text-warn",
  red: "bg-bad/15 text-bad",
  orange: "bg-accent/25 text-warn",
};

export default function StatCard({ icon, label, value, note, tone }) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-line bg-surface p-5 sm:flex-row sm:items-center sm:gap-3 sm:p-4">
      <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${TONES[tone]}`}>
        <Icon name={icon} className="h-5 w-5" />
      </div>

      <div className="min-w-0">
        <p className="m-0 text-xs text-muted">{label}</p>
        <p className="m-0 font-display text-2xl leading-none font-bold sm:text-[28px]">{value}</p>
        <p className="m-0 mt-1 text-[11px] break-words text-muted">{note}</p>
      </div>
    </div>
  );
}
