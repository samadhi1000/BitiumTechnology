'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

// ── Star particle canvas ─────────────────────────────────────────────────────
function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    type Star = { x: number; y: number; r: number; alpha: number; speed: number; drift: number };
    const NUM = 220;
    const stars: Star[] = Array.from({ length: NUM }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.6 + 0.2,
      alpha: Math.random(),
      speed: Math.random() * 0.006 + 0.003,
      drift: (Math.random() - 0.5) * 0.15,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((s) => {
        s.alpha += s.speed;
        if (s.alpha > 1 || s.alpha < 0) s.speed *= -1;
        s.x += s.drift;
        if (s.x < 0) s.x = canvas.width;
        if (s.x > canvas.width) s.x = 0;

        const grd = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 3);
        grd.addColorStop(0, `rgba(180,160,255,${s.alpha})`);
        grd.addColorStop(0.5, `rgba(140,100,255,${s.alpha * 0.4})`);
        grd.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * 3, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

// ── Main preloader ────────────────────────────────────────────────────────────
export default function Preloader({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<'in' | 'hold' | 'out'>('in');

  useEffect(() => {
    // in → hold after 600 ms
    const t1 = setTimeout(() => setPhase('hold'), 600);
    // hold → out after 2 600 ms total
    const t2 = setTimeout(() => setPhase('out'), 2600);
    // unmount after fade completes
    const t3 = setTimeout(() => onDone(), 3400);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, [onDone]);

  // Tailwind transitions controlled via phase state
  const wrapperCls =
    phase === 'out'
      ? 'opacity-0 scale-105 pointer-events-none'
      : 'opacity-100 scale-100';

  const logoCls =
    phase === 'in'
      ? 'opacity-0 scale-75 -translate-y-4'
      : phase === 'hold'
      ? 'opacity-100 scale-100 translate-y-0'
      : 'opacity-0 scale-110 translate-y-4';

  const textCls =
    phase === 'in'
      ? 'opacity-0 translate-y-4'
      : phase === 'hold'
      ? 'opacity-100 translate-y-0'
      : 'opacity-0 -translate-y-4';

  const barCls = phase === 'hold' ? 'w-full' : 'w-0';

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black
        transition-all duration-700 ease-in-out ${wrapperCls}`}
    >
      {/* Dreamy star particles */}
      <StarField />

      {/* Subtle radial glow behind logo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className={`w-[420px] h-[420px] rounded-full bg-violet-700/10 blur-[90px]
            transition-all duration-1000 ${phase === 'hold' ? 'opacity-100' : 'opacity-0'}`}
        />
      </div>

      {/* Logo ring */}
      <div
        className={`relative z-10 transition-all duration-700 ease-out ${logoCls}`}
        style={{ transitionDelay: phase === 'in' ? '0ms' : '0ms' }}
      >
        {/* Spinning ring */}
        <svg
          className={`absolute -inset-5 w-[calc(100%+40px)] h-[calc(100%+40px)] transition-opacity duration-500
            ${phase === 'hold' ? 'opacity-100 animate-spin' : 'opacity-0'}`}
          style={{ animationDuration: '6s' }}
          viewBox="0 0 130 130"
        >
          <circle
            cx="65" cy="65" r="60"
            fill="none"
            stroke="url(#ringGrad)"
            strokeWidth="1.5"
            strokeDasharray="80 300"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="50%" stopColor="#d946ef" />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>
          </defs>
        </svg>

        {/* Second counter-spin ring */}
        <svg
          className={`absolute -inset-3 w-[calc(100%+24px)] h-[calc(100%+24px)] transition-opacity duration-500
            ${phase === 'hold' ? 'opacity-60 animate-spin' : 'opacity-0'}`}
          style={{ animationDuration: '9s', animationDirection: 'reverse' }}
          viewBox="0 0 110 110"
        >
          <circle
            cx="55" cy="55" r="50"
            fill="none"
            stroke="url(#ringGrad2)"
            strokeWidth="1"
            strokeDasharray="30 280"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="ringGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#d946ef" />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>
          </defs>
        </svg>

        {/* Logo image */}
        <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-violet-500/40 shadow-[0_0_40px_rgba(139,92,246,0.45)]">
          <Image
            src="/images/bitium-logo.jpg"
            alt="Bitium Technology"
            fill
            priority
            className="object-cover"
          />
        </div>
      </div>

      {/* Brand text */}
      <div
        className={`relative z-10 mt-8 text-center transition-all duration-700 ease-out ${textCls}`}
        style={{ transitionDelay: phase === 'in' ? '150ms' : '0ms' }}
      >
        <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-white via-violet-300 to-fuchsia-400 bg-clip-text text-transparent">
          PrintGrid
        </h1>
        <p className="mt-1 text-[11px] font-bold text-zinc-500 tracking-[0.25em] uppercase">
          powered by Bitium Technology
        </p>
      </div>

      {/* Loading bar */}
      <div
        className={`relative z-10 mt-10 h-[2px] w-48 rounded-full bg-zinc-900 overflow-hidden
          transition-opacity duration-300 ${phase === 'out' ? 'opacity-0' : 'opacity-100'}`}
      >
        <div
          className={`h-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-violet-500
            transition-all ease-in-out ${barCls}`}
          style={{ transitionDuration: phase === 'hold' ? '1800ms' : '200ms' }}
        />
      </div>
    </div>
  );
}
