-- Run in Supabase SQL editor.
-- Tables for paywall: customers (1:1 user <-> stripe customer) and subscriptions.

create table if not exists public.customers (
  user_id uuid primary key references auth.users(id) on delete cascade,
  stripe_customer_id text unique not null,
  created_at timestamptz default now()
);

create table if not exists public.subscriptions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  stripe_subscription_id text unique not null,
  stripe_customer_id text not null,
  status text not null,
  plan text,
  current_period_end timestamptz,
  cancel_at_period_end boolean default false,
  updated_at timestamptz default now()
);

alter table public.customers enable row level security;
alter table public.subscriptions enable row level security;

-- Users can read their own subscription row. Webhook uses service role and bypasses RLS.
create policy "self read customers" on public.customers
  for select using (auth.uid() = user_id);

create policy "self read subscriptions" on public.subscriptions
  for select using (auth.uid() = user_id);
