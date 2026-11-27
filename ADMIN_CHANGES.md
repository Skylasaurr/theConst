# Admin side: completion notes

Scope: Admin (owner) pages only. All data is hardcoded sample data held in React state
(`src/hooks/useAdminData.js`); no database, backend, or new dependencies. Changes reset on refresh.

## What each Admin page does now
- **Dashboard**: KPIs, 7-day chart, low-stock alerts and the requests panel all read the shared state, so they update when inventory, expenses, attendance or requests change.
- **Inventory**: Add / Edit / View / Delete product, Add Stock, Manage Categories (add, rename, delete when empty), Import CSV (+ template), search, status filter, sortable columns, pagination, category filter.
- **IWS Employees**: Employees add / edit / delete with validation (account fields only for non-staff roles); Time Clock with working Clock in / Clock out and search.
- **Employees Attendance**: weekly DTR generator now lists the live employee roster.
- **Expenses & Cash Flow**: add, edit, delete (modal confirm), search + type/category filters, stats and chart from the shared list.
- **Reports & Analytics** (new, from the Figma prototype): Today / 7 / 30 days, revenue, expenses, net profit, transactions, sales vs expenses chart, top products, expenses by category, Export sales CSV, Print, Reset demo data.
- **Requests** (new page): Pending / Approved / Rejected tabs and search. Approving a stock request updates the product quantity; approving a DTR request updates today's time in/out.

## Fixes
- `InventoryTable`: View button called an undefined `setViewing` (crash). Replaced with a details modal.
- `Modal`: now supports `subtitle` and `size`; no longer lets a closing dialog wipe the dialog that replaced it.
- `App`: `text-basedtext-muted` typo, unused state/handlers removed.
- Emojis replaced with inline SVG icons (`components/Icon.jsx`).
- Duplicate employee/time-clock records and two conflicting employee lists unified.

## Not changed
Cashier / Inventory-staff / Staff dashboards, POS and login behaviour. Accounts created in the Admin
Employees form do not yet work on the login screen (login still uses the fixed demo accounts).
