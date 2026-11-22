/* Download rows as a .csv file (opens in Excel). */
export function downloadCsv(name, head, rows) {
  const q = (v) => `"${String(v).replace(/"/g, '""')}"`
  const csv = [head, ...rows].map((r) => r.map(q).join(',')).join('\n')
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
  a.download = name
  a.click()
  URL.revokeObjectURL(a.href)
}
