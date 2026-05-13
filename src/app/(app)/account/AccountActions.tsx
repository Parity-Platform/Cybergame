"use client";

import { useState } from "react";

export default function AccountActions({ hasSubscription }: { hasSubscription: boolean }) {
  const [loading, setLoading] = useState(false);

  const openPortal = async () => {
    setLoading(true);
    const res = await fetch("/api/stripe/portal", { method: "POST" });
    const json = await res.json();
    if (json.url) window.location.href = json.url;
    setLoading(false);
  };

  if (!hasSubscription) return null;

  return (
    <button onClick={openPortal} disabled={loading} className="btn btn-secondary">
      {loading ? "Loading..." : "Manage billing"}
    </button>
  );
}
