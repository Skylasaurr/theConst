import Modal from "./Modal";
import Button from "./Button";
import StockBadge from "./StockBadge";
import { peso } from "../lib/format";

export default function ProductDetailsModal({
  product,
  onClose,
  onEdit,
  onAddStock,
}) {
  const rows = product && [
    ["Product ID", product.sku],
    ["Category", product.cat],
    ["Unit", product.unit],
    ["Selling price", peso(product.price)],
    ["Available quantity", `${product.stock} ${product.unit}`],
    ["Low-stock threshold", product.min],
    ["Stock value", peso(product.price * Math.max(0, product.stock))],
  ];
  return (
    <Modal
      open={!!product}
      title={product?.name ?? ""}
      subtitle="Product details"
      onClose={onClose}
    >
      {product && (
        <>
          <ul className="m-0 list-none p-0">
            {rows.map(([k, v]) => (
              <li
                key={k}
                className="flex justify-between gap-3 border-b border-line py-2"
              >
                <span className="text-muted">{k}</span>
                <b className="text-right">{v}</b>
              </li>
            ))}
            <li className="flex items-center justify-between gap-3 py-2">
              <span className="text-muted">Stock status</span>
              <StockBadge product={product} />
            </li>
          </ul>
          <div className="mt-4 flex flex-wrap justify-end gap-2">
            <Button onClick={onClose}>Close</Button>
            <Button onClick={() => onAddStock(product)}>Add Stock</Button>
            <Button variant="primary" onClick={() => onEdit(product)}>
              Edit Product
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
}
