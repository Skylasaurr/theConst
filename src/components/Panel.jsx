export default function Panel({ title, children, className = "" }) {
  return (
    <section
      className={`rounded-md border border-line bg-surface p-4 ${className}`}
    >
      {title && (
        <h2 className="mb-3 font-display text-[22px] font-bold">{title}</h2>
      )}
      {children}
    </section>
  );
}
