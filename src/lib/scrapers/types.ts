import { Retailer, StockStatus } from "@/types";

export interface StockCheckResult {
  retailer: Retailer;
  productId: string;
  productName: string;
  status: StockStatus;
  price: number | null;
  url: string;
  checkedAt: string;
}

export interface RetailerAdapter {
  retailer: Retailer;
  checkStock(productId: string): Promise<StockCheckResult>;
  checkAll(): Promise<StockCheckResult[]>;
}
