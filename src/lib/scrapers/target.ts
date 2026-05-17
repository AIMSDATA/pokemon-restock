import { RetailerAdapter, StockCheckResult } from "./types";

// Target product IDs (TCIN)
const TARGET_PRODUCTS: Record<string, { tcin: string; name: string; dpci: string }> = {
  "prismatic-evolutions-etb": {
    tcin: "91635157",
    name: "Prismatic Evolutions Elite Trainer Box",
    dpci: "087-00-0001",
  },
  "prismatic-evolutions-bbb": {
    tcin: "91635158",
    name: "Prismatic Evolutions Binder Collection",
    dpci: "087-00-0002",
  },
  "surging-sparks-bb": {
    tcin: "91234567",
    name: "Surging Sparks Booster Box",
    dpci: "087-00-0003",
  },
  "destined-rivals-etb": {
    tcin: "91345678",
    name: "Destined Rivals Elite Trainer Box",
    dpci: "087-00-0004",
  },
  "journey-together-bb": {
    tcin: "91456789",
    name: "Journey Together Booster Box",
    dpci: "087-00-0005",
  },
};

export class TargetAdapter implements RetailerAdapter {
  retailer = "target" as const;

  private baseUrl = "https://redsky.target.com/redsky_aggregations/v1/web/pdp_fulfillment_v1";

  private buildUrl(tcin: string, zipCode: string = "90210"): string {
    const params = new URLSearchParams({
      key: "9f36aeafbe60771e321a7cc95a78140772ab3e96",
      tcin,
      store_id: "1234",
      zip: zipCode,
      state: "CA",
      latitude: "34.0522",
      longitude: "-118.2437",
      scheduled_delivery_store_id: "1234",
      pricing_store_id: "1234",
    });
    return `${this.baseUrl}?${params.toString()}`;
  }

  async checkStock(productId: string): Promise<StockCheckResult> {
    const product = TARGET_PRODUCTS[productId];
    if (!product) {
      return {
        retailer: "target",
        productId,
        productName: productId,
        status: "unknown",
        price: null,
        url: "https://www.target.com",
        checkedAt: new Date().toISOString(),
      };
    }

    try {
      const url = this.buildUrl(product.tcin);
      const response = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
          Accept: "application/json",
        },
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) {
        console.log(`[Target] HTTP ${response.status} for ${product.name}`);
        return this.fallbackResult(productId, product.name);
      }

      const data = await response.json();
      const fulfillment = data?.data?.product?.fulfillment;

      const isShippingAvailable =
        fulfillment?.shipping_options?.availability_status === "IN_STOCK";
      const isPickupAvailable =
        fulfillment?.store_options?.[0]?.order_pickup?.availability_status ===
        "IN_STOCK";

      const status =
        isShippingAvailable || isPickupAvailable ? "in_stock" : "out_of_stock";

      const price =
        data?.data?.product?.price?.formatted_current_price_default_message;
      const parsedPrice = price ? parseFloat(price.replace("$", "")) : null;

      return {
        retailer: "target",
        productId,
        productName: product.name,
        status,
        price: parsedPrice,
        url: `https://www.target.com/p/-/A-${product.tcin}`,
        checkedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error(`[Target] Error checking ${product.name}:`, error);
      return this.fallbackResult(productId, product.name);
    }
  }

  async checkAll(): Promise<StockCheckResult[]> {
    const results = await Promise.allSettled(
      Object.keys(TARGET_PRODUCTS).map((id) => this.checkStock(id))
    );

    return results
      .filter((r): r is PromiseFulfilledResult<StockCheckResult> => r.status === "fulfilled")
      .map((r) => r.value);
  }

  private fallbackResult(productId: string, name: string): StockCheckResult {
    return {
      retailer: "target",
      productId,
      productName: name,
      status: "unknown",
      price: null,
      url: "https://www.target.com",
      checkedAt: new Date().toISOString(),
    };
  }
}
