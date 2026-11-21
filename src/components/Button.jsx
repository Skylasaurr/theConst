const VARIANT = {
  primary:
    "bg-accent border-accent text-accent-ink font-semibold hover:brightness-95",
  default: "bg-surface border-line hover:border-muted",
  ghost: "bg-transparent border-line hover:border-muted",
  green:
    "bg-emerald-900 border-emerald-900 text-white font-bold hover:brightness-80",
  warning: "bg-bad/15 border-bad text-bad font-semibold hover:brightness-80",
};
export default function Button({
  variant = "default",
  small = false,
  className = "",
  ...props
}) {
  return (
    <button
      className={`inline-flex cursor-pointer items-center gap-1.5 rounded border ${small ? "px-2.5 py-1 text-[13px]" : "px-3.5 py-2"} ${VARIANT[variant]} ${className}`}
      {...props}
    />
  );
}
