# Impig Construction Supply – ReactJS Homepage

React + Vite + Tailwind CSS (v4). Homepage (dashboard) of the Impig system, role-aware.

## Run
    npm install
    npm run dev      # http://localhost:5173
    npm run build

## Structure
- `src/App.jsx` – state (role, page, theme, menu, requests)
- `src/components/` – TopBar, Sidebar, Dashboard, KpiCard, Panel, SalesChart, StockPanel, StockBadge, RequestsPanel, Modal, Button
- `src/data/` – client inventory (`products.json`) and sample users/sales

## Interactive features
1. Role switcher: changes nav and dashboard content
2. Mobile menu toggle (hamburger drawer)
3. Dark / light theme toggle
4. Stock alert search + unit filter
5. Request review modal (approve / reject updates the badge count)

## General Account Password
- Impig_123 (can be find at data/system.js)
