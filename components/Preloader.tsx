'use client';

import React, { useEffect, useRef, useState } from 'react';

export default function Preloader({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<'in' | 'playing' | 'out'>('in');
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }

    // 5 seconds duration
    const t1 = setTimeout(() => setPhase('playing'), 100);
    const t2 = setTimeout(() => setPhase('out'), 5000);
    const t3 = setTimeout(() => onDone(), 5600);

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
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#000000]
        transition-all duration-700 ease-in-out ${wrapperCls}`}
      style={{ backgroundColor: '#000000' }}
    >
      {/* 2.5" x 2.5" (~200px - 225px) Video Container on 100% Solid Black */}
      <div className="relative z-10 w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center bg-[#000000]">
        <video
          ref={videoRef}
          src="/preloader.mp4"
          autoPlay
          muted
          playsInline
          onEnded={handleVideoEnded}
          className="w-full h-full object-contain mix-blend-screen bg-[#000000]"
          style={{ backgroundColor: '#000000' }}
        />
      </div>
    </div>
  );
}
