"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
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
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);

  // Position state refs for silky smooth 60/120fps LERP
  const currentX = useRef<number>(0);
  const targetX = useRef<number>(0);
  const autoPlaySpeed = useRef<number>(0.35); // Ambient gentle drift when idle
  const isHovered = useRef<boolean>(false);
  const isDragging = useRef<boolean>(false);
  const dragStartX = useRef<number>(0);
  const dragStartScroll = useRef<number>(0);
  const maxScroll = useRef<number>(0);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Update bounds when container or track resizes
  const updateBounds = useCallback(() => {
    if (!containerRef.current || !trackRef.current) return;
    const containerWidth = containerRef.current.clientWidth;
    const trackWidth = trackRef.current.scrollWidth;
    // maxScroll represents the maximum negative offset
    maxScroll.current = Math.max(0, trackWidth - containerWidth + 24); // 24px padding margin
  }, []);

  useEffect(() => {
    updateBounds();
    window.addEventListener("resize", updateBounds);
    return () => window.removeEventListener("resize", updateBounds);
  }, [updateBounds]);

  // Main animation loop (LERP interpolation)
  useEffect(() => {
    const animate = () => {
      if (!isHovered.current && !isDragging.current) {
        // Ambient auto-scroll when user is not actively interacting
        targetX.current -= autoPlaySpeed.current;
        if (targetX.current < -maxScroll.current) {
          targetX.current = 0; // Loop back gently
          currentX.current = 0;
        } else if (targetX.current > 0) {
          targetX.current = -maxScroll.current;
        }
      }

      // Linear interpolation (LERP): current = current + (target - current) * factor
      const lerpFactor = isDragging.current ? 0.25 : 0.08;
      currentX.current += (targetX.current - currentX.current) * lerpFactor;

      // Apply transform directly to GPU accelerated layer
      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(${currentX.current}px, 0, 0)`;
      }

      // Update arrow button active states
      setCanScrollLeft(currentX.current < -5);
      setCanScrollRight(currentX.current > -maxScroll.current + 5);

      rafId.current = requestAnimationFrame(animate);
    };

    rafId.current = requestAnimationFrame(animate);

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  // Mouse Move Event Tracker (Maps mouse position across hero container to target translation)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging.current || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    // Normalized cursor X from -1 (left edge) to 0 (center) to +1 (right edge)
    const relativeX = (e.clientX - rect.left) / rect.width; // 0 to 1
    const normalized = Math.max(0, Math.min(1, relativeX)); // Clamp [0, 1]

    // Map 0 -> targetX: 0, 1 -> targetX: -maxScroll
    targetX.current = -normalized * maxScroll.current;
  };

  const handleMouseEnter = () => {
    isHovered.current = true;
  };

  const handleMouseLeave = () => {
    isHovered.current = false;
  };

  // Drag to scroll support (Mouse drag & touch)
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    dragStartX.current = e.clientX;
    dragStartScroll.current = targetX.current;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleDragMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const delta = e.clientX - dragStartX.current;
    const nextTarget = dragStartScroll.current + delta * 1.5;
    targetX.current = Math.max(-maxScroll.current, Math.min(0, nextTarget));
  };

  // Touch Support
  const handleTouchStart = (e: React.TouchEvent) => {
    isDragging.current = true;
    dragStartX.current = e.touches[0].clientX;
    dragStartScroll.current = targetX.current;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const delta = e.touches[0].clientX - dragStartX.current;
    const nextTarget = dragStartScroll.current + delta * 1.2;
    targetX.current = Math.max(-maxScroll.current, Math.min(0, nextTarget));
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
  };

  // Button navigation
  const scrollStep = (direction: "left" | "right") => {
    const stepSize = 180;
    if (direction === "left") {
      targetX.current = Math.min(0, targetX.current + stepSize);
    } else {
      targetX.current = Math.max(-maxScroll.current, targetX.current - stepSize);
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
            disabled={!canScrollLeft}
            aria-label="Scroll carousel left"
            className="w-6 h-6 rounded-full border border-slate-200 dark:border-white/15 bg-white dark:bg-black/60 flex items-center justify-center text-slate-600 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-[#2CFF05] disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            <ChevronLeft size={13} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              scrollStep("right");
            }}
            disabled={!canScrollRight}
            aria-label="Scroll carousel right"
            className="w-6 h-6 rounded-full border border-slate-200 dark:border-white/15 bg-white dark:bg-black/60 flex items-center justify-center text-slate-600 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-[#2CFF05] disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            <ChevronRight size={13} />
          </button>
        </div>
      </div>

      {/* Viewport & Hardware Accelerated Track */}
      <div className="relative overflow-hidden w-full select-none py-1 z-10">
        {/* Soft edge gradient masks */}
        <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-white/95 dark:from-black/50 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white/95 dark:from-black/50 to-transparent z-10 pointer-events-none" />

        <div
          ref={trackRef}
          style={{ willChange: "transform" }}
          className="flex items-stretch gap-3 transition-transform ease-out"
        >
          {HERO_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
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
