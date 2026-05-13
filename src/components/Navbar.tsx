import Link from "next/link";
import { createClient, safeGetUser } from "@/lib/supabase/server";

export default async function Navbar() {
  const supabase = await createClient();
  const user = await safeGetUser(supabase);

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-bg-base/60 border-b border-line">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="font-mono text-xs font-bold border border-accent/50 text-accent px-1.5 py-0.5 rounded tracking-wider">
            EVL
          </span>
          <span className="font-semibold tracking-tight text-sm">Arcade</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm text-muted">
          <Link href="/#games" className="hover:text-white transition">Games</Link>
          <Link href="/#pricing" className="hover:text-white transition">Pricing</Link>
          <Link href="/#faq" className="hover:text-white transition">FAQ</Link>
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link href="/gallery" className="btn btn-ghost text-sm">Gallery</Link>
              <Link href="/account" className="btn btn-secondary text-sm">Account</Link>
            </>
          ) : (
            <>
              <Link href="/login" className="btn btn-ghost text-sm">Log in</Link>
              <Link href="/signup" className="btn btn-primary text-sm">Start free trial</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
