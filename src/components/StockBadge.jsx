const STYLE = { ok: 'text-ok', low: 'text-warn', out: 'text-bad' }
export const stockStatus = (p) =>
  p.stock <= 0 ? ['out', 'Out of stock'] : p.stock <= p.min ? ['low', 'Low stock'] : ['ok', 'In stock']

export default function StockBadge({ product }) {
  const [key, label] = stockStatus(product)
  return <span className={`inline-block rounded-[3px] border border-current px-2 text-xs font-semibold ${STYLE[key]}`}>{label}</span>
}
