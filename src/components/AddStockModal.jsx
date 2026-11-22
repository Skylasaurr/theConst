import { useState } from "react";
import Modal from "./Modal";
import Button from "./Button";
import Field, { inputClass } from "./Field";
import StockBadge from "./StockBadge";

function AddStockForm({ products, initial, onSubmit, onClose }) {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(initial?.id ?? null);
  const [qty, setQty] = useState("");
  const [error, setError] = useState("");

  const selected = products.find((p) => p.id === selectedId);
  const q = query.trim().toLowerCase();
  const matches = q
    ? products
        .filter((p) => (p.name + p.sku).toLowerCase().includes(q))
        .slice(0, 6)
    : [];

  const submit = (e) => {
    e.preventDefault();
    if (!selected) return setError("Select a product first.");
    const n = Number(qty);
    if (!Number.isInteger(n) || n <= 0)
      return setError("Enter a whole number greater than 0.");
    onSubmit(selected, n);
  };

  return (
    <form onSubmit={submit} noValidate>
      {selected ? (
        <div className="mb-3 flex items-start justify-between gap-3 rounded border border-line bg-soft px-3 py-2">
          <div>
            <b>{selected.name}</b>
            <small className="block text-muted">
              {selected.sku} · {selected.stock} {selected.unit} in stock
            </small>
          </div>
          <Button small onClick={() => setSelectedId(null)}>
            Change
          </Button>
        </div>
      ) : (
        <div className="mb-3">
          <Field label="Select product" required>
            <input
              type="search"
              className={inputClass}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setError("");
              }}
              placeholder="Search products by name or id"
              autoFocus
            />
          </Field>
          <ul className="m-0 mt-1 list-none p-0">
            {matches.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedId(p.id);
                    setError("");
                  }}
                  className="flex w-full cursor-pointer items-center justify-between gap-2 border-b border-line px-1 py-2 text-left hover:bg-soft"
                >
                  <span>
                    {p.name}
                    <small className="block text-muted">
                      {p.sku} · {p.stock} {p.unit}
                    </small>
                  </span>
                  <StockBadge product={p} />
                </button>
              </li>
            ))}
            {q && matches.length === 0 && (
              <li className="py-2 text-sm text-muted">No products found.</li>
            )}
          </ul>
        </div>
      )}

      <Field
        label="Quantity to add"
        required
        hint={
          selected && Number(qty) > 0
            ? `New quantity: ${selected.stock + Number(qty)} ${selected.unit}`
            : "Use Add Stock for new deliveries."
        }
      >
        <input
          type="number"
          min="1"
          step="1"
          className={inputClass}
          value={qty}
          onChange={(e) => {
            setQty(e.target.value);
            setError("");
          }}
          placeholder="0"
          aria-invalid={!!error}
        />
      </Field>
      {error && (
        <p role="alert" className="m-0 mt-2 text-[13px] text-bad">
          {error}
        </p>
      )}

      <div className="mt-5 flex justify-end gap-2">
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="primary">
          Add Stock
        </Button>
      </div>
    </form>
  );
}

export default function AddStockModal({
  open,
  products,
  initial,
  onSubmit,
  onClose,
}) {
  return (
    <Modal
      open={open}
      title="Add stock"
      subtitle="Increase the quantity of an existing product."
      onClose={onClose}
    >
      <AddStockForm
        products={products}
        initial={initial}
        onSubmit={onSubmit}
        onClose={onClose}
      />
    </Modal>
  );
}
