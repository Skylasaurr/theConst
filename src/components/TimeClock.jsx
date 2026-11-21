import Panel from "./Panel";
import StatusBadge from "./StatusBadge";

const TIME_RECORDS = [
  {
    id: 1,
    name: "Maria Santos",
    position: "Cashier",
    timeIn: "7:52 AM",
    timeOut: null,
    status: "present",
  },
  {
    id: 2,
    name: "Juan dela Cruz",
    position: "Warehouse Clerk",
    timeIn: "8:21 AM",
    timeOut: null,
    status: "late",
  },
  {
    id: 3,
    name: "Ana Reyes",
    position: "Warehouse Clerk",
    timeIn: null,
    timeOut: null,
    status: "absent",
  },
];

const STATUS_LABEL = {
  present: "Present",
  late: "Late",
  absent: "Absent",
};

export default function TimeClockTable({ records = TIME_RECORDS, onClockOut }) {
  return (
    <Panel title="Today's Time Clock">
      <table className="w-full border-collapse text-left text-[14px] [&_td]:px-3 [&_td]:py-2 [&_th]:px-3 [&_th]:py-2">
        <thead className="text-muted">
          <tr className="border-b border-line">
            <th>Employee</th>
            <th>Time In</th>
            <th>Time out</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r) => (
            <tr key={r.id} className="border-b border-line">
              <td>
                {r.name} · {r.position}
              </td>
              <td>{r.timeIn || "--"}</td>
              <td>{r.timeOut || "--"}</td>
              <td>
                <StatusBadge variant={r.status}>
                  {STATUS_LABEL[r.status]}
                </StatusBadge>
              </td>
              <td>
                <StatusBadge onClick={() => onClockOut?.(r)}>
                  Clock out
                </StatusBadge>
              </td>
            </tr>
          ))}
          {records.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center text-muted">
                No time records today.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </Panel>
  );
}
