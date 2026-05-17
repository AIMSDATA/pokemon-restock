import { MOCK_PRODUCTS, MOCK_REPORTS } from "@/lib/mock-data";
import { ProductCard } from "@/components/product-card";
import { ReportCard } from "@/components/report-card";
import Link from "next/link";

export default function Dashboard() {
  const hotProducts = MOCK_PRODUCTS.filter((p) =>
    p.retailers.some((r) => r.status === "in_stock")
  );

  const recentReports = MOCK_REPORTS.slice(0, 3);

  const totalInStock = MOCK_PRODUCTS.reduce(
    (acc, p) => acc + p.retailers.filter((r) => r.status === "in_stock").length,
    0
  );
  const totalTracked = MOCK_PRODUCTS.reduce(
    (acc, p) => acc + p.retailers.length,
    0
  );

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-3 gap-3">
        <StatCard label="Products" value={MOCK_PRODUCTS.length} icon="🃏" />
        <StatCard
          label="In Stock"
          value={totalInStock}
          icon="✅"
          highlight
        />
        <StatCard label="Tracked" value={totalTracked} icon="📡" />
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-sm text-text-primary">
            🔥 In Stock Now
          </h2>
          <Link
            href="/products"
            className="text-xs text-accent hover:text-accent-hover"
          >
            View all →
          </Link>
        </div>
        <div className="space-y-3">
          {hotProducts.length > 0 ? (
            hotProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <EmptyState message="Nothing in stock right now. We'll notify you when something drops!" />
          )}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-sm text-text-primary">
            📍 Recent Sightings
          </h2>
          <Link
            href="/reports"
            className="text-xs text-accent hover:text-accent-hover"
          >
            View all →
          </Link>
        </div>
        <div className="space-y-3">
          {recentReports.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  highlight,
}: {
  label: string;
  value: number;
  icon: string;
  highlight?: boolean;
}) {
  return (
    <div className="bg-bg-card rounded-xl border border-border p-3 text-center">
      <span className="text-xl">{icon}</span>
      <p
        className={`text-2xl font-bold mt-1 ${highlight ? "text-success" : "text-text-primary"}`}
      >
        {value}
      </p>
      <p className="text-[10px] text-text-secondary mt-0.5">{label}</p>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="bg-bg-card rounded-xl border border-border p-8 text-center">
      <p className="text-3xl mb-2">😴</p>
      <p className="text-sm text-text-secondary">{message}</p>
    </div>
  );
}
