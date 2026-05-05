// src/App.tsx
import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import { GameStateProvider, useGameState } from "./context/GameStateContext";

import LandingScreen from "./screens/LandingScreen";
import AuthScreen from "./screens/AuthScreen";
import IntroScreen from "./screens/IntroScreen";
import QuestionScreen from "./screens/QuestionScreen";
import ProfileScreen from "./screens/ProfileScreen";
import MatrixRain from "./components/MatrixRain";
import "./index.css";

function AppContent() {
  const { activeQuestions, qIndex, answered, handleNext } = useGameState();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && location.pathname !== "/") {
        navigate("/");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [location.pathname, navigate]);
  
  return (
    <div className="app-wrapper">

      <div className="bg-solid" />
      <MatrixRain color="#166534" />
      <div className="bg-grid" />
      
      <div key={location.pathname} className="animate-screen">
        <Routes location={location}>
          <Route path="/" element={<LandingScreen />} />
          <Route path="/auth" element={<AuthScreen />} />
          <Route path="/intro" element={<IntroScreen />} />
          <Route path="/quiz" element={
            <>
              <QuestionScreen key={qIndex} />
              {answered && (
                <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 16px 32px", display: "flex", justifyContent: "flex-end" }}>
                  <button
                    onClick={() => {
                      if (handleNext()) navigate("/profile");
                    }}
                    className="btn-primary"
                    style={{ maxWidth: "max-content", padding: "14px 32px", fontSize: 13, textTransform: "uppercase", letterSpacing: 2, background: "#000" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "var(--primary)"; e.currentTarget.style.color = "#000"; e.currentTarget.style.boxShadow = "0 0 15px var(--primary-glow)"; e.currentTarget.style.transform = "translateX(4px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "#000"; e.currentTarget.style.color = "var(--primary)"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateX(0)"; }}
                  >
                    {qIndex + 1 >= activeQuestions.length ? "./EVALUATE_SCORE" : "./NEXT_MODULE"}
                  </button>
                </div>
              )}
            </>
          } />
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <GameStateProvider>
        <AppContent />
      </GameStateProvider>
    </BrowserRouter>
  );
}