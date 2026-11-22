import { useState } from "react";
import Modal from "./Modal";
import Button from "./Button";
import Icon from "./Icon";
import { parseCsv, toCsv, downloadFile } from "../lib/csv";

const COLUMNS = ["name", "category", "unit", "price", "stock", "min"];

/* Turns CSV text into { valid, skipped } product rows. */
export function readProducts(text) {
  const [header = [], ...body] = parseCsv(text);
  const idx = Object.fromEntries(
    COLUMNS.map((c) => [
      c,
      header.findIndex((h) => h.trim().toLowerCase() === c),
    ]),
  );
  if (Object.values(idx).some((i) => i < 0))
    return {
      error: `The first row must contain these columns: ${COLUMNS.join(", ")}.`,
    };
  const valid = [];
  let skipped = 0;
  for (const r of body) {
    const get = (c) => (r[idx[c]] ?? "").trim();
    const row = {
      name: get("name"),
      cat: get("category"),
      unit: get("unit"),
      price: Number(get("price")),
      stock: Number(get("stock")),
      min: Number(get("min")),
    };
    const ok =
      row.name &&
      row.cat &&
      row.unit &&
      get("price") !== "" &&
      row.price > 0 &&
      Number.isInteger(row.stock) &&
      get("stock") !== "" &&
      Number.isInteger(row.min) &&
      row.min >= 0 &&
      get("min") !== "";
    if (ok) valid.push(row);
    else skipped++;
  }
  return { valid, skipped };
}

function Importer({ onImport, onClose }) {
  const [result, setResult] = useState(null);
  const [fileName, setFileName] = useState("");

  const choose = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    if (!/\.csv$/i.test(file.name))
      return setResult({
        error: "Please choose a .csv file. In Excel, use Save As, then CSV.",
      });
    setResult(readProducts(await file.text()));
  };
  const template = () =>
    downloadFile(
      "products-template.csv",
      toCsv([
        COLUMNS,
        [
          "Sample cement 40kg",
          "Steel and Structural Materials",
          "piece",
          "280",
          "50",
          "10",
        ],
      ]),
    );

  return (
    <>
      <p className="m-0 mb-3 text-sm text-muted">
        Upload a CSV file with the columns <b>{COLUMNS.join(", ")}</b>. New
        categories are created automatically.
      </p>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <label className="inline-flex cursor-pointer items-center gap-1.5 rounded border border-line bg-surface px-3.5 py-2 hover:border-muted">
          <Icon name="upload" /> Choose CSV file
          <input
            type="file"
            accept=".csv,text/csv"
            onChange={choose}
            className="sr-only"
          />
        </label>
        <Button onClick={template}>
          <Icon name="download" /> Download template
        </Button>
        {fileName && <span className="text-sm text-muted">{fileName}</span>}
      </div>

      {result?.error && (
        <p role="alert" className="m-0 text-sm text-bad">
          {result.error}
        </p>
      )}
      {result?.valid && (
        <p role="status" className="m-0 text-sm">
          {result.valid.length} product{result.valid.length === 1 ? "" : "s"}{" "}
          ready to import
          {result.skipped > 0 && (
            <span className="text-warn">
              , {result.skipped} invalid row{result.skipped === 1 ? "" : "s"}{" "}
              will be skipped
            </span>
          )}
          .
        </p>
      )}

      <div className="mt-5 flex justify-end gap-2">
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="primary"
          disabled={!result?.valid?.length}
          onClick={() => onImport(result)}
        >
          Import products
        </Button>
      </div>
    </>
  );
}

export default function ImportProductsModal({ open, onClose, onImport }) {
  return (
    <Modal
      open={open}
      title="Import products"
      subtitle="Add many products at once from a CSV file."
      onClose={onClose}
    >
      <Importer onImport={onImport} onClose={onClose} />
    </Modal>
  );
}
