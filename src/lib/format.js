export const peso = (n) =>
  '₱' + Number(n).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
export const kpeso = (n) => (n >= 1000 ? '₱' + (n / 1000).toFixed(1) + 'k' : '₱' + Math.round(n))

/* Local-time ISO date (YYYY-MM-DD). Plain strings compare correctly in date order. */
export const isoDate = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
export const daysAgo = (n) => {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return isoDate(d)
}
export const withinLastDays = (iso, days) => iso >= daysAgo(days - 1) && iso <= isoDate()
export const fullName = (e) => [e.first, e.middle, e.last].filter(Boolean).join(' ')
