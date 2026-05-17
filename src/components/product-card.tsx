import { Product, RETAILER_INFO } from "@/types";
import { StockBadge } from "./stock-badge";
import { timeAgo } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const inStockCount = product.retailers.filter(
    (r) => r.status === "in_stock"
  ).length;

  return (
    <div className="bg-bg-card rounded-xl border border-border p-4 hover:bg-bg-card-hover transition-colors">
      <div className="flex items-start gap-3">
        <div className="w-16 h-16 bg-bg-secondary rounded-lg flex items-center justify-center text-3xl shrink-0">
          🃏
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-text-primary truncate">
            {product.name}
          </h3>
          <p className="text-xs text-text-secondary mt-0.5">
            {product.category}
          </p>
          <div className="mt-2 flex items-center gap-2">
            {inStockCount > 0 ? (
              <span className="text-xs text-success font-medium">
                {inStockCount} retailer{inStockCount > 1 ? "s" : ""} in stock
              </span>
            ) : (
              <span className="text-xs text-text-secondary">
                Out of stock everywhere
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-3 space-y-2">
        {product.retailers.map((listing) => {
          const info = RETAILER_INFO[listing.retailer];
          return (
            <div
              key={listing.retailer}
              className="flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2">
                <span>{info.icon}</span>
                <span className="text-text-secondary">{info.name}</span>
              </div>
              <div className="flex items-center gap-2">
                {listing.price && (
                  <span className="text-text-secondary">
                    ${listing.price.toFixed(2)}
                  </span>
                )}
                <StockBadge status={listing.status} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 pt-2 border-t border-border">
        <p className="text-[10px] text-text-secondary">
          Last checked {timeAgo(product.retailers[0].lastChecked)}
        </p>
      </div>
    </div>
  );
}
