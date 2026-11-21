import { useEffect, useRef } from 'react'

export default function Modal({ open, title, onClose, children }) {
  const ref = useRef(null)
  useEffect(() => {
    const d = ref.current
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
  }, [open])
  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      className="m-auto w-[min(460px,calc(100vw-24px))] rounded-lg border border-line bg-surface p-0 text-ink backdrop:bg-black/55"
    >
      {open && (
        <div className="p-5">
          <h2 className="mb-3 font-display text-[22px] font-bold">{title}</h2>
          {children}
        </div>
      )}
    </dialog>
  )
}
