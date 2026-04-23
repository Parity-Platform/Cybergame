// src/App.tsx
import { useState } from "react";
import { QUESTIONS } from "./data/questions";
import type { Category, Question, CategoryStats } from "./types";

import IntroScreen from "./screens/IntroScreen";
import QuestionScreen from "./screens/QuestionScreen";
import ProfileScreen from "./screens/ProfileScreen";

export default function App() {
  const [screen, setScreen] = useState<"intro" | "quiz" | "profile">("intro"); 
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [qIndex, setQIndex] = useState<number>(0);
  const [totalXP, setTotalXP] = useState<number>(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [answered, setAnswered] = useState<boolean>(false);
  const [streak, setStreak] = useState<number>(0);
  const [categoryStats, setCategoryStats] = useState<CategoryStats>({});

  const handleStart = (selectedCategories: Category[]) => {
    let filtered = QUESTIONS.filter(q => selectedCategories.includes(q.category));
    
    // Shuffle and pick up to 10 questions for a dynamic, longer gameplay session
    filtered = filtered.sort(() => 0.5 - Math.random()).slice(0, 10);

    const initialStats: CategoryStats = {};
    filtered.forEach(q => {
      if (!initialStats[q.category]) initialStats[q.category] = { correct: 0, total: 0 };
    });

    setActiveQuestions(filtered);
    setCategoryStats(initialStats);
    setQIndex(0);
    setTotalXP(0);
    setAnswers([]);
    setStreak(0);
    setAnswered(false);
    setScreen("quiz");
  };

  const handleAnswer = (isCorrect: boolean, xp: number, category: string) => {
    setAnswers(prev => [...prev, isCorrect]);
    setTotalXP(prev => prev + xp);
    
    if (isCorrect) {
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }

    setCategoryStats(prev => ({
      ...prev,
      [category]: {
        total: prev[category].total + 1,
        correct: prev[category].correct + (isCorrect ? 1 : 0)
      }
    }));

    setAnswered(true);
  };

  const handleNext = () => {
    if (qIndex + 1 >= activeQuestions.length) {
      setScreen("profile");
    } else {
      setQIndex(i => i + 1);
      setAnswered(false);
    }
  };

  const maxPossibleXP = activeQuestions.reduce((acc) => acc + 150, 0); 

  return (
    <div style={{ minHeight: "100vh", position: "relative", overflow: "hidden", paddingBottom: 40, backgroundColor: "#050505", color: "#4ade80", fontFamily: "monospace" }}>
      <div style={{ position: "fixed", inset: 0, backgroundImage: "radial-gradient(#166534 1px, transparent 1px)", backgroundSize: "24px 24px", opacity: 0.3, pointerEvents: "none", zIndex: -1 }} />
      
      {screen === "intro" && <IntroScreen onStart={handleStart} />}

      {screen === "quiz" && (
        <>
          <QuestionScreen
            question={activeQuestions[qIndex]}
            qIndex={qIndex}
            total={activeQuestions.length}
            currentXP={totalXP}
            streak={streak}
            onAnswer={handleAnswer}
            answered={answered}
          />
          {answered && (
            <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 16px 32px", display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={handleNext}
                style={{ fontSize: 13, fontWeight: 600, letterSpacing: 2, padding: "14px 32px", background: "#000000", border: "1px solid #4ade80", color: "#4ade80", borderRadius: 8, cursor: "pointer", transition: "all 0.2s", textTransform: "uppercase" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#4ade80"; e.currentTarget.style.color = "#000"; e.currentTarget.style.boxShadow = "0 0 15px #4ade80"; e.currentTarget.style.transform = "translateX(4px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#000000"; e.currentTarget.style.color = "#4ade80"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateX(0)"; }}
              >
                {qIndex + 1 >= activeQuestions.length ? "./EVALUATE_SCORE" : "./NEXT_MODULE"}
              </button>
            </div>
          )}
        </>
      )}

      {screen === "profile" && (
        <ProfileScreen
          totalXP={totalXP}
          answers={answers}
          maxPossibleXP={maxPossibleXP}
          categoryStats={categoryStats}
          onRestart={() => setScreen("intro")}
        />
      )}
    </div>
  );
}