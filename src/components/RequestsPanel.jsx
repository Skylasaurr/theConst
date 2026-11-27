import { useState } from "react";
import Panel from "./Panel";
import Button from "./Button";
import RequestReviewModal from "./RequestReviewModal";

/* Dashboard card: pending requests only. */
export default function RequestsPanel({ requests, products, onDecide, onPage }) {
  const [open, setOpen] = useState(null);
  const pending = requests.filter((r) => r.status === "pending");
  return (
    <Panel title="Needs your attention" className="h-[278px] overflow-y-auto">
      <ul className="m-0 list-none p-0">
        {pending.map((r) => (
          <li key={r.id} className="flex items-center justify-between gap-2.5 border-b border-line py-2 last:border-0">
            <span>
              {r.text}
              <small className="block text-muted">{r.by}</small>
            </span>
            <Button small onClick={() => setOpen(r)}>Review</Button>
          </li>
        ))}
        {pending.length === 0 && (
          <li className="py-3.5 text-muted">No pending requests. You are all caught up.</li>
        )}
      </ul>
      {onPage && (
        <Button small variant="ghost" className="mt-3" onClick={() => onPage("req")}>
          View all requests
        </Button>
      )}
      <RequestReviewModal request={open} products={products} onClose={() => setOpen(null)} onDecide={onDecide} />
    </Panel>
  );
}
