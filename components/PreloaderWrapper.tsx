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
        className={`w-full min-h-full flex flex-col ${
          heroVisible || !show 
            ? 'opacity-100 transition-opacity duration-700' 
            : 'opacity-0 pointer-events-none'
        }`}
      >
        {children}
      </div>
    </>
  );
}
