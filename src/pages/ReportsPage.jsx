import { useState } from 'react'
import KpiGrid, { Cols } from '../components/KpiGrid'
import KpiCard from '../components/KpiCard'
import Panel from '../components/Panel'
import Button from '../components/Button'
import BarList from '../components/BarList'
import DataTable from '../components/DataTable'
import SalesChart from '../components/SalesChart'
import { stockStatus } from '../components/StockBadge'
import { products, sales, salesByDay, expenses } from '../data/system'
import { peso, kpeso } from '../lib/format'
import { downloadCsv } from '../lib/csv'

const TABS = {
  owner: [['sales', 'Sales'], ['inventory', 'Inventory'], ['expenses', 'Expenses']],
  cashier: [['sales', 'Sales']],
  inventory: [['inventory', 'Inventory']],
}
const shortDate = (d) => d.toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })
const sum = (list, f) => list.reduce((t, x) => t + f(x), 0)
const group = (list, key, val) => {
  const m = {}
  list.forEach((x) => { m[key(x)] = (m[key(x)] || 0) + val(x) })
  return Object.entries(m).map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value)
}
const withText = (rows, fmt = peso) => rows.map((r) => ({ ...r, text: fmt(r.value) }))

export default function ReportsPage({ role }) {
  const tabs = TABS[role] || TABS.owner
  const [tab, setTab] = useState(tabs[0][0])
  const [range, setRange] = useState(7)
  const from = 7 - range
  const mySales = sales.filter((s) => s.day >= from)
  const myExp = expenses.filter((e) => e.day >= from)
  const revenue = sum(mySales, (s) => s.total)
  const spent = sum(myExp, (e) => e.amt)

  /* each tab builds its own numbers and its CSV export */
  let content, exportFn
  if (tab === 'sales') {
    const lines = mySales.flatMap((s) => s.items.map((i) => ({ ...i, amount: i.qty * i.price })))
    const top = withText(group(lines, (i) => i.name, (i) => i.amount)).slice(0, 6)
    const pay = withText(group(mySales, (s) => s.pay, (s) => s.total))
    const recent = [...mySales].reverse().slice(0, 8)
    exportFn = () => downloadCsv('sales-report.csv', ['Receipt', 'Date', 'Payment', 'Cashier', 'Total'], mySales.map((s) => [s.id, shortDate(s.date), s.pay, s.by, s.total]))
    content = (
      <>
        <KpiGrid>
          <KpiCard label="Revenue" value={peso(revenue)} />
          <KpiCard label="Transactions" value={mySales.length} />
          <KpiCard label="Average sale" value={peso(mySales.length ? revenue / mySales.length : 0)} />
          <KpiCard label="Items sold" value={sum(lines, (i) => i.qty)} />
        </KpiGrid>
        <Panel title={`Daily sales, last ${range} days`} className="mb-4"><SalesChart data={salesByDay.slice(from)} /></Panel>
        <Cols>
          <Panel title="Top products by sales"><BarList items={top} /></Panel>
          <Panel title="Payment methods"><BarList items={pay} /></Panel>
        </Cols>
        <Panel title="Recent transactions" className="mt-4">
          <DataTable right={[5]} head={['Receipt', 'Date', 'Cashier', 'Payment', 'Items', 'Total']}
            rows={recent.map((s) => [s.id, shortDate(s.date), s.by, s.pay, s.items.length, peso(s.total)])} />
        </Panel>
      </>
    )
  } else if (tab === 'inventory') {
    const counts = { ok: 0, low: 0, out: 0 }
    products.forEach((p) => counts[stockStatus(p)[0]]++)
    const status = [
      { label: 'In stock', value: counts.ok, text: counts.ok, color: 'var(--ok)' },
      { label: 'Low stock', value: counts.low, text: counts.low, color: 'var(--warn)' },
      { label: 'Out of stock', value: counts.out, text: counts.out, color: 'var(--bad)' },
    ]
    const byUnit = withText(group(products, (p) => p.cat, () => 1), String).slice(0, 8)
    const priority = products.filter((p) => p.stock <= p.min).sort((a, b) => a.stock / a.min - b.stock / b.min).slice(0, 8)
    exportFn = () => downloadCsv('inventory-report.csv', ['Code', 'Product', 'Unit', 'Price', 'Stock', 'Minimum', 'Status'], products.map((p) => [p.sku, p.name, p.unit, p.price, p.stock, p.min, stockStatus(p)[1]]))
    content = (
      <>
        <KpiGrid>
          <KpiCard label="Products" value={products.length} />
          <KpiCard label="Inventory value" value={kpeso(sum(products, (p) => p.price * p.stock))} />
          <KpiCard label="Low stock" value={counts.low} warn />
          <KpiCard label="Out of stock" value={counts.out} warn />
        </KpiGrid>
        <Cols>
          <Panel title="Stock status"><BarList items={status} /></Panel>
          <Panel title="Products by unit"><BarList items={byUnit} /></Panel>
        </Cols>
        <Panel title="Restock priority" className="mt-4">
          <DataTable right={[2, 3]} head={['Product', 'Unit', 'Stock', 'Minimum']} rows={priority.map((p) => [p.name, p.unit, p.stock, p.min])} />
        </Panel>
      </>
    )
  } else {
    const cats = withText(group(myExp, (e) => e.cat, (e) => e.amt))
    exportFn = () => downloadCsv('expenses-report.csv', ['Date', 'Category', 'Note', 'Amount'], myExp.map((e) => [shortDate(e.date), e.cat, e.note, e.amt]))
    const net = revenue - spent
    content = (
      <>
        <KpiGrid>
          <KpiCard label="Total expenses" value={peso(spent)} />
          <KpiCard label="Biggest category" value={cats[0]?.label || 'None'} />
          <KpiCard label="Sales minus expenses" value={peso(net)} warn={net < 0} />
        </KpiGrid>
        <Cols>
          <Panel title="Expenses by category"><BarList items={cats} /></Panel>
          <Panel title="Expense records">
            <DataTable right={[3]} head={['Date', 'Category', 'Note', 'Amount']} rows={myExp.map((e) => [shortDate(e.date), e.cat, e.note, peso(e.amt)])} />
          </Panel>
        </Cols>
      </>
    )
  }

  const pill = (on) => `cursor-pointer rounded border px-3.5 py-1.5 ${on ? 'border-accent bg-accent font-semibold text-accent-ink' : 'border-line bg-surface hover:border-muted'}`
  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-2.5">
        <div role="tablist" aria-label="Report type" className="flex gap-2">
          {tabs.map(([id, label]) => <button key={id} role="tab" aria-selected={tab === id} onClick={() => setTab(id)} className={pill(tab === id)}>{label}</button>)}
        </div>
        {tab !== 'inventory' && (
          <label className="ml-auto flex items-center gap-2 text-sm text-muted">Period
            <select value={range} onChange={(e) => setRange(Number(e.target.value))} className="rounded border border-line bg-surface px-2.5 py-1.5 text-ink">
              <option value={3}>Last 3 days</option><option value={7}>Last 7 days</option>
            </select>
          </label>
        )}
        <Button className={tab === 'inventory' ? 'ml-auto' : ''} onClick={exportFn}>Export CSV</Button>
      </div>
      {content}
    </>
  )
}
