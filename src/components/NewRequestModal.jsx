
import { useState } from "react";
import Modal from "./Modal";
import Button from "./Button";

const TYPES = {
  "Stock count adjustment": "Item and new count, e.g. PPR PIPE 1 32mm to 152",
  "Void sale": "Receipt number, e.g. Receipt 0042",
  "DTR correction": "Corrected time, e.g. 07:40 to 17:05",
  Other: "What do you need?",
};

const label = "block text-sm font-semibold";
const field = "rounded border border-line bg-surface px-3 py-2 text-ink";

export default function NewRequestModal({
  open,
  onClose,
  onSubmit,
}) {
  const [type, setType] = useState("Stock count adjustment");
  const [details, setDetails] = useState("");
  const [reason, setReason] = useState("");

  const ready = Boolean(details.trim() && reason.trim());

  const resetForm = () => {
    setType("Stock count adjustment");
    setDetails("");
    setReason("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!ready) return;

    onSubmit({
      type,
      details: details.trim(),
      reason: reason.trim(),
    });

    resetForm();
  };

  return (
    <Modal
      open={open}
      title="New request"
      onClose={handleClose}
    >
      <form onSubmit={handleSubmit}>
        <label htmlFor="req-type" className={label}>
          Request type
        </label>

        <select
          id="req-type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className={`${field} mt-1 w-full`}
        >
          {Object.keys(TYPES).map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>

        <label htmlFor="req-details" className={`${label} mt-3`}>
          Details
        </label>

        <input
          id="req-details"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder={TYPES[type]}
          className={`${field} mt-1 w-full`}
        />

        <label htmlFor="req-reason" className={`${label} mt-3`}>
          Reason
        </label>

        <textarea
          id="req-reason"
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Why is this needed?"
          className={`${field} mt-1 w-full`}
        />

        <div className="mt-5 flex justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={handleClose}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="primary"
            disabled={!ready}
            className="disabled:cursor-not-allowed disabled:opacity-50"
          >
            Send request
          </Button>
        </div>
      </form>
    </Modal>
  );
}