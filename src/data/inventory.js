import products from "./products.json";
export { products };

/* `icon` is a key understood by components/Icon.jsx */
export const initialCategories = [
  { id: 1, name: "Plumbing Supplies", icon: "drop" },
  { id: 2, name: "Electrical Supplies", icon: "bolt" },
  { id: 3, name: "Paints and Painting Supplies", icon: "paint" },
  { id: 4, name: "Door and Cabinet Hardware", icon: "door" },
  { id: 5, name: "Nails, Screws and Fasteners", icon: "nut" },
  { id: 6, name: "Adhesives, Sealants and Construction Chemicals", icon: "flask" },
  { id: 7, name: "Sanitary Ware and Bathroom Accessories", icon: "bath" },
  { id: 8, name: "Steel and Structural Materials", icon: "building" },
  { id: 9, name: "Hand Tools and Tool Accessories", icon: "wrench" },
  { id: 10, name: "Screens, Boards and Building Accessories", icon: "layout" },
  { id: 11, name: "Safety and Protective Equipment", icon: "shield" },
  { id: 12, name: "Automotive and Maintenance Supplies", icon: "car" },
];

export const DEFAULT_UNITS = [
  "piece", "box", "set", "roll", "pouch", "meter", "centimeter", "milimeter",
  "inches", "kilo", "kilogram", "grams", "liter", "gallon",
];
