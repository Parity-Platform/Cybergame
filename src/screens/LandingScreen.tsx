//--- /dev/null
// src/screens/LandingScreen.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGameState } from "../context/GameStateContext";

export default function LandingScreen() {
  const { isAuthenticated, setIsAuthenticated, setAuthType, setGameMode } = useGameState();
  const [activeTab, setActiveTab] = useState<"cyber" | "it">("cyber");
  const navigate = useNavigate();
  const [headerText, setHeaderText] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [hoveredBtn, setHoveredBtn] = useState<"login" | "register" | null>(null);

  // Terminal typing animation effect for the prompt string
  useEffect(() => {
    const fullText = isAuthenticated ? "root@vulnhunt:~#" : "guest@vulnhunt:~$";
    setHeaderText("");
    let i = 0;
    const interval = setInterval(() => {
      setHeaderText(fullText.slice(0, i + 1));
      i++;
      if (i >= fullText.length) clearInterval(interval);
    }, 40); // Faster typing
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Handles toggling between different game modules (Cybersecurity vs IT Support)
  const handleSwitch = (tab: "cyber" | "it") => {
    setActiveTab(tab);
    setErrorMsg(null);
    setGameMode(tab);
  };

  // Proceeds to the intro screen if the correct module is active
  const handlePlay = () => {
    if (activeTab === "cyber") {
      navigate("/intro");
    } else {
      setErrorMsg("[ERROR] IT_SUPPORT_MODULE.sh: Operation not permitted. Module under construction.");
    }
  };

  return (
    <div className="screen-container">
      <div className="animate-fade-up" style={{ maxWidth: 600, width: "100%" }}>
        
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--primary-dim)", marginBottom: 24, borderBottom: "1px dashed var(--primary-dim)", paddingBottom: 8, textAlign: "left" }}>
          <span>
            {headerText}
            <span className="terminal-cursor" style={{ background: "var(--primary-dim)" }} />
          </span>
          <span>SYS_OP_MODE: {isAuthenticated ? "AUTHORIZED" : "LOCKED"}</span>
          <span>{new Date().toISOString().split('T')[0]}</span>
        </div>

        {!isAuthenticated ? (
          <>
            <div className="text-label" style={{ letterSpacing: 4 }}>
              // SYSTEM ACCESS REQUIRED
            </div>

            <div style={{ minHeight: 160, marginBottom: 40 }}>
              <div className="animate-fade-up-fast">
                <pre className="text-title" style={{ fontSize: "clamp(4px, 1.5vw, 14px)", textAlign: "left", display: "inline-block", lineHeight: 1.2, textShadow: "0 0 10px var(--primary-glow)" }}>
{`\\ \\   / / | |  | | | |        | \\ | | | |  | | | |  | | | \\ | | |__   __|
 \\ \\ / /  | |  | | | |        |  \\| | | |__| | | |  | | |  \\| |    | |   
  \\ V /   | |  | | | |        | . \` | |  __  | | |  | | | . \` |    | |   
   \\ /    | |__| | | |____    | |\\  | | |  | | | |__| | | |\\  |    | |   
    V      \\____/  |______|   |_| \\_| |_|  |_|  \\____/  |_| \\_|    |_|   `}
                </pre>
                <p className="text-subtitle">
                  The ultimate multi-vector cybersecurity &amp; IT support simulation.<br/>
                  Verify your credentials to proceed.
                </p>
              </div>
            </div>

            {/* ACTIONS */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}>
              <div style={{ display: "flex", gap: 16, width: "100%", justifyContent: "center" }}>
                <button 
                  onClick={() => { setAuthType("login"); navigate("/auth"); }} 
                  onMouseEnter={() => setHoveredBtn("login")}
                  onMouseLeave={() => setHoveredBtn(null)}
                  style={{ flex: 1, maxWidth: 200, padding: "14px 24px", background: "#0a0a0a", border: `1px solid ${hoveredBtn === "login" ? "var(--primary)" : "#333"}`, color: hoveredBtn === "login" ? "var(--primary)" : "#e2e8f0", borderRadius: 8, cursor: "pointer", fontWeight: 600, transition: "all 0.2s" }}
                >
                  LOGIN
                </button>
                <button 
                  onClick={() => { setAuthType("register"); navigate("/auth"); }} 
                  onMouseEnter={() => setHoveredBtn("register")}
                  onMouseLeave={() => setHoveredBtn(null)}
                  style={{ flex: 1, maxWidth: 200, padding: "14px 24px", background: "#0a0a0a", border: `1px solid ${hoveredBtn === "register" ? "var(--primary)" : "#333"}`, color: hoveredBtn === "register" ? "var(--primary)" : "#e2e8f0", borderRadius: 8, cursor: "pointer", fontWeight: 600, transition: "all 0.2s" }}
                >
                  REGISTER
                </button>
              </div>
              
              <button onClick={() => setIsAuthenticated(true)} className="btn-primary">
                ./PLAY_AS_GUEST.sh
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="text-label" style={{ letterSpacing: 4 }}>
              // SELECT SIMULATION MODULE
            </div>

            {/* SWIPE / TOGGLE SWITCH */}
            <div style={{ 
              position: "relative", display: "flex", background: "#050505", border: "1px solid #333", 
              borderRadius: 40, padding: 6, marginBottom: 48, boxShadow: "inset 0 0 10px rgba(0,0,0,0.8)" 
            }}>
              <div style={{ 
                position: "absolute", top: 6, bottom: 6, left: activeTab === "cyber" ? 6 : "50%", 
                width: "calc(50% - 6px)", background: "var(--primary-dim)", 
                borderRadius: 34, transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", 
                boxShadow: `0 0 15px var(--primary-glow)`
              }} />
              
              <button 
                onClick={() => handleSwitch("cyber")}
                className={`toggle-btn ${activeTab === "cyber" ? "active" : ""}`}
              >
                CYBERSECURITY
              </button>
              <button 
                onClick={() => handleSwitch("it")}
                className={`toggle-btn ${activeTab === "it" ? "active" : ""}`}
              >
                IT SUPPORT
              </button>
            </div>

            {/* GAME INFO */}
            <div style={{ minHeight: 160, marginBottom: 40 }}>
              {activeTab === "cyber" ? (
                <div className="animate-fade-up-fast">
                  <h1 className="text-title text-outline">
                    root@VULNHUNT:~#
                  </h1>
                  <p className="text-subtitle">
                    Identify vulnerabilities in multi-vector code snippets.<br/>Level up your security IQ.
                  </p>
                </div>
              ) : (
                <div className="animate-fade-up-fast">
                  <h1 className="text-title text-outline">
                    C:\SYS_ADMIN\&gt;
                  </h1>
                  <p className="text-subtitle">
                    Troubleshoot networks, fix active directories, and resolve IT nightmares.<br/>
                    Identify phishing attempts and secure the infrastructure.<br/>
                    <span style={{ color: "#fbbf24", fontWeight: 600 }}>[MODULE UNDER CONSTRUCTION]</span>
                  </p>
                </div>
              )}
            </div>

            {errorMsg && (
              <div className="error-box" style={{ maxWidth: 416, margin: "0 auto 24px" }}>
                {errorMsg}
              </div>
            )}

            {/* ACTIONS */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}>
              <button onClick={handlePlay} className="btn-primary">
                ./START_MODULE.sh
              </button>
              {/* Allows the user to explicitly log out by updating global auth state */}
              <button onClick={() => setIsAuthenticated(false)} className="btn-ghost" style={{ textDecoration: "underline", fontSize: 12 }}>
                Log out
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
