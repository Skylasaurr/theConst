import { useState } from "react";
import Panel from "./Panel";
import Button from "./Button";
import StatusBadge from "./StatusBadge";
import RequestReviewModal, {
  STATUS_LABEL,
  STATUS_VARIANT,
} from "./RequestReviewModal";
import { inputClass } from "./Field";

const TABS = [
  ["pending", "Pending"],
  ["approved", "Approved"],
  ["rejected", "Rejected"],
  ["all", "All"],
];

export default function RequestsPage({ data, onDecide }) {
  const { requests, products } = data;
  const [tab, setTab] = useState("pending");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(null);

  const count = (key) =>
    key === "all"
      ? requests.length
      : requests.filter((r) => r.status === key).length;
  const rows = requests.filter(
    (r) =>
      (tab === "all" || r.status === tab) &&
      `${r.id} ${r.text} ${r.by} ${r.reason}`
        .toLowerCase()
        .includes(q.trim().toLowerCase()),
  );

  return (
    <Panel>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div
          role="tablist"
          aria-label="Request status"
          className="flex flex-wrap gap-2"
        >
          {TABS.map(([key, label]) => (
            <Button
              key={key}
              role="tab"
              aria-selected={tab === key}
              small
              variant={tab === key ? "primary" : "default"}
              onClick={() => setTab(key)}
            >
              {label} ({count(key)})
            </Button>
          ))}
        </div>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search requests"
          aria-label="Search requests"
          className={`${inputClass} ml-auto min-w-0 basis-56`}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] border-collapse text-left text-[14px] [&_td]:px-3 [&_td]:py-2.5 [&_th]:px-3 [&_th]:py-2">
          <thead className="text-muted">
            <tr className="border-b border-line">
              <th>Request</th>
              <th>From</th>
              <th>Reason</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-line">
                <td>
                  <span className="text-muted">{r.id}</span> · {r.text}
                </td>
                <td>{r.by}</td>
                <td>{r.reason}</td>
                <td>
                  <StatusBadge variant={STATUS_VARIANT[r.status]}>
                    {STATUS_LABEL[r.status]}
                  </StatusBadge>
                </td>
                <td className="text-right">
                  <Button
                    small
                    variant={r.status === "pending" ? "primary" : "default"}
                    onClick={() => setOpen(r)}
                  >
                    {r.status === "pending" ? "Review" : "View"}
                  </Button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-muted">
                  {tab === "pending" && !q
                    ? "No pending requests. You are all caught up."
                    : "No requests match your filter."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <RequestReviewModal
        request={open}
        products={products}
        onClose={() => setOpen(null)}
        onDecide={onDecide}
      />
    </Panel>
  );
}
