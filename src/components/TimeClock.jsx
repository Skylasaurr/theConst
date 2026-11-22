import { useState } from "react";
import Panel from "./Panel";
import Button from "./Button";
import StatusBadge from "./StatusBadge";
import { inputClass } from "./Field";
import { fullName } from "../lib/format";

const STATUS_LABEL = { present: "Present", late: "Late", absent: "Absent" };
const LATE_AFTER = 8 * 60 + 15; // after 8:15 AM counts as late

/* "8:21 AM" -> minutes after midnight */
const minutes = (label) => {
  const [, h, m, ap] = /^(\d+):(\d+)\s*(AM|PM)$/i.exec(label) ?? [];
  return (
    ((Number(h) % 12) + (ap?.toUpperCase() === "PM" ? 12 : 0)) * 60 + Number(m)
  );
};
export const statusOf = (rec) =>
  !rec?.timeIn
    ? "absent"
    : minutes(rec.timeIn) > LATE_AFTER
      ? "late"
      : "present";

export default function TimeClockTable({ data, notify }) {
  const { employees, attendance, clockIn, clockOut } = data;
  const [q, setQ] = useState("");
  const rows = employees.filter((e) =>
    `${fullName(e)} ${e.pos}`.toLowerCase().includes(q.trim().toLowerCase()),
  );

  return (
    <Panel title="Today's Time Clock">
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search employee"
        aria-label="Search time clock"
        className={`${inputClass} mb-3`}
      />
      <div className="max-h-[260px] overflow-auto">
        <table className="w-full min-w-[560px] border-collapse text-left text-[14px] [&_td]:px-3 [&_td]:py-2 [&_th]:px-3 [&_th]:py-2">
          <thead className="sticky top-0 bg-surface text-muted">
            <tr className="border-b border-line">
              <th>Employee</th>
              <th>Time In</th>
              <th>Time out</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((e) => {
              const rec = attendance[e.id] ?? {};
              const status = statusOf(rec);
              return (
                <tr key={e.id} className="border-b border-line">
                  <td>
                    {fullName(e)} · {e.pos}
                  </td>
                  <td>{rec.timeIn || "--"}</td>
                  <td>{rec.timeOut || "--"}</td>
                  <td>
                    <StatusBadge variant={status}>
                      {STATUS_LABEL[status]}
                    </StatusBadge>
                  </td>
                  <td>
                    {!rec.timeIn ? (
                      <Button
                        small
                        variant="primary"
                        onClick={() => {
                          clockIn(e.id);
                          notify(`${fullName(e)} clocked in`);
                        }}
                      >
                        Clock in
                      </Button>
                    ) : !rec.timeOut ? (
                      <Button
                        small
                        onClick={() => {
                          clockOut(e.id);
                          notify(`${fullName(e)} clocked out`);
                        }}
                      >
                        Clock out
                      </Button>
                    ) : (
                      <span className="text-muted">Done for today</span>
                    )}
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-muted">
                  {employees.length === 0
                    ? "No time records today."
                    : "No employees match your search."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
