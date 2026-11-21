import { useState } from 'react'

const categories = ['Stock purchase', 'Fuel & delivery', 'Utilities', 'Salaries', 'Supplies', 'Other']
const sample = [
  { id: 1, date: '2026-11-16', category: categories[0], note: 'Supplier restock', amount: 7450 },
  { id: 2, date: '2026-11-16', category: categories[1], note: 'Truck diesel', amount: 1600 },
  { id: 3, date: '2026-11-15', category: categories[2], note: 'Electricity and water', amount: 3800 },
]
const money = n => '₱' + Number(n).toLocaleString('en-PH', { minimumFractionDigits: 2 })
const totalOf = list => list.reduce((s, e) => s + e.amount, 0)
const card = 'rounded-lg border border-line bg-surface p-4'
const field = 'w-full rounded-md border border-line p-3'

export default function Expenses() {
  const [expenses, setExpenses] = useState(sample)
  const [form, setForm] = useState({ date: new Date().toISOString().slice(0, 10), category: categories[0], note: '', amount: '' })
  const total = totalOf(expenses)
  const update = e => setForm({ ...form, [e.target.name]: e.target.value })

  const add = e => {
    e.preventDefault()
    if (Number(form.amount) <= 0) return
    setExpenses([{ ...form, id: Date.now(), amount: Number(form.amount) }, ...expenses])
    setForm({ ...form, note: '', amount: '' })
  }
  const remove = id => {
    if (confirm('Delete this expense?')) setExpenses(expenses.filter(e => e.id !== id))
  }

  const stats = [
    ['Total expenses', money(total)],
    ['Recorded expenses', expenses.length],
    ['Stock purchases', money(totalOf(expenses.filter(e => e.category === categories[0])))],
    ['Other expenses', money(totalOf(expenses.filter(e => e.category !== categories[0])))]
  ]

  return <div className="space-y-5">
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map(([a, b]) => <div key={a} className={card}>
        <p className="text-sm text-muted">{a}</p>
        <h2 className="mt-2 text-2xl font-bold">{b}</h2>
      </div>)}
    </div>

    <div className="grid gap-4 lg:grid-cols-2">
      <section className={card}>
        <h2 className="mb-4 text-lg font-bold">Add expense</h2>
        <form onSubmit={add} className="space-y-3">
       <input className={field} type="date" name="date" value={form.date} onChange={update} required />
      <select className={'$field} bg-surface text-ink'} name="category" value={form.category} onChange={update}>
      {categories.map(c => <option key={c}>{c}</option>)}
        </select>
      <input className={field} name="note" placeholder="Note (optional)" value={form.note} onChange={update} />
      <input className={field} type="number" name="amount" min="0.01" step="0.01" placeholder="Amount (₱)" value={form.amount} onChange={update} required />
      <button className="rounded-md bg-amber-500 px-5 py-3 font-semibold text-black">Record expense</button>
      </form>
      </section>

      <section className={card}>
        <h2 className="mb-4 text-lg font-bold">Expense summary</h2>
        {categories.map(c => {
       const amount = totalOf(expenses.filter(e => e.category === c))
       return <div key={c} className="mb-4">
     <div className="mb-1 flex justify-between text-sm"><span>{c}</span><strong>{money(amount)}</strong></div>
      <div className="h-2 rounded bg-slate-200">
         <div className="h-2 rounded bg-amber-500" style={{ width: `${total ? amount / total * 100 : 0}%` }} />
          </div>
          </div>  })}
      </section>
    </div>

    <section className={card}>
      <h2 className="mb-4 text-lg font-bold">Recent expenses</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
       <thead><tr className="border-b border-line text-muted">
      {['Date', 'Category', 'Note', 'Amount', 'Action'].map(h => <th key={h} className="p-3">{h}</th>)}
      </tr></thead>
      <tbody>
     {expenses.map(e => <tr key={e.id} className="border-b border-line">
     <td className="p-3">{e.date}</td>
      <td className="p-3">{e.category}</td>
     <td className="p-3">{e.note || '-'}</td>
     <td className="p-3 font-semibold">{money(e.amount)}</td>
       <td className="p-3"><button className="text-red-600" onClick={() => remove(e.id)}>Delete</button></td>
      </tr>)}
     {!expenses.length && <tr><td colSpan="5" className="p-4 text-center text-muted">No expenses recorded.</td></tr>}
       </tbody>
   </table>
  </div>
 </section>
  </div>
}
