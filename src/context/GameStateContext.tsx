import React, { createContext, useContext, useState, useEffect } from "react";
import { QUESTIONS } from "../data/questions";
import type { Category, Question, CategoryStats } from "../types";

interface GameState {
  gameMode: "cyber" | "it";
  setGameMode: (m: "cyber" | "it") => void;
  authType: "login" | "register";
  setAuthType: (t: "login" | "register") => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  activeQuestions: Question[];
  qIndex: number;
  totalXP: number;
  answers: boolean[];
  answered: boolean;
  streak: number;
  categoryStats: CategoryStats;
  handleStart: (categories: Category[]) => void;
  handleAnswer: (isCorrect: boolean, xp: number, category: string) => void;
  handleNext: () => boolean;
  maxPossibleXP: number;
}

const GameStateContext = createContext<GameState | null>(null);

const getInitialState = () => {
  const saved = localStorage.getItem("vulnhunt_state");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {}
  }
  return {};
};

export const GameStateProvider = ({ children }: { children: React.ReactNode }) => {
  const initialState = getInitialState();
  const [gameMode, setGameMode] = useState<"cyber" | "it">(initialState.gameMode ?? "cyber");
  const [authType, setAuthType] = useState<"login" | "register">("login");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialState.isAuthenticated ?? false);
  const [activeQuestions, setActiveQuestions] = useState<Question[]>(initialState.activeQuestions ?? []);
  const [qIndex, setQIndex] = useState<number>(initialState.qIndex ?? 0);
  const [totalXP, setTotalXP] = useState<number>(initialState.totalXP ?? 0);
  const [answers, setAnswers] = useState<boolean[]>(initialState.answers ?? []);
  const [answered, setAnswered] = useState<boolean>(initialState.answered ?? false);
  const [streak, setStreak] = useState<number>(initialState.streak ?? 0);
  const [categoryStats, setCategoryStats] = useState<CategoryStats>(initialState.categoryStats ?? {});

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const stateToSave = { gameMode, activeQuestions, qIndex, totalXP, answers, answered, streak, categoryStats, isAuthenticated };
      localStorage.setItem("vulnhunt_state", JSON.stringify(stateToSave));
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [gameMode, activeQuestions, qIndex, totalXP, answers, answered, streak, categoryStats, isAuthenticated]);

  const handleStart = (selectedCategories: Category[]) => {
    let filtered = QUESTIONS.filter(q => selectedCategories.includes(q.category));
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
    localStorage.removeItem("vulnhunt_qstate");
  };

  const handleAnswer = (isCorrect: boolean, xp: number, category: string) => {
    setAnswers(prev => [...prev, isCorrect]);
    setTotalXP(prev => prev + xp);
    if (isCorrect) setStreak(prev => prev + 1);
    else setStreak(0);
    setCategoryStats(prev => ({
      ...prev,
      [category]: {
        total: (prev[category]?.total || 0) + 1,
        correct: (prev[category]?.correct || 0) + (isCorrect ? 1 : 0)
      }
    }));
    setAnswered(true);
  };

  const handleNext = () => {
    if (qIndex + 1 >= activeQuestions.length) {
      return true;
    } else {
      setQIndex(i => i + 1);
      setAnswered(false);
      return false;
    }
  };

  const maxPossibleXP = activeQuestions.reduce((acc, q) => acc + 150, 0); 

  return (
    <GameStateContext.Provider value={{ gameMode, setGameMode, authType, setAuthType, isAuthenticated, setIsAuthenticated, activeQuestions, qIndex, totalXP, answers, answered, streak, categoryStats, handleStart, handleAnswer, handleNext, maxPossibleXP }}>
      {children}
    </GameStateContext.Provider>
  );
};

export const useGameState = () => {
  const context = useContext(GameStateContext);
  if (!context) throw new Error("useGameState must be used within GameStateProvider");
  return context;
};