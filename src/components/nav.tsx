"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: "📊" },
  { href: "/products", label: "Products", icon: "🃏" },
  { href: "/reports", label: "Reports", icon: "📍" },
  { href: "/alerts", label: "Alerts", icon: "🔔" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-bg-secondary border-t border-border z-50">
      <div className="max-w-lg mx-auto flex">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center py-3 text-xs transition-colors ${
                active
                  ? "text-accent"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <span className="text-xl mb-0.5">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function TopHeader() {
  return (
    <header className="sticky top-0 bg-bg-secondary/90 backdrop-blur-md border-b border-border z-40">
      <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">⚡</span>
          <h1 className="text-lg font-bold text-accent">PokeRestock</h1>
        </div>
        <span className="text-xs text-text-secondary bg-bg-card px-2 py-1 rounded-full">
          Live
          <span className="inline-block w-2 h-2 bg-success rounded-full ml-1 animate-pulse" />
        </span>
      </div>
    </header>
  );
}
