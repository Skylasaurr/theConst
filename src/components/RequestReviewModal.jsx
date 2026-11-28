import Modal from "./Modal";
import Button from "./Button";
import StatusBadge from "./StatusBadge";
import { peso } from "../lib/format";

export const STATUS_VARIANT = { pending: "late", approved: "present", rejected: "absent" };
export const STATUS_LABEL = { pending: "Pending", approved: "Approved", rejected: "Rejected" };

/* Review dialog shared by the dashboard panel and the Requests page. */
export default function RequestReviewModal({ request, products, onClose, onDecide }) {
  const product = request?.type === "stock" ? products.find((p) => p.id === request.payload.productId) : null;
  const decide = (status) => {
    onDecide(request, status);
    onClose();
  };
  return (
    <Modal open={!!request} title="Review request" onClose={onClose}>
      {request && (
        <>
          <p className="m-0 mb-1 font-semibold">{request.text}</p>
          <p className="m-0 mb-2 text-muted">
            From {request.by}. Reason: {request.reason}.
          </p>
          {product && (
            <p className="m-0 mb-2 text-sm">
              Approving changes {product.name} from <b>{product.stock}</b> to <b>{request.payload.stock}</b> {product.unit}.
            </p>
          )}
          {request.type === "dtr" && (
            <p className="m-0 mb-2 text-sm">
              Approving sets today's time in to <b>{request.payload.timeIn}</b> and time out to <b>{request.payload.timeOut}</b>.
            </p>
          )}
          {request.type === "transaction" && (
            <div className="mb-4 space-y-1 text-sm">
              <p className="m-0">Date: <b>{request.payload.date}</b></p>
              <p className="m-0">Type: <b>{request.payload.type}</b></p>
              <p className="m-0">Category: <b>{request.payload.category}</b></p>
              <p className="m-0">Amount: <b>{peso(request.payload.amount)}</b></p>
              <p className="m-0">Note: <b>{request.payload.note || "-"}</b></p>
            </div>
          )}
          <p className="m-0 mb-4 text-sm">
            Status: <StatusBadge variant={STATUS_VARIANT[request.status]}>{STATUS_LABEL[request.status]}</StatusBadge>
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={onClose}>Close</Button>
            {request.status === "pending" && (
              <>
                <Button variant="warning" onClick={() => decide("rejected")}>Reject</Button>
                <Button variant="primary" onClick={() => decide("approved")}>Approve</Button>
              </>
            )}
          </div>
        </>
      )}
    </Modal>
  );
}
