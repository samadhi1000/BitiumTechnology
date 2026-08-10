"use client";

import React, { useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { PenTool, Layers, Printer, Stamp, Scissors, ChevronLeft, ChevronRight } from "lucide-react";

interface HeroCardItem {
  id: string;
  title: string;
  desc: string;
  image: string;
  href: string;
  icon: React.ElementType;
}

const HERO_ITEMS: HeroCardItem[] = [
  {
    id: "stencil",
    title: "Custom Stencils",
    desc: "Precision laser-cut stencils for every creative need.",
    image: "/images/hero-cards/stencil.jpg",
    href: "/stencil",
    icon: PenTool,
  },
  {
    id: "dtf",
    title: "DTF Film Rolls",
    desc: "High-quality film rolls for vibrant and durable prints.",
    image: "/images/hero-cards/dtf.jpg",
    href: "/dtf-printing",
    icon: Layers,
  },
  {
    id: "screen-printing",
    title: "Screen Printing",
    desc: "Professional screen printing materials and accessories.",
    image: "/images/hero-cards/screenprint.jpg",
    href: "/screen-printing",
    icon: Printer,
  },
  {
    id: "batik-stamp",
    title: "Batik Stamps",
    desc: "Traditional batik stamps crafted to perfection.",
    image: "/images/hero-cards/batik.jpg",
    href: "/batik-stamp",
    icon: Stamp,
  },
  {
    id: "laser-cutting",
    title: "Laser Engraving",
    desc: "Precision CNC laser cutting and engraving solutions.",
    image: "/images/hero-cards/laser.jpg",
    href: "/laser-cutting",
    icon: Scissors,
  },
];

export const HeroShowcaseCarousel: React.FC = () => {
  // Triplicate array to allow continuous seamless wrapping in either direction
  const displayItems = [...HERO_ITEMS, ...HERO_ITEMS, ...HERO_ITEMS];

  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);

  // Position & Velocity references for smooth 60/120fps physics
  const currentX = useRef<number>(0);
  const targetVelocity = useRef<number>(-0.6); // Base auto-scroll speed (negative = right-to-left)
  const currentVelocity = useRef<number>(-0.6);
  const singleSetWidth = useRef<number>(0);

  const isHovered = useRef<boolean>(false);
  const isDragging = useRef<boolean>(false);
  const dragStartX = useRef<number>(0);
  const lastMouseX = useRef<number>(0);

  // Measure single set width (5 cards * (cardWidth + gap))
  const updateMetrics = useCallback(() => {
    if (!trackRef.current) return;
    const totalWidth = trackRef.current.scrollWidth;
    // Since displayItems has 3 sets:
    singleSetWidth.current = totalWidth / 3;
  }, []);

  useEffect(() => {
    updateMetrics();
    window.addEventListener("resize", updateMetrics);
    return () => window.removeEventListener("resize", updateMetrics);
  }, [updateMetrics]);

  // Main animation loop
  useEffect(() => {
    let lastTime = performance.now();

    const animate = (time: number) => {
      const delta = Math.min((time - lastTime) / 16.666, 2.0); // normalize frame rate
      lastTime = time;

      if (!isDragging.current) {
        // Smoothly interpolate velocity
        currentVelocity.current += (targetVelocity.current - currentVelocity.current) * 0.08;
        currentX.current += currentVelocity.current * delta;
      }

      // Infinite Seamless Wrapping Logic
      if (singleSetWidth.current > 0) {
        // If scrolled past the first set to the left, wrap seamlessly
        while (currentX.current <= -singleSetWidth.current) {
          currentX.current += singleSetWidth.current;
        }
        // If scrolled past zero to the right, wrap seamlessly
        while (currentX.current > 0) {
          currentX.current -= singleSetWidth.current;
        }
      }

      // Apply transform directly to GPU accelerated layer
      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(${currentX.current}px, 0, 0)`;
      }

      rafId.current = requestAnimationFrame(animate);
    };

    rafId.current = requestAnimationFrame(animate);

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  // Mouse Move Event Tracker (Maps mouse position across container to speed and direction)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging.current || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    // Normalized cursor X from -1 (left edge) to 0 (center) to +1 (right edge)
    const relativeX = (e.clientX - rect.left) / rect.width; // 0 to 1
    const offsetFromCenter = (relativeX - 0.5) * 2; // -1 (left) to 0 (center) to +1 (right)

    // Map position to velocity:
    // Moving cursor to the right edge (offset > 0) => scrolls faster to the left (negative velocity)
    // Moving cursor to the left edge (offset < 0) => scrolls to the right (positive velocity)
    // Center (offset ≈ 0) => gentle base scroll
    if (Math.abs(offsetFromCenter) < 0.15) {
      targetVelocity.current = -0.4;
    } else {
      // Speed scales up to -3.5px/frame on right, or +3.5px/frame on left
      targetVelocity.current = -offsetFromCenter * 3.5;
    }
  };

  const handleMouseEnter = () => {
    isHovered.current = true;
  };

  const handleMouseLeave = () => {
    isHovered.current = false;
    // Resume gentle auto-scroll speed
    targetVelocity.current = -0.6;
  };

  // Drag / Swipe handling
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    dragStartX.current = e.clientX;
    lastMouseX.current = e.clientX;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleDragMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const deltaX = e.clientX - lastMouseX.current;
    currentX.current += deltaX;
    lastMouseX.current = e.clientX;
  };

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    isDragging.current = true;
    dragStartX.current = e.touches[0].clientX;
    lastMouseX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const touchX = e.touches[0].clientX;
    const deltaX = touchX - lastMouseX.current;
    currentX.current += deltaX;
    lastMouseX.current = touchX;
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
  };

  // Step button actions
  const scrollStep = (direction: "left" | "right") => {
    const stepSize = 168; // 1 card + gap
    if (direction === "left") {
      currentX.current += stepSize;
    } else {
      currentX.current -= stepSize;
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={(e) => {
        handleMouseMove(e);
        handleDragMove(e);
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="w-full max-w-[540px] group relative select-none rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-white/20 bg-white/95 dark:bg-black/50 backdrop-blur-xl p-4 sm:p-5 shadow-xl dark:shadow-2xl overflow-hidden transition-colors duration-300 cursor-grab active:cursor-grabbing"
    >
      {/* Ambient Light Effect inside frame */}
      <div className="absolute -top-20 -right-20 w-48 h-48 bg-emerald-500/10 dark:bg-[#2CFF05]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-slate-300/20 dark:bg-white/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header inside frame */}
      <div className="mb-3.5 flex items-center justify-between relative z-10">
        <h3 className="font-heading font-extrabold text-sm sm:text-[15px] tracking-tight text-slate-900 dark:text-white drop-shadow-sm flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-[#2CFF05] animate-pulse shrink-0" />
          <span>
            Everything You Need to{" "}
            <span className="text-emerald-600 dark:text-[#2CFF05] dark:drop-shadow-[0_0_10px_rgba(44,255,5,0.4)]">
              Create, Print &amp; Deliver
            </span>
          </span>
        </h3>

        {/* Quick Nav Arrows */}
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              scrollStep("left");
            }}
            aria-label="Scroll carousel left"
            className="w-6 h-6 rounded-full border border-slate-200 dark:border-white/15 bg-white dark:bg-black/60 flex items-center justify-center text-slate-600 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-[#2CFF05] transition-all shadow-sm active:scale-95"
          >
            <ChevronLeft size={13} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              scrollStep("right");
            }}
            aria-label="Scroll carousel right"
            className="w-6 h-6 rounded-full border border-slate-200 dark:border-white/15 bg-white dark:bg-black/60 flex items-center justify-center text-slate-600 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-[#2CFF05] transition-all shadow-sm active:scale-95"
          >
            <ChevronRight size={13} />
          </button>
        </div>
      </div>

      {/* Viewport & Hardware Accelerated Infinite Track */}
      <div className="relative overflow-hidden w-full select-none py-1 z-10">
        {/* Soft edge gradient masks */}
        <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-white/95 dark:from-black/50 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white/95 dark:from-black/50 to-transparent z-10 pointer-events-none" />

        <div
          ref={trackRef}
          style={{ willChange: "transform" }}
          className="flex items-stretch gap-3 transition-transform ease-out"
        >
          {displayItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link
                key={`${item.id}-${index}`}
                href={item.href}
                draggable={false}
                className="w-[145px] sm:w-[155px] shrink-0 p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/90 dark:bg-white/[0.08] dark:hover:bg-white/[0.15] border border-slate-200/80 dark:border-white/15 hover:border-emerald-500/50 dark:hover:border-[#2CFF05]/70 transition-all duration-200 flex flex-col group/card cursor-pointer shadow-sm dark:shadow-lg backdrop-blur-sm"
              >
                {/* Image */}
                <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-slate-200 dark:bg-zinc-900 border border-slate-200 dark:border-white/20 mb-2 pointer-events-none">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="160px"
                    draggable={false}
                    className="object-cover group-hover/card:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Category Icon & Title */}
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/15 dark:bg-[#2CFF05]/20 border border-emerald-500/30 dark:border-[#2CFF05]/40 flex items-center justify-center text-emerald-600 dark:text-[#2CFF05] shrink-0">
                    <Icon size={11} strokeWidth={2.2} />
                  </div>
                  <h4 className="font-heading font-bold text-[12px] text-slate-900 dark:text-white group-hover/card:text-emerald-600 dark:group-hover/card:text-[#2CFF05] transition-colors truncate">
                    {item.title}
                  </h4>
                </div>

                {/* Description */}
                <p className="text-[10px] text-slate-600 dark:text-zinc-300 leading-tight line-clamp-2">
                  {item.desc}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HeroShowcaseCarousel;
