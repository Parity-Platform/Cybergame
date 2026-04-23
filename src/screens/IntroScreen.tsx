// src/screens/IntroScreen.tsx
import { useState } from "react";
import type { Category } from "../types";
import { CATEGORIES } from "../data/questions";

interface IntroScreenProps {
  onStart: (selectedCategories: Category[]) => void;
}

export default function IntroScreen({ onStart }: IntroScreenProps) {
  const [selectedCats, setSelectedCats] = useState<Category[]>([]);

  const toggleCat = (cat: Category) => {
    setSelectedCats(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const handleInit = () => {
    const finalCats = selectedCats.length > 0 ? selectedCats : CATEGORIES;
    onStart(finalCats);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "monospace" }}>
      <div style={{ position: "relative", textAlign: "center", animation: "fadeUp 0.8s ease forwards", maxWidth: 700 }}>
        <div style={{ fontSize: 12, color: "#4ade80", letterSpacing: 6, marginBottom: 12, fontWeight: 600 }}>
          // LEVEL UP YOUR SECURITY IQ
        </div>
        <h1 style={{
          fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: 800,
          margin: "0 0 8px", color: "#4ade80",
          letterSpacing: 2, textShadow: "0 0 20px rgba(74, 222, 128, 0.4)"
        }}>
          root@VULNHUNT:~#_
        </h1>
        <p style={{ color: "#a3a3a3", fontSize: 13, margin: "0 0 40px", letterSpacing: 1 }}>
          &gt; MULTI-VECTOR CODE SECURITY CHALLENGE &lt;
        </p>

        <div style={{ background: "#050505", border: "1px solid #166534", padding: 16, marginBottom: 32, textAlign: "left", fontSize: 11, color: "#4ade80", opacity: 0.8, boxShadow: "inset 0 0 10px rgba(22, 101, 52, 0.2)", borderRadius: 8 }}>
          <div style={{ marginBottom: 4 }}>[*] SYSTEM BOOT SEQUENCE INITIATED...</div>
          <div style={{ marginBottom: 4 }}>[*] LOADING SECURE KERNEL MODULES... <span style={{ color: "#22c55e" }}>[OK]</span></div>
          <div style={{ marginBottom: 4 }}>[*] MOUNTING ENCRYPTED VFS... <span style={{ color: "#22c55e" }}>[OK]</span></div>
          <div style={{ marginBottom: 4 }}>[*] ESTABLISHING ANONYMOUS UPLINK... <span style={{ color: "#22c55e" }}>[ESTABLISHED]</span></div>
          <div style={{ color: "#22d3ee", marginTop: 8, animation: "terminalTextPulse 2s infinite" }}>&gt; AWAITING_OPERATOR_CONFIG...</div>
        </div>

        <div style={{ background: "#0a0a0a", border: "1px solid #22c55e", borderRadius: 8, padding: 24, marginBottom: 32, boxShadow: "0 0 15px rgba(34, 197, 94, 0.1)" }}>
          <div style={{ fontSize: 12, color: "#4ade80", letterSpacing: 1, marginBottom: 16, fontWeight: 600 }}>
            SELECT TARGET VECTORS (OR LEAVE BLANK FOR ALL)
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => toggleCat(cat)}
                style={{
                  background: selectedCats.includes(cat) ? "#4ade80" : "transparent",
                  border: `1px solid ${selectedCats.includes(cat) ? "#4ade80" : "#166534"}`,
                  color: selectedCats.includes(cat) ? "#000" : "#a3a3a3", padding: "8px 16px",
                  borderRadius: 6, cursor: "pointer",
                  fontSize: 12, transition: "all 0.2s", fontWeight: 600
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleInit}
          style={{
            fontSize: 14, fontWeight: 800, letterSpacing: 2,
            padding: "16px 48px", background: "#000", border: "1px solid #4ade80",
            color: "#4ade80", borderRadius: 8, cursor: "pointer", 
            boxShadow: "0 0 10px rgba(74, 222, 128, 0.2)", transition: "all 0.2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "#4ade80"; e.currentTarget.style.color = "#000"; e.currentTarget.style.boxShadow = "0 0 20px rgba(74, 222, 128, 0.6)"; e.currentTarget.style.transform = "translateY(-2px)" }}
          onMouseLeave={e => { e.currentTarget.style.background = "#000"; e.currentTarget.style.color = "#4ade80"; e.currentTarget.style.boxShadow = "0 0 10px rgba(74, 222, 128, 0.2)"; e.currentTarget.style.transform = "translateY(0)" }}
        >
          ./INITIALIZE_SYS.sh
        </button>
      </div>
    </div>
  );
}