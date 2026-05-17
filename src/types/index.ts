export type Retailer = "target" | "walmart" | "pokemoncenter" | "gamestop" | "bestbuy";

export type StockStatus = "in_stock" | "out_of_stock" | "preorder" | "unknown";

export interface Product {
  id: string;
  name: string;
  image: string;
  category: string;
  retailers: RetailerListing[];
}

export interface RetailerListing {
  retailer: Retailer;
  url: string;
  price: number | null;
  status: StockStatus;
  lastChecked: string;
  lastInStock: string | null;
}

export interface CommunityReport {
  id: string;
  productName: string;
  retailer: Retailer | string;
  location: string;
  zipCode: string;
  status: StockStatus;
  note: string;
  reportedAt: string;
  upvotes: number;
}

export interface AlertPreference {
  id: string;
  productId: string;
  retailers: Retailer[];
  zipCode: string;
  radius: number;
  enabled: boolean;
  channels: AlertChannel[];
}

export type AlertChannel = "push" | "sms" | "discord";

export const RETAILER_INFO: Record<Retailer, { name: string; color: string; icon: string }> = {
  target: { name: "Target", color: "#CC0000", icon: "🎯" },
  walmart: { name: "Walmart", color: "#0071CE", icon: "🏪" },
  pokemoncenter: { name: "Pokemon Center", color: "#FFCB05", icon: "⚡" },
  gamestop: { name: "GameStop", color: "#FF0000", icon: "🎮" },
  bestbuy: { name: "Best Buy", color: "#0046BE", icon: "🏷️" },
};

export const STATUS_INFO: Record<StockStatus, { label: string; color: string }> = {
  in_stock: { label: "In Stock", color: "#22c55e" },
  out_of_stock: { label: "Out of Stock", color: "#ef4444" },
  preorder: { label: "Pre-Order", color: "#f59e0b" },
  unknown: { label: "Unknown", color: "#6b7280" },
};
