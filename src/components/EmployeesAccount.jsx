import { useState, useMemo } from "react";
import Panel from "./Panel";
import Button from "./Button";
import Modal from "./Modal";
import Field, { inputClass } from "./Field";
import ConfirmDialog from "./ConfirmDialog";
import Icon from "./Icon";
import { fullName, isoDate } from "../lib/format";
import { DEMO_USER } from "../data/system";

const POSITIONS = [
  ["cashier", "Cashier", "Cashier"],
  ["owner", "Admin", "Administrator"],
  ["staff", "Staff", "Staff"],
  ["inventory", "Inventory Staff", "Inventory staff"],
];
const needsAccount = (role) => !!role && role !== "staff";
const BLANK = {
  first: "",
  middle: "",
  last: "",
  birthdate: "",
  contact: "",
  email: "",
  role: "",
  hired: isoDate(),
  username: "",
  password: "",
  confirm: "",
};

function EmployeeForm({ employee, employees, onSubmit, onClose }) {
  const isAdd = !employee;
  const [f, setF] = useState(
    employee ? { ...BLANK, ...employee, password: "", confirm: "" } : BLANK,
  );
  const [errors, setErrors] = useState({});
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    const found = {};
    if (!f.first.trim()) found.first = "Enter the first name.";
    if (!f.last.trim()) found.last = "Enter the last name.";
    if (!f.birthdate) found.birthdate = "Select the birthdate.";
    else if (f.birthdate > isoDate())
      found.birthdate = "Birthdate can't be in the future.";
    if (!/^[0-9+()\s-]{7,}$/.test(f.contact.trim()))
      found.contact = "Enter a valid contact number.";
    if (!/^\S+@\S+\.\S+$/.test(f.email.trim()))
      found.email = "Enter a valid email address.";
    if (!f.role) found.role = "Select a position.";
    if (!f.hired) found.hired = "Select the date hired.";
    if (needsAccount(f.role)) {
      const name = f.username.trim().toLowerCase();
      if (!name) found.username = "Enter a username.";
      else if (
        employees.some(
          (x) => x.id !== employee?.id && x.username.toLowerCase() === name,
        )
      )
        found.username = "That username is already taken.";
      if (isAdd || f.password) {
        if (f.password.length < 8)
          found.password = "Use at least 8 characters.";
        else if (f.password !== f.confirm)
          found.confirm = "Passwords do not match.";
      }
    }
    setErrors(found);
    if (Object.keys(found).length) return;

    const [, , defaultPos] = POSITIONS.find(([role]) => role === f.role);
    const keepPos =
      employee && employee.role === f.role ? employee.pos : defaultPos;
    onSubmit({
      first: f.first.trim(),
      middle: f.middle.trim(),
      last: f.last.trim(),
      birthdate: f.birthdate,
      contact: f.contact.trim(),
      email: f.email.trim(),
      role: f.role,
      pos: keepPos,
      hired: f.hired,
      username: needsAccount(f.role) ? f.username.trim() : "",
      created: employee?.created ?? isoDate(),
    });
  };

  return (
    <form onSubmit={submit} noValidate>
      <div className="grid max-h-[60vh] gap-3 overflow-y-auto px-1 pb-1 sm:grid-cols-2">
        <Field label="First name" required error={errors.first}>
          <input
            className={inputClass}
            value={f.first}
            onChange={set("first")}
            placeholder="Enter first name"
            aria-invalid={!!errors.first}
            autoFocus
          />
        </Field>
        <Field label="Middle name">
          <input
            className={inputClass}
            value={f.middle}
            onChange={set("middle")}
            placeholder="Enter middle name (optional)"
          />
        </Field>
        <Field label="Last name" required error={errors.last}>
          <input
            className={inputClass}
            value={f.last}
            onChange={set("last")}
            placeholder="Enter last name"
            aria-invalid={!!errors.last}
          />
        </Field>
        <Field label="Birthdate" required error={errors.birthdate}>
          <input
            type="date"
            className={inputClass}
            value={f.birthdate}
            max={isoDate()}
            onChange={set("birthdate")}
            aria-invalid={!!errors.birthdate}
          />
        </Field>
        <Field label="Contact number" required error={errors.contact}>
          <input
            type="tel"
            className={inputClass}
            value={f.contact}
            onChange={set("contact")}
            placeholder="Enter contact number"
            aria-invalid={!!errors.contact}
          />
        </Field>
        <Field label="Email address" required error={errors.email}>
          <input
            type="email"
            className={inputClass}
            value={f.email}
            onChange={set("email")}
            placeholder="Enter email address"
            aria-invalid={!!errors.email}
          />
        </Field>
        <Field label="Employee position" required error={errors.role}>
          <select
            className={inputClass}
            value={f.role}
            onChange={set("role")}
            aria-invalid={!!errors.role}
          >
            <option value="" disabled>
              Select an option
            </option>
            {POSITIONS.map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Date hired" required error={errors.hired}>
          <input
            type="date"
            className={inputClass}
            value={f.hired}
            onChange={set("hired")}
            aria-invalid={!!errors.hired}
          />
        </Field>

        {f.role && !needsAccount(f.role) && (
          <p className="m-0 text-sm text-muted sm:col-span-2">
            Regular staff don't need an account, so no username or password is
            required.
          </p>
        )}
        {needsAccount(f.role) && (
          <>
            <Field label="Username" required error={errors.username}>
              <input
                className={inputClass}
                value={f.username}
                onChange={set("username")}
                placeholder="Enter username"
                autoComplete="off"
                aria-invalid={!!errors.username}
              />
            </Field>
            <Field
              label={isAdd ? "Password" : "New password"}
              required={isAdd}
              error={errors.password}
              hint={
                isAdd ? undefined : "Leave blank to keep the current password."
              }
            >
              <input
                type="password"
                className={inputClass}
                value={f.password}
                onChange={set("password")}
                placeholder="Enter password"
                autoComplete="new-password"
                aria-invalid={!!errors.password}
              />
            </Field>
            {(isAdd || f.password) && (
              <Field label="Confirm password" required error={errors.confirm}>
                <input
                  type="password"
                  className={inputClass}
                  value={f.confirm}
                  onChange={set("confirm")}
                  placeholder="Reenter password"
                  autoComplete="new-password"
                  aria-invalid={!!errors.confirm}
                />
              </Field>
            )}
          </>
        )}
      </div>
      <div className="mt-5 flex justify-end gap-2">
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="green">
          {isAdd ? "Add Employee" : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}

export default function EmployeesAccount({ data, notify, currentUserId }) {
  const { employees } = data;
  const [dialog, setDialog] = useState(null); // { type: "add" | "edit" | "delete", employee? }
  const close = () => setDialog(null);
  const [q, setQ] = useState("");
  const [position, setPosition] = useState("All");

  const positions = useMemo(
    () => ["All", ...new Set(employees.map((e) => e.pos))],
    [employees],
  );
  const rows = employees.filter(
    (e) =>
      (position === "All" || e.pos === position) &&
      `${fullName(e)} ${e.no} ${e.pos} ${e.created}`
        .toLowerCase()
        .includes(q.trim().toLowerCase()),
  );

  const save = (values) => {
    if (dialog.type === "add") {
      const { no } = data.addEmployee(values);
      notify(`${fullName(values)} added as ${no}`);
    } else {
      data.updateEmployee(dialog.employee.id, values);
      notify(`Saved changes to ${fullName(values)}`);
    }
    close();
  };
  const remove = () => {
    data.deleteEmployee(dialog.employee.id);
    notify(`${fullName(dialog.employee)} deleted`);
    close();
  };

  /* Admin demo account and the built-in login accounts can't be removed here. */
  const isLocked = (e) =>
    e.id === currentUserId || Object.values(DEMO_USER).includes(e.id);

  return (
    <Panel>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="m-0 font-display text-[22px] font-bold">Employees</h2>
        <Button
          variant="green"
          className="rounded-lg"
          onClick={() => setDialog({ type: "add" })}
        >
          <Icon name="plus" /> Add Employee
        </Button>
      </div>

      <div className="mb-3 flex flex-wrap gap-2">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name, ID, position, or date"
          aria-label="Search employees"
          className={`${inputClass} min-w-0 flex-1 basis-40`}
        />
        <select
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          aria-label="Position"
          className={`${inputClass} w-auto`}
        >
          {positions.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="max-h-[360px] overflow-auto">
        <table className="w-full min-w-[640px] border-collapse text-left text-[14px] [&_td]:px-3 [&_td]:py-2 [&_th]:px-3 [&_th]:py-2">
          <thead className="sticky top-0 bg-surface text-muted">
            <tr className="border-b border-line">
              <th>Employee No.</th>
              <th>Employee Name</th>
              <th>Position</th>
              <th>Date Created</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((e) => (
              <tr className="border-b border-line" key={e.id}>
                <td className="text-muted">{e.no}</td>
                <td>{fullName(e)}</td>
                <td>{e.pos}</td>
                <td>{e.created}</td>
                <td>
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      small
                      onClick={() => setDialog({ type: "edit", employee: e })}
                      aria-label={`Edit ${fullName(e)}`}
                    >
                      <Icon name="edit" className="h-3.5 w-3.5" /> Edit
                    </Button>
                    <Button
                      variant="warning"
                      small
                      disabled={isLocked(e)}
                      title={
                        isLocked(e)
                          ? "Built-in login accounts can't be deleted"
                          : undefined
                      }
                      onClick={() => setDialog({ type: "delete", employee: e })}
                      aria-label={`Delete ${fullName(e)}`}
                    >
                      <Icon name="trash" className="h-3.5 w-3.5" /> Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-muted">
                  {employees.length === 0
                    ? "No employees yet."
                    : "No employees match your search."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        open={dialog?.type === "add" || dialog?.type === "edit"}
        title={dialog?.type === "edit" ? "Update employee" : "Add employee"}
        subtitle={
          dialog?.type === "edit"
            ? "Update information for this employee."
            : "Create a new employee record. Regular staff don't need an account."
        }
        size="lg"
        onClose={close}
      >
        <EmployeeForm
          employee={dialog?.employee ?? null}
          employees={employees}
          onSubmit={save}
          onClose={close}
        />
      </Modal>

      <ConfirmDialog
        open={dialog?.type === "delete"}
        title="Delete employee?"
        message="This action can't be undone."
        detail={dialog?.employee && fullName(dialog.employee)}
        onConfirm={remove}
        onClose={close}
      />
    </Panel>
  );
}
