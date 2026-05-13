"use client";

import { createContext, useContext } from "react";

export type GameView = "intro" | "quiz" | "profile";
export type NavTarget = `/${GameView}` | "/" | "/quit";

export type GameNavigate = (target: NavTarget) => void;

const NavCtx = createContext<GameNavigate | null>(null);

export function GameNavProvider({
  navigate,
  children,
}: {
  navigate: GameNavigate;
  children: React.ReactNode;
}) {
  return <NavCtx.Provider value={navigate}>{children}</NavCtx.Provider>;
}

export function useNavigate(): GameNavigate {
  const fn = useContext(NavCtx);
  if (!fn) throw new Error("useNavigate must be used within GameNavProvider");
  return fn;
}
