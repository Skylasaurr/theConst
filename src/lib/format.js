export const peso = (n) =>
  '₱' + Number(n).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
export const kpeso = (n) => (n >= 1000 ? '₱' + (n / 1000).toFixed(1) + 'k' : '₱' + Math.round(n))

export const isoDate = (d) => {
  const date = d instanceof Date ? d : new Date(d)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const daysAgo = (n) => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() - n)
  return isoDate(d)
}

export const fullName = (employee) => {
  if (!employee) return ''
  return [employee.first, employee.middle, employee.last].filter(Boolean).join(' ')
}

export const withinLastDays = (date, days) => {
  const target = date instanceof Date ? date : new Date(`${date}T00:00:00`)
  if (Number.isNaN(target.getTime())) return false
  const end = new Date()
  end.setHours(23, 59, 59, 999)
  const start = new Date(end)
  start.setDate(start.getDate() - (days - 1))
  start.setHours(0, 0, 0, 0)
  return target >= start && target <= end
}
