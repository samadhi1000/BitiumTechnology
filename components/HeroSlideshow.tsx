'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const IMAGES = [
  '/images/hero-bg-1.jpg',
  '/images/hero-bg-2.jpg',
  '/images/hero-bg-3.jpg',
];

export const HeroSlideshow: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % IMAGES.length);
    }, 6000); // Change image every 6 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0 bg-zinc-950">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 0.35, scale: 1.1 }}
          exit={{ opacity: 0, scale: 1.15 }}
          transition={{
            opacity: { duration: 1.8, ease: 'easeInOut' },
            scale: { duration: 6.5, ease: 'linear' },
          }}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${IMAGES[index]})` }}
        />
      </AnimatePresence>

      {/* Modern High-End Visual Effects & Overlays */}
      {/* 1. Vignette & Radial Darkening overlay to maintain readability of text */}
      <div className="absolute inset-0 bg-radial-[at_center,_var(--tw-gradient-stops)] from-transparent via-zinc-950/60 to-zinc-950 z-10" />

      {/* 2. Linear Gradient Bottom Fade into content */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/20 via-transparent to-zinc-950 z-10" />

      {/* 3. Subtle grid dot pattern overlay for technical precision print store look */}
      <div 
        className="absolute inset-0 opacity-[0.03] z-10"
        style={{
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
    </div>
  );
};
