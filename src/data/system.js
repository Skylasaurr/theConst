import products from './products.json'
import { daysAgo, isoDate } from '../lib/format'

export const users = [
  { id: 'u1', no: 'E-001', name: 'Patricia Bonto', role: 'owner', pos: 'Administrator', contact: '0917 000 0001', in: '7:45 AM' },
  { id: 'u2', no: 'E-002', name: 'Justine Oriola', role: 'cashier', pos: 'Cashier', contact: '0917 000 0002', in: '7:52 AM' },
  { id: 'u3', no: 'E-003', name: 'Darren Jake Payoran', role: 'inventory', pos: 'Inventory staff', contact: '0917 000 0003', in: '8:03 AM' },
  { id: 'u4', no: 'E-004', name: 'Christian Angelo Basbas', role: 'staff', pos: 'Sales helper', contact: '0917 000 0004', in: null },
  { id: 'u5', no: 'E-005', name: 'Christine Joy San Pablo', role: 'staff', pos: 'Delivery helper', contact: '0917 000 0005', in: '8:10 AM' },
  { id: 'u6', no: 'E-006', name: 'Mark Ian Ebora', role: 'staff', pos: 'Delivery helper', contact: '0917 000 0006', in: '8:15 AM' },
]
export const DEMO_USER = { owner: 'u1', cashier: 'u2', inventory: 'u3'}
export const ROLES = [
  ['owner', 'Administrator'], ['cashier', 'Cashier'], ['inventory', 'Inventory Staff'],
]
export const NAV = {
  owner: [['dash', 'Dashboard'], ['inv', 'Inventory'], ['dtr', 'IWS Employees'], ['att', 'Employees Attendance'], ['exp', 'Expenses & Cash Flow'], ['rep', 'Reports & Analytics'], ['req', 'Requests'], ['out', 'Logout']],
  cashier: [['dash', 'Dashboard'], ['inv', 'Stock'], ['pos', 'Point of Sale'], ['exp', 'Expenses'], ['rep', 'Sales report'], ['req', 'My requests'], ['out', 'Logout']],
  inventory: [['dash', 'Dashboard'], ['inv', 'Inventory'], ['rep', 'Inventory report'], ['req', 'My requests'], ['out', 'Logout']],
}

export { products }
export const PASSWORD = 'Impig_123'


export const initialRequests = [
  { id: 'Q-1', by: 'Darren Jake Payoran', text: 'Stock count adjustment: PPR PIPE 1 32mm to 152', reason: 'Physical count is higher than the system', type: 'stock', payload: { productId: 'p3', stock: 152 }, status: 'pending', decidedAt: null },
  { id: 'Q-2', by: 'Christine Joy San Pablo', text: 'DTR correction: 07:40 to 17:05', reason: 'Forgot to time in', type: 'dtr', payload: { employeeId: 'u5', timeIn: '7:40 AM', timeOut: '5:05 PM' }, status: 'pending', decidedAt: null },
  { id: 'Q-3', by: 'Darren Jake Payoran', text: 'Stock count adjustment: FUSION MACHINE 6 pcs to 10 pcs', reason: 'Delivery received but not yet encoded', type: 'stock', payload: { productId: 'p19', stock: 10 }, status: 'pending', decidedAt: null },
]

const emp = (id, no, first, middle, last, role, pos, contact, email, birthdate, hired, username) => ({
  id, no, first, middle, last, role, pos, contact, email, birthdate, hired, username, created: hired,
})
export const initialEmployees = [
  emp('u1', 'E-001', 'Patricia', '', 'Bonto', 'owner', 'Administrator', '0917 000 0001', 'patricia.bonto@impig.example', '1985-03-14', '2023-01-09', 'pbonto'),
  emp('u2', 'E-002', 'Justine', '', 'Oriola', 'cashier', 'Cashier', '0917 000 0002', 'justine.oriola@impig.example', '1999-07-21', '2024-02-12', 'joriola'),
  emp('u3', 'E-003', 'Darren Jake', '', 'Payoran', 'inventory', 'Inventory staff', '0917 000 0003', 'darren.payoran@impig.example', '2000-11-02', '2024-05-20', 'dpayoran'),
  emp('u4', 'E-004', 'Christian Angelo', '', 'Basbas', 'staff', 'Sales helper', '0917 000 0004', 'christian.basbas@impig.example', '2001-01-30', '2025-03-03', ''),
  emp('u5', 'E-005', 'Christine Joy', '', 'San Pablo', 'staff', 'Delivery helper', '0917 000 0005', 'christine.sanpablo@impig.example', '2000-09-18', '2025-06-16', ''),
  emp('u6', 'E-006', 'Mark Ian', '', 'Ebora', 'staff', 'CEO', '0917 000 0006', 'mark.ebora@impig.example', '2000-12-25', '2025-07-15', ''),
]
export const initialAttendance = Object.fromEntries(
  users.map((u) => [u.id, { timeIn: u.in, timeOut: null }]),
)

const tx = (id, ago, category, note, amount, type) => ({ id, date: daysAgo(ago), category, note, amount, type })
export const initialTransactions = [
  tx(1, 6, 'Stock purchase', 'Supplier restock', 7450, 'Cash out'),
  tx(2, 5, 'Sales', 'Materials sales', 12000, 'Cash in'),
  tx(3, 4, 'Fuel & delivery', 'Truck diesel', 1600, 'Cash out'),
  tx(4, 3, 'Utilities', 'Electricity and water', 3800, 'Cash out'),
  tx(5, 2, 'Repayment', 'Employee loan repayment', 5200, 'Cash in'),
  tx(6, 1, 'Sales', 'Construction materials sales', 8500, 'Cash in'),
  tx(7, 0, 'Sales', 'Daily sales', 12000, 'Cash in'),
  tx(8, 9, 'Stock purchase', 'Cement and steel bars', 18400, 'Cash out'),
  tx(9, 10, 'Sales', 'Bulk order, contractor', 15200, 'Cash in'),
  tx(10, 12, 'Utilities', 'Internet and electricity', 4100, 'Cash out'),
  tx(11, 14, 'Salaries', 'Bi-monthly payroll', 22000, 'Cash out'),
  tx(12, 15, 'Fuel & delivery', 'Delivery truck diesel', 2100, 'Cash out'),
  tx(13, 18, 'Sales', 'Materials sales', 9800, 'Cash in'),
  tx(14, 21, 'Stock purchase', 'Plumbing supplies restock', 12600, 'Cash out'),
  tx(15, 24, 'Supplies', 'Packaging and receipts', 1850, 'Cash out'),
  tx(16, 27, 'Salaries', 'Bi-monthly payroll', 22000, 'Cash out'),
]


let seed = 11
const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647
const inStock = products.filter((p) => p.stock > 1)
export const salesRecords = (() => {
  const out = []
  for (let n = 29; n >= 0; n--) {
    const d = new Date()
    d.setDate(d.getDate() - n)
    const date = isoDate(d)
    const count = n === 0 ? 3 : 3 + Math.floor(rnd() * 3)
    for (let i = 0; i < count; i++) {
      const items = Array.from({ length: 1 + Math.floor(rnd() * 3) }, () => {
        const p = inStock[Math.floor(rnd() * inStock.length)]
        return { productId: p.id, name: p.name, price: p.price, qty: 1 + Math.floor(rnd() * (p.price < 100 ? 10 : 4)) }
      })
      out.push({ id: `S-${date}-${i + 1}`, date, items, total: Math.round(items.reduce((t, it) => t + it.price * it.qty, 0)) })
    }
  }
  return out
})()

export const salesByDay = [-6, -5, -4, -3, -2, -1, 0].map((n) => {
  const d = new Date(); d.setDate(d.getDate() + n)
  const sales = salesRecords.filter((s) => s.date === isoDate(d))
  return { label: d.toLocaleDateString('en-PH', { weekday: 'short' }), value: sales.reduce((t, s) => t + s.total, 0), count: sales.length }
})
