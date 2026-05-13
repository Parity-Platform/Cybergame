export default function Footer() {
  return (
    <footer className="border-t border-line mt-32">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row gap-4 items-center justify-between text-sm text-muted">
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-xs font-bold border border-accent/40 text-accent px-1.5 py-0.5 rounded tracking-wider">
            EVL
          </span>
          <span>EV Loader Arcade</span>
        </div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white transition">Terms</a>
          <a href="#" className="hover:text-white transition">Privacy</a>
          <a href="mailto:cybersecurity@parityplatform.com" className="hover:text-white transition">Contact</a>
        </div>
        <div>© Parity Platform P.C.</div>
      </div>
    </footer>
  );
}
