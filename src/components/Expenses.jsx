
import { useState } from 'react'

const categories = [
  'Stock purchase', 'Fuel & delivery', 'Utilities',
  'Sales', 'Repayment', 'Supplies', 'Other'
]

const today = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const dateAgo = days => {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const sample = [
  { id: 1, date: dateAgo(6), category: 'Stock purchase', note: 'Supplier restock', amount: 7450, type: 'Cash out' },
  { id: 2, date: dateAgo(5), category: 'Sales', note: 'Materials sales', amount: 12000, type: 'Cash in' },
  { id: 3, date: dateAgo(4), category: 'Fuel & delivery', note: 'Truck diesel', amount: 1600, type: 'Cash out' },
  { id: 4, date: dateAgo(3), category: 'Utilities', note: 'Electricity and water', amount: 3800, type: 'Cash out' },
  { id: 5, date: dateAgo(2), category: 'Repayment', note: 'Employee loan repayment', amount: 5200, type: 'Cash in' },
  { id: 6, date: dateAgo(1), category: 'Sales', note: 'Construction materials sales', amount: 8500, type: 'Cash in' },
  { id: 7, date: today(), category: 'Sales', note: 'Daily sales', amount: 12000, type: 'Cash in' },
]

const money = n => '₱' + n.toLocaleString('en-PH', {
  minimumFractionDigits: 2
})

const card = 'rounded-lg border border-line bg-surface p-4'
const field = 'w-full rounded-md border border-line bg-surface p-3 text-ink'

export default function Expenses() {
  const [transactions, setTransactions] = useState(sample)
  const [form, setForm] = useState({
    date: today(),
    category: categories[0],
    note: '',
    amount: '',
    type: 'Cash out'
  })

  const update = e => setForm({ ...form, [e.target.name]: e.target.value })

  const total = type => transactions
    .filter(t => t.type === type)
    .reduce((sum, t) => sum + t.amount, 0)

  const add = e => {
    e.preventDefault()
    if (Number(form.amount) <= 0) return

    setTransactions([
      { ...form, id: Date.now(), amount: Number(form.amount) },
      ...transactions
    ])
    setForm({ ...form, note: '', amount: '' })
  }

  const remove = id => {
    if (confirm('Delete this transaction?')) {
      setTransactions(transactions.filter(t => t.id !== id))
    }
  }

  const start = new Date()
  start.setDate(start.getDate() - 6)

  const last7 = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(start)
    date.setDate(start.getDate() + i)

    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

    return {
      date: key,
      label: `${date.getMonth() + 1}-${String(date.getDate()).padStart(2, '0')}`,
      in: transactions.filter(t => t.date === key && t.type === 'Cash in').reduce((s, t) => s + t.amount, 0),
      out: transactions.filter(t => t.date === key && t.type === 'Cash out').reduce((s, t) => s + t.amount, 0)
    }
  })

  const todayIn = transactions
    .filter(t => t.date === today() && t.type === 'Cash in')
    .reduce((s, t) => s + t.amount, 0)

  const todayOut = transactions
    .filter(t => t.date === today() && t.type === 'Cash out')
    .reduce((s, t) => s + t.amount, 0)

  const netToday = todayIn - todayOut
  const netWeek = last7.reduce((s, d) => s + d.in - d.out, 0)
  const maxBar = Math.max(1, ...last7.map(d => Math.max(d.in, d.out)))

  const stats = [
    ['Cash in today', money(todayIn)],
    ['Cash out today', money(todayOut)],
    ['Net today', money(netToday)],
    ['Net, last 7 days', money(netWeek)]
  ]

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(([label, value]) => (
          <div key={label} className={card}>
            <p className="text-sm text-muted">{label}</p>
            <h2 className="mt-2 text-2xl font-bold">{value}</h2>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <section className={card}>
          <h2 className="mb-2 text-lg font-bold">Cash Flow - Last 7 Days</h2>

          <div className="mb-4 flex gap-4 text-sm">
            <span className="text-green-700">■ Cash in</span>
            <span className="text-amber-500">■ Cash out</span>
          </div>

          <div className="flex h-52 items-end justify-around gap-2 border-b border-line px-2">
            {last7.map(day => (
              <div key={day.date} className="flex h-full flex-1 items-end justify-center gap-1">
                <div
                  className="w-7 rounded-t-md bg-green-700"
                  style={{ height: `${day.in / maxBar * 90}%` }}
                  title={`Cash in: ${money(day.in)}`}
                />
                <div
                  className="w-7 rounded-t-md bg-amber-400"
                  style={{ height: `${day.out / maxBar * 90}%` }}
                  title={`Cash out: ${money(day.out)}`}
                />
              </div>
            ))}
          </div>

          <div className="mt-2 flex justify-around text-xs text-muted">
            {last7.map(day => (
              <span key={day.date}>{day.label}</span>
            ))}
          </div>
        </section>

        <section className={card}>
          <h2 className="mb-4 text-lg font-bold">Add Transaction</h2>

          <form onSubmit={add} className="space-y-3">
            <input
              className={field}
              type="date"
              name="date"
              value={form.date}
              onChange={update}
              required
            />

            <select
              className={field}
              name="category"
              value={form.category}
              onChange={update}
            >
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>

            <select
              className={field}
              name="type"
              value={form.type}
              onChange={update}
            >
              <option>Cash in</option>
              <option>Cash out</option>
            </select>

            <input
              className={field}
              name="note"
              placeholder="Note (optional)"
              value={form.note}
              onChange={update}
            />

            <input
              className={field}
              type="number"
              name="amount"
              min="0.01"
              step="0.01"
              placeholder="Amount (₱)"
              value={form.amount}
              onChange={update}
              required
            />

            <button className="w-full rounded-md bg-green-700 px-5 py-3 font-semibold text-white">
              Record transaction
            </button>
          </form>
        </section>
      </div>

      <section className={card}>
        <h2 className="mb-4 text-lg font-bold">Transaction History</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line text-muted">
                {['Date', 'Category', 'Note', 'Type', 'Amount', 'Action'].map(h => (
                  <th key={h} className="p-3">{h}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {transactions.map(t => (
                <tr key={t.id} className="border-b border-line">
                  <td className="p-3">{t.date}</td>
                  <td className="p-3">{t.category}</td>
                  <td className="p-3">{t.note || '-'}</td>
                  <td className={`p-3 font-semibold ${t.type === 'Cash in' ? 'text-green-700' : 'text-red-600'}`}>
                    {t.type}
                  </td>
                  <td className="p-3 font-semibold">
                    {t.type === 'Cash in' ? '+' : '-'}{money(t.amount)}
                  </td>
                  <td className="p-3">
                    <button
                      className="text-red-600"
                      onClick={() => remove(t.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {!transactions.length && (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-muted">
                    No transactions recorded.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
