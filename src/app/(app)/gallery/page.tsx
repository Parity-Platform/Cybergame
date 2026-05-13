import Link from "next/link";
import { GAMES } from "@/lib/games";
import { createClient, safeGetUser } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const supabase = await createClient();
  const user = await safeGetUser(supabase);

  return (
    <div className="max-w-6xl mx-auto px-6 py-14">
      <div className="flex items-end justify-between mb-10">
        <div>
          <div className="section-tag mb-2">Gallery</div>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            {user?.email ? `Pick a game, ${user.email.split("@")[0]}` : "Pick a game"}
          </h1>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {GAMES.map((g) => {
          const playable = g.status === "live";
          const Inner = (
            <div className={`card overflow-hidden transition ${playable ? "hover:translate-y-[-2px] hover:shadow-card cursor-pointer" : "opacity-60"}`}>
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
                {!playable && (
                  <div className="absolute top-3 right-3 text-[10px] tracking-wide px-2 py-1 rounded-full bg-bg-base/70 border border-line">
                    COMING SOON
                  </div>
                )}
                {playable && (
                  <div className="absolute top-3 right-3 text-[10px] tracking-wide px-2 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300">
                    LIVE
                  </div>
                )}
              </div>
              <div className="p-5 flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs text-muted">{g.category}</div>
                  <div className="text-lg font-semibold mt-1">{g.title}</div>
                  <div className="text-sm text-muted mt-1">{g.tagline}</div>
                </div>
                {playable && <span className="text-accent text-sm shrink-0">Play →</span>}
              </div>
            </div>
          );

          return playable ? (
            <Link key={g.slug} href={`/play/${g.slug}`}>{Inner}</Link>
          ) : (
            <div key={g.slug}>{Inner}</div>
          );
        })}
      </div>
    </div>
  );
}
