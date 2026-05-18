"use client";

import { useState } from "react";
import { MOCK_REPORTS } from "@/lib/mock-data";
import { ReportCard } from "@/components/report-card";
import { RETAILER_INFO, Retailer } from "@/types";

export default function ReportsPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-lg">Community Reports</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-accent text-bg-primary px-4 py-2 rounded-xl text-xs font-semibold hover:bg-accent-hover transition-colors"
        >
          {showForm ? "Cancel" : "+ Report"}
        </button>
      </div>

      {showForm && <ReportForm onClose={() => setShowForm(false)} />}

      <div className="space-y-3">
        {MOCK_REPORTS.map((report) => (
          <ReportCard key={report.id} report={report} />
        ))}
      </div>
    </div>
  );
}

function ReportForm({ onClose }: { onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="bg-bg-card rounded-xl border border-success/30 p-4 text-center">
        <p className="text-2xl mb-2">✅</p>
        <p className="text-sm text-success font-medium">Report submitted!</p>
        <p className="text-xs text-text-secondary mt-1">
          Thanks for helping the community.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(onClose, 2000);
      }}
      className="bg-bg-card rounded-xl border border-border p-4 space-y-3"
    >
      <div>
        <label className="text-xs text-text-secondary block mb-1">
          Product Name
        </label>
        <input
          type="text"
          required
          placeholder="e.g. Prismatic Evolutions ETB"
          className="w-full bg-bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-text-secondary block mb-1">
            Retailer
          </label>
          <select className="w-full bg-bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent">
            {Object.entries(RETAILER_INFO).map(([key, info]) => (
              <option key={key} value={key}>
                {info.icon} {info.name}
              </option>
            ))}
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-text-secondary block mb-1">
            Postal Code
          </label>
          <input
            type="text"
            required
            placeholder="L5B 1H7"
            maxLength={7}
            className="w-full bg-bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent"
          />
        </div>
      </div>

      <div>
        <label className="text-xs text-text-secondary block mb-1">
          Store Location
        </label>
        <input
          type="text"
          required
          placeholder="e.g. Walmart - Square One, Mississauga"
          className="w-full bg-bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent"
        />
      </div>

      <div>
        <label className="text-xs text-text-secondary block mb-1">
          Notes (optional)
        </label>
        <textarea
          placeholder="How many did you see? Where in the store?"
          rows={2}
          className="w-full bg-bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent resize-none"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-accent text-bg-primary py-2.5 rounded-xl text-sm font-semibold hover:bg-accent-hover transition-colors"
      >
        Submit Report
      </button>
    </form>
  );
}
