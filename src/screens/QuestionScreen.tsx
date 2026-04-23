// src/screens/QuestionScreen.tsx
import { useState, useEffect } from "react";
import type { Question } from "../types";

interface QuestionScreenProps {
  question: Question;
  qIndex: number;
  total: number;
  currentXP: number;
  streak: number;
  onAnswer: (isCorrect: boolean, xp: number, category: string) => void;
  answered: boolean;
}

export default function QuestionScreen({ question, qIndex, total, currentXP, streak, onAnswer, answered }: QuestionScreenProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [showFix, setShowFix] = useState(false);
  const maxTime = question.timeLimit + 60; // Give 60 additional seconds dynamically
  const [timeLeft, setTimeLeft] = useState(maxTime);
  const [earned, setEarned] = useState(0);
  const [shuffledOptions, setShuffledOptions] = useState<{text: string, originalIndex: number}[]>([]);
  const [displayedQuestion, setDisplayedQuestion] = useState("");
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    const optionsWithIndices = question.options.map((text, idx) => ({ text, originalIndex: idx }));
    for (let i = optionsWithIndices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [optionsWithIndices[i], optionsWithIndices[j]] = [optionsWithIndices[j], optionsWithIndices[i]];
    }
    setShuffledOptions(optionsWithIndices);
    setSelected(null);
    setShowFix(false);
    setTimeLeft(maxTime);
    setEarned(0);
    setShowHint(false);
  }, [question, qIndex]);

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
    }, 20); // 20ms delay per character

    return () => clearInterval(interval);
  }, [question.question]);

  useEffect(() => {
    if (answered) return;
    if (timeLeft <= 0) {
      handleSelect(-1, true); 
      return;
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, answered]);

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

  const handleHint = () => {
    if (showHint) return;
    setShowHint(true);
    setTimeLeft(prev => Math.max(1, prev - 10)); // Deduct 10 seconds for the hint
  };

  const optColors = (idx: number) => {
    if (selected === null && !answered) return { bg: "#000000", border: "#166534", color: "#4ade80", font: "#a3a3a3" };
    
    const isThisCorrect = shuffledOptions[idx].originalIndex === question.correct;

    if (isThisCorrect && answered) return { bg: "#052e16", border: "#4ade80", color: "#4ade80", font: "#4ade80" };
    if (idx === selected) return { bg: "#450a0a", border: "#f87171", color: "#f87171", font: "#f87171" };
    
    return { bg: "#050505", border: "#166534", color: "#166534", font: "#525252" };
  };

  const timerColor = timeLeft <= 10 ? "#f87171" : timeLeft <= maxTime / 2 ? "#fbbf24" : "#4ade80";

  const getReactionMessage = () => {
    if (selected === -1) return "Execution Timeout.";
    if (earned > 130) return "Optimal Solution (+Speed Bonus)";
    if (earned > 0) return "Vulnerability Verified.";
    return "Incorrect Analysis.";
  };

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "20px 16px", animation: "fadeUp 0.4s ease", fontFamily: "monospace" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 12, color: "#4ade80", letterSpacing: 1 }}>
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
          <h2 style={{ fontSize: "clamp(1.2rem, 3vw, 1.6rem)", color: "#f8fafc", margin: 0, fontWeight: 800, letterSpacing: -0.5 }}>
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

      <div style={{ background: "#0a0a0a", border: "1px solid #333", borderRadius: 8, marginBottom: 24, overflow: "hidden", animation: "fadeUp 0.6s ease forwards", opacity: 0, animationDelay: "0.1s" }}>
        <div style={{ background: "#111", padding: "10px 16px", borderBottom: "1px solid #333", display: "flex", gap: 6, alignItems: "center" }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#f87171" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#fbbf24" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#4ade80" }} />
          <span style={{ fontSize: 11, color: "#a3a3a3", marginLeft: 8 }}>
            ./target_source.{question.language === "Java" ? "java" : question.language === "PHP" ? "php" : question.language === "Python" ? "py" : question.language === "HTML" ? "html" : "js"}
          </span>
        </div>
        <pre style={{ margin: 0, padding: "20px", fontSize: 13, lineHeight: 1.6, color: "#e2e8f0", overflowX: "auto" }}>
          {question.code}
        </pre>
      </div>

      <p style={{ fontSize: 15, color: "#e2e8f0", marginBottom: 20, fontWeight: 600, animation: "fadeUp 0.6s ease forwards", opacity: 0, animationDelay: "0.3s" }}>
        <span style={{ color: "#4ade80", marginRight: 8 }}>$</span>{displayedQuestion}
        <span style={{ color: "#4ade80", marginLeft: 4 }}>{displayedQuestion.length < question.question.length ? "█" : "_"}</span>
      </p>

      {/* HINT SYSTEM */}
      {!answered && (question as any).hint && (
        <div style={{ marginBottom: 24, animation: "fadeUp 0.6s ease forwards", opacity: 0, animationDelay: "0.4s" }}>
          <button
            onClick={handleHint}
            disabled={showHint}
            style={{ background: showHint ? "#052e16" : "#000", border: `1px dashed ${showHint ? "#4ade80" : "#fbbf24"}`, color: showHint ? "#4ade80" : "#fbbf24", padding: "8px 12px", fontSize: 12, cursor: showHint ? "default" : "pointer", borderRadius: 8, transition: "all 0.2s" }}
          >
            {showHint ? `[!] HINT: ${(question as any).hint}` : "./DECRYPT_HINT.sh --cost 10s"}
          </button>
        </div>
      )}

      <div style={{ display: "grid", gap: 12, marginBottom: 24 }}>
        {shuffledOptions.map((opt, idx) => {
          const c = optColors(idx);
          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={answered}
              style={{
                background: c.bg, border: `1px solid ${c.border}`, borderRadius: 8, padding: "16px 20px",
                color: c.font, fontSize: 14, textAlign: "left", fontWeight: 600,
                cursor: answered ? "default" : "pointer", display: "flex", gap: 12, transition: "all 0.2s",
                boxShadow: answered && idx === selected ? `0 0 15px ${c.border}44` : "none",
                animation: "fadeUp 0.4s ease forwards", opacity: 0, 
                animationDelay: `${0.4 + (idx * 0.1)}s`
              }}
              onMouseEnter={e => { if (!answered) { e.currentTarget.style.background = "#111"; e.currentTarget.style.borderColor = "#4ade80"; e.currentTarget.style.transform = "translateY(-1px)"; } }}
              onMouseLeave={e => { if (!answered) { e.currentTarget.style.background = c.bg; e.currentTarget.style.borderColor = c.border; e.currentTarget.style.transform = "translateY(0)"; } }}
            >
              <span style={{ color: c.color, width: 24 }}>[{String.fromCharCode(65 + idx)}]</span>
              <span>{opt.text}</span>
            </button>
          );
        })}
      </div>

      {answered && (
        <div style={{ background: earned > 0 ? "#052e16" : "#450a0a", border: `1px solid ${earned > 0 ? "#4ade80" : "#f87171"}`, borderRadius: 8, padding: 24, animation: "fadeUp 0.3s ease", boxShadow: `0 0 20px ${earned > 0 ? "rgba(74,222,128,0.15)" : "rgba(248,113,113,0.15)"}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: earned > 0 ? "#4ade80" : "#f87171", textShadow: `0 0 5px ${earned > 0 ? "#4ade80" : "#f87171"}` }}>
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
            style={{ fontSize: 11, color: "#a3a3a3", background: "#000", border: "1px solid #333", borderRadius: 6, padding: "8px 16px", cursor: "pointer", fontWeight: 600, transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#111"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#000"; e.currentTarget.style.color = "#a3a3a3"; }}
          >
            {showFix ? "[-] CLOSE SECURE_FIX.PATCH" : "[+] CAT SECURE_FIX.PATCH"}
          </button>
          {showFix && (
            <pre style={{ marginTop: 16, padding: 16, background: "#000", border: "1px solid #333", borderRadius: 8, fontSize: 12, color: "#22d3ee", overflowX: "auto" }}>
              {question.fix}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}