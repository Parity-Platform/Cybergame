import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 h-16 flex items-center">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="font-mono text-xs font-bold border border-accent/50 text-accent px-1.5 py-0.5 rounded tracking-wider">
            EVL
          </span>
          <span className="font-semibold tracking-tight text-sm">Arcade</span>
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
