'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { ZoomIn, ZoomOut, RotateCcw, Move, Sparkles } from 'lucide-react';

interface InteractiveZoomViewerProps {
  src: string;
  alt: string;
}

export default function InteractiveZoomViewer({ src, alt }: InteractiveZoomViewerProps) {
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [origin, setOrigin] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setOrigin({ x, y });
  };

  const handleZoomIn = () => {
    setZoomScale((prev) => Math.min(prev + 0.75, 3.5));
  };

  const handleZoomOut = () => {
    setZoomScale((prev) => Math.max(prev - 0.75, 1));
  };

  const handleResetZoom = () => {
    setZoomScale(1);
    setOrigin({ x: 50, y: 50 });
  };

  const handleToggleClick = () => {
    if (zoomScale > 1) {
      handleResetZoom();
    } else {
      setZoomScale(2.2);
    }
  };

  // Determine effective zoom: if user hovered and scale is 1, auto-enable a subtle 1.8x inspection zoom
  const effectiveZoom = zoomScale > 1 ? zoomScale : isHovered ? 1.8 : 1;

  return (
    <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-border/80 flex flex-col group select-none">
      {/* Zoomable Image Container */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          if (zoomScale === 1) setOrigin({ x: 50, y: 50 });
        }}
        onClick={handleToggleClick}
        className="relative w-full h-full overflow-hidden cursor-crosshair"
      >
        <div
          style={{
            transform: `scale(${effectiveZoom})`,
            transformOrigin: `${origin.x}% ${origin.y}%`,
            transition: isHovered && zoomScale === 1 ? 'transform 0.15s ease-out, transform-origin 0.05s ease-out' : 'transform 0.2s ease-out',
          }}
          className="w-full h-full relative"
        >
          <Image
            src={src}
            alt={alt}
            fill
            className="object-contain p-2"
            sizes="(max-width: 768px) 100vw, 500px"
            priority
          />
        </div>

        {/* Magnifier Guideline Overlay when hovering */}
        {effectiveZoom > 1 && (
          <div
            className="pointer-events-none absolute border border-[#2CFF05]/50 bg-[#2CFF05]/10 rounded-full shadow-lg shadow-[#2CFF05]/20 -translate-x-1/2 -translate-y-1/2 transition-all duration-75"
            style={{
              left: `${origin.x}%`,
              top: `${origin.y}%`,
              width: `${100 / effectiveZoom}%`,
              height: `${100 / effectiveZoom}%`,
            }}
          />
        )}
      </div>

      {/* Floating Interactive Zoom Toolbar */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none z-20">
        {/* Zoom Level Indicator */}
        <div className="px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/15 text-[10px] font-bold text-white flex items-center gap-1.5 shadow-lg">
          <Sparkles size={11} className="text-[#2CFF05]" />
          <span>
            {effectiveZoom > 1 ? `${effectiveZoom.toFixed(1)}x Zoom (Move to Inspect)` : 'Click or Hover to Zoom'}
          </span>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1.5 bg-black/85 backdrop-blur-md border border-white/15 p-1 rounded-full shadow-lg pointer-events-auto">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleZoomIn();
            }}
            disabled={zoomScale >= 3.5}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-[#2CFF05] hover:text-black text-white flex items-center justify-center transition-colors disabled:opacity-30 disabled:hover:bg-white/10 disabled:hover:text-white cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn size={13} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleZoomOut();
            }}
            disabled={zoomScale <= 1}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-[#2CFF05] hover:text-black text-white flex items-center justify-center transition-colors disabled:opacity-30 disabled:hover:bg-white/10 disabled:hover:text-white cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut size={13} />
          </button>

          {zoomScale > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleResetZoom();
              }}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-[#2CFF05] hover:text-black text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Reset Zoom"
            >
              <RotateCcw size={12} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
