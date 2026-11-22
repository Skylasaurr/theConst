import { useState } from "react";
import Panel from "./Panel";
import Button from "./Button";
import Modal from "./Modal";

export default function RequestsPanel({ requests, onDecide }) {
  const [open, setOpen] = useState(null);
  const decide = (status) => {
    onDecide(open, status);
    setOpen(null);
  };
  return (
    <Panel title="Needs your attention" className="h-[278px] overflow-y-auto">
      <ul className="m-0 list-none p-0">
        {requests.map((r) => (
          <li
            key={r.id}
            className="flex items-center justify-between gap-2.5 border-b border-line py-2 last:border-0"
          >
            <span>
              {r.text}
              <small className="block text-muted">{r.by}</small>
            </span>
            <Button small onClick={() => setOpen(r)}>
              Review
            </Button>
          </li>
        ))}
        {requests.length === 0 && (
          <li className="py-3.5 text-muted">
            No pending requests. You are all caught up.
          </li>
        )}
      </ul>
      <Modal open={!!open} title="Review request" onClose={() => setOpen(null)}>
        {open && (
          <>
            <p className="m-0 mb-1">{open.text}</p>
            <p className="m-0 mb-4 text-muted">
              From {open.by}. Reason: {open.reason}.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setOpen(null)}>
                Close
              </Button>
              <Button variant="warning" onClick={() => decide("rejected")}>
                Reject
              </Button>
              <Button variant="primary" onClick={() => decide("approved")}>
                Approve
              </Button>
            </div>
          </>
        )}
      </Modal>
    </Panel>
  );
}
