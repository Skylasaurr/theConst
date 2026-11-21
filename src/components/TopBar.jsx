import { ROLES } from "../data/system";

export default function TopBar({
  role,
  onRole,
  theme,
  onTheme,
  navOpen,
  onNav,
}) {
  return (
    <header className="flex flex-wrap items-center gap-x-3.5 gap-y-2.5 border-b border-line bg-surface px-4 py-2.5">
      <button
        onClick={onNav}
        aria-expanded={navOpen}
        aria-controls="main-nav"
        aria-label="Toggle menu"
        className="cursor-pointer rounded border border-line px-2.5 py-1.5 lg:hidden"
      >
        ☰
      </button>
      <label htmlFor="role" className="font-semibold">
        Viewing as
      </label>
      <select
        id="role"
        value={role}
        onChange={(e) => onRole(e.target.value)}
        className="min-w-40 rounded border border-line bg-surface px-2.5 py-1.5"
      >
        {ROLES.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
      <button
        onClick={onTheme}
        aria-pressed={theme === "dark"}
        className="ml-auto cursor-pointer rounded border border-line px-3 py-1.5"
      >
        {theme === "dark" ? "Light mode" : "Dark mode"}
      </button>
    </header>
  );
}
