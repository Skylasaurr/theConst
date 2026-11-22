import { useEffect, useRef } from "react";

const SIZE = {
  sm: "w-[min(400px,calc(100vw-24px))]",
  md: "w-[min(460px,calc(100vw-24px))]",
  lg: "w-[min(640px,calc(100vw-24px))]",
};

export default function Modal({
  open,
  title,
  subtitle,
  size = "md",
  onClose,
  children,
}) {
  const ref = useRef(null);
  const openRef = useRef(open);
  openRef.current = open;
  useEffect(() => {
    const d = ref.current;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      // Esc closes the dialog natively; ignore the event when the parent already closed it
      onClose={() => openRef.current && onClose()}
      onClick={(e) => e.target === ref.current && onClose()}
      className={`m-auto max-h-[calc(100vh-24px)] ${SIZE[size]} overflow-y-auto rounded-lg border border-line bg-surface p-0 text-ink backdrop:bg-black/55`}
    >
      {open && (
        <div className="p-5">
          <h2 className="m-0 font-display text-[22px] font-bold">{title}</h2>
          {subtitle && (
            <p className="m-0 mt-0.5 text-sm text-muted">{subtitle}</p>
          )}
          <div className="mt-3">{children}</div>
        </div>
      )}
    </dialog>
  );
}
