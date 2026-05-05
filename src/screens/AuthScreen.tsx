//--- /dev/null
// src/screens/AuthScreen.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGameState } from "../context/GameStateContext";

export default function AuthScreen() {
  const { authType, setIsAuthenticated } = useGameState();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">(authType);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [cmdText, setCmdText] = useState("");
  const [bootStep, setBootStep] = useState(0); // 0 = typing cmd, 1 = executing, 2 = form
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Handles the pseudo-terminal boot sequence and typing animation
  useEffect(() => {
    setBootStep(0);
    setCmdText("");
    setErrorMsg(null);
    const fullCmd = `./${mode}.sh`;
    let i = 0;
    let timeoutId: ReturnType<typeof setTimeout>;
    const interval = setInterval(() => {
      setCmdText(fullCmd.slice(0, i + 1));
      i++;
      if (i >= fullCmd.length) {
        clearInterval(interval);
        setBootStep(1);
        timeoutId = setTimeout(() => setBootStep(2), 600);
      }
    }, 40); // Faster typing
    return () => {
      clearInterval(interval);
      clearTimeout(timeoutId);
    };
  }, [mode]);

  // Processes the login/registration form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (mode === "login") {
      if (!email || !password) return;
      console.log(`Authenticating ${email} via login...`);
    } else {
      if (!username || !email || !password || password !== confirmPassword) {
        if (password !== confirmPassword) setErrorMsg("[FATAL] AUTH_KEY_MISMATCH: Passwords do not match.");
        return;
      }
      console.log(`Registering ${username} (${email})...`);
    }
    
    // Simulate authentication process and navigate back to the main route
    setIsAuthenticated(true);
    navigate("/");
  };

  return (
    <div className="screen-container">
      <div className="animate-fade-up-fast" style={{ width: "100%", maxWidth: 450 }}>
        
        <button 
          onClick={() => navigate("/")}
          className="btn-ghost"
          style={{ marginBottom: 24 }}
        >
        &lt; cd /landingpage
        </button>

        <div className="terminal-window" style={{ position: "relative", padding: 32, borderRadius: 4 }}>
          
          <div className="terminal-header" style={{ position: "absolute", top: 0, left: 0, right: 0 }}>
            <span>{mode === "login" ? "AUTH_MODULE" : "REGISTRATION_MODULE"}</span>
            <span>TTY1</span>
          </div>

          <div style={{ marginTop: 16, marginBottom: bootStep >= 1 ? 16 : 24, color: "#a3a3a3", fontSize: 13 }}>
            <span style={{ color: "var(--primary)" }}>guest@vulnhunt:~$</span> {cmdText}
            {bootStep === 0 && <span className="terminal-cursor" style={{ width: 8, height: 15 }} />}
          </div>

          {bootStep >= 1 && (
            <div style={{ marginBottom: 24, color: "var(--primary)", fontSize: 12, opacity: 0.8, animation: "fadeUp 0.3s ease" }}>
              <div style={{ marginBottom: 4 }}>[*] EXECUTING {mode === "login" ? "AUTH" : "REGISTRATION"} PROTOCOL...</div>
              <div style={{ marginBottom: 4 }}>[*] ESTABLISHING SECURE CONNECTION... <span style={{ color: "var(--primary)" }}>[OK]</span></div>
              {bootStep >= 2 && <div style={{ color: "var(--primary)", marginTop: 8, opacity: 0.7 }}>&gt; AWAITING_OPERATOR_INPUT...</div>}
            </div>
          )}

          {bootStep >= 2 && (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {mode === "register" && (
                <div className="animate-fade-up-fast" style={{ opacity: 0, animationDelay: "0.1s" }}>
                <label className="input-label">&gt; USERNAME</label>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: "#555" }}>$</span>
                  <input 
                    type="text" value={username} onChange={e => setUsername(e.target.value)} required
                    className="terminal-input"
                  />
                </div>
              </div>
              )}
              
              <div className="animate-fade-up-fast" style={{ opacity: 0, animationDelay: mode === "register" ? "0.2s" : "0.1s" }}>
              <label className="input-label">&gt; MAIL</label>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: "#555" }}>$</span>
                <input 
                  type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  className="terminal-input"
                />
              </div>
            </div>
              
              <div className="animate-fade-up-fast" style={{ opacity: 0, animationDelay: mode === "register" ? "0.3s" : "0.2s" }}>
              <label className="input-label">&gt; PASSWORD</label>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: "#555" }}>$</span>
                <input 
                  type="password" value={password} onChange={e => setPassword(e.target.value)} required
                  className="terminal-input"
                />
              </div>
            </div>

              {mode === "register" && (
                <div className="animate-fade-up-fast" style={{ opacity: 0, animationDelay: "0.4s" }}>
                <label className="input-label">&gt; RETYPE_PASSWORD</label>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: "#555" }}>$</span>
                  <input 
                    type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required
                    className="terminal-input"
                  />
                </div>
              </div>
              )}

              {errorMsg && (
                <div className="error-box animate-fade-up-fast" style={{ padding: "8px", marginBottom: 0 }}>
                  {errorMsg}
                </div>
              )}

              <button 
                type="submit" 
                className="btn-primary animate-fade-up-fast"
                style={{ marginTop: 16, padding: "12px", opacity: 0, animationDelay: mode === "register" ? "0.5s" : "0.3s", transition: "all 0.2s", background: isHovered ? "var(--primary)" : "transparent", color: isHovered ? "#000" : "var(--primary)", boxShadow: isHovered ? "0 0 10px var(--primary-glow)" : "none" }} 
                onMouseEnter={() => setIsHovered(true)} 
                onMouseLeave={() => setIsHovered(false)}
              >
                [ EXECUTE ]
              </button>
            </form>
          )}

          <div style={{ marginTop: 24, textAlign: "left", fontSize: 12, color: "#555", borderTop: "1px dashed #333", paddingTop: 16 }}>
            {mode === "login" ? "No account? " : "Existing account? "}
            <button onClick={() => setMode(mode === "login" ? "register" : "login")} className="btn-ghost" style={{ display: "inline", textDecoration: "underline" }}>
              {mode === "login" ? "./register.sh" : "./login.sh"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
