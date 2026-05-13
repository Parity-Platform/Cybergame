"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GameStateProvider, useGameState } from "../context/GameStateContext";
import { GameNavProvider, type GameView, type NavTarget } from "./nav";
import IntroScreen from "../screens/IntroScreen";
import QuestionScreen from "../screens/QuestionScreen";
import ProfileScreen from "../screens/ProfileScreen";
import MatrixRain from "../components/MatrixRain";
import "./game.css";

function GuestBanner() {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: "rgba(8, 8, 12, 0.96)",
        borderTop: "1px solid rgba(124, 92, 255, 0.25)",
        padding: "10px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontFamily: "var(--font-inter, system-ui, sans-serif)",
        fontSize: "13px",
      }}
    >
      <span style={{ color: "#9ca3af" }}>
        Playing as guest. Progress not saved.
      </span>
      <a
        href="/signup"
        style={{
          color: "#a78bfa",
          fontWeight: 600,
          textDecoration: "none",
          borderBottom: "1px solid rgba(167, 139, 250, 0.35)",
          paddingBottom: "1px",
        }}
      >
        Create account →
      </a>
    </div>
  );
}

function GameInner({ guest }: { guest?: boolean }) {
  const router = useRouter();
  const [view, setView] = useState<GameView>("intro");
  const { activeQuestions, qIndex, answered, handleNext } = useGameState();

  const exitTarget = guest ? "/" : "/gallery";

  const navigate = (target: NavTarget) => {
    if (target === "/" || target === "/quit") {
      router.push(exitTarget);
      return;
    }
    setView(target.slice(1) as GameView);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") router.push(exitTarget);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router, exitTarget]);

  return (
    <GameNavProvider navigate={navigate}>
      <div className="game-root">
        <div className="bg-solid" />
        <MatrixRain color="#166534" />
        <div className="bg-grid" />

        <div key={view} className="animate-screen">
          {view === "intro" && <IntroScreen />}
          {view === "quiz" && (
            <>
              <QuestionScreen key={qIndex} />
              {answered && (
                <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 16px 32px", display: "flex", justifyContent: "flex-end" }}>
                  <button
                    onClick={() => {
                      const done = handleNext();
                      if (done) navigate("/profile");
                    }}
                    className="btn-primary"
                    style={{ maxWidth: "max-content", padding: "14px 32px", fontSize: 13, textTransform: "uppercase", letterSpacing: 2, background: "#000" }}
                  >
                    {qIndex + 1 >= activeQuestions.length ? "./EVALUATE_SCORE" : "./NEXT_MODULE"}
                  </button>
                </div>
              )}
            </>
          )}
          {view === "profile" && <ProfileScreen />}
        </div>
      </div>
    </GameNavProvider>
  );
}

export default function VulnhuntApp({ guest }: { guest?: boolean }) {
  return (
    <>
      <GameStateProvider>
        <GameInner guest={guest} />
      </GameStateProvider>
      {guest && <GuestBanner />}
    </>
  );
}
