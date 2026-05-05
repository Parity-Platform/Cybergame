// src/screens/QuestionScreen.tsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useGameState } from "../context/GameStateContext";

export default function QuestionScreen() {
  const { activeQuestions, qIndex, totalXP: currentXP, streak, handleAnswer: onAnswer, answered, handleNext } = useGameState();
  const navigate = useNavigate();
  const question = activeQuestions[qIndex];
  const total = activeQuestions.length;
  const onAbort = () => navigate("/");

  if (!question) return null;

  // Dynamic maximum time based on difficulty and reading length
  const maxTime = question.timeLimit + 60; // Give 60 additional seconds dynamically

  // Retrieve existing local state or initialize randomly shuffled options and timer
  const [initialQState] = useState(() => {
    const savedStr = localStorage.getItem('vulnhunt_qstate');
    if (savedStr) {
      try {
        const parsed = JSON.parse(savedStr);
        if (parsed.qIndex === qIndex) return parsed;
      } catch {}
    }
    
    const optionsWithIndices = question.options.map((text, idx) => ({ text, originalIndex: idx }));
    for (let i = optionsWithIndices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [optionsWithIndices[i], optionsWithIndices[j]] = [optionsWithIndices[j], optionsWithIndices[i]];
    }
    return {
      selected: null as number | null,
      showFix: false,
      timeLeft: maxTime,
      earned: 0,
      shuffledOptions: optionsWithIndices,
      showHint: false
    };
  });

  const [selected, setSelected] = useState<number | null>(initialQState.selected);
  const [showFix, setShowFix] = useState<boolean>(initialQState.showFix);
  const [timeLeft, setTimeLeft] = useState<number>(initialQState.timeLeft);
  const [earned, setEarned] = useState<number>(initialQState.earned);
  const [shuffledOptions, setShuffledOptions] = useState<{text: string, originalIndex: number}[]>(initialQState.shuffledOptions);
  const [showHint, setShowHint] = useState<boolean>(initialQState.showHint);
  const [hoveredOption, setHoveredOption] = useState<number | null>(null);
  const [displayedQuestion, setDisplayedQuestion] = useState("");
  const endTimeRef = useRef<number>(Date.now() + initialQState.timeLeft * 1000);

  // Reset local state when moving to the next question
  useEffect(() => {
    const savedStr = localStorage.getItem('vulnhunt_qstate');
    let parsed = null;
    if (savedStr) {
      try { parsed = JSON.parse(savedStr); } catch {}
    }
    
    if (parsed && parsed.qIndex === qIndex) {
      setSelected(parsed.selected);
      setShowFix(parsed.showFix);
      setTimeLeft(parsed.timeLeft);
      setEarned(parsed.earned);
      setShuffledOptions(parsed.shuffledOptions);
      setShowHint(parsed.showHint);
    } else {
      const optionsWithIndices = question.options.map((text, idx) => ({ text, originalIndex: idx }));
      for (let i = optionsWithIndices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [optionsWithIndices[i], optionsWithIndices[j]] = [optionsWithIndices[j], optionsWithIndices[i]];
      }
      setSelected(null);
      setShowFix(false);
      setTimeLeft(maxTime);
      setEarned(0);
      setShuffledOptions(optionsWithIndices);
      setShowHint(false);
      endTimeRef.current = Date.now() + maxTime * 1000;
    }
  }, [qIndex, question, maxTime]);

  // Persist current question state to local storage when meaningful changes occur
  useEffect(() => {
    localStorage.setItem('vulnhunt_qstate', JSON.stringify({ qIndex, selected, showFix, timeLeft, earned, shuffledOptions, showHint }));
  }, [qIndex, selected, showFix, timeLeft, earned, shuffledOptions, showHint]);

  // Terminal typing animation for the vulnerability question text
  useEffect(() => {
    let currentIndex = 0;
    setDisplayedQuestion("");
    const fullText = question.question;

    const interval = setInterval(() => {
      currentIndex++;
      setDisplayedQuestion(fullText.slice(0, currentIndex));
      if (currentIndex >= fullText.length) {
        clearInterval(interval);
      }
    }, 15); // Faster typing animation

    return () => clearInterval(interval);
  }, [question.question]);

  // Count down remaining time using a real-time interval approach
  useEffect(() => {
    if (answered) return;
    const timer = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((endTimeRef.current - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(timer);
        handleSelect(-1, true);
      }
    }, 500); // Check twice a second to prevent UI lag
    return () => clearInterval(timer);
  }, [answered]);

  // Evaluates selected answer, calculates speed bonus, and propagates result to game state
  const handleSelect = (idx: number, isTimeout = false) => {
    if (selected !== null || answered) return;
    
    let isCorrect = false;
    let xp = 0;

    if (!isTimeout && idx !== -1) {
      setSelected(idx);
      isCorrect = (shuffledOptions[idx].originalIndex === question.correct);
      if (isCorrect) {
        const speedBonus = Math.floor((timeLeft / maxTime) * 50);
        xp = 100 + speedBonus;
      }
    } else {
      setSelected(-1);
    }

    setEarned(xp);
    onAnswer(isCorrect, xp, question.category);
  };

  // Unlocks the question hint with a time penalty
  // [FUTURE DEV]: The hint system is currently disabled but the logic remains for future updates
  const handleHint = () => {
    if (showHint) return;
    setShowHint(true);
    endTimeRef.current -= 10000; // Deduct 10 real-time seconds for the hint
    setTimeLeft(prev => Math.max(1, prev - 10)); // Deduct 10 seconds for the hint
  };

  // Evaluates next step and signals router to load next module or profile
  const handleProceed = () => {
    localStorage.removeItem('vulnhunt_qstate');
    const isGameOver = handleNext();
    if (isGameOver) {
      navigate("/profile");
    }
  };

  // Computes the visual styling of each option button based on selection & hover state
  const optColors = (idx: number, isHovered: boolean) => {
    if (selected === null && !answered) {
      return isHovered 
        ? { bg: "#111", border: "var(--primary)", color: "var(--primary)", font: "#a3a3a3", transform: "translateY(-1px)" }
        : { bg: "#000000", border: "var(--primary-dim)", color: "var(--primary)", font: "#a3a3a3", transform: "translateY(0)" };
    }
    
    const isThisCorrect = shuffledOptions[idx].originalIndex === question.correct;

    if (isThisCorrect && answered) return { bg: "var(--primary-bg)", border: "var(--primary)", color: "var(--primary)", font: "var(--primary)", transform: "translateY(0)" };
    if (idx === selected) return { bg: "#450a0a", border: "#f87171", color: "#f87171", font: "#f87171", transform: "translateY(0)" };
    
    return { bg: "#050505", border: "var(--primary-dim)", color: "var(--primary-dim)", font: "#525252", transform: "translateY(0)" };
  };

  // Update timer text color to warn the player when time is running out
  const timerColor = timeLeft <= 10 ? "#f87171" : timeLeft <= maxTime / 2 ? "#fbbf24" : "var(--primary)";

  // Generate contextual feedback message depending on correctness
  const getReactionMessage = () => {
    if (selected === -1) return "Execution Timeout.";
    if (earned > 130) return "Optimal Solution (+Speed Bonus)";
    if (earned > 0) return "Vulnerability Verified.";
    return "Incorrect Analysis.";
  };

  return (
    <div className="animate-fade-up-fast" style={{ maxWidth: 860, margin: "0 auto", padding: "20px 16px" }}>
      
      <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 24 }}>
        <button 
          onClick={onAbort}
          className="btn-ghost"
        >
          &lt; cd /landingpage && ./abort_process.sh
        </button>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 12, color: "var(--primary)", letterSpacing: 1 }}>
            [JOB_0{qIndex + 1}/{total}] // {question.category.toUpperCase()}
          </div>
          <div style={{ display: "flex", gap: 16, alignItems: "center", marginTop: 6 }}>
            <div style={{ fontSize: 14, color: "#22d3ee", fontWeight: 600, textShadow: "0 0 5px rgba(34, 211, 238, 0.4)" }}>
              XP: {currentXP}
            </div>
            {streak > 1 && (
              <div style={{ fontSize: 12, color: "#fbbf24", animation: "slideInRight 0.3s", background: "#451a03", border: "1px solid #fbbf24", padding: "2px 8px", borderRadius: 6 }}>
                🔥 {streak}x STREAK
              </div>
            )}
          </div>
        </div>

        <div style={{ 
          display: "flex", alignItems: "center", gap: 10,
          background: "#000", border: `1px solid ${timerColor}`, padding: "8px 16px", borderRadius: 8,
          boxShadow: `0 0 10px ${timerColor}44`,
          animation: timeLeft <= 10 && !answered ? "timerPulse 1s infinite" : "none"
        }}>
          <span style={{ fontSize: 11, color: "#a3a3a3", fontWeight: 600 }}>TIMEOUT</span>
          <span style={{ fontSize: 18, color: timerColor, fontWeight: 800, width: 34, textAlign: "center", textShadow: `0 0 8px ${timerColor}` }}>
            {timeLeft}s
          </span>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 11, color: "#a3a3a3", marginBottom: 4, fontWeight: 600 }}>
            {question.language.toUpperCase()}
          </div>
          <h2 style={{ fontSize: "clamp(1.2rem, 3vw, 1.6rem)", color: "#f8fafc", margin: 0, fontWeight: 800, letterSpacing: -0.5, textShadow: "0 0 10px rgba(248, 250, 252, 0.3)" }}>
            {question.title}
          </h2>
        </div>
        <div style={{
          fontSize: 11, padding: "4px 10px", borderRadius: 6, fontWeight: 600,
          border: `1px solid ${question.diffColor}`, color: question.diffColor, background: `${question.diffColor}22`
        }}>
          {question.difficulty}
        </div>
      </div>

      <div className="terminal-window" style={{ padding: 0, border: "1px solid #333", marginBottom: 24, overflow: "hidden", opacity: 0, animation: "fadeUp 0.6s ease forwards", animationDelay: "0.1s", boxShadow: "none" }}>
        <div style={{ background: "#111", padding: "10px 16px", borderBottom: "1px solid #333", display: "flex", gap: 6, alignItems: "center" }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#f87171" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#fbbf24" }} />
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--primary)" }} />
          <span style={{ fontSize: 11, color: "#a3a3a3", marginLeft: 8 }}>
            ./target_source.{question.language === "Java" ? "java" : question.language === "PHP" ? "php" : question.language === "Python" ? "py" : question.language === "HTML" ? "html" : "js"}
          </span>
        </div>
        <pre style={{ margin: 0, padding: "20px", fontSize: 13, lineHeight: 1.6, color: "#e2e8f0", overflowX: "auto" }}>
          {question.code}
        </pre>
      </div>

      <p style={{ fontSize: 15, color: "#e2e8f0", marginBottom: 20, fontWeight: 600, opacity: 0, animation: "fadeUp 0.6s ease forwards", animationDelay: "0.3s" }}>
        <span style={{ color: "var(--primary)", marginRight: 8 }}>$</span>{displayedQuestion}
        <span style={{ color: "var(--primary)", marginLeft: 4 }}>{displayedQuestion.length < question.question.length ? "█" : "_"}</span>
      </p>

      {/* HINT SYSTEM - [FUTURE DEV]: Temporarily hidden to avoid issues. Uncomment to re-enable */}
      {/*
      {!answered && question.hint && (
        <div style={{ marginBottom: 24, opacity: 0, animation: "fadeUp 0.6s ease forwards", animationDelay: "0.4s" }}>
          <button
            onClick={handleHint}
            disabled={showHint}
            style={{ background: showHint ? "var(--primary-bg)" : "#000", border: `1px dashed ${showHint ? "var(--primary)" : "#fbbf24"}`, color: showHint ? "var(--primary)" : "#fbbf24", padding: "8px 12px", fontSize: 12, cursor: showHint ? "default" : "pointer", borderRadius: 8, transition: "all 0.2s" }}
          >
            {showHint ? `[!] HINT: ${question.hint}` : "./DECRYPT_HINT.sh --cost 10s"}
          </button>
        </div>
      )}
      */}

      <div style={{ display: "grid", gap: 12, marginBottom: 24 }}>
        {shuffledOptions.map((opt, idx) => {
          const c = optColors(idx, hoveredOption === idx);
          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={answered}
              onMouseEnter={() => !answered && setHoveredOption(idx)}
              onMouseLeave={() => !answered && setHoveredOption(null)}
              style={{
                background: c.bg, border: `1px solid ${c.border}`, borderRadius: 8, padding: "16px 20px",
                color: c.font, fontSize: 14, textAlign: "left", fontWeight: 600,
                cursor: answered ? "default" : "pointer", display: "flex", gap: 12, transition: "all 0.2s", transform: c.transform,
                boxShadow: answered && idx === selected ? `0 0 15px ${c.border}44` : "none",
                opacity: 0, animation: "fadeUp 0.4s ease forwards", animationDelay: `${0.4 + (idx * 0.1)}s`
              }}
            >
              <span style={{ color: c.color, width: 24 }}>[{String.fromCharCode(65 + idx)}]</span>
              <span>{opt.text}</span>
            </button>
          );
        })}
      </div>

      {answered && (
        <div className="terminal-window" style={{ background: earned > 0 ? "var(--primary-bg)" : "#450a0a", borderColor: earned > 0 ? "var(--primary)" : "#f87171", animation: "fadeUp 0.3s ease", boxShadow: `0 0 20px ${earned > 0 ? "var(--primary-glow)" : "rgba(248,113,113,0.15)"}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: earned > 0 ? "var(--primary)" : "#f87171", textShadow: `0 0 5px ${earned > 0 ? "var(--primary)" : "#f87171"}` }}>
              {getReactionMessage()}
            </span>
            {earned > 0 && (
              <span style={{ fontSize: 12, color: "#22d3ee", fontWeight: 600 }}>
                +{earned} XP
              </span>
            )}
          </div>
          <p style={{ fontSize: 14, color: "#e2e8f0", margin: "0 0 16px", lineHeight: 1.6 }}>
            {question.explanation}
          </p>
          <button
            onClick={() => setShowFix(!showFix)}
            className="btn-outline"
          >
            {showFix ? "[-] CLOSE SECURE_FIX.PATCH" : "[+] CAT SECURE_FIX.PATCH"}
          </button>
          {showFix && (
            <pre style={{ marginTop: 16, padding: 16, background: "#000", border: "1px solid #333", borderRadius: 8, fontSize: 12, color: "#22d3ee", overflowX: "auto" }}>
              {question.fix}
            </pre>
          )}
          <div style={{ marginTop: 24, textAlign: "right" }}>
            // [DEV NOTE]: Exw duo koumpia gia proceed. H logiki gia next module/profile einai idi sto handleProceed kai handleNext sto context, opote to button auto den exei kritiki leitourgia pros to paron.
            {/* <button onClick={handleProceed} className="btn-primary">
              ./NEXT_MODULE.sh
            </button> */}
          </div>
        </div>
      )}
    </div>
  );
}