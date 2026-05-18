import { RetailerAdapter, StockCheckResult } from "./types";

// 401 Games product slugs (Toronto LGS)
const FOUROHONE_PRODUCTS: Record<string, { slug: string; name: string }> = {
  "prismatic-evolutions-etb": {
    slug: "pokemon-sv-prismatic-evolutions-elite-trainer-box",
    name: "Prismatic Evolutions Elite Trainer Box",
  },
  "prismatic-evolutions-bbb": {
    slug: "pokemon-sv-prismatic-evolutions-binder-collection",
    name: "Prismatic Evolutions Binder Collection",
  },
  "surging-sparks-bb": {
    slug: "pokemon-sv-surging-sparks-booster-box",
    name: "Surging Sparks Booster Box",
  },
  "destined-rivals-etb": {
    slug: "pokemon-sv-destined-rivals-elite-trainer-box",
    name: "Destined Rivals Elite Trainer Box",
  },
  "journey-together-bb": {
    slug: "pokemon-sv-journey-together-booster-box",
    name: "Journey Together Booster Box",
  },
};

export class FourOhOneAdapter implements RetailerAdapter {
  retailer = "fourohone" as const;

  async checkStock(productId: string): Promise<StockCheckResult> {
    const product = FOUROHONE_PRODUCTS[productId];
    if (!product) {
      return this.fallbackResult(productId, productId);
    }

    try {
      const url = `https://store.401games.ca/products/${product.slug}`;
      const response = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
          Accept: "text/html",
        },
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) {
        console.log(`[401 Games] HTTP ${response.status} for ${product.name}`);
        return this.fallbackResult(productId, product.name);
      }

      const html = await response.text();

      // 401 Games runs on Shopify
      const isInStock =
        html.includes('"available":true') ||
        html.includes("Add to cart") ||
        html.includes("Add to Cart");

      const isOutOfStock =
        html.includes('"available":false') ||
        html.includes("Sold out") ||
        html.includes("sold out");

      const isPreorder =
        html.includes("Pre-order") || html.includes("pre-order");

      // Shopify price format
      const priceMatch = html.match(/"price":\s*(\d+)/);
      const price = priceMatch ? parseFloat(priceMatch[1]) / 100 : null;

      let status: StockCheckResult["status"] = "unknown";
      if (isPreorder) status = "preorder";
      else if (isInStock && !isOutOfStock) status = "in_stock";
      else if (isOutOfStock) status = "out_of_stock";

      return {
        retailer: "fourohone",
        productId,
        productName: product.name,
        status,
        price,
        url,
        checkedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error(`[401 Games] Error checking ${product.name}:`, error);
      return this.fallbackResult(productId, product.name);
    }
  }

  async checkAll(): Promise<StockCheckResult[]> {
    const results: StockCheckResult[] = [];
    for (const id of Object.keys(FOUROHONE_PRODUCTS)) {
      results.push(await this.checkStock(id));
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    return results;
  }

  private fallbackResult(productId: string, name: string): StockCheckResult {
    return {
      retailer: "fourohone",
      productId,
      productName: name,
      status: "unknown",
      price: null,
      url: "https://store.401games.ca",
      checkedAt: new Date().toISOString(),
    };
  }
}
