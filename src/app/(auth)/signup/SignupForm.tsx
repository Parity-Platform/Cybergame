"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PLANS, type PlanId } from "@/lib/plans";

export default function SignupForm() {
  const router = useRouter();
  const params = useSearchParams();
  const initialPlan = (params.get("plan") as PlanId) || "pro";
  const [plan, setPlan] = useState<PlanId>(initialPlan);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { selected_plan: plan } },
    });
    if (error) {
      setLoading(false);
      setError(error.message);
      return;
    }

    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    const json = await res.json();
    setLoading(false);
    if (json.url) {
      window.location.href = json.url;
    } else {
      router.push("/account");
    }
  };

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      <div>
        <label className="label">Plan</label>
        <div className="grid grid-cols-3 gap-2">
          {PLANS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPlan(p.id)}
              className={`text-left rounded-lg border p-3 transition ${
                plan === p.id
                  ? "border-accent bg-accent/10"
                  : "border-line bg-white/[0.02] hover:border-white/20"
              }`}
            >
              <div className="text-xs text-muted">{p.name}</div>
              <div className="text-sm font-semibold mt-1">EUR{p.priceMonthly}</div>
              <div className="text-[11px] text-muted">/ month</div>
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="label">Email</label>
        <input
          type="email"
          required
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
        />
      </div>
      <div>
        <label className="label">Password</label>
        <input
          type="password"
          required
          minLength={8}
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 8 characters"
        />
      </div>
      {error && (
        <div className="text-sm text-rose-400 border border-rose-400/30 bg-rose-500/10 rounded-lg p-3">
          {error}
        </div>
      )}
      <button type="submit" disabled={loading} className="btn btn-primary w-full">
        {loading ? "Creating account..." : "Start free trial"}
      </button>
      <p className="text-[11px] text-muted text-center">
        You will not be charged today. Cancel anytime.
      </p>
    </form>
  );
}
