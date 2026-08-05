'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ShieldAlert, Loader2 } from 'lucide-react';

interface SecureWatermarkedImageProps {
  src: string;
  alt: string;
  className?: string;
  watermarkText?: string;
  aspectRatio?: '4/3' | '1/1' | '16/9';
}

export default function SecureWatermarkedImage({
  src,
  alt,
  className = '',
  watermarkText = 'Bitium Technology',
  aspectRatio = '4/3',
}: SecureWatermarkedImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(false);

    const img = new Image();
    img.src = src;

    img.onload = () => {
      if (!active) return;
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setError(true);
        setLoading(false);
        return;
      }

      // 1. Establish high resolution canvas context based on physical size
      const targetWidth = img.naturalWidth || 800;
      const targetHeight = img.naturalHeight || 600;
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      // 2. Draw low-res image background
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      // 3. Security Overlay: Diagonal repeating lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = Math.max(1, targetWidth * 0.002);
      const lineGap = Math.max(30, targetWidth * 0.08);
      for (let i = -targetHeight; i < targetWidth + targetHeight; i += lineGap) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + targetHeight, targetHeight);
        ctx.stroke();
      }

      // 4. Security Overlay: Multi-layer text watermark grid pattern
      const fontSize = Math.max(14, Math.floor(targetWidth * 0.035));
      ctx.font = `bold ${fontSize}px sans-serif`;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
      ctx.shadowBlur = 4;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const xSpacing = Math.max(150, targetWidth * 0.35);
      const ySpacing = Math.max(120, targetHeight * 0.3);

      ctx.save();
      // Apply slight rotation for standard anti-OCR and protection layout
      for (let x = xSpacing / 2; x < targetWidth; x += xSpacing) {
        for (let y = ySpacing / 2; y < targetHeight; y += ySpacing) {
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(-20 * Math.PI / 180);
          ctx.fillText(watermarkText, 0, 0);
          ctx.restore();
        }
      }
      ctx.restore();

      // Clear local memory reference of source image to prevent tracking URL leaks
      img.onload = null;
      img.onerror = null;

      setLoading(false);
    };

    img.onerror = (e) => {
      console.error('Failed to load secure preview image:', e);
      if (active) {
        setError(true);
        setLoading(false);
      }
    };

    return () => {
      active = false;
    };
  }, [src, watermarkText]);

  // Context menu prevention handler
  const preventTheft = (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const aspectClass = 
    aspectRatio === '1/1' ? 'aspect-square' :
    aspectRatio === '16/9' ? 'aspect-video' : 'aspect-[4/3]';

  return (
    <div
      ref={containerRef}
      onContextMenu={preventTheft}
      className={`relative w-full overflow-hidden bg-zinc-950 rounded-2xl select-none ${aspectClass} ${className}`}
    >
      {/* 1. Actual canvas executing watermarked draw */}
      <canvas
        ref={canvasRef}
        className={`w-full h-full object-cover select-none pointer-events-none transition-opacity duration-300 ${
          loading || error ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ userSelect: 'none' }}
      />

      {/* 2. Absolute overlay cover shielding the Canvas from mouse events and inspect-element pointer */}
      <div
        className="absolute inset-0 z-30 select-none cursor-default bg-transparent"
        onContextMenu={preventTheft}
        onDragStart={preventTheft}
        onDrop={preventTheft}
        style={{
          WebkitTouchCallout: 'none',
          WebkitUserSelect: 'none',
          userSelect: 'none',
        }}
      />

      {/* 3. Loader state */}
      {loading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-zinc-950 text-zinc-400">
          <Loader2 className="animate-spin text-[#116466]" size={28} />
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Securing Preview...</span>
        </div>
      )}

      {/* 4. Error state */}
      {error && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-zinc-950 p-4 text-center text-zinc-500">
          <ShieldAlert size={28} className="text-red-500/60 animate-pulse" />
          <span className="text-xs font-bold text-zinc-400">Preview Security Locked</span>
          <span className="text-[10px] leading-relaxed text-zinc-500 max-w-[200px]">
            Please check connection or refresh to view asset safely.
          </span>
        </div>
      )}
    </div>
  );
}
