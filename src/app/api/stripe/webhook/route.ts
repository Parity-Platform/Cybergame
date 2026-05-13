import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const RELEVANT = new Set([
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "customer.subscription.trial_will_end",
]);

async function upsertSubscription(sub: Stripe.Subscription) {
  const admin = await createServiceClient();
  const userId =
    (sub.metadata?.user_id as string | undefined) ??
    (await resolveUserFromCustomer(sub.customer as string));
  if (!userId) return;

  await admin.from("subscriptions").upsert({
    user_id: userId,
    stripe_subscription_id: sub.id,
    stripe_customer_id: sub.customer as string,
    status: sub.status,
    plan: (sub.metadata?.plan as string | undefined) ?? null,
    current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
    cancel_at_period_end: sub.cancel_at_period_end,
  });
}

async function resolveUserFromCustomer(customerId: string) {
  const admin = await createServiceClient();
  const { data } = await admin
    .from("customers")
    .select("user_id")
    .eq("stripe_customer_id", customerId)
    .maybeSingle();
  return data?.user_id as string | undefined;
}

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !secret) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const body = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (err) {
    return NextResponse.json(
      { error: `Bad signature: ${(err as Error).message}` },
      { status: 400 }
    );
  }

  if (!RELEVANT.has(event.type)) return NextResponse.json({ ok: true });

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.subscription) {
          const sub = await stripe.subscriptions.retrieve(
            session.subscription as string
          );
          await upsertSubscription(sub);
        }
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        await upsertSubscription(event.data.object as Stripe.Subscription);
        break;
      }
    }
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
