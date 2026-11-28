import { useState } from "react";
import Panel from "./Panel";
import Button from "./Button";
import Modal from "./Modal";

const SHOW_DEMO = true;

const STATUS = {
  pending: ["Pending", "text-warn"],
  approved: ["Approved", "text-ok"],
  rejected: ["Rejected", "text-bad"],
};

const TABS = [
  ["pending", "Pending"],
  ["approved", "Approved"],
  ["rejected", "Rejected"],
  ["all", "All"],
];

const TYPES = {
  "Stock count adjustment": "Item and new count, e.g. PPR PIPE 1 32mm to 152",
  "Void sale": "Receipt number, e.g. Receipt 0042",
  "DTR correction": "Corrected time, e.g. 07:40 to 17:05",
  Other: "What do you need?",
};

const stamp = (d) => {
  const date = d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const time = d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
  return `${date} · ${time}`;
};

const demoRequests = (name) => [
  {
    id: "D-1",
    by: name,
    text: "Stock count adjustment: PPR PIPE 1 32mm to 148",
    reason: "Two pieces were damaged during delivery",
    status: "pending",
    time: new Date(2026, 10, 27, 9, 15).getTime(),
  },
  {
    id: "D-2",
    by: name,
    text: "Void sale: Receipt 0042",
    reason: "Wrong item was scanned",
    status: "approved",
    time: new Date(2026, 10, 26, 15, 40).getTime(),
  },
  {
    id: "D-3",
    by: name,
    text: "DTR correction: 07:52 to 17:05",
    reason: "Forgot to time out",
    status: "rejected",
    time: new Date(2026, 10, 25, 17, 30).getTime(),
  },
];

const statusKey = (r) => {
  const key = String(r.status ?? "pending").toLowerCase();
  return STATUS[key] ? key : "pending";
};

const th = "py-2 pr-4 font-semibold";
const td = "py-3 pr-4 align-top";
const label = "block text-sm font-semibold";
const field = "rounded border border-line bg-surface px-3 py-2 text-ink";

export default function MyRequests({ requests = [], user, onCreate, notify }) {
  const [tab, setTab] = useState("all");
  const [query, setQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [created, setCreated] = useState([]);

  const name = user?.name;
  const mine = [
    ...created,
    ...requests.filter((r) => name && r.by === name),
    ...(SHOW_DEMO ? demoRequests(name) : []),
  ].sort((a, b) => (b.time ?? 0) - (a.time ?? 0));

  const count = (key) =>
    key === "all"
      ? mine.length
      : mine.filter((r) => statusKey(r) === key).length;

  const q = query.trim().toLowerCase();
  const shown = mine.filter((r) => {
    const inTab = tab === "all" || statusKey(r) === tab;
    const words = `${r.id} ${r.text} ${r.reason} ${STATUS[statusKey(r)][0]}`;
    return inTab && (!q || words.toLowerCase().includes(q));
  });

  const send = (draft) => {
    const now = new Date();
    const req = {
      id: `N-${now.getTime().toString(36).slice(-4).toUpperCase()}`,
      by: name,
      text: `${draft.type}: ${draft.details}`,
      reason: draft.reason,
      status: "pending",
      time: now.getTime(),
    };
    if (onCreate) onCreate(req);
    else setCreated((list) => [req, ...list]);
    setFormOpen(false);
    setTab("all");
    setQuery("");
    notify?.("Request sent to the owner");
  };

  return (
    <>
      <p className="m-0 mb-3 text-muted">
        Requests you sent to the owner. Count adjustments, voids and DTR
        corrections appear here.
      </p>
      <Panel>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap gap-2">
            {TABS.map(([key, text]) => (
              <Button
                key={key}
                small
                variant={tab === key ? "primary" : "default"}
                aria-pressed={tab === key}
                onClick={() => setTab(key)}
              >
                {text} ({count(key)})
              </Button>
            ))}
          </div>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search requests"
              aria-label="Search requests"
              className={`${field} w-56`}
            />
            <Button variant="primary" onClick={() => setFormOpen(true)}>
              New request
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-line">
                <th className={th}>Request</th>
                <th className={th}>Reason</th>
                <th className={th}>Sent</th>
                <th className={th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((r) => {
                const [statusLabel, tone] = STATUS[statusKey(r)];
                return (
                  <tr
                    key={r.id}
                    className="border-b border-line last:border-0"
                  >
                    <td className={td}>
                      <span className="text-muted">{r.id} · </span>
                      {r.text}
                    </td>
                    <td className={td}>{r.reason}</td>
                    <td className={`${td} whitespace-nowrap`}>
                      {r.time ? stamp(new Date(r.time)) : (r.sent ?? "-")}
                    </td>
                    <td className={td}>
                      <span
                        className={`inline-block rounded-[3px] border border-current bg-current/10 px-2 text-xs font-semibold ${tone}`}
                      >
                        {statusLabel}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {shown.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-3.5 text-muted">
                    {mine.length === 0
                      ? "No requests yet."
                      : "No requests match your search."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>

      <Modal
        open={formOpen}
        title="New request"
        onClose={() => setFormOpen(false)}
      >
        <RequestForm onCancel={() => setFormOpen(false)} onSubmit={send} />
      </Modal>
    </>
  );
}

function RequestForm({ onCancel, onSubmit }) {
  const [type, setType] = useState("Stock count adjustment");
  const [details, setDetails] = useState("");
  const [reason, setReason] = useState("");
  const ready = Boolean(details.trim() && reason.trim());

  const submit = (e) => {
    e.preventDefault();
    if (ready)
      onSubmit({ type, details: details.trim(), reason: reason.trim() });
  };

  return (
    <form onSubmit={submit}>
      <label htmlFor="req-type" className={label}>
        Request type
      </label>
      <select
        id="req-type"
        value={type}
        onChange={(e) => setType(e.target.value)}
        className={`${field} mt-1 w-full`}
      >
        {Object.keys(TYPES).map((t) => (
          <option key={t}>{t}</option>
        ))}
      </select>

      <label htmlFor="req-details" className={`${label} mt-3`}>
        Details
      </label>
      <input
        id="req-details"
        value={details}
        onChange={(e) => setDetails(e.target.value)}
        placeholder={TYPES[type]}
        className={`${field} mt-1 w-full`}
      />

      <label htmlFor="req-reason" className={`${label} mt-3`}>
        Reason
      </label>
      <textarea
        id="req-reason"
        rows={3}
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Why is this needed?"
        className={`${field} mt-1 w-full`}
      />

      <div className="mt-5 flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={!ready}
          className="disabled:cursor-not-allowed disabled:opacity-50"
        >
          Send request
        </Button>
      </div>
    </form>
  );
}