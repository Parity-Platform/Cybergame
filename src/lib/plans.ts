export type PlanId = "starter" | "pro" | "team";

export interface Plan {
  id: PlanId;
  name: string;
  tagline: string;
  priceMonthly: number;
  currency: string;
  trialDays: number;
  features: string[];
  highlight?: boolean;
  stripePriceIdEnv: string;
}

export const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    tagline: "For curious learners",
    priceMonthly: 6,
    currency: "EUR",
    trialDays: 7,
    features: [
      "Access to Vulnhunt",
      "Standard difficulty pool",
      "Personal progress tracking",
    ],
    stripePriceIdEnv: "STRIPE_PRICE_STARTER",
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "For aspiring AppSec engineers",
    priceMonthly: 14,
    currency: "EUR",
    trialDays: 7,
    highlight: true,
    features: [
      "Everything in Starter",
      "All games + future releases",
      "Hard / Critical question pools",
      "Streak boosters & leaderboards",
    ],
    stripePriceIdEnv: "STRIPE_PRICE_PRO",
  },
  {
    id: "team",
    name: "Team",
    tagline: "For squads of 5+",
    priceMonthly: 49,
    currency: "EUR",
    trialDays: 14,
    features: [
      "Everything in Pro",
      "Team workspace",
      "Shared dashboards",
      "Priority support",
    ],
    stripePriceIdEnv: "STRIPE_PRICE_TEAM",
  },
];

export const getPlan = (id: PlanId) => PLANS.find((p) => p.id === id);
