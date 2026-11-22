/* Scrolls sideways on small screens. `right` = indexes of right-aligned columns. */
export default function DataTable({ head, rows, right = [] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr>{head.map((h, c) => <th key={h} className={`border-b border-line px-2 py-2 text-[13px] font-semibold text-muted ${right.includes(c) ? 'text-right' : ''}`}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>{r.map((cell, c) => <td key={c} className={`border-b border-line px-2 py-2 whitespace-nowrap ${right.includes(c) ? 'text-right' : ''}`}>{cell}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
