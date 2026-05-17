"use client";

import { useState } from "react";
import { MOCK_PRODUCTS } from "@/lib/mock-data";
import { ProductCard } from "@/components/product-card";

const CATEGORIES = ["All", "Elite Trainer Box", "Booster Box", "Collection Box"];

export default function ProductsPage() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = MOCK_PRODUCTS.filter((p) => {
    const matchesCategory = filter === "All" || p.category === filter;
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-4">
      <h2 className="font-bold text-lg">Products</h2>

      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full bg-bg-card border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent"
      />

      <div className="flex gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              filter === cat
                ? "bg-accent text-bg-primary"
                : "bg-bg-card text-text-secondary hover:text-text-primary border border-border"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length > 0 ? (
          filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className="bg-bg-card rounded-xl border border-border p-8 text-center">
            <p className="text-3xl mb-2">🔍</p>
            <p className="text-sm text-text-secondary">
              No products match your search
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
