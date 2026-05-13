import Link from "next/link";
import PricingGrid from "@/components/PricingGrid";
import AccountActions from "./AccountActions";
import { createClient, safeGetUser } from "@/lib/supabase/server";
import { PLANS } from "@/lib/plans";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const supabase = await createClient();
  const user = await safeGetUser(supabase);

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-6 py-16 text-center">
        <p className="text-muted">Not signed in.</p>
        <Link href="/login" className="btn btn-primary mt-4 inline-flex">Log in</Link>
      </div>
    );
  }

  let sub = null;
  try {
    const { data } = await supabase
      .from("subscriptions")
      .select("status, plan, current_period_end, cancel_at_period_end")
      .eq("user_id", user.id)
      .maybeSingle();
    sub = data;
  } catch {
    // no subscription table yet (Supabase not configured)
  }

  const planMeta = sub ? PLANS.find((p) => p.id === sub.plan) : undefined;

  return (
    <div className="max-w-4xl mx-auto px-6 py-14 space-y-10">
      <div>
        <div className="section-tag mb-2">Account</div>
        <h1 className="text-3xl font-semibold tracking-tight mt-1">
          {user.email}
        </h1>
      </div>

      <section className="card p-7">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="text-sm text-muted">Subscription</div>
            <div className="text-xl font-semibold mt-1">
              {planMeta ? planMeta.name : "No active plan"}
            </div>
            {sub && (
              <div className="text-sm text-muted mt-1">
                Status:{" "}
                <span className={
                  sub.status === "active" || sub.status === "trialing"
                    ? "text-emerald-400"
                    : "text-amber-400"
                }>
                  {sub.status}
                </span>
                {sub.current_period_end && (
                  <>
                    {" - "}
                    {sub.cancel_at_period_end ? "ends " : "renews "}
                    {new Date(sub.current_period_end).toLocaleDateString()}
                  </>
                )}
              </div>
            )}
          </div>
          <AccountActions hasSubscription={!!sub} />
        </div>
      </section>

      {!sub && (
        <section>
          <div className="section-tag mb-2">Choose a plan</div>
          <h2 className="text-2xl font-semibold tracking-tight mt-1 mb-6">
            Unlock the gallery
          </h2>
          <PricingGrid authed />
        </section>
      )}

      <section className="card p-7">
        <div className="text-sm text-muted">Sign out of this device</div>
        <form action="/api/auth/signout" method="post" className="mt-3">
          <button className="btn btn-secondary">Log out</button>
        </form>
      </section>
    </div>
  );
}
