export default function KpiCard({ label, value, warn = false }) {
  return (
    <div className="border-r border-b border-line p-4 -mr-px -mb-px">
      <small className="block text-[13px] text-muted">{label}</small>
      <b className={`font-display text-[30px] leading-tight ${warn ? 'text-warn' : ''}`}>{value}</b>
    </div>
  )
}
