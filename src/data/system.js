import products from './products.json'

export const users = [
  { id: 'u1', no: 'E-001', name: 'Patricia Bonto', role: 'owner', pos: 'Administrator', contact: '0917 000 0001', in: '7:45 AM' },
  { id: 'u2', no: 'E-002', name: 'Justine Oriola', role: 'cashier', pos: 'Cashier', contact: '0917 000 0002', in: '7:52 AM' },
  { id: 'u3', no: 'E-003', name: 'Darren Jake Payoran', role: 'inventory', pos: 'Inventory staff', contact: '0917 000 0003', in: '8:03 AM' },
  { id: 'u4', no: 'E-004', name: 'Christian Angelo Basbas', role: 'staff', pos: 'Sales helper', contact: '0917 000 0004', in: null },
  { id: 'u5', no: 'E-005', name: 'Christine Joy San Pablo', role: 'staff', pos: 'Delivery helper', contact: '0917 000 0005', in: '8:10 AM' },
]
export const DEMO_USER = { owner: 'u1', cashier: 'u2', inventory: 'u3'}
export const ROLES = [
  ['owner', 'Administrator'], ['cashier', 'Cashier'], ['inventory', 'Inventory Staff'],
]
export const NAV = {
  owner: [['dash', 'Dashboard'], ['inv', 'Inventory'], ['dtr', 'IWS Employees'], ['att', 'Employees Attendance'], ['exp', 'Expenses & cash flow'], ['rep', 'Reports'], ['req', 'Requests'], ['out', 'Logout']],
  cashier: [['dash', 'Dashboard'], ['inv', 'Stock'], ['pos', 'Point of Sale'], ['exp', 'Expenses'], ['rep', 'Sales report'], ['req', 'My requests'], ['out', 'Logout']],
  inventory: [['dash', 'Dashboard'], ['inv', 'Inventory'], ['rep', 'Inventory report'], ['req', 'My requests'], ['out', 'Logout']],
}

export { products }
export const initialRequests = [
  { id: 'Q-1', by: 'Darren Jake Payoran', text: 'Stock count adjustment: PPR PIPE 1 32mm to 152', reason: 'Physical count is higher than the system' },
  { id: 'Q-2', by: 'Christine Joy San Pablo', text: 'DTR correction: 07:40 to 17:05', reason: 'Forgot to time in' },
]

/* Sample transactions for the last 7 days (seeded, so numbers stay stable between reloads). */
let seed = 11
const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647
const inStock = products.filter((p) => p.stock > 1)
const today = new Date()
const OFFSETS = [-6, -5, -4, -3, -2, -1, 0]
const dayDate = (n) => { const d = new Date(today); d.setDate(d.getDate() + n); return d }

export const sales = []
OFFSETS.forEach((n, day) => {
  const count = n === 0 ? 3 : 3 + Math.floor(rnd() * 3)
  for (let i = 0; i < count; i++) {
    const items = Array.from({ length: 1 + Math.floor(rnd() * 3) }, () => {
      const p = inStock[Math.floor(rnd() * inStock.length)]
      return { name: p.name, unit: p.unit, price: p.price, qty: 1 + Math.floor(rnd() * (p.price < 100 ? 10 : 4)) }
    })
    sales.push({
      id: 'R-' + String(sales.length + 1).padStart(4, '0'), day, date: dayDate(n), items,
      total: Math.round(items.reduce((t, x) => t + x.qty * x.price, 0)),
      pay: rnd() < 0.7 ? 'Cash' : 'GCash', by: rnd() < 0.8 ? 'Justine Oriola' : 'Patricia Bonto',
    })
  }
})

export const salesByDay = OFFSETS.map((n, day) => {
  const list = sales.filter((s) => s.day === day)
  return { label: dayDate(n).toLocaleDateString('en-PH', { weekday: 'short' }), value: list.reduce((t, s) => t + s.total, 0), count: list.length }
})

export const expenses = [
  [-6, 'Supplier payment', 'Cement restock', 12500], [-5, 'Utilities', 'Electricity bill', 3180],
  [-4, 'Delivery', 'Fuel for delivery truck', 1450], [-3, 'Supplies', 'Receipt rolls and ink', 420],
  [-2, 'Salaries', 'Weekly wages', 8400], [-1, 'Meals', 'Staff lunch during inventory', 380],
  [0, 'Delivery', 'Tricycle fare for hollow blocks', 300],
].map(([n, cat, note, amt]) => ({ day: 6 + n, date: dayDate(n), cat, note, amt }))

export const weekExpenses = expenses.reduce((t, e) => t + e.amt, 0)
export const PASSWORD = 'Impig_123'
