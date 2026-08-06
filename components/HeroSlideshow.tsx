'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const IMAGES = [
  '/images/hero-bg-1.jpg',
  '/images/hero-bg-2.jpg',
  '/images/hero-bg-3.jpg',
  '/images/hero-bg-4.jpg',
];

export const HeroSlideshow: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // 9 second interval matches the full animation cycle of one slide:
    // 2s (appear/clear overlays) + 5s (clear view) + 2s (darken overlays again) = 9s
    const timer = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % IMAGES.length);
    }, 9000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0 bg-background">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          {/* Background image zooming and opacity cycling */}
          <motion.div
            initial={{ scale: 1.03, opacity: 0 }}
            animate={{ 
              scale: 1.12,
              opacity: [0, 1, 1, 0.35, 0.35] 
            }}
            transition={{
              scale: { duration: 9, ease: 'linear' },
              opacity: { 
                duration: 9, 
                times: [0, 0.22, 0.77, 0.99, 1.0], 
                ease: 'easeInOut' 
              }
            }}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${IMAGES[index]})` }}
          />

          {/* Overlays inside the slide that fade out to make the image 100% clear, then fade back in */}
          {/* 1. Vignette & Radial Darkening overlay to maintain readability of text */}
          <motion.div 
            animate={{ 
              opacity: [1, 0, 0, 1, 1] 
            }}
            transition={{
              duration: 9,
              times: [0, 0.22, 0.77, 0.99, 1.0],
              ease: 'easeInOut'
            }}
            className="absolute inset-0 bg-radial-[at_center,_var(--tw-gradient-stops)] from-transparent via-zinc-950/60 to-zinc-950 z-10"
          />

          {/* 2. Linear Gradient Bottom Fade into content */}
          <motion.div 
            animate={{ 
              opacity: [1, 0, 0, 1, 1] 
            }}
            transition={{
              duration: 9,
              times: [0, 0.22, 0.77, 0.99, 1.0],
              ease: 'easeInOut'
            }}
            className="absolute inset-0 bg-gradient-to-b from-zinc-950/20 via-transparent to-zinc-950 z-10"
          />
        </motion.div>
      </AnimatePresence>

      {/* 3. Subtle grid dot pattern overlay for technical precision print store look (rendered static on top) */}
      <div 
        className="absolute inset-0 opacity-[0.03] z-20"
        style={{
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
    </div>
  );
};
