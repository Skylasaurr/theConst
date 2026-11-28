import { useState } from "react";
import StatCard from "./StatCard";
import CategoryBrowser from "./CategoryBrowser";
import InventoryTable from "./InventoryTable";
import ProductFormModal from "./ProductFormModal";
import ProductDetailsModal from "./ProductDetailsModal";
import AddStockModal from "./AddStockModal";
import ManageCategoriesModal from "./ManageCategoriesModal";
import ImportProductsModal from "./ImportProductsModal";
import ConfirmDialog from "./ConfirmDialog";
import Button from "./Button";
import Icon from "./Icon";
import { stockStatus } from "./StockBadge";
import { peso } from "../lib/format";

export default function Inventory({ data, notify, readOnly = false }) {
  const { products, categories } = data;
  const [category, setCategory] = useState("all");
  /* one open dialog at a time: { type, product? } */
  const [dialog, setDialog] = useState(null);
  const close = () => setDialog(null);

  const low = products.filter((p) => stockStatus(p)[0] === "low").length;
  const out = products.filter((p) => stockStatus(p)[0] === "out").length;
  const value = products.reduce(
    (sum, p) => sum + p.price * Math.max(0, p.stock),
    0,
  );

  const stats = [
    {
      id: 1,
      label: "Total Items",
      value: products.length,
      note: `Across ${categories.length} categories`,
      tone: "green",
      icon: "box",
    },
    {
      id: 2,
      label: "Low Stock",
      value: low,
      note: "Items need attention",
      tone: "yellow",
      icon: "alert",
    },
    {
      id: 3,
      label: "Out of Stock",
      value: out,
      note: "Replenish these items",
      tone: "red",
      icon: "alertCircle",
    },
    {
      id: 4,
      label: "Inventory Value",
      value: peso(value),
      note: "Total stock valuation",
      tone: "orange",
      icon: "peso",
    },
  ];

  const cats = categories.map((c) => ({
    ...c,
    count: products.filter((p) => p.cat === c.name).length,
  }));
  const shown =
    category === "all" ? products : products.filter((p) => p.cat === category);

  const saveProduct = (values) => {
    if (dialog.product) {
      data.updateProduct(dialog.product.id, values);
      notify(`Saved changes to ${values.name}`);
    } else {
      data.addProduct(values);
      notify(`${values.name} added to inventory`);
    }
    close();
  };
  const addStock = (product, qty) => {
    data.addStock(product.id, qty);
    notify(`Added ${qty} ${product.unit} to ${product.name}`);
    close();
  };
  const removeProduct = () => {
    data.deleteProduct(dialog.product.id);
    notify(`${dialog.product.name} deleted`);
    close();
  };
  const importProducts = ({ valid, skipped }) => {
    for (const name of new Set(valid.map((p) => p.cat))) {
      if (!categories.some((c) => c.name.toLowerCase() === name.toLowerCase()))
        data.addCategory(name);
    }
    const resolved = valid.map((p) => ({
      ...p,
      cat:
        categories.find((c) => c.name.toLowerCase() === p.cat.toLowerCase())
          ?.name ?? p.cat,
    }));
    data.importProducts(resolved);
    notify(
      `Imported ${valid.length} product${valid.length === 1 ? "" : "s"}${skipped ? `, skipped ${skipped}` : ""}`,
    );
    close();
  };
  const renameCategory = (id, name) => {
    const old = categories.find((c) => c.id === id)?.name;
    const ok = data.renameCategory(id, name);
    if (ok && category === old) setCategory(name.trim());
    return ok;
  };
  const removeCategory = (c) => {
    if (data.deleteCategory(c.id)) {
      if (category === c.name) setCategory("all");
      notify(`Category "${c.name}" deleted`);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col flex-wrap gap-2.5 sm:flex-row">
        {!readOnly && (
          <Button onClick={() => setDialog({ type: "import" })}>
            <Icon name="upload" /> Import CSV
          </Button>
        )}

        {!readOnly && (
          <Button
            variant="primary"
            onClick={() => setDialog({ type: "form", product: null })}
          >
            <Icon name="plus" /> Add Product
          </Button>
        )}
        {!readOnly && (
          <Button onClick={() => setDialog({ type: "categories" })}>
            <Icon name="list" /> Manage Categories
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.id} {...s} />
        ))}
      </div>
      <CategoryBrowser
        categories={cats}
        selected={category}
        onSelect={setCategory}
      />
      <InventoryTable
        products={shown}
        category={category}
        onView={(product) => setDialog({ type: "view", product })}
        readOnly={readOnly}
        onEdit={(product) => setDialog({ type: "form", product })}
        onDelete={(product) => setDialog({ type: "delete", product })}
        onAddStock={(product) => setDialog({ type: "stock", product })}
      />
      <ProductDetailsModal
        product={dialog?.type === "view" ? dialog.product : null}
        readOnly={readOnly}
        onClose={close}
        onEdit={(product) => setDialog({ type: "form", product })}
        onAddStock={(product) => setDialog({ type: "stock", product })}
      />
      <ProductFormModal
        open={dialog?.type === "form"}
        product={dialog?.product ?? null}
        categories={categories}
        products={products}
        onSubmit={saveProduct}
        onClose={close}
      />
      <AddStockModal
        open={dialog?.type === "stock"}
        products={products}
        initial={dialog?.product ?? null}
        onSubmit={addStock}
        onClose={close}
      />
      <ManageCategoriesModal
        open={dialog?.type === "categories"}
        categories={categories}
        products={products}
        onAdd={data.addCategory}
        onRename={renameCategory}
        onDelete={removeCategory}
        onClose={close}
      />
      <ImportProductsModal
        open={dialog?.type === "import"}
        onImport={importProducts}
        onClose={close}
      />
      <ConfirmDialog
        open={dialog?.type === "delete"}
        title="Delete product?"
        message="This action can't be undone."
        detail={dialog?.product?.name}
        onConfirm={removeProduct}
        onClose={close}
      />
    </div>
  );
}
