import products from './products.json'

export const users = [
  { id: 'u1', no: 'E-001', name: 'Patricia Bonto', role: 'owner', pos: 'Administrator', contact: '0917 000 0001', in: '7:45 AM' },
  { id: 'u2', no: 'E-002', name: 'Justine Oriola', role: 'cashier', pos: 'Cashier', contact: '0917 000 0002', in: '7:52 AM' },
  { id: 'u3', no: 'E-003', name: 'Darren Jake Payoran', role: 'inventory', pos: 'Inventory staff', contact: '0917 000 0003', in: '8:03 AM' },
  { id: 'u4', no: 'E-004', name: 'Christian Angelo Basbas', role: 'staff', pos: 'Sales helper', contact: '0917 000 0004', in: null },
  { id: 'u5', no: 'E-005', name: 'Christine Joy San Pablo', role: 'staff', pos: 'Delivery helper', contact: '0917 000 0005', in: '8:10 AM' },
]
export const DEMO_USER = { owner: 'u1', cashier: 'u2', inventory: 'u3', staff: 'u4' }
export const ROLES = [
  ['owner', 'Administrator'], ['cashier', 'Cashier'], ['inventory', 'Inventory Staff'], ['staff', 'Regular Staff'],
]
export const NAV = {
  owner: [['dash', 'Dashboard'], ['inv', 'Inventory'], ['pos', 'Point of Sale'], ['dtr', 'IWS Employees'], ['pay', 'Payroll'], ['exp', 'Expenses & cash flow'], ['rep', 'Reports'], ['req', 'Requests'], ['users', 'Users & access']],
  cashier: [['dash', 'Dashboard'], ['inv', 'Stock'], ['pos', 'Point of Sale'], ['dtr', 'My DTR'], ['exp', 'Expenses'], ['rep', 'Sales report'], ['req', 'My requests']],
  inventory: [['dash', 'Dashboard'], ['inv', 'Inventory'], ['dtr', 'My DTR'], ['rep', 'Inventory report'], ['req', 'My requests']],
  staff: [['dash', 'My dashboard'], ['inv', 'Stock list'], ['dtr', 'My DTR'], ['req', 'My requests']],
}

export { products }
export const initialRequests = [
  { id: 'Q-1', by: 'Darren Jake Payoran', text: 'Stock count adjustment: PPR PIPE 1 32mm to 152', reason: 'Physical count is higher than the system' },
  { id: 'Q-2', by: 'Christine Joy San Pablo', text: 'DTR correction: 07:40 to 17:05', reason: 'Forgot to time in' },
]

let seed = 11
const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647
const inStock = products.filter((p) => p.stock > 1)
const today = new Date()
export const salesByDay = [-6, -5, -4, -3, -2, -1, 0].map((n) => {
  const d = new Date(today); d.setDate(d.getDate() + n)
  const count = n === 0 ? 3 : 3 + Math.floor(rnd() * 3)
  let total = 0
  for (let i = 0; i < count; i++) {
    const p = inStock[Math.floor(rnd() * inStock.length)]
    total += p.price * (1 + Math.floor(rnd() * (p.price < 100 ? 10 : 4)))
  }
  return { label: d.toLocaleDateString('en-PH', { weekday: 'short' }), value: Math.round(total), count }
})
export const weekExpenses = 26230
export const PASSWORD = 'Impig_123'
