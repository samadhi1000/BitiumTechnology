'use client';

import React, { useEffect, useRef, useState } from 'react';

export default function Preloader({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<'in' | 'playing' | 'out'>('in');
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Attempt video playback
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Fallback for browsers with strict autoplay policies
      });
    }

    // Phase transition timer (video is ~4s long)
    const t1 = setTimeout(() => setPhase('playing'), 100);
    const t2 = setTimeout(() => setPhase('out'), 4000);
    const t3 = setTimeout(() => onDone(), 4600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onDone]);

  const handleVideoEnded = () => {
    setPhase('out');
    setTimeout(() => onDone(), 500);
  };

  const wrapperCls =
    phase === 'out'
      ? 'opacity-0 scale-105 pointer-events-none'
      : 'opacity-100 scale-100';

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black
        transition-all duration-700 ease-in-out ${wrapperCls}`}
    >
      {/* Ambient background glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full bg-violet-600/10 blur-[150px] animate-pulse" />
      </div>

      {/* Seamless Video Container */}
      <div className="relative z-10 w-full max-w-4xl px-4 flex flex-col items-center justify-center">
        <video
          ref={videoRef}
          src="/preloader.mp4"
          autoPlay
          muted
          playsInline
          onEnded={handleVideoEnded}
          className="w-full h-auto max-h-[85vh] object-contain mix-blend-screen bg-black"
        />
      </div>
    </div>
  );
}
