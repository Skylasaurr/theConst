export const peso = (n) =>
  '₱' + Number(n).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
export const kpeso = (n) => (n >= 1000 ? '₱' + (n / 1000).toFixed(1) + 'k' : '₱' + Math.round(n))
