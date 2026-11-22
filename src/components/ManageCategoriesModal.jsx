import { useState } from "react";
import Modal from "./Modal";
import Button from "./Button";
import Icon from "./Icon";
import { inputClass } from "./Field";

function Manager({ categories, products, onAdd, onRename, onDelete, onClose }) {
  const [name, setName] = useState("");
  const [editing, setEditing] = useState(null); // { id, draft }
  const [error, setError] = useState("");

  const count = (c) => products.filter((p) => p.cat === c.name).length;

  const add = (e) => {
    e.preventDefault();
    if (!name.trim()) return setError("Enter a category name.");
    if (!onAdd(name)) return setError("That category already exists.");
    setName("");
    setError("");
  };
  const save = () => {
    if (!editing.draft.trim()) return setError("Enter a category name.");
    if (!onRename(editing.id, editing.draft))
      return setError("That category already exists.");
    setEditing(null);
    setError("");
  };

  return (
    <>
      <form onSubmit={add} className="mb-3 flex gap-2">
        <input
          className={inputClass}
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError("");
          }}
          placeholder="New category name"
          aria-label="New category name"
        />
        <Button type="submit" variant="primary">
          <Icon name="plus" /> Add
        </Button>
      </form>
      {error && (
        <p role="alert" className="m-0 mb-2 text-[13px] text-bad">
          {error}
        </p>
      )}

      <ul className="m-0 max-h-72 list-none overflow-y-auto p-0">
        {categories.map((c) => (
          <li
            key={c.id}
            className="flex items-center justify-between gap-2 border-b border-line py-2 last:border-0"
          >
            {editing?.id === c.id ? (
              <>
                <input
                  className={inputClass}
                  value={editing.draft}
                  onChange={(e) =>
                    setEditing({ ...editing, draft: e.target.value })
                  }
                  aria-label="Category name"
                  autoFocus
                />
                <div className="flex gap-1.5">
                  <Button small variant="primary" onClick={save}>
                    Save
                  </Button>
                  <Button
                    small
                    onClick={() => {
                      setEditing(null);
                      setError("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </>
            ) : (
              <>
                <span>
                  {c.name}
                  <small className="block text-muted">{count(c)} items</small>
                </span>
                <div className="flex gap-1.5">
                  <Button
                    small
                    onClick={() => {
                      setEditing({ id: c.id, draft: c.name });
                      setError("");
                    }}
                    aria-label={`Rename ${c.name}`}
                  >
                    <Icon name="edit" className="h-3.5 w-3.5" /> Rename
                  </Button>
                  <Button
                    small
                    variant="warning"
                    onClick={() => onDelete(c)}
                    disabled={count(c) > 0}
                    title={
                      count(c) > 0
                        ? "Move or delete its products first"
                        : undefined
                    }
                    aria-label={`Delete ${c.name}`}
                  >
                    <Icon name="trash" className="h-3.5 w-3.5" /> Delete
                  </Button>
                </div>
              </>
            )}
          </li>
        ))}
        {categories.length === 0 && (
          <li className="py-3 text-muted">No categories yet.</li>
        )}
      </ul>

      <div className="mt-4 flex justify-end">
        <Button onClick={onClose}>Done</Button>
      </div>
    </>
  );
}

export default function ManageCategoriesModal({ open, onClose, ...rest }) {
  return (
    <Modal
      open={open}
      title="Manage categories"
      subtitle="A category can only be deleted when it has no products."
      size="lg"
      onClose={onClose}
    >
      <Manager {...rest} onClose={onClose} />
    </Modal>
  );
}
