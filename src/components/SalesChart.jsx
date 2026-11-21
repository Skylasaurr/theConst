import { kpeso } from "../lib/format";

export default function SalesChart({ data }) {
  const W = 640,
    H = 170,
    P = 10;
  const max = Math.max(1, ...data.map((d) => d.value));
  const bw = (W - P * 2) / data.length;
  return (
    <svg
      viewBox={`0 0 ${W} ${H + 44}`}
      role="img"
      aria-label="Sales for the last 7 days"
      className="block h-auto w-full"
    >
      {data.map((d, i) => {
        const h = Math.round((d.value / max) * H),
          x = P + i * bw + bw * 0.2,
          w = bw * 0.6;
        return (
          <g key={d.label + i}>
            <rect
              x={x}
              y={H - h + 20}
              width={w}
              height={h}
              rx="2"
              fill={i === data.length - 1 ? "var(--accent)" : "var(--bar)"}
            />
            <text
              x={x + w / 2}
              y={H - h + 14}
              textAnchor="middle"
              fontSize="13"
              fill="var(--ink)"
            >
              {kpeso(d.value)}
            </text>
            <text
              x={x + w / 2}
              y={H + 38}
              textAnchor="middle"
              fontSize="13"
              fill="var(--muted)"
            >
              {d.label}
            </text>
          </g>
        );
      })}
      <line x1="0" x2={W} y1={H + 20} y2={H + 20} stroke="var(--line)" />
    </svg>
  );
}
