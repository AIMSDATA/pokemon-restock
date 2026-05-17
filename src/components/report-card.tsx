import { CommunityReport, RETAILER_INFO, Retailer } from "@/types";
import { StockBadge } from "./stock-badge";
import { timeAgo } from "@/lib/utils";

export function ReportCard({ report }: { report: CommunityReport }) {
  const retailerInfo =
    report.retailer in RETAILER_INFO
      ? RETAILER_INFO[report.retailer as Retailer]
      : null;

  return (
    <div className="bg-bg-card rounded-xl border border-border p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-text-primary truncate">
            {report.productName}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            {retailerInfo && <span>{retailerInfo.icon}</span>}
            <span className="text-xs text-text-secondary">
              {report.location}
            </span>
          </div>
        </div>
        <StockBadge status={report.status} />
      </div>

      {report.note && (
        <p className="mt-2 text-xs text-text-secondary bg-bg-secondary rounded-lg p-2">
          &ldquo;{report.note}&rdquo;
        </p>
      )}

      <div className="mt-3 flex items-center justify-between text-[10px] text-text-secondary">
        <span>{timeAgo(report.reportedAt)}</span>
        <button className="flex items-center gap-1 hover:text-accent transition-colors">
          <span>👍</span>
          <span>{report.upvotes}</span>
        </button>
      </div>
    </div>
  );
}
