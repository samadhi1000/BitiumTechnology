'use client';

import React, { useEffect, useState } from 'react';
import Preloader from '@/components/Preloader';

export default function PreloaderWrapper({ children }: { children: React.ReactNode }) {
  const [show, setShow] = useState(true);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    // Only show once per session
    const seen = sessionStorage.getItem('bitium_loaded');
    if (seen) {
      setShow(false);
      setHeroVisible(true);
    }
  }, []);

  const handleDone = () => {
    sessionStorage.setItem('bitium_loaded', '1');
    setShow(false);
    // Smoothly & elegantly reveal main Hero page content
    requestAnimationFrame(() => {
      setHeroVisible(true);
    });
  };

  return (
    <>
      {show && <Preloader onDone={handleDone} />}
      <div 
        className={`transition-all duration-1000 ease-out transform ${
          heroVisible || !show 
            ? 'opacity-100 translate-y-0 scale-100' 
            : 'opacity-0 translate-y-2 scale-[0.99] pointer-events-none'
        }`}
      >
        {children}
      </div>
    </>
  );
}
