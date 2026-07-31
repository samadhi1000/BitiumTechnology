'use client';

import React, { useEffect, useRef, useState } from 'react';

// ── 1. Metallic Gold & Silver Flame Particle Canvas Component ───────────────────
function GoldSilverParticles() {
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

    // Gold & Silver color palette
    const colors = [
      '#FFD700', // Metallic Gold
      '#FDB813', // Warm Gold
      '#E6CA65', // Light Gold
      '#FFFFFF', // Crisp Pure Silver
      '#E0E0E0', // Platinum Silver
      '#C0C0C0'  // Deep Metallic Silver
    ];

    type Particle = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      life: number;
      maxLife: number;
      color: string;
    };

    const particles: Particle[] = [];
    const NUM_PARTICLES = 120;

    const createParticle = (): Particle => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      // Frame box dimension (~220px)
      const boxSize = 220;
      
      // Spawn particles along the perimeter of the video frame
      const side = Math.floor(Math.random() * 4);
      let x = centerX;
      let y = centerY;

      if (side === 0) { // Top edge
        x = centerX - boxSize / 2 + Math.random() * boxSize;
        y = centerY - boxSize / 2;
      } else if (side === 1) { // Right edge
        x = centerX + boxSize / 2;
        y = centerY - boxSize / 2 + Math.random() * boxSize;
      } else if (side === 2) { // Bottom edge
        x = centerX - boxSize / 2 + Math.random() * boxSize;
        y = centerY + boxSize / 2;
      } else { // Left edge
        x = centerX - boxSize / 2;
        y = centerY - boxSize / 2 + Math.random() * boxSize;
      }

      // Angle pointing outwards from center for spreading flame effect
      const angle = Math.atan2(y - centerY, x - centerX) + (Math.random() - 0.5) * 0.5;
      const speed = Math.random() * 1.5 + 0.5;

      return {
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.4, // Subtle upward flame drift
        size: Math.random() * 2.8 + 0.8,
        alpha: Math.random() * 0.8 + 0.2,
        life: 0,
        maxLife: Math.random() * 60 + 40,
        color: colors[Math.floor(Math.random() * colors.length)]
      };
    };

    for (let i = 0; i < NUM_PARTICLES; i++) {
      particles.push(createParticle());
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, idx) => {
        p.life++;
        p.x += p.vx;
        p.y += p.vy;

        // Fade out as life increases
        const currentAlpha = (1 - p.life / p.maxLife) * p.alpha;

        if (p.life >= p.maxLife || currentAlpha <= 0) {
          particles[idx] = createParticle();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, currentAlpha);
          ctx.shadowBlur = p.size * 3;
          ctx.shadowColor = p.color;
          ctx.fill();
        }
      });

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />;
}

// ── 2. Premium Preloader Component ──────────────────────────────────────────────
export default function Preloader({ onDone }: { onDone: () => void }) {
  // Sequence States: 'video' -> 'blackout' -> 'reveal'
  const [stage, setStage] = useState<'video' | 'blackout' | 'reveal'>('video');
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }

    // Sequence Timings:
    // 1. Video & Gold-Silver Flame Frame active for 4.2 seconds
    const videoTimer = setTimeout(() => {
      setStage('blackout');
    }, 4200);

    // 2. Solid Blackout Screen held for EXACTLY 1 second (1000ms)
    const blackoutTimer = setTimeout(() => {
      setStage('reveal');
      onDone();
    }, 5200);

    return () => {
      clearTimeout(videoTimer);
      clearTimeout(blackoutTimer);
    };
  }, [onDone]);

  const handleVideoEnded = () => {
    if (stage === 'video') {
      setStage('blackout');
      setTimeout(() => {
        setStage('reveal');
        onDone();
      }, 1000);
    }
  };

  if (stage === 'reveal') return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[#000000] transition-opacity duration-500 ${
        stage === 'blackout' ? 'opacity-100 bg-[#000000]' : 'opacity-100'
      }`}
      style={{ backgroundColor: '#000000' }}
    >
      {/* Dynamic Gold & Silver Keyframe Styles */}
      <style jsx global>{`
        @keyframes gold-silver-rotate {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        .gold-silver-border {
          background: linear-gradient(
            135deg, 
            #FFD700 0%, 
            #FFFFFF 25%, 
            #E6CA65 50%, 
            #C0C0C0 75%, 
            #FFD700 100%
          );
          background-size: 300% 300%;
          animation: gold-silver-rotate 4s ease infinite;
        }

        .gold-silver-glow {
          box-shadow: 
            0 0 25px rgba(255, 215, 0, 0.5),
            0 0 50px rgba(192, 192, 192, 0.3),
            inset 0 0 15px rgba(255, 215, 0, 0.3);
        }
      `}</style>

      {/* Render Video Frame & Flame Particles during 'video' stage */}
      {stage === 'video' && (
        <>
          {/* Spreading Flame Particles */}
          <GoldSilverParticles />

          {/* Centered Preloader Video Frame */}
          <div className="relative z-10 p-[3px] rounded-3xl gold-silver-border gold-silver-glow transition-all duration-700 animate-pulse">
            <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-[22px] overflow-hidden bg-[#000000] flex items-center justify-center">
              <video
                ref={videoRef}
                src="/preloader.mp4"
                autoPlay
                muted
                playsInline
                onEnded={handleVideoEnded}
                className="w-full h-full object-cover mix-blend-screen bg-[#000000]"
                style={{ backgroundColor: '#000000' }}
              />
            </div>
          </div>
        </>
      )}

      {/* Solid Blackout Phase: Completely solid black screen held for 1 second */}
      {stage === 'blackout' && (
        <div className="absolute inset-0 bg-[#000000] z-50 pointer-events-none" />
      )}
    </div>
  );
}
