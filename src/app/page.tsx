import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PricingGrid from "@/components/PricingGrid";
import { GAMES } from "@/lib/games";
import { createClient, safeGetUser } from "@/lib/supabase/server";

const HERO_STATS = [
  { label: "SQL Injection", pct: 82 },
  { label: "XSS", pct: 61 },
  { label: "Path Traversal", pct: 48 },
  { label: "Command Injection", pct: 33 },
];

export default async function Landing() {
  const supabase = await createClient();
  const user = await safeGetUser(supabase);
  const authed = !!user;

  return (
    <>
      <Navbar />

      <main>
        {/* HERO */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 dotgrid opacity-40 pointer-events-none" />
          <div className="max-w-6xl mx-auto px-6 pt-20 pb-16 relative">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

              <div>
                <div className="section-tag mb-6">Cybersecurity Training</div>
                <h1 className="text-5xl md:text-6xl font-bold tracking-tight gradient-text leading-[1.05]">
                  Train your security<br />reflexes. Daily.
                </h1>
                <p className="mt-6 text-lg text-muted max-w-lg">
                  Bite-sized cybersecurity games. Spot vulnerabilities, catch phish, triage incidents. Subscribe once, play everything.
                </p>
                <div className="mt-8 flex items-center gap-3 flex-wrap">
                  <Link href={authed ? "/gallery" : "/signup"} className="btn btn-primary px-6 py-3 text-base">
                    {authed ? "Open gallery" : "Start free trial"}
                  </Link>
                  <Link href="/play/vulnhunt" className="btn btn-secondary px-6 py-3 text-base">
                    Play demo
                  </Link>
                </div>
                <div className="mt-5 flex items-center gap-4 text-xs text-muted">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent/70 animate-pulse" />
                    7-day free trial on all plans
                  </span>
                  <span className="text-line">|</span>
                  <span>No account needed to play demo</span>
                </div>
              </div>

              {/* Live game session panel */}
              <div className="card overflow-hidden shadow-card">
                <div className="px-4 py-3 border-b border-line flex items-center justify-between bg-bg-elevated">
                  <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-muted">
                    <span>VULNHUNT</span>
                    <span>·</span>
                    <span>Q 07 / 10</span>
                  </div>
                  <span className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    LIVE
                  </span>
                </div>
                <div className="px-5 py-5 bg-bg-elevated space-y-3.5">
                  <div className="text-[10px] font-mono tracking-widest text-muted mb-4">CATEGORY ACCURACY</div>
                  {HERO_STATS.map(({ label, pct }) => (
                    <div key={label}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-muted">{label}</span>
                        <span className="font-mono">{pct}%</span>
                      </div>
                      <div className="h-1 rounded-full overflow-hidden" style={{ background: "var(--line)" }}>
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-accent to-accent-soft"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-5 py-3.5 border-t border-line grid grid-cols-3 divide-x divide-line">
                  {[
                    { label: "STREAK", value: "×14" },
                    { label: "ACCURACY", value: "71%" },
                    { label: "XP EARNED", value: "+2,340" },
                  ].map(({ label, value }) => (
                    <div key={label} className="px-3 first:pl-0 last:pr-0 text-center">
                      <div className="text-[9px] font-mono tracking-wider text-muted">{label}</div>
                      <div className="text-sm font-bold mt-1">{value}</div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* GAMES */}
        <section id="games" className="max-w-6xl mx-auto px-6 py-24">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="section-tag mb-2">Library</div>
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
                Games in the arcade
              </h2>
            </div>
            <div className="text-sm text-muted hidden md:block">
              {GAMES.filter((g) => g.status === "live").length} live ·{" "}
              {GAMES.filter((g) => g.status === "soon").length} coming soon
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {GAMES.map((g) => (
              <div key={g.slug} className="card overflow-hidden group hover:translate-y-[-2px] transition">
                <div
                  className="aspect-[16/10] flex items-center justify-center relative"
                  style={{
                    background: `radial-gradient(circle at 30% 20%, ${g.accent}22, transparent 60%), linear-gradient(180deg, #14141d 0%, #0c0c14 100%)`,
                  }}
                >
                  <span
                    className="text-5xl font-mono select-none"
                    style={{ color: g.accent, textShadow: `0 0 28px ${g.accent}60` }}
                  >
                    {g.icon}
                  </span>
                  {g.status === "soon" && (
                    <div className="absolute top-3 right-3 text-[10px] tracking-wide px-2 py-1 rounded-full bg-bg-base/70 border border-line">
                      COMING SOON
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="text-xs text-muted">{g.category}</div>
                  <div className="text-lg font-semibold mt-1">{g.title}</div>
                  <div className="text-sm text-muted mt-1">{g.tagline}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="max-w-6xl mx-auto px-6 py-24">
          <div className="text-center mb-12">
            <div className="section-tag-center mb-3">Pricing</div>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
              One subscription. Every game.
            </h2>
            <p className="text-muted mt-3 max-w-xl mx-auto">
              All plans start with a free trial. Cancel anytime from your account.
            </p>
          </div>
          <PricingGrid authed={authed} />
        </section>

        {/* FAQ */}
        <section id="faq" className="max-w-3xl mx-auto px-6 py-24">
          <div className="text-center mb-12">
            <div className="section-tag-center mb-3">FAQ</div>
            <h2 className="text-3xl font-semibold tracking-tight">
              Common questions
            </h2>
          </div>
          <div className="space-y-3">
            {[
              {
                q: "Is there really a free trial?",
                a: "Yes. Every plan starts with a 7-day trial (14 days for Team). You will not be charged until day 8.",
              },
              {
                q: "Can I cancel any time?",
                a: "Cancel from your Account page in two clicks. You keep access until the end of your billing period.",
              },
              {
                q: "Do I need to create an account to try a game?",
                a: "Yes. Account + active trial unlocks the entire gallery. Auth and billing live behind one paywall.",
              },
              {
                q: "Are more games coming?",
                a: "We ship a new game every few weeks. Pro and Team plans get instant access.",
              },
            ].map((f) => (
              <details key={f.q} className="card p-5 group">
                <summary className="cursor-pointer list-none flex justify-between items-center">
                  <span className="font-medium">{f.q}</span>
                  <span className="text-muted group-open:rotate-45 transition">+</span>
                </summary>
                <p className="text-muted mt-3 text-sm">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
