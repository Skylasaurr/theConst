import Icon from "./Icon";

export default function TopBar({ roleLabel, theme, onTheme, navOpen, onNav }) {
  return (
    <header className="flex flex-wrap items-center gap-x-3.5 gap-y-2.5 border-b border-line bg-surface px-4 py-2.5">
      <button
        onClick={onNav}
        aria-expanded={navOpen}
        aria-controls="main-nav"
        aria-label="Toggle menu"
        className="cursor-pointer rounded border border-line px-2.5 py-1.5 lg:hidden"
      >
        <Icon name={navOpen ? "x" : "menu"} className="h-5 w-5" />
      </button>

      <span className="font-semibold">Logged in as {roleLabel}</span>

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
