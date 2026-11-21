import { useEffect, useLayoutEffect, useRef, useState } from "react";
import TopBar from "./components/TopBar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Panel from "./components/Panel";
import Modal from "./components/Modal";
import PasswordForm from "./components/PasswordForm";
import IWSEmployees from "./components/IWSEmployees";
import { NAV, ROLES, DEMO_USER, users, initialRequests } from "./data/system";

export default function App() {
  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [role, setRole] = useState("owner");
  const [pending, setPending] = useState(null);
  const [page, setPage] = useState("dash");
  const [navOpen, setNavOpen] = useState(false);
  const [requests, setRequests] = useState(initialRequests);
  const [toast, setToast] = useState("");
  const [theme, setTheme] = useState(() =>
    matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light",
  );

  useLayoutEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const updateHeaderHeight = () => {
      setHeaderHeight(header.getBoundingClientRect().height);
    };
    const observer = new ResizeObserver(updateHeaderHeight);
    observer.observe(header);
    updateHeaderHeight();

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const changeRole = (r) => {
    setRole(r);
    setPage("dash");
    setPending(null);
  };

  const user = users.find((u) => u.id === DEMO_USER[role]);
  const items = NAV[role];
  const title = (items.find(([id]) => id === page) || items[0])[1];
  const decide = (req, status) => {
    setRequests((rs) => rs.filter((r) => r.id !== req.id));
    setToast(`Request ${status}`);
  };

  return (
    <>
      <div ref={headerRef} className="sticky top-0 z-40">
        <div className="hazard" />
        <TopBar
          role={role}
          onRole={(r) => r !== role && setPending(r)}
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
          onPage={setPage}
          badge={role === "owner" ? requests.length : 0}
          open={navOpen}
          onClose={() => setNavOpen(false)}
          topOffset={headerHeight}
        />
        <main className="w-full max-w-[1120px] min-w-0 p-4 md:p-[22px]">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <h1 className="m-0 font-display text-[28px] leading-[1.1] font-bold md:text-[32px]">
              {title}
            </h1>
            <div className="text-right">
              <div className="text-xl text-muted">
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
              requests={requests}
              onDecide={decide}
              onPage={setPage}
            />
          ) : page === "dtr" ? (
            <IWSEmployees />
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
        open={!!pending}
        title="Enter password"
        onClose={() => setPending(null)}
      >
        {pending && (
          <PasswordForm
            roleLabel={ROLES.find(([v]) => v === pending)[1]}
            submitLabel="Switch view"
            onSuccess={() => changeRole(pending)}
            onCancel={() => setPending(null)}
          />
        )}
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
