// src/components/Visuals.tsx
// src/components/Visuals.tsx
import type { Rank } from '../types';

export const RANKS: Rank[] = [
  { min: 0, max: 24, title: "Script Kiddie", color: "#64748B", bg: "#F8FAFC", emoji: "👾", desc: "Keep learning. Every expert was once a beginner." },
  { min: 25, max: 49, title: "Junior Dev", color: "#0EA5E9", bg: "#F0F9FF", emoji: "🧑‍💻", desc: "You know the basics. Time to dig deeper." },
  { min: 50, max: 74, title: "Security Aware", color: "#10B981", bg: "#ECFDF5", emoji: "🔍", desc: "Solid understanding of common vulnerabilities." },
  { min: 75, max: 89, title: "AppSec Engineer", color: "#F59E0B", bg: "#FFFBEB", emoji: "🛡️", desc: "You think like an attacker. That's the mindset." },
  { min: 90, max: 99, title: "Security Champion", color: "#F97316", bg: "#FFF7ED", emoji: "🔥", desc: "Outstanding. You catch bugs before they ship." },
  { min: 100, max: 100, title: "Elite Hacker", color: "#8B5CF6", bg: "#F5F3FF", emoji: "💀", desc: "Perfect score. You are the vulnerability." },
];

export function getRank(pct: number): Rank {
  return RANKS.find((r) => pct >= r.min && pct <= r.max) || RANKS[0];
}

interface AvatarProps {
  rank: Rank;
  score: number;
}

export function Avatar({ rank }: AvatarProps) {
  const expressions: Record<string, any> = {
    "Script Kiddie": { eyeY: 52, mouthD: "M 38 62 Q 45 58 52 62", color1: "#94A3B8", color2: "#CBD5E1" },
    "Junior Dev": { eyeY: 50, mouthD: "M 38 62 Q 45 64 52 62", color1: "#38BDF8", color2: "#7DD3FC" },
    "Security Aware": { eyeY: 49, mouthD: "M 36 61 Q 45 67 54 61", color1: "#34D399", color2: "#6EE7B7" },
    "AppSec Engineer": { eyeY: 48, mouthD: "M 35 60 Q 45 70 55 60", color1: "#FBBF24", color2: "#FCD34D" },
    "Security Champion": { eyeY: 47, mouthD: "M 34 59 Q 45 72 56 59", color1: "#FB923C", color2: "#FDBA74" },
    "Elite Hacker": { eyeY: 46, mouthD: "M 33 58 Q 45 73 57 58", color1: "#A78BFA", color2: "#C4B5FD" },
  };
  const expr = expressions[rank.title] || expressions["Junior Dev"];

  return (
    <svg viewBox="0 0 90 110" width="160" height="180" style={{ filter: `drop-shadow(0 4px 6px rgba(0,0,0,0.05))` }}>
      <ellipse cx="45" cy="108" rx="28" ry="6" fill="#E2E8F0" opacity="0.8" />
      <rect x="22" y="72" width="46" height="32" rx="10" fill={expr.color1} />
      <text x="45" y="93" textAnchor="middle" fontSize="7" fill="#0F172A" fontFamily="var(--font-mono)" opacity="0.8" fontWeight="bold">&lt;/sec&gt;</text>
      <rect x="38" y="67" width="14" height="10" fill="#EAD4AA" />
      <ellipse cx="45" cy="48" rx="26" ry="28" fill="#FDE68A" />
      {rank.title === "Elite Hacker" ? (
        <><ellipse cx="45" cy="22" rx="27" ry="10" fill="#1E293B" /><rect x="18" y="22" width="54" height="10" fill="#1E293B" /></>
      ) : (<ellipse cx="45" cy="23" rx="26" ry="9" fill={expr.color2} />)}
      <ellipse cx="19" cy="48" rx="5" ry="7" fill="#FDE68A" />
      <ellipse cx="71" cy="48" rx="5" ry="7" fill="#FDE68A" />
      <ellipse cx="36" cy={expr.eyeY} rx="5" ry="5.5" fill="white" />
      <ellipse cx="54" cy={expr.eyeY} rx="5" ry="5.5" fill="white" />
      <circle cx="37" cy={expr.eyeY + 1} r="3" fill="#0F172A" />
      <circle cx="55" cy={expr.eyeY + 1} r="3" fill="#0F172A" />
      <circle cx="38" cy={expr.eyeY - 1} r="1" fill="white" />
      <circle cx="56" cy={expr.eyeY - 1} r="1" fill="white" />
      <path d="M 31 44 Q 36 41 41 44" stroke="#B45309" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M 49 44 Q 54 41 59 44" stroke="#B45309" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d={expr.mouthD} stroke="#991B1B" strokeWidth="2" fill="none" strokeLinecap="round" />
      {rank.title === "Elite Hacker" && (<path d="M 24 48 Q 45 42 66 48 Q 66 50 63 50 L 50 49 L 40 49 L 27 50 Q 24 50 24 48" fill="#0F172A" opacity="0.85" />)}
      {rank.title === "AppSec Engineer" && (<rect x="28" y="47" width="34" height="5" rx="2" fill="#0F172A" opacity="0.7" />)}
      {(rank.title === "Security Champion") && (<><path d="M 20 28 L 26 18 L 32 28 Z" fill={expr.color2} opacity="0.8" /><path d="M 58 28 L 64 18 L 70 28 Z" fill={expr.color2} opacity="0.8" /></>)}
      {rank.title === "Script Kiddie" && (<><path d="M 19 48 Q 19 20 45 20 Q 71 20 71 48" stroke="#64748B" strokeWidth="3" fill="none" /><rect x="14" y="44" width="10" height="12" rx="3" fill="#94A3B8" /><rect x="66" y="44" width="10" height="12" rx="3" fill="#94A3B8" /></>)}
    </svg>
  );
}