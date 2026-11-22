/* Small stroke icons (24x24). `name` picks the path(s). */
const PATHS = {
  box: "M21 8l-9-5-9 5v8l9 5 9-5V8z M3 8l9 5 9-5 M12 13v8",
  alert:
    "M10.3 3.9L2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z M12 9v4 M12 17h.01",
  alertCircle: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M12 8v4 M12 16h.01",
  peso: "M7 20V4h6a4 4 0 0 1 0 8H7 M5 8h12 M5 11h12",
  drop: "M12 2.7s7 7.3 7 12.3a7 7 0 0 1-14 0c0-5 7-12.3 7-12.3z",
  bolt: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  paint:
    "M19 3H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z M12 11v4 M10 15h4v6h-4z",
  door: "M5 21V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v17 M3 21h18 M15 12h.01",
  nut: "M12 2l8.7 5v10L12 22l-8.7-5V7L12 2z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  flask:
    "M9 3h6 M10 3v6L4.5 19a1.5 1.5 0 0 0 1.3 2.2h12.4a1.5 1.5 0 0 0 1.3-2.2L14 9V3 M7.5 14h9",
  bath: "M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-3z M6 12V6a2 2 0 0 1 4 0 M7 19l-1 2 M17 19l1 2",
  building: "M3 21h18 M5 21V7l7-4 7 4v14 M9 21v-6h6v6",
  wrench:
    "M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4 2.6-2.6z",
  layout: "M3 3h18v18H3z M3 12h18 M12 3v18",
  shield: "M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5l8-3z",
  car: "M5 17h14 M3 13l2-6h14l2 6v4H3v-4z M7 17v2 M17 17v2",
  x: "M18 6L6 18 M6 6l12 12",
  menu: "M4 6h16 M4 12h16 M4 18h16",
  arrowRight: "M5 12h14 M13 6l6 6-6 6",
  arrowLeft: "M19 12H5 M11 6l-6 6 6 6",
  search: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14z M21 21l-4.3-4.3",
  plus: "M12 5v14 M5 12h14",
  upload: "M12 16V4 M7 9l5-5 5 5 M4 20h16",
  download: "M12 4v12 M7 11l5 5 5-5 M4 20h16",
  printer: "M6 9V3h12v6 M6 18H4v-7h16v7h-2 M7 14h10v7H7z",
  rotate: "M3 12a9 9 0 1 0 3-6.7 M3 4v5h5",
  edit: "M12 20h9 M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z",
  trash: "M3 6h18 M8 6V4h8v2 M6 6l1 14h10l1-14 M10 11v5 M14 11v5",
  eye: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  up: "M6 15l6-6 6 6",
  down: "M6 9l6 6 6-6",
  sort: "M8 9l4-4 4 4 M16 15l-4 4-4-4",
  check: "M5 12l5 5L20 7",
  list: "M8 6h13 M8 12h13 M8 18h13 M3 6h.01 M3 12h.01 M3 18h.01",
};

export default function Icon({ name, className = "h-4 w-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 ${className}`}
      aria-hidden="true"
    >
      <path d={PATHS[name] ?? PATHS.box} />
    </svg>
  );
}
