'use client';

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Percentage counter progress
  useEffect(() => {
    // Speed of counter
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsDone(true), 400); // Wait briefly at 100%
          setTimeout(() => setIsHidden(true), 1200); // Match transit timing to display none
          return 100;
        }
        // Random progress step
        const step = Math.floor(Math.random() * 8) + 4;
        return Math.min(prev + step, 100);
      });
    }, 60);

    return () => clearInterval(interval);
  }, []);

  // Dreamy Star Particles canvas effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Track window resize
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle schema
    interface Star {
      x: number;
      y: number;
      size: number;
      speed: number;
      opacity: number;
      pulseDirection: number;
    }

    const stars: Star[] = Array.from({ length: 65 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.2 + 0.5,
      speed: Math.random() * 0.4 + 0.1,
      opacity: Math.random() * 0.7 + 0.2,
      pulseDirection: Math.random() > 0.5 ? 1 : -1
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      // Render stars
      stars.forEach((star) => {
        ctx.beginPath();
        // Star pulse glow opacity
        star.opacity += star.pulseDirection * 0.015;
        if (star.opacity >= 0.9) star.pulseDirection = -1;
        if (star.opacity <= 0.15) star.pulseDirection = 1;

        ctx.fillStyle = `rgba(167, 139, 250, ${star.opacity})`; // Soft violet star tint
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        // Slow drifting movement
        star.y -= star.speed;
        if (star.y < -10) {
          star.y = height + 10;
          star.x = Math.random() * width;
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (isHidden) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center transition-all duration-700 ease-in-out ${
        isDone ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Background Star Particles */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Loader Container */}
      <div className="relative z-10 flex flex-col items-center gap-6 select-none">
        
        {/* Animated Glowing Ring & Logo */}
        <div className="relative w-28 h-28 flex items-center justify-center">
          {/* Pulsing Back Glow */}
          <div className="absolute inset-0 rounded-full bg-violet-600/35 filter blur-xl animate-pulse"></div>
          
          {/* Spinning Tech Ring */}
          <div className="absolute inset-0 border border-t-violet-500 border-r-fuchsia-500 border-b-transparent border-l-transparent rounded-full animate-spin [animation-duration:1.5s]"></div>
          
          {/* Logo Frame */}
          <div className="w-[100px] h-[100px] rounded-full overflow-hidden border border-zinc-800 bg-zinc-950 flex items-center justify-center p-1.5 shadow-2xl relative z-10 animate-bounce [animation-duration:3s]">
            <Image
              src="/images/logo-anim.png"
              alt="PrintGrid Animated Logo"
              width={90}
              height={90}
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Counter Text */}
        <div className="text-center space-y-2 mt-4">
          <h2 className="text-lg font-black tracking-[0.25em] bg-gradient-to-r from-white via-violet-300 to-fuchsia-300 bg-[size:200%_auto] text-transparent bg-clip-text animate-pulse">
            PRINTGRID
          </h2>
          <div className="flex items-center justify-center gap-2">
            {/* Loading Bar */}
            <div className="w-32 h-1 bg-zinc-900 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-100 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            {/* Percentage Text */}
            <span className="text-[10px] font-mono text-zinc-400 tracking-wider w-8 text-right">
              {progress}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
