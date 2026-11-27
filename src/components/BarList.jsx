/* Horizontal bar chart: items = [{ label, value, text }] */
export default function BarList({ items, empty = 'No data for this range.' }) {
  const max = Math.max(1, ...items.map((i) => i.value))
  if (!items.length) return <p className="m-0 text-muted">{empty}</p>
  return (
    <ul className="m-0 list-none p-0">
      {items.map((i) => (
        <li key={i.label} className="mb-2.5 last:mb-0">
          <div className="mb-1 flex justify-between gap-3 text-sm"><span className="truncate">{i.label}</span><b className="shrink-0">{i.text}</b></div>
          <div className="h-2 rounded-full bg-soft"><div className="h-2 rounded-full bg-bar" style={{ width: `${Math.max(2, (i.value / max) * 100)}%`, background: i.color }} /></div>
        </li>
      ))}
    </ul>
  )
}
