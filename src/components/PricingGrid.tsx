"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PLANS, type PlanId } from "@/lib/plans";

export default function PricingGrid({ authed }: { authed: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState<PlanId | null>(null);

  const onPick = async (id: PlanId) => {
    if (!authed) {
      router.push(`/signup?plan=${id}`);
      return;
    }
    setLoading(id);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: id }),
      });
      const json = await res.json();
      if (json.url) window.location.href = json.url;
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="grid md:grid-cols-3 gap-5">
      {PLANS.map((p) => (
        <div
          key={p.id}
          className={`card p-7 relative ${p.highlight ? "glow-ring" : ""}`}
        >
          {p.highlight && (
            <div className="absolute -top-3 left-7 text-[11px] tracking-wide font-semibold px-2.5 py-1 rounded-full bg-accent text-white shadow-glow">
              MOST POPULAR
            </div>
          )}
          <div className="text-sm text-muted">{p.tagline}</div>
          <div className="text-2xl font-semibold mt-2">{p.name}</div>
          <div className="mt-4 flex items-baseline gap-1">
            <span className="text-4xl font-bold gradient-text">EUR{p.priceMonthly}</span>
            <span className="text-muted text-sm">/ month</span>
          </div>
          <div className="text-xs text-muted mt-1">
            {p.trialDays}-day free trial. Cancel anytime.
          </div>
          <ul className="mt-6 space-y-2.5 text-sm">
            {p.features.map((f) => (
              <li key={f} className="flex gap-2 items-start">
                <span className="text-accent mt-0.5">{"→"}</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <button
            onClick={() => onPick(p.id)}
            disabled={loading === p.id}
            className={`btn w-full mt-7 ${p.highlight ? "btn-primary" : "btn-secondary"}`}
          >
            {loading === p.id ? "Loading..." : authed ? "Start trial" : "Get started"}
          </button>
        </div>
      ))}
    </div>
  );
}
