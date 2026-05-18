import { RetailerAdapter, StockCheckResult } from "./types";

// Walmart Canada product IDs
const WALMART_CA_PRODUCTS: Record<string, { sku: string; name: string }> = {
  "prismatic-evolutions-etb": {
    sku: "6000217234567",
    name: "Prismatic Evolutions Elite Trainer Box",
  },
  "prismatic-evolutions-bbb": {
    sku: "6000217234568",
    name: "Prismatic Evolutions Binder Collection",
  },
  "surging-sparks-bb": {
    sku: "6000217234569",
    name: "Surging Sparks Booster Box",
  },
  "destined-rivals-etb": {
    sku: "6000217234570",
    name: "Destined Rivals Elite Trainer Box",
  },
  "journey-together-bb": {
    sku: "6000217234571",
    name: "Journey Together Booster Box",
  },
};

export class WalmartCanadaAdapter implements RetailerAdapter {
  retailer = "walmart" as const;

  async checkStock(productId: string): Promise<StockCheckResult> {
    const product = WALMART_CA_PRODUCTS[productId];
    if (!product) {
      return this.fallbackResult(productId, productId);
    }

    try {
      const url = `https://www.walmart.ca/ip/${product.sku}`;
      const response = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
          Accept: "text/html",
        },
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) {
        console.log(`[Walmart CA] HTTP ${response.status} for ${product.name}`);
        return this.fallbackResult(productId, product.name);
      }

      const html = await response.text();

      const isInStock =
        html.includes('"availabilityStatus":"IN_STOCK"') ||
        html.includes('"availability":"InStock"') ||
        html.includes("Add to cart") ||
        html.includes("Add to Cart");

      const isOutOfStock =
        html.includes('"availabilityStatus":"OUT_OF_STOCK"') ||
        html.includes("Out of stock") ||
        html.includes("Currently unavailable") ||
        html.includes("not available");

      const priceMatch = html.match(/"currentPrice":\s*(\d+\.?\d*)/);
      const price = priceMatch ? parseFloat(priceMatch[1]) : null;

      let status: StockCheckResult["status"] = "unknown";
      if (isInStock && !isOutOfStock) status = "in_stock";
      else if (isOutOfStock) status = "out_of_stock";

      return {
        retailer: "walmart",
        productId,
        productName: product.name,
        status,
        price,
        url,
        checkedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error(`[Walmart CA] Error checking ${product.name}:`, error);
      return this.fallbackResult(productId, product.name);
    }
  }

  async checkAll(): Promise<StockCheckResult[]> {
    const results: StockCheckResult[] = [];
    for (const id of Object.keys(WALMART_CA_PRODUCTS)) {
      results.push(await this.checkStock(id));
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    return results;
  }

  private fallbackResult(productId: string, name: string): StockCheckResult {
    return {
      retailer: "walmart",
      productId,
      productName: name,
      status: "unknown",
      price: null,
      url: "https://www.walmart.ca",
      checkedAt: new Date().toISOString(),
    };
  }
}
