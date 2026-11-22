import { useState } from "react";
import Modal from "./Modal";
import Button from "./Button";
import Field, { inputClass } from "./Field";
import { DEFAULT_UNITS } from "../data/inventory";

const isWhole = (v) => v !== "" && Number.isInteger(Number(v));

function validate(f) {
  const e = {};
  if (!f.name.trim()) e.name = "Enter the product name.";
  if (!f.cat) e.cat = "Select a category.";
  if (!f.unit) e.unit = "Select a unit.";
  if (f.price === "" || !(Number(f.price) > 0))
    e.price = "Enter a price greater than 0.";
  if (!isWhole(f.stock) || Number(f.stock) < 0)
    e.stock = "Enter a whole number, 0 or more.";
  if (!isWhole(f.min) || Number(f.min) < 0)
    e.min = "Enter a whole number, 0 or more.";
  return e;
}

function ProductForm({ product, categories, units, onSubmit, onClose }) {
  const [f, setF] = useState({
    name: product?.name ?? "",
    cat: product?.cat ?? "",
    unit: product?.unit ?? "",
    price: product?.price ?? "",
    stock: product?.stock ?? 0,
    min: product?.min ?? 10,
  });
  const [errors, setErrors] = useState({});
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    const found = validate(f);
    setErrors(found);
    if (Object.keys(found).length) return;
    onSubmit({
      name: f.name.trim(),
      cat: f.cat,
      unit: f.unit,
      price: Number(f.price),
      stock: Number(f.stock),
      min: Number(f.min),
    });
  };

  return (
    <form onSubmit={submit} noValidate>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Product ID">
          <input
            className={`${inputClass} bg-soft`}
            value={product?.sku ?? "Generated automatically"}
            readOnly
          />
        </Field>
        <Field label="Product name" required error={errors.name}>
          <input
            className={inputClass}
            value={f.name}
            onChange={set("name")}
            placeholder="Enter product name"
            aria-invalid={!!errors.name}
            autoFocus
          />
        </Field>
        <Field label="Category" required error={errors.cat}>
          <select
            className={inputClass}
            value={f.cat}
            onChange={set("cat")}
            aria-invalid={!!errors.cat}
          >
            <option value="" disabled>
              Select category
            </option>
            {categories.map((c) => (
              <option key={c.id}>{c.name}</option>
            ))}
          </select>
        </Field>
        <Field label="Unit" required error={errors.unit}>
          <select
            className={inputClass}
            value={f.unit}
            onChange={set("unit")}
            aria-invalid={!!errors.unit}
          >
            <option value="" disabled>
              Select unit
            </option>
            {units.map((u) => (
              <option key={u}>{u}</option>
            ))}
          </select>
        </Field>
        <Field label="Selling price (₱)" required error={errors.price}>
          <input
            className={inputClass}
            type="number"
            min="0"
            step="0.01"
            value={f.price}
            onChange={set("price")}
            placeholder="0.00"
            aria-invalid={!!errors.price}
          />
        </Field>
        <Field label="Available quantity" required error={errors.stock}>
          <input
            className={inputClass}
            type="number"
            step="1"
            value={f.stock}
            onChange={set("stock")}
            aria-invalid={!!errors.stock}
          />
        </Field>
        <Field
          label="Low-stock threshold"
          required
          error={errors.min}
          hint="Alert when stock reaches this quantity."
        >
          <input
            className={inputClass}
            type="number"
            min="0"
            step="1"
            value={f.min}
            onChange={set("min")}
            aria-invalid={!!errors.min}
          />
        </Field>
      </div>
      <div className="mt-5 flex justify-end gap-2">
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="primary">
          {product ? "Save Changes" : "Create Product"}
        </Button>
      </div>
    </form>
  );
}

/* `product` is null for Add, or the product being edited. */
export default function ProductFormModal({
  open,
  product,
  categories,
  products,
  onSubmit,
  onClose,
}) {
  const units = [
    ...new Set([...DEFAULT_UNITS, ...products.map((p) => p.unit)]),
  ];
  return (
    <Modal
      open={open}
      title={product ? "Edit product" : "Add product"}
      subtitle={
        product
          ? "Update this item in your inventory."
          : "Create a new item in your inventory."
      }
      size="lg"
      onClose={onClose}
    >
      <ProductForm
        product={product}
        categories={categories}
        units={units}
        onSubmit={onSubmit}
        onClose={onClose}
      />
    </Modal>
  );
}
