import { useState, useMemo } from "react";
import Panel from "./Panel";
import Button from "./Button";
import Modal from "./Modal";

const EMPLOYEES = [
  { id: 1, date: "2026-11-16", category: "Cashier", name: "Maria Santos" },
  {
    id: 2,
    date: "2026-11-16",
    category: "Warehouse Clerk",
    name: "Juan dela Cruz",
  },
  {
    id: 3,
    date: "2026-11-17",
    category: "Delivery driver",
    name: "Pedro Garcia",
  },
  {
    id: 4,
    date: "2026-11-17",
    category: "Delivery driver",
    name: "Pedro Garcia",
  },
];

export default function EmployeesAccount({ employees = EMPLOYEES }) {
  const [modal, setModal] = useState(null); // null | "add" | "edit" | "delete"
  const close = () => setModal(null);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("All");

  const categories = useMemo(
    () => ["All", ...new Set(employees.map((e) => e.category))],
    [employees],
  );

  const rows = employees.filter(
    (e) =>
      (category === "All" || e.category === category) &&
      (e.name + e.category + e.date).toLowerCase().includes(q.toLowerCase()),
  );

  const field = "rounded border border-line bg-surface px-2.5 py-2";

  return (
    <Panel>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="m-0 font-display text-[22px] font-bold">Employees</h2>
        <Button
          variant="green"
          className="rounded-lg"
          onClick={() => setModal("add")}
        >
          Add Employee
        </Button>
      </div>

      <div className="mb-3 flex flex-wrap gap-2">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name, category, or date"
          aria-label="Search employees"
          className={`${field} min-w-0 flex-1 basis-40`}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Category"
          className={field}
        >
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="h-[300px] overflow-y-auto">
        <table className="w-full border-collapse text-left text-[14px] [&_td]:px-5 [&_td]:py-2 [&_th]:px-5 [&_th]:py-2">
          <thead className="sticky top-0 bg-surface text-muted">
            <tr className="border-b border-line">
              <th>Date Created</th>
              <th>Category</th>
              <th>Employee Name</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((e) => (
              <tr className="border-b border-line" key={e.id}>
                <td>{e.date}</td>
                <td>{e.category}</td>
                <td>{e.name}</td>
                <td>
                  <div className="flex items-center justify-end gap-2">
                    <Button small onClick={() => setModal("edit")}>
                      Edit
                    </Button>
                    <Button
                      variant="warning"
                      small
                      onClick={() => setModal("delete")}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={4} className="text-muted text-center">
                  {employees.length === 0
                    ? "No employees yet."
                    : "No employees match your search."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ADD */}
      <Modal
        open={modal === "add"}
        title="Add employee"
        subtitle="Create a new employee record. Note: Regular staff don't need an account"
        onClose={close}
      >
        <div>
          <div className="grid gap-3 max-h-[500px] overflow-y-auto px-1">
            <label className="flex flex-col gap-1">
              Employee Firstname
              <input className={field} placeholder="Enter employee firstname" />
            </label>
            <label className="flex flex-col gap-1">
              Employee Surname
              <input className={field} placeholder="Enter employee surname" />
            </label>
            <label className="flex flex-col gap-1">
              Employee Lastname
              <input className={field} placeholder="Enter employee lastname" />
            </label>
            <label className="flex flex-col gap-1">
              Birthdate
              <input type="date" className={field} />
            </label>
            <label className="flex flex-col gap-1">
              Contact Number
              <input
                className={field}
                type="tel"
                placeholder="Enter employee contact number"
              />
            </label>
            <label className="flex flex-col gap-1">
              Email Address
              <input
                type="email"
                className={field}
                placeholder="Enter employee email address"
              />
            </label>
            <label className="flex flex-col gap-1">
              Employee Position
              <select
                name="StaffCategory"
                id="StaffCategorySelect"
                className={field}
              >
                <option value="" disabled selected>
                  Select an option
                </option>
                <option value="Cashier">Cashier</option>
                <option value="Admin">Admin</option>
                <option value="Staff">Staff</option>
                <option value="InventoryStaff">Inventory Staff</option>
              </select>
            </label>
            <label className="flex flex-col gap-1">
              Date Hired
              <input type="date" className={field} />
            </label>
            <label className="flex flex-col gap-1">
              Username
              <input className={field} placeholder="Enter username" />
            </label>
            <label className="flex flex-col gap-1">
              Password
              <input
                type="password"
                className={field}
                placeholder="Enter password"
              />
            </label>
            <label className="flex flex-col gap-1 pb-3">
              Confirm password
              <input
                type="password"
                className={field}
                placeholder="Reenter password"
              />
            </label>
          </div>
          <div className="mt-5 flex justify-end gap-2">
            <Button onClick={close}>Cancel</Button>
            <Button variant="green">Add Employee</Button>
          </div>
        </div>
      </Modal>

      {/* EDIT */}
      <Modal
        open={modal === "edit"}
        title="Update employee"
        subtitle="Update information for this employee."
        onClose={close}
      >
        <div className="grid gap-3">
          <div className="grid gap-3 max-h-[500px] overflow-y-auto px-1">
            <label className="flex flex-col gap-1">
              Employee Firstname
              <input className={field} placeholder="Enter employee firstname" />
            </label>
            <label className="flex flex-col gap-1">
              Employee Surname
              <input className={field} placeholder="Enter employee surname" />
            </label>
            <label className="flex flex-col gap-1">
              Employee Lastname
              <input className={field} placeholder="Enter employee lastname" />
            </label>
            <label className="flex flex-col gap-1">
              Birthdate
              <input type="date" className={field} />
            </label>
            <label className="flex flex-col gap-1">
              Contact Number
              <input
                className={field}
                type="tel"
                placeholder="Enter employee contact number"
              />
            </label>
            <label className="flex flex-col gap-1">
              Email Address
              <input
                type="email"
                className={field}
                placeholder="Enter employee email address"
              />
            </label>
            <label className="flex flex-col gap-1">
              Employee Position
              <select
                name="StaffCategory"
                id="StaffCategorySelect"
                className={field}
              >
                <option value="" disabled selected>
                  Select an option
                </option>
                <option value="Cashier">Cashier</option>
                <option value="Admin">Admin</option>
                <option value="Staff">Staff</option>
                <option value="InventoryStaff">Inventory Staff</option>
              </select>
            </label>
            <label className="flex flex-col gap-1">
              Date Hired
              <input type="date" className={field} />
            </label>
            <label className="flex flex-col gap-1">
              Username
              <input className={field} placeholder="Enter username" />
            </label>
            <label className="flex flex-col gap-1 mb-2">
              Password
              <input
                type="password"
                className={field}
                placeholder="Enter password"
              />
            </label>
          </div>
          <div className="mt-2 flex justify-end gap-2">
            <Button onClick={close}>Cancel</Button>
            <Button variant="green">Save Changes</Button>
          </div>
        </div>
      </Modal>

      {/* DELETE */}
      <Modal
        open={modal === "delete"}
        variant="danger"
        title="Delete employee?"
        subtitle="This action can't be undone."
        onClose={close}
      >
        <p className="rounded border border-line px-3 py-2 text-left">
          Maria Santos
        </p>
        <div className="mt-4 flex justify-center gap-2">
          <Button onClick={close}>Cancel</Button>
          <Button variant="warning" onClick={close}>
            Yes, delete
          </Button>
        </div>
      </Modal>
    </Panel>
  );
}
