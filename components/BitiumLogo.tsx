"use client";
import React, { useEffect, useRef } from 'react';

interface BitiumLogoProps {
  className?: string;
  withParticles?: boolean;
  scale?: number;
}

export default function BitiumLogo({ className = "", withParticles = false, scale = 1 }: BitiumLogoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!withParticles) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: any[] = [];
    const particleCount = 45;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 0.5,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.6 + 0.2
      });
    }

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.15 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      });

      animationFrameId = requestAnimationFrame(drawParticles);
    };

    drawParticles();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [withParticles]);

  const scaledSize = 180 * scale;

  return (
    <div 
      className={`relative flex justify-center items-center overflow-hidden ${className}`} 
      style={{ 
        width: withParticles ? '100%' : `${scaledSize}px`,
        height: withParticles ? '350px' : `${scaledSize}px`,
        background: withParticles ? 'radial-gradient(circle at center, rgba(30, 35, 55, 0.4) 0%, rgba(5, 5, 8, 1) 70%)' : 'transparent' 
      }}
    >
      {withParticles && (
        <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-0"></canvas>
      )}

      {withParticles && (
        <div className="absolute w-[300px] h-[300px] bg-[radial-gradient(circle,rgba(255,255,255,0.15)_0%,rgba(220,38,38,0.1)_40%,transparent_70%)] blur-[20px] z-[2] animate-[pulse-glow_3s_infinite_alternate_ease-in-out]"></div>
      )}

      <div 
        className="relative z-10 flex flex-col items-center justify-center"
        style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}
      >
        <div className="relative flex items-center justify-center w-[180px] h-[180px]">
          
          <div className="absolute w-full h-full rounded-full border-2 border-transparent border-t-[3px] border-r-[3px] border-t-[#ff1a3c] border-r-[#ff1a3c] drop-shadow-[0_0_10px_#ff1a3c] animate-[spin-ring_2.5s_linear_infinite]"></div>
          
          <div className="absolute w-full h-full rounded-full shadow-[0_0_20px_rgba(255,26,60,0.3),inset_0_0_15px_rgba(255,26,60,0.2)] animate-[pulse-ring_2s_ease-in-out_infinite_alternate]"></div>
          
          <div className="absolute flex flex-col items-center text-center">
            <div className="text-[14px] font-[800] tracking-[3px] text-white uppercase mb-[6px] flex items-center gap-[2px] drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
              B<span className="text-[#ff1a3c] drop-shadow-[0_0_12px_#ff1a3c]">!</span>TIUM
            </div>
            <div className="text-[11px] font-[600] tracking-[4px] text-[#d1d5db] mb-[8px]">
              TECHNOLOGY
            </div>

            <svg className="w-[80px] h-[80px] fill-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] animate-[float-emblem_3s_ease-in-out_infinite_alternate]" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <path d="M 20,20 L 45,20 C 60,20 60,38 45,38 C 62,38 62,60 45,60 L 20,60 Z M 30,28 L 30,34 L 42,34 C 48,34 48,28 42,28 Z M 30,42 L 30,52 L 44,52 C 50,42 50,42 44,42 Z" fill="none" stroke="#ffffff" strokeWidth="4" strokeLinejoin="round" />
              <path d="M 45,35 Q 55,20 75,25 Q 65,35 60,40 Q 75,35 85,45 Q 70,50 60,52 Q 65,60 55,65 Q 50,55 45,50 Z" fill="#ffffff" />
              <circle cx="50" cy="50" r="1.5" fill="#ff1a3c" />
            </svg>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin-ring {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse-ring {
          0% { opacity: 0.5; transform: scale(0.98); }
          100% { opacity: 1; transform: scale(1.02); }
        }
        @keyframes pulse-glow {
          0% { opacity: 0.4; transform: scale(0.9); }
          100% { opacity: 0.8; transform: scale(1.1); }
        }
        @keyframes float-emblem {
          0% { transform: translateY(0px); }
          100% { transform: translateY(-3px); }
        }
      `}</style>
    </div>
  );
}
