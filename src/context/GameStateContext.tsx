"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
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

// Helper to safely load game state from local storage
const getInitialState = () => {
  if (typeof window === "undefined") return {};
  const saved = window.localStorage.getItem("vulnhunt_state");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (error) {
      console.error("[GameStateContext] Failed to parse game state from local storage:", error);
    }
  }
  return {};
};

// Provider component that manages and supplies the global game state to the application
export const GameStateProvider = ({ children }: { children: React.ReactNode }) => {
  const initialState = getInitialState();

  // Core game state variables
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

  // Automatically save state to local storage periodically to prevent data loss
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const stateToSave = { gameMode, activeQuestions, qIndex, totalXP, answers, answered, streak, categoryStats, isAuthenticated };
      if (typeof window !== "undefined") window.localStorage.setItem("vulnhunt_state", JSON.stringify(stateToSave));
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [gameMode, activeQuestions, qIndex, totalXP, answers, answered, streak, categoryStats, isAuthenticated]);

  // Initializes a new game session with 10 random questions from selected categories
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
    if (typeof window !== "undefined") window.localStorage.removeItem("vulnhunt_qstate");
  };

  // Processes a user's answer, updates their XP, streak, and tracks category statistics
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

  // Advances the game to the next question, or signals the end of the quiz
  const handleNext = () => {
    if (qIndex + 1 >= activeQuestions.length) {
      return true;
    } else {
      setQIndex(i => i + 1);
      setAnswered(false);
      return false;
    }
  };

  // Memoize max possible XP to avoid recalculating on every render unless activeQuestions changes
  const maxPossibleXP = useMemo(() => activeQuestions.reduce((acc, q) => acc + 150, 0), [activeQuestions]);

  return (
    <GameStateContext.Provider value={{ gameMode, setGameMode, authType, setAuthType, isAuthenticated, setIsAuthenticated, activeQuestions, qIndex, totalXP, answers, answered, streak, categoryStats, handleStart, handleAnswer, handleNext, maxPossibleXP }}>
      {children}
    </GameStateContext.Provider>
  );
};

// Custom hook to easily consume the GameStateContext
export const useGameState = () => {
  const context = useContext(GameStateContext);
  if (!context) throw new Error("useGameState must be used within GameStateProvider");
  return context;
};