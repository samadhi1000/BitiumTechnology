'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';

interface ProductCardMediaCarouselProps {
  mainImage: string;
  mockupUrls?: string[];
  alt: string;
  watermarkText?: string;
  aspectRatio?: '3/4' | '4/5' | '1/1' | '16/9';
  className?: string;
}

export default function ProductCardMediaCarousel({
  mainImage,
  mockupUrls = [],
  alt,
  watermarkText = 'Bitium Technology',
  aspectRatio = '3/4',
  className = '',
}: ProductCardMediaCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [enableTransition, setEnableTransition] = useState(true);

  // Combine main artwork image and up to 2 mockups
  const originalSlides = useMemo(() => {
    const list = [mainImage, ...(mockupUrls || [])].filter((url): url is string => Boolean(url && url.trim()));
    return list.length > 0 ? list : [mainImage];
  }, [mainImage, mockupUrls]);

  const hasMultiple = originalSlides.length > 1;

  // Clone first slide at the end for 100% seamless infinite forward sliding without rewinding
  const loopSlides = useMemo(() => {
    if (!hasMultiple) return originalSlides;
    return [...originalSlides, originalSlides[0]];
  }, [originalSlides, hasMultiple]);

  // Auto-slide every 1.2s in one continuous forward direction on hover
  useEffect(() => {
    if (!isHovered || !hasMultiple) {
      setEnableTransition(false);
      setCurrentIndex(0);
      return;
    }

    setEnableTransition(true);
    const interval = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 1200);

    return () => clearInterval(interval);
  }, [isHovered, hasMultiple]);

  // When reached the cloned slide at the end (loopSlides.length - 1), seamlessly reset to index 0
  useEffect(() => {
    if (currentIndex >= loopSlides.length - 1) {
      const timer = setTimeout(() => {
        setEnableTransition(false);
        setCurrentIndex(0);
      }, 550); // Matches the 0.55s slide animation duration

      return () => clearTimeout(timer);
    } else {
      // Re-enable transition for regular forward steps
      const timer = setTimeout(() => {
        setEnableTransition(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, loopSlides.length]);

  // Context menu prevention handler to prevent image theft
  const preventTheft = (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const aspectClass =
    aspectRatio === '3/4' ? 'aspect-[3/4]' :
    aspectRatio === '4/5' ? 'aspect-[4/5]' :
    aspectRatio === '1/1' ? 'aspect-square' :
    aspectRatio === '16/9' ? 'aspect-video' : 'aspect-[3/4]';

  const activeDotIndex = currentIndex % originalSlides.length;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setEnableTransition(false);
        setCurrentIndex(0);
      }}
      onContextMenu={preventTheft}
      className={`relative w-full overflow-hidden bg-slate-100 dark:bg-zinc-900 rounded-xl select-none ${aspectClass} ${className}`}
    >
      {/* ── Seamless Infinite Slide Track ── */}
      <div className="relative w-full h-full overflow-hidden">
        {loopSlides.map((src, idx) => {
          const offset = idx - currentIndex;
          return (
            <div
              key={`${src}-${idx}`}
              style={{
                transform: `translateX(${offset * 100}%)`,
                transition: enableTransition
                  ? 'transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)'
                  : 'none',
              }}
              className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none"
            >
              <Image
                src={src}
                alt={`${alt} - View ${(idx % originalSlides.length) + 1}`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover w-full h-full"
                priority={idx === 0}
                draggable={false}
              />
            </div>
          );
        })}
      </div>

      {/* ── Global "Bitium Technology" Watermark Security Overlay ── */}
      <div
        className="absolute inset-0 pointer-events-none select-none z-10 opacity-30 dark:opacity-25 mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='150' viewBox='0 0 220 150'><text x='50%' y='50%' fill='white' font-family='sans-serif' font-weight='bold' font-size='13' text-anchor='middle' transform='rotate(-20 110 75)' opacity='0.85'>${encodeURIComponent(watermarkText)}</text><line x1='0' y1='0' x2='220' y2='150' stroke='rgba(255,255,255,0.18)' stroke-width='1'/></svg>")`,
          backgroundRepeat: 'repeat',
        }}
      />

      {/* ── Overlay Shield to prevent direct image grabbing ── */}
      <div
        className="absolute inset-0 z-20 select-none bg-transparent pointer-events-none"
        onContextMenu={preventTheft}
        onDragStart={preventTheft}
        onDrop={preventTheft}
      />

      {/* ── Multi-image Badge / Slide Indicator Dots (Bottom center) ── */}
      {hasMultiple && (
        <div className="absolute bottom-2 inset-x-0 z-30 flex items-center justify-center gap-1.5 pointer-events-none">
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 shadow-sm transition-opacity duration-300">
            {originalSlides.map((_, dotIdx) => (
              <span
                key={dotIdx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  dotIdx === activeDotIndex
                    ? 'w-3.5 bg-[#2CFF05] shadow-[0_0_6px_rgba(44,255,5,0.8)]'
                    : 'w-1.5 bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
