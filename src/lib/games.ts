export interface GameTile {
  slug: string;
  title: string;
  tagline: string;
  category: string;
  cover: string;
  status: "live" | "soon";
  minPlan?: "starter" | "pro" | "team";
  accent: string;
  icon: string;
}

export const GAMES: GameTile[] = [
  {
    slug: "vulnhunt",
    title: "Vulnhunt",
    tagline: "Spot the vulnerability. Beat the clock.",
    category: "AppSec",
    cover: "/covers/vulnhunt.svg",
    status: "live",
    minPlan: "starter",
    accent: "#7c5cff",
    icon: "</>",
  },
  {
    slug: "phishnet",
    title: "Phishnet",
    tagline: "Sort phish from real. Train your inbox.",
    category: "Awareness",
    cover: "/covers/phishnet.svg",
    status: "soon",
    minPlan: "starter",
    accent: "#22d3ee",
    icon: "@",
  },
  {
    slug: "redteam-rooms",
    title: "Redteam Rooms",
    tagline: "Multi-stage scenarios. Pwn the network.",
    category: "Offensive",
    cover: "/covers/redteam.svg",
    status: "soon",
    minPlan: "pro",
    accent: "#fb7185",
    icon: ">_",
  },
  {
    slug: "sock-shift",
    title: "SOC Shift",
    tagline: "Triage alerts. Beat the SLA.",
    category: "Blue Team",
    cover: "/covers/socshift.svg",
    status: "soon",
    minPlan: "pro",
    accent: "#34d399",
    icon: "!",
  },
];

export const getGame = (slug: string) => GAMES.find((g) => g.slug === slug);
