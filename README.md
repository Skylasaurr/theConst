# Impig Construction Supply – React App

React + Vite + Tailwind CSS (v4). Role-aware management system for Impig Construction Supply.

## Run
    npm install
    npm run dev      # http://localhost:5173/theConst/
    npm run build

## Structure
- `src/App.jsx` – app state (login, role, page, theme, menu, requests) and page switching
- `src/components/`
  - Layout: `TopBar`, `Sidebar`
  - Screens: `LogInPage`, `Dashboard`, `IWSEmployees` (`TimeClock` + `EmployeesAccount`), `WeeklyDTR`
  - Dashboard widgets: `KpiCard`, `SalesChart`, `StockPanel`, `StockBadge`, `RequestsPanel`
  - Shared UI: `Panel`, `Button`, `Modal`, `StatusBadge`, `PasswordForm`
- `src/data/` – client inventory (`products.json`) and sample users/sales/requests (`system.js`)
- `src/lib/` – `format.js` (peso helpers) and the login background image

## Pages
Dashboard (different layout per role), IWS Employees (time clock + employee list with add/edit/delete modals),
Employees Attendance (weekly DTR generator and printable preview). Other sidebar items show a placeholder page.

## Interactive features
1. Login page with Sign In / Attendance options
2. Role switcher (password protected): changes nav and dashboard content
3. Mobile menu toggle (hamburger drawer)
4. Dark / light theme toggle
5. Stock alert and employee search + filters
6. Request review modal (approve / reject updates the badge count)
7. Weekly DTR: pick employee and week, generate, print

## General Account Password
- Impig_123 (can be found at data/system.js)
