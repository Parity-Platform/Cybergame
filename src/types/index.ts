// src/types/index.ts

export type Difficulty = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type Category = 
  | "Injection" 
  | "Frontend & Web" 
  | "Authentication & Secrets" 
  | "Architecture & Config" 
  | "Data Integrity" 
  | "Access Control";

export interface Question {
  id: number;
  category: Category;
  title: string;
  language: string;
  difficulty: Difficulty;
  timeLimit: number;
  diffColor: string;
  code: string;
  question: string;
  options: string[]; 
  correct: number;
  explanation: string;
  fix: string;
}

export interface Rank {
  min: number;
  max: number;
  title: string;
  color: string;
  bg: string;
  emoji: string;
  desc: string;
}

export interface CategoryStats {
  [key: string]: {
    total: number;
    correct: number;
  };
}