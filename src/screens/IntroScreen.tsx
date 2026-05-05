// src/screens/IntroScreen.tsx
import { useState, useEffect } from "react";
import type { Category } from "../types";
import { CATEGORIES } from "../data/questions";
import { useNavigate } from "react-router-dom";
import { useGameState } from "../context/GameStateContext";

export default function IntroScreen() {
  const { handleStart } = useGameState();
  const navigate = useNavigate();
  const [selectedCats, setSelectedCats] = useState<Category[]>([]);
  const [headerText, setHeaderText] = useState("");
  const [bootStep, setBootStep] = useState(0);

  // Toggle a specific category filter on/off
  const toggleCat = (cat: Category) => {
    setSelectedCats(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  // Start the quiz with the chosen categories, or all categories if none are selected
  const handleInit = () => {
    const finalCats = selectedCats.length > 0 ? selectedCats : CATEGORIES;
    handleStart(finalCats);
    navigate("/quiz");
  };

  // Animated typing effect for the header
  useEffect(() => {
    const fullText = "root@VULNHUNT:~#";
    let i = 0;
    setHeaderText("");
    const interval = setInterval(() => {
      setHeaderText(fullText.slice(0, i + 1));
      i++;
      if (i >= fullText.length) clearInterval(interval);
    }, 40); // Faster typing
    return () => clearInterval(interval);
  }, []);

  // Step-by-step terminal boot animation sequence
  useEffect(() => {
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setBootStep(step);
      if (step >= 5) clearInterval(interval);
    }, 350);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="screen-container">
      <div className="animate-fade-up" style={{ position: "relative", maxWidth: 700, width: "100%" }}>
        
        <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 24 }}>
          <button 
            onClick={() => navigate("/")}
            className="btn-ghost"
          >
            &lt; cd /landingpage
          </button>
        </div>

        <div className="text-label" style={{ letterSpacing: 6, marginBottom: 12 }}>
          // LEVEL UP YOUR SECURITY IQ
        </div>
        <h1 className="text-title text-title-large text-outline" style={{ margin: "0 0 8px", letterSpacing: 2 }}>
          {headerText}
        </h1>
        <p className="text-subtitle" style={{ fontSize: 13, margin: "0 0 40px", letterSpacing: 1 }}>
          &gt; MULTI-VECTOR CODE SECURITY CHALLENGE &lt;
        </p>

        <div className="terminal-window" style={{ background: "var(--primary-bg)", border: "1px solid var(--primary-dim)", padding: 16, marginBottom: 32, minHeight: 140, textAlign: "left", fontSize: 11, color: "var(--primary)", opacity: 0.8, boxShadow: "inset 0 0 10px var(--primary-glow)" }}>
          {bootStep >= 1 && <div style={{ marginBottom: 4 }}>[*] SYSTEM BOOT SEQUENCE INITIATED...</div>}
          {bootStep >= 2 && <div style={{ marginBottom: 4 }}>[*] LOADING SECURE KERNEL MODULES... <span style={{ color: "var(--primary)" }}>[OK]</span></div>}
          {bootStep >= 3 && <div style={{ marginBottom: 4 }}>[*] MOUNTING ENCRYPTED VFS... <span style={{ color: "var(--primary)" }}>[OK]</span></div>}
          {bootStep >= 4 && <div style={{ marginBottom: 4 }}>[*] ESTABLISHING ANONYMOUS UPLINK... <span style={{ color: "var(--primary)" }}>[ESTABLISHED]</span></div>}
          {bootStep >= 5 && <div className="terminal-pulse" style={{ color: "var(--primary)", opacity: 0.7, marginTop: 8 }}>&gt; AWAITING_OPERATOR_CONFIG...</div>}
        </div>

        <div className="terminal-window" style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 12, color: "var(--primary)", letterSpacing: 1, marginBottom: 16, fontWeight: 600 }}>
            SELECT TARGET VECTORS (OR LEAVE BLANK FOR ALL)
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => toggleCat(cat)}
                className={`cat-btn ${selectedCats.includes(cat) ? "active" : ""}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleInit}
          className="btn-primary"
          style={{ padding: "16px 48px", letterSpacing: 2, maxWidth: "max-content" }}
        >
          ./INITIALIZE_SYS.sh
        </button>
      </div>
    </div>
  );
}