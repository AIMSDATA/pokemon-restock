import { StockStatus, STATUS_INFO } from "@/types";

export function StockBadge({ status }: { status: StockStatus }) {
  const info = STATUS_INFO[status];
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
      style={{ backgroundColor: `${info.color}20`, color: info.color }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: info.color }}
      />
      {info.label}
    </span>
  );
}
