export const inputClass =
  "w-full rounded border border-line bg-surface px-2.5 py-2 text-ink placeholder:text-muted/70 focus:border-accent focus:outline-none aria-[invalid=true]:border-bad";

/* Label + control + inline error. Wrap an <input>, <select>, etc. */
export default function Field({
  label,
  required,
  error,
  hint,
  className = "",
  children,
}) {
  return (
    <label className={`flex flex-col gap-1 text-sm ${className}`}>
      <span className="font-semibold">
        {label}
        {required && <span className="text-bad"> *</span>}
      </span>
      {children}
      {error ? (
        <span role="alert" className="text-[13px] text-bad">
          {error}
        </span>
      ) : (
        hint && <span className="text-[13px] text-muted">{hint}</span>
      )}
    </label>
  );
}
