import KpiCard from './KpiCard'
import Panel from './Panel'
import Button from './Button'
import SalesChart from './SalesChart'
import StockPanel from './StockPanel'
import RequestsPanel from './RequestsPanel'
import { peso } from '../lib/format'
import { users, products, salesByDay, weekExpenses } from '../data/system'

const Kpis = ({ children }) => (
  <div className="mb-4 grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] overflow-hidden rounded-md border border-line bg-surface">{children}</div>
)
const Cols = ({ children }) => <div className="grid items-start gap-4 lg:grid-cols-[3fr_2fr]">{children}</div>

const low = products.filter((p) => p.stock <= p.min).length
const out = products.filter((p) => p.stock <= 0).length
const clocked = users.filter((u) => u.in).length

export default function Dashboard({ role, user, requests, onDecide, onPage }) {
  const week = salesByDay.reduce((t, d) => t + d.value, 0)
  const today = salesByDay[salesByDay.length - 1]

  if (role === 'owner') return (
    <>
      <Kpis>
        <KpiCard label="Sales today" value={peso(today.value)} />
        <KpiCard label="Sales, last 7 days" value={peso(week)} />
        <KpiCard label="Expenses, last 7 days" value={peso(weekExpenses)} />
        <KpiCard label="Low or out of stock" value={low} warn />
        <KpiCard label="Staff clocked in" value={`${clocked} of ${users.length}`} />
      </Kpis>
      <Cols>
        <Panel title="Sales, last 7 days"><SalesChart data={salesByDay} /></Panel>
        <RequestsPanel requests={requests} onDecide={onDecide} />
      </Cols>
      <StockPanel title="Low-stock alerts" products={products} />
    </>
  )
  if (role === 'cashier') return (
    <>
      <Kpis>
        <KpiCard label="My sales today" value={peso(today.value)} />
        <KpiCard label="My transactions today" value={today.count} />
        <KpiCard label="Items low on stock" value={low} warn />
      </Kpis>
      <Cols>
        <StockPanel title="Low-stock alerts" products={products} />
        <Panel title="Start serving">
          <p className="mt-0 mb-3 text-muted">Ring up customers and the system deducts stock automatically.</p>
          <Button variant="primary" onClick={() => onPage('pos')}>New sale</Button>
        </Panel>
      </Cols>
    </>
  )
  if (role === 'inventory') return (
    <>
      <Kpis>
        <KpiCard label="Products" value={products.length} />
        <KpiCard label="Low stock" value={low - out} warn />
        <KpiCard label="Out of stock" value={out} warn />
      </Kpis>
      <StockPanel title="Restock soon" products={products} />
    </>
  )
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Panel title="My information">
        <ul className="m-0 list-none p-0">
          {[['Name', user.name], ['Employee no.', user.no], ['Position', user.pos], ['Contact', user.contact]].map(([k, v]) => (
            <li key={k} className="flex justify-between gap-2.5 border-b border-line py-2 last:border-0"><span>{k}</span><b>{v}</b></li>
          ))}
        </ul>
      </Panel>
      <Panel title="Today">
        <p className="mt-0 mb-3 text-muted">You have not timed in yet today.</p>
        <Button variant="primary" onClick={() => onPage('dtr')}>Open my DTR</Button>
      </Panel>
    </div>
  )
}
