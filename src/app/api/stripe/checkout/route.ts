import { NextResponse } from "next/server";
import { stripe, APP_URL } from "@/lib/stripe";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { getPlan, type PlanId } from "@/lib/plans";

export async function POST(req: Request) {
  const { plan } = (await req.json()) as { plan: PlanId };
  const planMeta = getPlan(plan);
  if (!planMeta) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const priceId = process.env[planMeta.stripePriceIdEnv];
  if (!priceId) {
    return NextResponse.json(
      { error: `Missing env ${planMeta.stripePriceIdEnv}` },
      { status: 500 }
    );
  }

  const admin = await createServiceClient();
  const { data: existing } = await admin
    .from("customers")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .maybeSingle();

  let customerId = existing?.stripe_customer_id;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email!,
      metadata: { user_id: user.id },
    });
    customerId = customer.id;
    await admin
      .from("customers")
      .upsert({ user_id: user.id, stripe_customer_id: customerId });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    subscription_data: {
      trial_period_days: planMeta.trialDays,
      metadata: { user_id: user.id, plan: plan },
    },
    success_url: `${APP_URL}/gallery?subscribed=1`,
    cancel_url: `${APP_URL}/account?canceled=1`,
    allow_promotion_codes: true,
  });

  return NextResponse.json({ url: session.url });
}
