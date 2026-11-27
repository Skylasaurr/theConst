const CSS = `@keyframes loading-fill { from { width: 0 } to { width: 100% } }`;

export default function LoadingModal({ message = "Please wait", ms = 1500 }) {
  return (
    <>
      <style>{CSS}</style>
      <div
        role="status"
        aria-live="polite"
        className="fixed inset-0 z-50 grid place-items-center bg-black/55 p-4"
      >
        <div className="w-full max-w-xs rounded-md border border-line bg-surface p-5 shadow-lg">
          <h2 className="m-0 font-display text-xl font-bold">{message}</h2>
          <p className="m-0 mt-1 text-sm text-muted">
            This will only take a moment.
          </p>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-soft">
            <div
              className="h-full rounded-full bg-accent"
              style={{ animation: `loading-fill ${ms}ms ease-in-out forwards` }}
            />
          </div>
        </div>
      </div>
    </>
  );
}