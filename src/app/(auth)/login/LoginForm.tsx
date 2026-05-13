"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/gallery";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push(next);
    router.refresh();
  };

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
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
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="********"
        />
      </div>
      {error && (
        <div className="text-sm text-rose-400 border border-rose-400/30 bg-rose-500/10 rounded-lg p-3">
          {error}
        </div>
      )}
      <button type="submit" disabled={loading} className="btn btn-primary w-full">
        {loading ? "Signing in..." : "Log in"}
      </button>
    </form>
  );
}
