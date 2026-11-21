const VARIANT = {
  default: "bg-surface border-line text-ink",
  present: "bg-ok/15 border-ok text-ok",
  late: "bg-warn/15 border-warn text-warn",
  absent: "bg-bad/15 border-bad text-bad",
};

export default function StatusBadge({
  variant = "default",
  small = false,
  className = "",
  ...props
}) {
  return (
    <span
      className={`inline-flex items-center rounded border ${small ? "px-1.5 py-0.5 text-[11px]" : "px-2 py-0.5 text-xs"} font-semibold ${VARIANT[variant]} ${className}`}
      {...props}
    />
  );
}
