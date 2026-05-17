import { RetailerAdapter, StockCheckResult } from "./types";

// Pokemon Center product slugs
const PC_PRODUCTS: Record<string, { slug: string; name: string }> = {
  "prismatic-evolutions-etb": {
    slug: "pokemon-tcg-scarlet-violet-prismatic-evolutions-elite-trainer-box",
    name: "Prismatic Evolutions Elite Trainer Box",
  },
  "prismatic-evolutions-bbb": {
    slug: "pokemon-tcg-scarlet-violet-prismatic-evolutions-binder-collection",
    name: "Prismatic Evolutions Binder Collection",
  },
  "surging-sparks-bb": {
    slug: "pokemon-tcg-scarlet-violet-surging-sparks-booster-box",
    name: "Surging Sparks Booster Box",
  },
  "destined-rivals-etb": {
    slug: "pokemon-tcg-scarlet-violet-destined-rivals-elite-trainer-box",
    name: "Destined Rivals Elite Trainer Box",
  },
  "journey-together-bb": {
    slug: "pokemon-tcg-scarlet-violet-journey-together-booster-box",
    name: "Journey Together Booster Box",
  },
};

export class PokemonCenterAdapter implements RetailerAdapter {
  retailer = "pokemoncenter" as const;

  async checkStock(productId: string): Promise<StockCheckResult> {
    const product = PC_PRODUCTS[productId];
    if (!product) {
      return this.fallbackResult(productId, productId);
    }

    try {
      const url = `https://www.pokemoncenter.com/product/${product.slug}`;
      const response = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
          Accept: "text/html",
        },
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) {
        console.log(`[PokemonCenter] HTTP ${response.status} for ${product.name}`);
        return this.fallbackResult(productId, product.name);
      }

      const html = await response.text();

      const isInStock =
        html.includes('"availability":"InStock"') ||
        html.includes('"inStock":true') ||
        html.includes("Add to Cart");

      const isOutOfStock =
        html.includes("Out of Stock") ||
        html.includes('"availability":"OutOfStock"') ||
        html.includes('"inStock":false');

      const isPreorder =
        html.includes("Pre-Order") || html.includes("pre-order");

      // Extract price
      const priceMatch = html.match(/"price":\s*"?(\d+\.?\d*)"?/);
      const price = priceMatch ? parseFloat(priceMatch[1]) : null;

      let status: StockCheckResult["status"] = "unknown";
      if (isPreorder) status = "preorder";
      else if (isInStock && !isOutOfStock) status = "in_stock";
      else if (isOutOfStock) status = "out_of_stock";

      return {
        retailer: "pokemoncenter",
        productId,
        productName: product.name,
        status,
        price,
        url,
        checkedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error(`[PokemonCenter] Error checking ${product.name}:`, error);
      return this.fallbackResult(productId, product.name);
    }
  }

  async checkAll(): Promise<StockCheckResult[]> {
    const results: StockCheckResult[] = [];
    for (const id of Object.keys(PC_PRODUCTS)) {
      results.push(await this.checkStock(id));
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
    return results;
  }

  private fallbackResult(productId: string, name: string): StockCheckResult {
    return {
      retailer: "pokemoncenter",
      productId,
      productName: name,
      status: "unknown",
      price: null,
      url: "https://www.pokemoncenter.com",
      checkedAt: new Date().toISOString(),
    };
  }
}
