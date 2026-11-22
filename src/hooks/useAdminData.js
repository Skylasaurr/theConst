import { useState } from "react";
import { products as seedProducts, initialCategories } from "../data/inventory";
import {
  initialAttendance,
  initialEmployees,
  initialRequests,
  initialTransactions,
} from "../data/system";

const clone = (rows) => rows.map((r) => ({ ...r }));
const nextNumber = (rows, pattern) =>
  rows.reduce((max, r) => Math.max(max, Number(String(r).match(pattern)?.[1] ?? 0)), 0) + 1;

const nowLabel = () =>
  new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

/* All Admin data lives here as plain React state (no database or backend).
   Each action returns a value the UI can use for a message. */
export default function useAdminData() {
  const [products, setProducts] = useState(() => clone(seedProducts));
  const [categories, setCategories] = useState(() => clone(initialCategories));
  const [transactions, setTransactions] = useState(() => clone(initialTransactions));
  const [employees, setEmployees] = useState(() => clone(initialEmployees));
  const [attendance, setAttendance] = useState(() => structuredClone(initialAttendance));
  const [requests, setRequests] = useState(() => structuredClone(initialRequests));

  /* ---------- Products ---------- */
  const makeProduct = (rows, p) => {
    const n = nextNumber(rows.map((r) => r.id), /^p(\d+)$/);
    const sku = `ITM${String(nextNumber(rows.map((r) => r.sku), /^ITM(\d+)$/)).padStart(4, "0")}`;
    return { ...p, id: `p${n}`, sku };
  };
  const addProduct = (p) => {
    const product = makeProduct(products, p);
    setProducts((rows) => [product, ...rows]);
    return product;
  };
  const updateProduct = (id, patch) =>
    setProducts((rows) => rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  const deleteProduct = (id) => setProducts((rows) => rows.filter((r) => r.id !== id));
  const addStock = (id, qty) =>
    setProducts((rows) => rows.map((r) => (r.id === id ? { ...r, stock: r.stock + qty } : r)));
  const importProducts = (list) => {
    setProducts((rows) => {
      const made = [];
      for (const p of list) made.push(makeProduct([...made, ...rows], p));
      return [...made.reverse(), ...rows];
    });
    return list.length;
  };

  /* ---------- Categories ---------- */
  const addCategory = (name) => {
    const clean = name.trim();
    if (categories.some((c) => c.name.toLowerCase() === clean.toLowerCase())) return false;
    setCategories((rows) => [...rows, { id: Math.max(0, ...rows.map((c) => c.id)) + 1, name: clean, icon: "box" }]);
    return true;
  };
  const renameCategory = (id, name) => {
    const clean = name.trim();
    const current = categories.find((c) => c.id === id);
    if (!current || categories.some((c) => c.id !== id && c.name.toLowerCase() === clean.toLowerCase())) return false;
    setCategories((rows) => rows.map((c) => (c.id === id ? { ...c, name: clean } : c)));
    setProducts((rows) => rows.map((p) => (p.cat === current.name ? { ...p, cat: clean } : p)));
    return true;
  };
  const deleteCategory = (id) => {
    const current = categories.find((c) => c.id === id);
    if (!current || products.some((p) => p.cat === current.name)) return false;
    setCategories((rows) => rows.filter((c) => c.id !== id));
    return true;
  };

  /* ---------- Expenses & cash flow ---------- */
  const addTransaction = (t) => setTransactions((rows) => [{ ...t, id: Date.now() }, ...rows]);
  const updateTransaction = (id, patch) =>
    setTransactions((rows) => rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  const deleteTransaction = (id) => setTransactions((rows) => rows.filter((r) => r.id !== id));

  /* ---------- Employees and time clock ---------- */
  const addEmployee = (e) => {
    const no = `E-${String(nextNumber(employees.map((x) => x.no), /^E-(\d+)$/)).padStart(3, "0")}`;
    const id = `u${nextNumber(employees.map((x) => x.id), /^u(\d+)$/)}`;
    setEmployees((rows) => [...rows, { ...e, id, no }]);
    setAttendance((a) => ({ ...a, [id]: { timeIn: null, timeOut: null } }));
    return { id, no };
  };
  const updateEmployee = (id, patch) =>
    setEmployees((rows) => rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  const deleteEmployee = (id) => {
    setEmployees((rows) => rows.filter((r) => r.id !== id));
    setAttendance((a) => {
      const { [id]: _removed, ...rest } = a;
      return rest;
    });
  };
  const clockIn = (id) => setAttendance((a) => ({ ...a, [id]: { timeIn: nowLabel(), timeOut: null } }));
  const clockOut = (id) => setAttendance((a) => ({ ...a, [id]: { ...a[id], timeOut: nowLabel() } }));

  /* ---------- Requests ---------- */
  const decideRequest = (id, status) => {
    const req = requests.find((r) => r.id === id);
    if (!req || req.status !== "pending") return;
    if (status === "approved") {
      if (req.type === "stock") updateProduct(req.payload.productId, { stock: req.payload.stock });
      if (req.type === "dtr") {
        const { employeeId, timeIn, timeOut } = req.payload;
        setAttendance((a) => ({ ...a, [employeeId]: { timeIn, timeOut } }));
      }
    }
    setRequests((rows) =>
      rows.map((r) => (r.id === id ? { ...r, status, decidedAt: new Date().toISOString() } : r)),
    );
  };

  const resetAll = () => {
    setProducts(clone(seedProducts));
    setCategories(clone(initialCategories));
    setTransactions(clone(initialTransactions));
    setEmployees(clone(initialEmployees));
    setAttendance(structuredClone(initialAttendance));
    setRequests(structuredClone(initialRequests));
  };

  return {
    products, addProduct, updateProduct, deleteProduct, addStock, importProducts,
    categories, addCategory, renameCategory, deleteCategory,
    transactions, addTransaction, updateTransaction, deleteTransaction,
    employees, addEmployee, updateEmployee, deleteEmployee,
    attendance, clockIn, clockOut,
    requests, decideRequest,
    resetAll,
  };
}
