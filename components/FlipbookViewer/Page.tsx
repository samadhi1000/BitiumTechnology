'use client';

import React, { useEffect, useRef, useState } from 'react';
import { pageCache } from './PageCache';

interface PageProps {
  pdfDoc: any;
  pageNum: number;
  isActive: boolean;
  isPreload: boolean;
  side: 'left' | 'right' | 'single';
  zoom: number;
}

export default function Page({
  pdfDoc,
  pageNum,
  isActive,
  isPreload,
  side,
  zoom,
}: PageProps) {
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderTaskRef = useRef<any>(null);

  // Load or render page if it is active or preloaded
  const shouldRender = isActive || isPreload;

  useEffect(() => {
    if (!shouldRender || !pdfDoc) return;

    // Separate cached versions by zoom state
    const isZoomed = zoom > 1;
    const cacheKey = pageNum + (isZoomed ? 200000 : 0);

    const cached = pageCache.get(cacheKey);
    if (cached) {
      setImgUrl(cached);
      setLoading(false);
      return;
    }

    let isCancelled = false;

    async function renderPage() {
      try {
        setLoading(true);
        const page = await pdfDoc.getPage(pageNum);
        if (isCancelled) return;

        // Render at higher scale if zoomed
        const baseScale = isZoomed ? 2.25 : 1.5;
        const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
        const viewport = page.getViewport({ scale: baseScale * dpr });

        const canvas = canvasRef.current || document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) return;

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        renderTaskRef.current = page.render(renderContext);
        await renderTaskRef.current.promise;

        if (isCancelled) return;

        // Convert to data URL
        const dataUrl = canvas.toDataURL('image/jpeg', isZoomed ? 0.95 : 0.85);
        pageCache.set(cacheKey, dataUrl);
        setImgUrl(dataUrl);
        setLoading(false);
      } catch (err) {
        console.error(`Error rendering page ${pageNum}:`, err);
      }
    }

    renderPage();

    return () => {
      isCancelled = true;
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }
    };
  }, [pdfDoc, pageNum, shouldRender, zoom]);

  // Shadow direction for the center spine
  const getSpineShadowClass = () => {
    if (side === 'left') {
      return 'bg-gradient-to-r from-transparent to-black/35';
    } else if (side === 'right') {
      return 'bg-gradient-to-l from-transparent to-black/35';
    }
    return '';
  };

  return (
    <div 
      className="w-full h-full relative select-none overflow-hidden bg-slate-900 rounded-sm shadow-2xl flex items-center justify-center"
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
      style={{
        WebkitUserSelect: 'none',
        userSelect: 'none',
        WebkitTouchCallout: 'none',
      }}
    >
      {/* Hidden canvas for rendering */}
      {!imgUrl && (
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full object-contain pointer-events-none opacity-0"
        />
      )}

      {/* Rendered page image */}
      {imgUrl && (
        <img
          src={imgUrl}
          alt={`Catalog Page ${pageNum}`}
          draggable={false}
          onContextMenu={(e) => e.preventDefault()}
          onDragStart={(e) => e.preventDefault()}
          className="w-full h-full object-contain pointer-events-none select-none"
        />
      )}

      {/* Transparent protection shield layer: prevents direct image right-click or tap-to-save */}
      <div 
        className="absolute inset-0 z-10 select-none bg-transparent"
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
        style={{ pointerEvents: 'none' }}
      />

      {/* Loading state indicator */}
      {loading && !imgUrl && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/60 backdrop-blur-sm gap-2">
          <div className="w-6 h-6 rounded-full border-2 border-slate-800 border-t-[#2CFF05] animate-spin" />
          <span className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">Loading Page {pageNum}</span>
        </div>
      )}

      {/* Center Spine Gutter Shadow (3D Depth) */}
      {side !== 'single' && (
        <div 
          className={`absolute inset-y-0 w-16 pointer-events-none mix-blend-multiply ${
            side === 'left' ? 'right-0' : 'left-0'
          } ${getSpineShadowClass()}`} 
        />
      )}

      {/* Center spine white highlight reflection */}
      {side !== 'single' && (
        <div 
          className={`absolute inset-y-0 w-[2px] bg-white/10 pointer-events-none ${
            side === 'left' ? 'right-0' : 'left-0'
          }`}
        />
      )}

      {/* Soft page shadow outline (under the sheet borders) */}
      <div className="absolute inset-0 border border-white/5 pointer-events-none rounded-sm" />
    </div>
  );
}
