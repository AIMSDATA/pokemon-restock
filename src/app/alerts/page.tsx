"use client";

import { useState, useEffect } from "react";
import { MOCK_PRODUCTS } from "@/lib/mock-data";
import { RETAILER_INFO, Retailer } from "@/types";
import { requestNotificationPermission, registerServiceWorker } from "@/lib/utils";

export default function AlertsPage() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [postalCode, setPostalCode] = useState("");
  const [radius, setRadius] = useState("25");
  const [selectedRetailers, setSelectedRetailers] = useState<Retailer[]>([
    "walmart",
    "pokemoncenter",
    "bestbuy",
    "ebgames",
    "toysrus",
    "fourohone",
  ]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>(
    MOCK_PRODUCTS.map((p) => p.id)
  );

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setNotificationsEnabled(Notification.permission === "granted");
    }
  }, []);

  async function handleEnableNotifications() {
    registerServiceWorker();
    const granted = await requestNotificationPermission();
    setNotificationsEnabled(granted);
    if (granted) {
      new Notification("PokeRestock", {
        body: "Notifications enabled! We'll alert you on restocks.",
        icon: "/icons/icon-192.png",
      });
    }
  }

  function toggleRetailer(retailer: Retailer) {
    setSelectedRetailers((prev) =>
      prev.includes(retailer)
        ? prev.filter((r) => r !== retailer)
        : [...prev, retailer]
    );
  }

  function toggleProduct(id: string) {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="font-bold text-lg">Alert Settings</h2>

      <section className="bg-bg-card rounded-xl border border-border p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-sm">Push Notifications</h3>
            <p className="text-xs text-text-secondary mt-0.5">
              Get instant alerts when products restock
            </p>
          </div>
          {notificationsEnabled ? (
            <span className="text-xs text-success font-medium bg-success/10 px-3 py-1.5 rounded-full">
              Enabled
            </span>
          ) : (
            <button
              onClick={handleEnableNotifications}
              className="bg-accent text-bg-primary px-4 py-2 rounded-xl text-xs font-semibold hover:bg-accent-hover transition-colors"
            >
              Enable
            </button>
          )}
        </div>
      </section>

      <section className="bg-bg-card rounded-xl border border-border p-4 space-y-3">
        <h3 className="font-semibold text-sm">Location</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-text-secondary block mb-1">
              Postal Code
            </label>
            <input
              type="text"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              placeholder="M5V 1J2"
              maxLength={7}
              className="w-full bg-bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="text-xs text-text-secondary block mb-1">
              Radius
            </label>
            <select
              value={radius}
              onChange={(e) => setRadius(e.target.value)}
              className="w-full bg-bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent"
            >
              <option value="10">10 km</option>
              <option value="25">25 km</option>
              <option value="50">50 km</option>
              <option value="100">100 km</option>
            </select>
          </div>
        </div>
      </section>

      <section className="bg-bg-card rounded-xl border border-border p-4 space-y-3">
        <h3 className="font-semibold text-sm">Retailers</h3>
        <div className="space-y-2">
          {(Object.entries(RETAILER_INFO) as [Retailer, (typeof RETAILER_INFO)[Retailer]][]).map(
            ([key, info]) => (
              <label
                key={key}
                className="flex items-center justify-between py-1.5 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span>{info.icon}</span>
                  <span className="text-sm">{info.name}</span>
                </div>
                <input
                  type="checkbox"
                  checked={selectedRetailers.includes(key)}
                  onChange={() => toggleRetailer(key)}
                  className="w-4 h-4 accent-accent"
                />
              </label>
            )
          )}
        </div>
      </section>

      <section className="bg-bg-card rounded-xl border border-border p-4 space-y-3">
        <h3 className="font-semibold text-sm">Products to Track</h3>
        <div className="space-y-2">
          {MOCK_PRODUCTS.map((product) => (
            <label
              key={product.id}
              className="flex items-center justify-between py-1.5 cursor-pointer"
            >
              <div className="min-w-0 pr-3">
                <span className="text-sm truncate block">{product.name}</span>
                <span className="text-[10px] text-text-secondary">
                  {product.category}
                </span>
              </div>
              <input
                type="checkbox"
                checked={selectedProducts.includes(product.id)}
                onChange={() => toggleProduct(product.id)}
                className="w-4 h-4 accent-accent shrink-0"
              />
            </label>
          ))}
        </div>
      </section>

      <button className="w-full bg-accent text-bg-primary py-3 rounded-xl text-sm font-semibold hover:bg-accent-hover transition-colors">
        Save Preferences
      </button>
    </div>
  );
}
