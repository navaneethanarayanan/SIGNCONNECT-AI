import { useEffect, useRef } from "react";

type JarvisBackgroundProps = {
  state: "idle" | "listening" | "thinking" | "speaking" | "error";
};

const STATE_HUES: Record<JarvisBackgroundProps["state"], string> = {
  idle: "rgba(34, 211, 238, 0.05)",
  listening: "rgba(34, 211, 238, 0.08)",
  thinking: "rgba(167, 139, 250, 0.08)",
  speaking: "rgba(34, 197, 94, 0.07)",
  error: "rgba(248, 113, 113, 0.08)",
};

const STATE_GRID: Record<JarvisBackgroundProps["state"], string> = {
  idle: "rgba(56, 189, 248, 0.35)",
  listening: "rgba(56, 189, 248, 0.55)",
  thinking: "rgba(167, 139, 250, 0.5)",
  speaking: "rgba(74, 222, 128, 0.4)",
  error: "rgba(248, 113, 113, 0.45)",
};

function JarvisBackground({ state }: JarvisBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      phase: number;
    }[] = [];

    let width = 0;
    let height = 0;
    let animationFrameId = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      width = parent.clientWidth;
      height = parent.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const buildParticles = () => {
      particles.length = 0;
      const count = Math.min(90, Math.floor((width * height) / 22000));
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          size: Math.random() * 1.6 + 0.4,
          phase: Math.random() * Math.PI * 2,
        });
      }
    };

    const draw = (time: number) => {
      const current = stateRef.current;
      const hudColor = STATE_GRID[current];

      ctx.clearRect(0, 0, width, height);

      // Perspective floor grid
      const gridSize = 46;
      const horizonY = height * 0.55;

      ctx.lineWidth = 1;
      for (let i = -16; i <= 16; i++) {
        ctx.beginPath();
        const baseX = width / 2 + i * gridSize;
        ctx.moveTo(baseX, horizonY);
        ctx.lineTo(width / 2 + i * gridSize * 4.2, height + 10);
        ctx.strokeStyle = hudColor;
        ctx.globalAlpha = 0.12 + (16 - Math.abs(i)) * 0.012;
        ctx.stroke();
      }

      for (let j = 0; j < 14; j++) {
        ctx.beginPath();
        const y = horizonY + j * j * 1.7;
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.strokeStyle = hudColor;
        ctx.globalAlpha = Math.max(0.04, 0.3 - j * 0.02);
        ctx.stroke();
      }

      ctx.globalAlpha = 1;

      // Ambient state glow
      const glowCenterX = width / 2;
      const glowY = height * 0.42;
      const glow = ctx.createRadialGradient(
        glowCenterX, glowY, 0,
        glowCenterX, glowY, Math.max(width, height) * 0.55
      );
      glow.addColorStop(0, STATE_HUES[current]);
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);

      // Connecting particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.phase += 0.01;

        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle =
              current === "thinking"
                ? "rgba(167, 139, 250, 0.14)"
                : "rgba(56, 189, 248, 0.14)";
            ctx.lineWidth = 0.6 / (dist / 60);
            ctx.stroke();
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle =
          current === "thinking"
            ? "rgba(192, 132, 252, 0.7)"
            : "rgba(103, 232, 249, 0.7)";
        ctx.globalAlpha = 0.35 + Math.sin(p.phase) * 0.25;
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    buildParticles();
    animationFrameId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="jarvis-bg" aria-hidden="true">
      <canvas ref={canvasRef} />
      <div className="jarvis-bg-vignette" />
      <div className="jarvis-bg-scanline" />
    </div>
  );
}

export default JarvisBackground;