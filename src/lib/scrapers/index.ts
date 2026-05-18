import { WalmartCanadaAdapter } from "./target";
import { BestBuyCanadaAdapter } from "./walmart";
import { PokemonCenterAdapter } from "./pokemoncenter";
import { FourOhOneAdapter } from "./fourohone";
import { RetailerAdapter, StockCheckResult } from "./types";

export type { StockCheckResult, RetailerAdapter };

const adapters: RetailerAdapter[] = [
  new WalmartCanadaAdapter(),
  new BestBuyCanadaAdapter(),
  new PokemonCenterAdapter(),
  new FourOhOneAdapter(),
];

export interface StockMonitorResult {
  results: StockCheckResult[];
  changes: StockChange[];
  checkedAt: string;
  duration: number;
}

export interface StockChange {
  productId: string;
  productName: string;
  retailer: string;
  previousStatus: string;
  newStatus: string;
  price: number | null;
  url: string;
}

// In-memory cache of last known stock status
const stockCache = new Map<string, StockCheckResult>();

export async function runStockCheck(): Promise<StockMonitorResult> {
  const start = Date.now();
  const allResults: StockCheckResult[] = [];
  const changes: StockChange[] = [];

  // Run all adapters in parallel
  const adapterResults = await Promise.allSettled(
    adapters.map((adapter) => adapter.checkAll())
  );

  for (const result of adapterResults) {
    if (result.status === "fulfilled") {
      for (const stockResult of result.value) {
        allResults.push(stockResult);

        // Check for stock changes
        const cacheKey = `${stockResult.retailer}:${stockResult.productId}`;
        const previous = stockCache.get(cacheKey);

        if (previous && previous.status !== stockResult.status) {
          changes.push({
            productId: stockResult.productId,
            productName: stockResult.productName,
            retailer: stockResult.retailer,
            previousStatus: previous.status,
            newStatus: stockResult.status,
            price: stockResult.price,
            url: stockResult.url,
          });

          console.log(
            `[StockMonitor] CHANGE: ${stockResult.productName} @ ${stockResult.retailer}: ${previous.status} → ${stockResult.status}`
          );
        }

        // Update cache
        stockCache.set(cacheKey, stockResult);
      }
    }
  }

  const duration = Date.now() - start;

  console.log(
    `[StockMonitor] Checked ${allResults.length} listings in ${duration}ms. ${changes.length} changes detected.`
  );

  return {
    results: allResults,
    changes,
    checkedAt: new Date().toISOString(),
    duration,
  };
}

export function getStockCache(): Map<string, StockCheckResult> {
  return stockCache;
}
