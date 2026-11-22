import { useState } from "react";
import Icon from "./Icon";

export default function CategoryBrowser({ categories, selected, onSelect }) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? categories : categories.slice(0, 6);

  return (
    <section className="rounded-xl bg-steel p-4 text-steel-ink">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="m-0 text-base font-semibold">Browse by category</h3>
          <span className="text-xs opacity-70">
            Find the right supplies faster
          </span>
        </div>
        <div className="flex gap-2">
          {selected !== "all" && (
            <button
              onClick={() => onSelect("all")}
              className="inline-flex cursor-pointer items-center gap-1 rounded-md bg-accent px-3 py-1.5 text-xs font-semibold text-accent-ink hover:brightness-95"
            >
              Clear filter <Icon name="x" className="h-3 w-3" />
            </button>
          )}
          {categories.length > 6 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-steel-ink/40 px-3 py-1.5 text-xs transition-colors hover:border-steel-ink"
            >
              {showAll ? "Show fewer" : "View all categories"}
              <Icon name={showAll ? "up" : "down"} className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {visible.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelect(selected === c.name ? "all" : c.name)}
            aria-pressed={selected === c.name}
            className={`flex cursor-pointer flex-col gap-2 rounded-lg bg-surface p-3 text-left text-ink transition ${
              selected === c.name ? "ring-2 ring-accent" : "hover:brightness-95"
            }`}
          >
            <div className="grid h-8 w-8 place-items-center rounded-md bg-soft">
              <Icon name={c.icon} className="h-4 w-4" />
            </div>
            <div>
              <p className="m-0 text-sm font-extrabold">{c.name}</p>
              <p className="m-0 text-[12px] text-muted">{c.count} items</p>
            </div>
          </button>
        ))}
        {categories.length === 0 && (
          <p className="col-span-full m-0 text-sm opacity-80">
            No categories yet. Use Manage Categories to add one.
          </p>
        )}
      </div>
    </section>
  );
}
