import { useEffect, useRef, useState } from "react";
import Panel from "./Panel";
import Button from "./Button";
import { fullName } from "../lib/format";

export default function AttendancePage({ data, notify, onBack }) {
  const { employees, attendance, clockIn, clockOut } = data;
  const [employeeId, setEmployeeId] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const inputRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const submitAttendance = (e) => {
    e.preventDefault();

    const id = employeeId.trim().toLowerCase();
    const employee = employees.find(
      (item) => item.no.toLowerCase() === id
    );

    if (!employee) {
      notify("Employee ID not found. Please try again.");
      setEmployeeId("");
      inputRef.current?.focus();
      return;
    }

    const record = attendance[employee.id];

    if (!record?.timeIn) {
      clockIn(employee.id);
      notify(`Time In recorded for ${fullName(employee)}.`);
    } else if (!record.timeOut) {
      clockOut(employee.id);
      notify(`Time Out recorded for ${fullName(employee)}.`);
    } else {
      notify("Attendance already completed for today.");
    }

    setEmployeeId("");
    inputRef.current?.focus();
  };

  const getStatus = (record) => {
    if (!record?.timeIn) return "Not yet timed in";
    if (!record.timeOut) return "Working";
    return "Completed";
  };

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="m-0 text-3xl font-bold">Employee Attendance</h1>
            <p className="mt-2 text-sm text-muted">
              Scan or enter your Employee ID to record attendance.
            </p>
          </div>

          <Button onClick={onBack}>Back</Button>
        </div>

        <Panel title="Attendance Time In / Time Out">
          <div className="mb-5 text-center">
            <p className="m-0 text-sm text-muted">
              {currentTime.toLocaleDateString("en-PH", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
            <p className="my-2 text-4xl font-bold">
              {currentTime.toLocaleTimeString("en-PH", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </p>
          </div>

          <form onSubmit={submitAttendance} className="mx-auto max-w-xl">
            <label
              htmlFor="attendance-id"
              className="mb-2 block text-sm font-semibold"
            >
              Employee ID
            </label>

            <input
              ref={inputRef}
              id="attendance-id"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              placeholder="Enter or scan Employee ID (e.g. E-001)"
              autoComplete="off"
              autoFocus
              className="w-full rounded border border-line bg-surface px-4 py-3 text-center text-lg text-ink"
            />

            <Button
              type="submit"
              variant="primary"
              className="mt-4 w-full"
            >
              Submit
            </Button>
          </form>
        </Panel>

        <div className="mt-6">
          <Panel title="Today's Log">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-left text-sm">
                <thead>
                  <tr className="border-b border-line text-muted">
                    <th className="p-3">Employee</th>
                    <th className="p-3">Employee ID</th>
                    <th className="p-3">Time In</th>
                    <th className="p-3">Time Out</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {employees.map((employee) => {
                    const record = attendance[employee.id];

                    return (
                      <tr
                        key={employee.id}
                        className="border-b border-line"
                      >
                        <td className="p-3 font-medium">
                          {fullName(employee)}
                        </td>
                        <td className="p-3">{employee.no}</td>
                        <td className="p-3">
                          {record?.timeIn || "-"}
                        </td>
                        <td className="p-3">
                          {record?.timeOut || "-"}
                        </td>
                        <td className="p-3">
                          {getStatus(record)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Panel>
        </div>
      </div>
    </main>
  );
}
