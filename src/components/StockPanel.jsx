import { useState, useMemo } from 'react'
import Panel from './Panel'
import StockBadge, { stockStatus } from './StockBadge'

/* Searchable, filterable stock-alert list. */
export default function StockPanel({ title, products }) {
  const [q, setQ] = useState('')
  const [unit, setUnit] = useState('All')
  const units = useMemo(() => ['All', ...new Set(products.map((p) => p.cat))], [products])
  const rows = products.filter(
    (p) => stockStatus(p)[0] !== 'ok' && (unit === 'All' || p.cat === unit) && (p.name + p.sku).toLowerCase().includes(q.toLowerCase()),
  )
  const field = 'rounded border border-line bg-surface px-2.5 py-2'
  return (
    <Panel title={title}>
      <div className="mb-3 flex flex-wrap gap-2">
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or code" aria-label="Search stock alerts" className={`${field} min-w-0 flex-1 basis-40`} />
        <select value={unit} onChange={(e) => setUnit(e.target.value)} aria-label="Category" className={field}>
          {units.map((u) => <option key={u}>{u}</option>)}
        </select>
      </div>
      {rows.length > 20 && <p className="m-0 mb-2 text-xs text-muted">Showing 20 of {rows.length} alerts. Search or filter to narrow the list.</p>}
      <ul className="m-0 max-h-80 list-none overflow-y-auto p-0">
        {rows.slice(0, 20).map((p) => (
          <li key={p.id} className="flex items-center justify-between gap-2.5 border-b border-line py-2 last:border-0">
            <span>{p.name}<small className="block text-muted">{p.stock} {p.unit} left, minimum {p.min}</small></span>
            <StockBadge product={p} />
          </li>
        ))}
        {rows.length === 0 && <li className="py-3.5 text-muted">No stock alerts match your search.</li>}
      </ul>
    </Panel>
  )
}
