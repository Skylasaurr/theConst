import Modal from "./Modal";
import Button from "./Button";

/* Reusable yes/no confirmation. `detail` is shown in a box (e.g. the record name). */
export default function ConfirmDialog({
  open,
  title,
  message,
  detail,
  confirmLabel = "Yes, delete",
  onConfirm,
  onClose,
}) {
  return (
    <Modal
      open={open}
      title={title}
      subtitle={message}
      size="sm"
      onClose={onClose}
    >
      {detail && (
        <p className="m-0 rounded border border-line px-3 py-2 font-semibold">
          {detail}
        </p>
      )}
      <div className="mt-4 flex justify-end gap-2">
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="warning" onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
