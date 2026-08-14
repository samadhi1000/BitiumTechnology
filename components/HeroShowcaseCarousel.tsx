"use client";

import React, { useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { PenTool, Layers, Printer, Stamp, Scissors, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { useTheme } from "@/lib/context/ThemeContext";
import { useLanguage } from "@/lib/context/LanguageContext";

interface HeroCardItem {
  id: string;
  title: string;
  desc: string;
  image: string;
  href: string;
  icon: React.ElementType;
}

export const HeroShowcaseCarousel: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useLanguage();

  const heroItems: HeroCardItem[] = [
    {
      id: "stencil",
      title: t.heroCards?.customStencils?.title || "Custom Stencils",
      desc: t.heroCards?.customStencils?.desc || "Precision laser-cut stencils for every creative need.",
      image: "/images/hero-cards/stencil.webp",
      href: "/stencil",
      icon: PenTool,
    },
    {
      id: "dtf",
      title: t.heroCards?.dtfFilmRolls?.title || "DTF Film Rolls",
      desc: t.heroCards?.dtfFilmRolls?.desc || "High-quality film rolls for vibrant and durable prints.",
      image: "/images/hero-cards/dtf.webp",
      href: "/dtf-printing",
      icon: Layers,
    },
    {
      id: "screen-printing",
      title: t.heroCards?.screenPrinting?.title || "Screen Printing",
      desc: t.heroCards?.screenPrinting?.desc || "Professional screen printing materials and accessories.",
      image: "/images/hero-cards/screenprint.webp",
      href: "/screen-printing",
      icon: Printer,
    },
    {
      id: "batik-stamp",
      title: t.heroCards?.batikStamps?.title || "Batik Stamps",
      desc: t.heroCards?.batikStamps?.desc || "Traditional batik stamps crafted to perfection.",
      image: "/images/hero-cards/batik.webp",
      href: "/batik-stamp",
      icon: Stamp,
    },
    {
      id: "laser-cutting",
      title: t.heroCards?.laserEngraving?.title || "Laser Engraving",
      desc: t.heroCards?.laserEngraving?.desc || "Precision CNC laser cutting and engraving solutions.",
      image: "/images/hero-cards/laser.webp",
      href: "/laser-cutting",
      icon: Scissors,
    },
    {
      id: "toolkit",
      title: t.heroCards?.toolkitStudio?.title || "Toolkit Studio",
      desc: t.heroCards?.toolkitStudio?.desc || "Interactive 3D mockup studio and gang sheet canvas builder.",
      image: "/images/hero-cards/toolkit.webp",
      href: "/3d-customizer",
      icon: Sparkles,
    },
  ];

  // 5 sets buffer to allow completely seamless, infinite continuous wrapping in both directions
  const displayItems = [...heroItems, ...heroItems, ...heroItems, ...heroItems, ...heroItems];

  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);

  // Position & Velocity references for smooth 60/120fps physics
  const singleSetWidth = useRef<number>(0);
  const currentX = useRef<number>(0);
  const targetVelocity = useRef<number>(-0.6); // Base auto-scroll speed (negative = right-to-left)
  const currentVelocity = useRef<number>(-0.6);

  const isDragging = useRef<boolean>(false);
  const dragStartX = useRef<number>(0);
  const lastMouseX = useRef<number>(0);

  // Measure exact single set width using DOM offset for sub-pixel accuracy
  const updateMetrics = useCallback(() => {
    if (!trackRef.current) return;
    const children = trackRef.current.children;
    if (children.length > heroItems.length) {
      const firstChild = children[0] as HTMLElement;
      const nextSetChild = children[heroItems.length] as HTMLElement;
      if (firstChild && nextSetChild) {
        const calculatedSetWidth = nextSetChild.offsetLeft - firstChild.offsetLeft;
        if (calculatedSetWidth > 0) {
          singleSetWidth.current = calculatedSetWidth;
          if (currentX.current === 0) {
            currentX.current = -calculatedSetWidth * 2;
          }
        }
      }
    }
  }, []);

  useEffect(() => {
    updateMetrics();
    // Delay initial measurement slightly to ensure images & layout are rendered
    const t = setTimeout(updateMetrics, 100);
    window.addEventListener("resize", updateMetrics);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", updateMetrics);
    };
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

      // Infinite Seamless Wrapping Logic (Keeps currentX within buffer range with zero glitch)
      if (singleSetWidth.current > 0) {
        while (currentX.current <= -singleSetWidth.current * 3) {
          currentX.current += singleSetWidth.current;
        }
        while (currentX.current > -singleSetWidth.current * 2) {
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
    // Mouse entered
  };

  const handleMouseLeave = () => {
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
    const stepSize = 168; // 1 card (155px) + gap (12px)
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
      className="w-full max-w-[700px] group relative select-none rounded-2xl sm:rounded-3xl border border-white/10 dark:border-white/10 bg-black/25 dark:bg-black/45 backdrop-blur-[6px] p-4 sm:p-5 shadow-xl dark:shadow-2xl overflow-hidden transition-colors duration-300 cursor-grab active:cursor-grabbing"
    >
      {/* Subtle ambient lighting inside frame */}
      <div className="absolute -top-20 -right-20 w-48 h-48 bg-emerald-500/5 dark:bg-[#2CFF05]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header inside frame */}
      <div className="mb-3.5 flex items-center justify-between relative z-10">
        <h3 className="font-heading font-extrabold text-sm sm:text-[15px] tracking-tight flex items-center gap-2">
          <span className="w-2 h-2 rounded-full animate-pulse shrink-0" style={{ backgroundColor: "#2CFF05" }} />
          <span>
            <span className="font-black text-white" style={{ color: "#ffffff" }}>
              Everything You Need to
            </span>{" "}
            <span className="font-black drop-shadow-[0_0_10px_rgba(44,255,5,0.5)]" style={{ color: "#2CFF05" }}>
              Create, Print &amp; Deliver
            </span>
          </span>
        </h3>

        {/* Quick Nav Arrows */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              scrollStep("left");
            }}
            aria-label="Scroll carousel left"
            className="w-6.5 h-6.5 rounded-full border border-white/20 bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-[#2CFF05] hover:text-[#0a0a0a] hover:border-[#2CFF05] transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <ChevronLeft size={13} className="text-current" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              scrollStep("right");
            }}
            aria-label="Scroll carousel right"
            className="w-6.5 h-6.5 rounded-full border border-white/20 bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-[#2CFF05] hover:text-[#0a0a0a] hover:border-[#2CFF05] transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <ChevronRight size={13} className="text-current" />
          </button>
        </div>
      </div>

      {/* Viewport & Hardware Accelerated Infinite Track */}
      <div className="relative overflow-hidden w-full select-none py-1 z-10">
        {/* Soft edge gradient masks */}
        <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-transparent to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-transparent to-transparent z-10 pointer-events-none" />

        <div
          ref={trackRef}
          style={{ willChange: "transform" }}
          className="flex items-stretch gap-3"
        >
          {displayItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link
                key={`${item.id}-${index}`}
                href={item.href}
                draggable={false}
                className="w-[145px] sm:w-[155px] shrink-0 p-2.5 rounded-xl hero-showcase-card hover:border-emerald-500/50 dark:hover:border-[#2CFF05]/70 transition-all duration-200 flex flex-col group/card cursor-pointer shadow-sm dark:shadow-lg"
              >
                {/* Image */}
                <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-zinc-800/70 dark:bg-zinc-900/80 border border-white/10 dark:border-white/10 mb-2 pointer-events-none">
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
                  <h4 className="font-heading font-bold text-[12px] text-white group-hover/card:text-emerald-400 dark:group-hover/card:text-[#2CFF05] transition-colors truncate">
                    {item.title}
                  </h4>
                </div>

                {/* Description */}
                <p className="text-[10px] text-white/80 leading-tight line-clamp-2 font-medium">
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
