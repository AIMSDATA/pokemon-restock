import { RetailerAdapter, StockCheckResult } from "./types";

// Walmart product IDs
const WALMART_PRODUCTS: Record<string, { itemId: string; name: string }> = {
  "prismatic-evolutions-etb": {
    itemId: "5089412345",
    name: "Prismatic Evolutions Elite Trainer Box",
  },
  "prismatic-evolutions-bbb": {
    itemId: "5089412346",
    name: "Prismatic Evolutions Binder Collection",
  },
  "surging-sparks-bb": {
    itemId: "5089412347",
    name: "Surging Sparks Booster Box",
  },
  "destined-rivals-etb": {
    itemId: "5089412348",
    name: "Destined Rivals Elite Trainer Box",
  },
  "journey-together-bb": {
    itemId: "5089412349",
    name: "Journey Together Booster Box",
  },
};

export class WalmartAdapter implements RetailerAdapter {
  retailer = "walmart" as const;

  async checkStock(productId: string): Promise<StockCheckResult> {
    const product = WALMART_PRODUCTS[productId];
    if (!product) {
      return this.fallbackResult(productId, productId);
    }

    try {
      const url = `https://www.walmart.com/ip/${product.itemId}`;
      const response = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
          Accept: "text/html",
        },
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) {
        console.log(`[Walmart] HTTP ${response.status} for ${product.name}`);
        return this.fallbackResult(productId, product.name);
      }

      const html = await response.text();

      // Check for stock indicators in the page
      const isInStock =
        html.includes('"availabilityStatus":"IN_STOCK"') ||
        html.includes('"availability":"InStock"') ||
        html.includes("Add to cart");

      const isOutOfStock =
        html.includes('"availabilityStatus":"OUT_OF_STOCK"') ||
        html.includes("Out of stock") ||
        html.includes("Currently unavailable");

      // Try to extract price
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
      console.error(`[Walmart] Error checking ${product.name}:`, error);
      return this.fallbackResult(productId, product.name);
    }
  }

  async checkAll(): Promise<StockCheckResult[]> {
    // Stagger requests to avoid rate limiting
    const results: StockCheckResult[] = [];
    for (const id of Object.keys(WALMART_PRODUCTS)) {
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
      url: "https://www.walmart.com",
      checkedAt: new Date().toISOString(),
    };
  }
}
