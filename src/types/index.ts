export type Retailer = "walmart" | "pokemoncenter" | "ebgames" | "bestbuy" | "toysrus" | "fourohone";

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
  postalCode: string;
  status: StockStatus;
  note: string;
  reportedAt: string;
  upvotes: number;
}

export interface AlertPreference {
  id: string;
  productId: string;
  retailers: Retailer[];
  postalCode: string;
  radius: number;
  enabled: boolean;
  channels: AlertChannel[];
}

export type AlertChannel = "push" | "sms" | "discord";

export const RETAILER_INFO: Record<Retailer, { name: string; color: string; icon: string }> = {
  walmart: { name: "Walmart Canada", color: "#0071CE", icon: "🏪" },
  pokemoncenter: { name: "Pokemon Center", color: "#FFCB05", icon: "⚡" },
  ebgames: { name: "EB Games", color: "#FF0000", icon: "🎮" },
  bestbuy: { name: "Best Buy Canada", color: "#0046BE", icon: "🏷️" },
  toysrus: { name: "Toys R Us Canada", color: "#00529B", icon: "🧸" },
  fourohone: { name: "401 Games", color: "#8B5CF6", icon: "🃏" },
};

export const STATUS_INFO: Record<StockStatus, { label: string; color: string }> = {
  in_stock: { label: "In Stock", color: "#22c55e" },
  out_of_stock: { label: "Out of Stock", color: "#ef4444" },
  preorder: { label: "Pre-Order", color: "#f59e0b" },
  unknown: { label: "Unknown", color: "#6b7280" },
};

// GTA area postal code prefixes
export const GTA_POSTAL_PREFIXES = [
  "M1", "M2", "M3", "M4", "M5", "M6", "M7", "M8", "M9",  // Toronto
  "L4T", "L4W", "L4X", "L4Y", "L4Z", "L5A", "L5B", "L5C", "L5E", "L5G", "L5H", "L5J", "L5K", "L5L", "L5M", "L5N", "L5P", "L5R", "L5S", "L5T", "L5V", "L5W",  // Mississauga
  "L6P", "L6R", "L6S", "L6T", "L6V", "L6W", "L6X", "L6Y", "L6Z", "L7A",  // Brampton
  "L3P", "L3R", "L3S", "L3T", "L6B", "L6C", "L6E", "L6G",  // Markham
  "L4H", "L4J", "L4K", "L4L", "L6A",  // Vaughan
  "L4B", "L4C", "L4E", "L4S",  // Richmond Hill
  "L1S", "L1T", "L1V", "L1W", "L1Z",  // Pickering / Ajax
  "L1G", "L1H", "L1J", "L1K",  // Oshawa / Whitby
];
