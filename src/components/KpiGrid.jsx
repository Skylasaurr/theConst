export default function KpiGrid({ children }) {
  return <div className="mb-4 grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] overflow-hidden rounded-md border border-line bg-surface">{children}</div>
}
export const Cols = ({ children }) => <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-4 lg:grid-cols-2">{children}</div>
