"use client";

import { useEffect, useRef } from "react";

export default function MatrixRain({ color = "#166534" }: { color?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    // The binary characters to show in the digital rain
    const letters = "01";
    const fontSize = 14;
    let columns = 0;
    let drops: number[] = [];

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      columns = Math.floor(canvas.width / fontSize);
      // Fill the array with drops randomly spread across the vertical height
      // so it looks like it's already raining when it mounts
      drops = Array.from({ length: columns }).map(() => (Math.random() * canvas.height) / fontSize);
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);

    let lastDrawTime = Date.now();
    const fps = 30; // Limit FPS to make it feel a bit more retro/choppy
    const interval = 1000 / fps;

    const draw = () => {
      animationFrameId = requestAnimationFrame(draw);
      const now = Date.now();
      const elapsed = now - lastDrawTime;

      if (elapsed > interval) {
        lastDrawTime = now - (elapsed % interval);

        // Fade the background to black slowly to create the trail effect
        ctx.fillStyle = "rgba(5, 5, 5, 0.1)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = color;
        ctx.font = `${fontSize}px monospace`;

        for (let i = 0; i < drops.length; i++) {
          const text = letters.charAt(Math.floor(Math.random() * letters.length));
          
          ctx.fillText(text, i * fontSize, drops[i] * fontSize);

          // Reset the drop to the top randomly to keep the rain staggered
          if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i]++;
        }
      }
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [color]);

  return (
    <canvas
      ref={canvasRef}
      style={{ display: "block", position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: -2, opacity: 0.5, pointerEvents: "none" }}
    />
  );
}