import { NextResponse } from "next/server";
import { stripe, APP_URL } from "@/lib/stripe";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const admin = await createServiceClient();
  const { data: row } = await admin
    .from("customers")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!row?.stripe_customer_id) {
    return NextResponse.json({ error: "No customer" }, { status: 404 });
  }

  const portal = await stripe.billingPortal.sessions.create({
    customer: row.stripe_customer_id,
    return_url: `${APP_URL}/account`,
  });

  return NextResponse.json({ url: portal.url });
}
