'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const IMAGES = [
  '/images/hero-bg-1.webp',
  '/images/hero-bg-2.webp',
  '/images/hero-bg-3.webp',
  '/images/hero-bg-4.webp',
];

export const HeroSlideshow: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % IMAGES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0 bg-background">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.div
          key={index}
          initial={{ x: '100%', opacity: 0.6 }}
          animate={{ x: '0%', opacity: 1 }}
          exit={{ x: '-100%', opacity: 0.6 }}
          transition={{ 
            x: { duration: 1.6, ease: [0.25, 1, 0.5, 1] },
            opacity: { duration: 1.2, ease: 'easeInOut' }
          }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Background image with gentle right-to-left pan & zoom */}
          <motion.div
            initial={{ scale: 1.05, x: 20 }}
            animate={{ scale: 1.12, x: -20 }}
            transition={{ duration: 6, ease: 'linear' }}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${IMAGES[index]})` }}
          />

          {/* Vignette & Radial Darkening overlay to maintain readability of text */}
          <div className="absolute inset-0 bg-radial-[at_center,_var(--tw-gradient-stops)] from-transparent via-zinc-950/65 to-zinc-950/95 dark:from-transparent dark:via-zinc-950/70 dark:to-zinc-950 z-10" />

          {/* Linear Gradient Top and Bottom Fade into page content */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background z-10" />
        </motion.div>
      </AnimatePresence>

      {/* Subtle grid dot pattern overlay for technical precision print store look */}
      <div 
        className="absolute inset-0 opacity-[0.04] z-20 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.25) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
    </div>
  );
};

