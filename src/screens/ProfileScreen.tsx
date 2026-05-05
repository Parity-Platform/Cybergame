// src/screens/ProfileScreen.tsx
// src/screens/ProfileScreen.tsx
import { getRank, Avatar } from "../components/Visuals";
import { useNavigate } from "react-router-dom";
import { useGameState } from "../context/GameStateContext";

export default function ProfileScreen() {
  const { totalXP, answers, maxPossibleXP, categoryStats } = useGameState();
  const navigate = useNavigate();
  const onRestart = () => navigate("/intro");
  const onHome = () => navigate("/");

  const total = answers.length;
  const correct = answers.filter(Boolean).length;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
  
  const rank = getRank(accuracy);

  const getSuggestion = (cat: string, pct: number) => {
    if (pct >= 80) return "Mastery achieved. Keep monitoring for zero-days.";
    if (cat === "Injection") return "Review OWASP parameterized queries & ORM safety.";
    if (cat === "Sensitive Data Exposure") return "Study secrets management (Vault, AWS KMS) & env vars.";
    if (cat === "Broken Authentication") return "Implement MFA and strict password policies (Argon2/Bcrypt).";
    if (cat === "Cross-Site Scripting (XSS)") return "Sanitize inputs and use strict Content Security Policies.";
    if (cat === "Security Misconfiguration") return "Audit cloud buckets, disable debug modes in production.";
    return "Review OWASP Top 10 guidelines for this vector.";
  };

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "20px 16px", animation: "fadeUp 0.6s ease" }}>
      
      <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 24 }}>
        <button 
          onClick={onHome}
          className="btn-ghost"
        >
          &lt; cd /landingpage
        </button>
      </div>

      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div className="text-label" style={{ letterSpacing: 3, marginBottom: 8 }}>
          cat /var/log/vulnhunt_report.log
        </div>
        <h1 style={{ fontSize: "clamp(1.6rem, 4vw, 2.5rem)", margin: 0, color: rank.color, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", textShadow: `0 0 15px ${rank.color}66` }}>
          <span style={{ color: rank.color, marginRight: 8 }}>{rank.emoji}</span>STATUS: {rank.title}
        </h1>
        <p className="text-subtitle" style={{ marginTop: 8 }}>{rank.desc}</p>
      </div>

      <div className="terminal-window" style={{ borderColor: rank.color, padding: 32, marginBottom: 32, boxShadow: `0 0 20px ${rank.color}22` }}>
        <div style={{ display: "flex", gap: 32, alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}>
          <div style={{ filter: "drop-shadow(0 0 8px currentColor)", color: rank.color }}><Avatar rank={rank} score={accuracy} /></div>
          
          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
              {[
                { label: "TOTAL_XP", val: totalXP },
                { label: "MAX_POTENTIAL", val: maxPossibleXP },
                { label: "ACCURACY", val: `${accuracy}%` },
                { label: "THREATS_NEUTRALIZED", val: `${correct}/${total}` },
              ].map((s, idx) => (
                <div key={s.label} style={{ background: "#050505", borderRadius: 8, padding: "16px", border: `1px solid ${rank.color}44`, opacity: 0, animation: "fadeUp 0.4s ease forwards", animationDelay: `${0.2 + idx * 0.1}s` }}>
                  <div style={{ fontSize: 22, color: rank.color, fontWeight: 800, textShadow: `0 0 10px ${rank.color}66` }}>{s.val}</div>
                  <div style={{ fontSize: 10, color: "#a3a3a3", letterSpacing: 1, marginTop: 4, fontWeight: 600 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="terminal-window" style={{ borderColor: "#333", marginBottom: 32, boxShadow: "none" }}>
        <div className="text-label" style={{ letterSpacing: 2, marginBottom: 24 }}>
          ./vector_analysis.sh --category-mastery
        </div>
        <div style={{ display: "grid", gap: 16 }}>
          {Object.entries(categoryStats).map(([cat, stats], idx) => {
            const catPct = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
            const barColor = catPct >= 75 ? "#4ade80" : catPct >= 40 ? "#fbbf24" : "#f87171";
            
            return (
              <div key={cat} style={{ display: "flex", flexDirection: "column", gap: 6, opacity: 0, animation: "fadeUp 0.4s ease forwards", animationDelay: `${0.5 + idx * 0.1}s` }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#e2e8f0", fontWeight: 600 }}>
                  <span>{cat.toUpperCase()}</span>
                  <span style={{ color: barColor, textShadow: `0 0 5px ${barColor}66` }}>{stats.correct}/{stats.total} ({catPct}%)</span>
                </div>
                <div style={{ height: 8, background: "#111", borderRadius: 4, overflow: "hidden", border: "1px solid #333" }}>
                  <div style={{ width: `${catPct}%`, height: "100%", background: barColor, transition: "width 1s cubic-bezier(0.4, 0, 0.2, 1)", boxShadow: `0 0 10px ${barColor}` }} />
                </div>
                <div style={{ fontSize: 10, color: "#a3a3a3", marginTop: 4, fontStyle: "italic" }}>
                  &gt; {getSuggestion(cat, catPct)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ textAlign: "center", opacity: 0, animation: "fadeUp 0.4s ease forwards", animationDelay: "1s" }}>
        <button
          onClick={onRestart}
          className="btn-primary"
          style={{ padding: "16px 40px", letterSpacing: 2, textTransform: "uppercase", maxWidth: "max-content" }}
        >
          ./REBOOT_SYSTEM.sh
        </button>
      </div>
    </div>
  );
}