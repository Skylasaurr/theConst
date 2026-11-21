export default function Sidebar({ items, page, onPage, badge, open, onClose }) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <nav
        id="main-nav"
        aria-label="Main"
        className={`fixed inset-y-0 left-0 z-30 w-60 overflow-y-auto bg-steel p-3 text-steel-ink transition-transform lg:sticky lg:top-[60px] lg:z-auto lg:h-[calc(100vh-60px)] lg:w-auto lg:translate-x-0 lg:self-start ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="mb-3 ml-0.5 border-l-4 border-accent px-2.5 pt-1.5 pb-4">
          <b className="block font-display text-[28px] leading-none tracking-wide text-white">
            IMPIG
          </b>
          <span className="text-[13px] opacity-80">Construction Supply</span>
        </div>
        {items.map(([id, label]) => (
          <button
            key={id}
            onClick={() => {
              onPage(id);
              onClose();
            }}
            aria-current={page === id ? "page" : undefined}
            className={`flex w-full cursor-pointer items-center justify-between rounded px-3 py-2.5 text-left ${page === id ? "bg-accent font-semibold text-accent-ink" : "hover:bg-white/10"}`}
          >
            {label}
            {id === "req" && badge > 0 && (
              <span className="rounded-full bg-bad px-[7px] text-xs font-semibold text-white">
                {badge}
              </span>
            )}
          </button>
        ))}
      </nav>
    </>
  );
}
