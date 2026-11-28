import { useEffect, useLayoutEffect, useRef, useState } from "react";
import TopBar from "./components/TopBar";
import Sidebar from "./components/Sidebar";
import Button from "./components/Button";
import Dashboard from "./components/Dashboard";
import Panel from "./components/Panel";
import Modal from "./components/Modal";
import LoginPage from "./components/LogInPage";
import IWSEmployees from "./components/IWSEmployees";
import WeeklyDtr from "./components/WeeklyDTR";
import Expenses from "./components/Expenses";
import Inventory from "./components/Inventory";
import Reports from "./components/Reports";
import RequestsPage from "./components/RequestsPage";
import useAdminData from "./hooks/useAdminData";
import { fullName } from "./lib/format";
import { NAV, ROLES, DEMO_USER, users } from "./data/system";

export default function App() {
  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState("owner");
  const [page, setPage] = useState("dash");
  const [navOpen, setNavOpen] = useState(false);
  const data = useAdminData();
  const [toast, setToast] = useState("");
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [theme, setTheme] = useState(() =>
    matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light",
  );

  useLayoutEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const update = () => setHeaderHeight(header.getBoundingClientRect().height);
    const observer = new ResizeObserver(update);
    observer.observe(header);
    update();

    return () => observer.disconnect();
  }, [loggedIn]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const goTo = (id) => (id === "out" ? setConfirmLogout(true) : setPage(id));

  const logout = () => {
    setConfirmLogout(false);
    setRole("owner");
    setPage("dash");
    setLoggedIn(false);
  };

  const user = users.find((u) => u.id === DEMO_USER[role]);
  const items = NAV[role];
  const roleLabel = ROLES.find(([v]) => v === role)?.[1];
  const title = (items.find(([id]) => id === page) || items[0])[1];

  const decide = (req, status) => {
    data.decideRequest(req.id, status);
    setToast(`Request ${status}`);
  };
  const roster = data.employees.map((e) => ({
    id: e.id,
    no: e.no,
    name: fullName(e),
    pos: e.pos,
  }));
  const pendingCount = data.requests.filter(
    (r) => r.status === "pending",
  ).length;

  if (!loggedIn) {
    return (
      <LoginPage
        onLogin={(account) => {
          setRole(account.role);
          setPage("dash");
          setLoggedIn(true);
        }}
      />
    );
  }

  return (
    <>
      <div ref={headerRef} className="sticky top-0 z-40">
        <div className="hazard" />
        <TopBar
          roleLabel={roleLabel}
          theme={theme}
          onTheme={() => setTheme(theme === "dark" ? "light" : "dark")}
          navOpen={navOpen}
          onNav={() => setNavOpen(!navOpen)}
        />
      </div>

      <div className="grid min-h-[calc(100vh-60px)] lg:grid-cols-[232px_1fr]">
        <Sidebar
          items={items}
          page={page}
          onPage={goTo}
          badge={role === "owner" ? pendingCount : 0}
          open={navOpen}
          onClose={() => setNavOpen(false)}
          topOffset={headerHeight}
        />

        <main className="w-full max-w-none min-w-0 p-4 md:p-[22px] lg:col-start-2">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <h1 className="m-0 font-display text-[28px] leading-[1.1] font-bold md:text-[32px]">
              {title}
            </h1>

            <div className="ml-auto text-right">
              <div className="text-base text-muted sm:text-xl">
                {user.name}, {user.pos}
              </div>
              <div className="text-sm text-muted">
                {new Date().toLocaleDateString("en-PH", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
          </div>

          {page === "dash" ? (
            <Dashboard
              role={role}
              user={user}
              data={data}
              onDecide={decide}
              onPage={setPage}
            />
          ) : page === "exp" ? (
            <Expenses data={data} notify={setToast} />
          ) : page === "dtr" ? (
            <IWSEmployees
              data={data}
              notify={setToast}
              currentUserId={user.id}
            />
          ) : page === "inv" ? (
            <Inventory
              data={data}
              notify={setToast}
              readOnly={role === "cashier"}
            />
          ) : page === "att" ? (
            <WeeklyDtr
              employee={roster[0]}
              employees={roster}
              onBack={() => setPage("dash")}
            />
          ) : page === "rep" && role === "owner" ? (
            <Reports data={data} notify={setToast} />
          ) : page === "req" && role === "owner" ? (
            <RequestsPage data={data} onDecide={decide} />
          ) : (
            <Panel title={title}>
              <p className="m-0 text-muted">
                This page belongs to the full system.
              </p>
            </Panel>
          )}
        </main>
      </div>

      <Modal
        open={confirmLogout}
        title="Log out?"
        onClose={() => setConfirmLogout(false)}
      >
        <p className="m-0 mb-4 text-muted">Are you sure you want to log out?</p>
        <div className="flex justify-end gap-2">
          <Button onClick={() => setConfirmLogout(false)}>Cancel</Button>
          <Button variant="warning" onClick={logout}>
            Yes, log out
          </Button>
        </div>
      </Modal>

      <div
        role="status"
        aria-live="polite"
        className={`fixed bottom-4 left-1/2 z-40 -translate-x-1/2 rounded-md bg-ink px-4 py-2.5 text-surface transition-opacity ${toast ? "opacity-100" : "pointer-events-none opacity-0"}`}
      >
        {toast}
      </div>
    </>
  );
}
