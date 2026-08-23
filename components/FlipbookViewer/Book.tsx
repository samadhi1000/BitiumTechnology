'use client';

import React, { useState, useEffect, useRef } from 'react';
import Page from './Page';

interface BookProps {
  pdfDoc: any;
  totalPages: number;
  currentPage: number;
  onPageChange: (pageNum: number) => void;
  zoom: number;
  onZoomReset: () => void;
}

type FlipStatus = 'idle' | 'dragging' | 'animating';

interface FlipState {
  status: FlipStatus;
  direction: 'next' | 'prev';
  progress: number; // 0 to 1
}

export default function Book({
  pdfDoc,
  totalPages,
  currentPage,
  onPageChange,
  zoom,
  onZoomReset,
}: BookProps) {
  const [viewMode, setViewMode] = useState<'double' | 'single'>('double');
  const [reducedMotion, setReducedMotion] = useState(false);
  const [flipState, setFlipState] = useState<FlipState>({
    status: 'idle',
    direction: 'next',
    progress: 0,
  });

  // Pan state for zoom mode
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const isPanningRef = useRef(false);
  const panStartRef = useRef({ x: 0, y: 0 });

  // Pointer drag state for page turns
  const dragStartRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const bookRef = useRef<HTMLDivElement>(null);

  // Detect responsive view mode
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setViewMode('single');
      } else {
        setViewMode('double');
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // Detect reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const motionListener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', motionListener);

    return () => {
      window.removeEventListener('resize', handleResize);
      mediaQuery.removeEventListener('change', motionListener);
    };
  }, []);

  // Reset pan when zoom changes
  useEffect(() => {
    if (zoom === 1) {
      setPan({ x: 0, y: 0 });
    }
  }, [zoom]);

  // Determine L and R pages for double page mode
  // L is even, R is odd. Page 1 is Cover (R only). Last page is Back Cover (L only if total is even).
  let leftPageNum: number | null = null;
  let rightPageNum: number | null = null;

  if (viewMode === 'double') {
    if (currentPage === 1) {
      leftPageNum = null;
      rightPageNum = 1;
    } else if (currentPage % 2 === 0) {
      leftPageNum = currentPage;
      rightPageNum = currentPage + 1 <= totalPages ? currentPage + 1 : null;
    } else {
      leftPageNum = currentPage - 1;
      rightPageNum = currentPage;
    }
  } else {
    // Single page mode
    rightPageNum = currentPage;
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (zoom > 1) return; // Disable key turns when zoomed in

      if (e.key === 'ArrowRight' || e.key === ' ') {
        turnNext();
      } else if (e.key === 'ArrowLeft') {
        turnPrev();
      } else if (e.key === 'Home') {
        onPageChange(1);
      } else if (e.key === 'End') {
        onPageChange(totalPages);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, totalPages, viewMode, zoom]);

  // Turn page helpers
  const turnNext = () => {
    if (viewMode === 'double') {
      const nextPage = currentPage === 1 ? 2 : currentPage + 2;
      if (nextPage <= totalPages) {
        animateFlip('next', nextPage);
      }
    } else {
      if (currentPage < totalPages) {
        animateFlip('next', currentPage + 1);
      }
    }
  };

  const turnPrev = () => {
    if (viewMode === 'double') {
      const prevPage = currentPage === 2 ? 1 : currentPage - 2;
      if (prevPage >= 1) {
        animateFlip('prev', prevPage);
      }
    } else {
      if (currentPage > 1) {
        animateFlip('prev', currentPage - 1);
      }
    }
  };

  const animateFlip = (dir: 'next' | 'prev', targetPage: number) => {
    if (flipState.status !== 'idle') return;

    if (reducedMotion) {
      // Accessibility fallback: direct jump with instant update
      onPageChange(targetPage);
      return;
    }

    setFlipState({
      status: 'animating',
      direction: dir,
      progress: 0,
    });

    // We trigger the transition by setting progress to 1
    setTimeout(() => {
      setFlipState((prev) => ({ ...prev, progress: 1 }));
    }, 20);
  };

  const handleTransitionEnd = () => {
    if (flipState.status !== 'animating') return;

    const step = viewMode === 'double' ? 2 : 1;
    let targetPage = currentPage;

    if (flipState.direction === 'next') {
      if (viewMode === 'double') {
        targetPage = currentPage === 1 ? 2 : currentPage + 2;
      } else {
        targetPage = currentPage + 1;
      }
    } else {
      if (viewMode === 'double') {
        targetPage = currentPage === 2 ? 1 : currentPage - 2;
      } else {
        targetPage = currentPage - 1;
      }
    }

    // Bound check
    targetPage = Math.max(1, Math.min(totalPages, targetPage));

    onPageChange(targetPage);
    setFlipState({
      status: 'idle',
      direction: 'next',
      progress: 0,
    });
  };

  // Pointer event handlers (Mouse / Touch)
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return; // Only left click

    const rect = bookRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (zoom > 1) {
      // Zoom Panning
      isPanningRef.current = true;
      panStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
      bookRef.current?.setPointerCapture(e.pointerId);
    } else {
      // Page Turning Drag
      // Only drag if not already flipping
      if (flipState.status !== 'idle') return;

      const clickWidth = rect.width;
      const isRightSide = x > clickWidth / 2;

      // Check bounds
      if (isRightSide && currentPage >= totalPages) return;
      if (!isRightSide && currentPage <= 1) return;

      isDraggingRef.current = true;
      dragStartRef.current = { x: e.clientX, y: e.clientY };
      
      setFlipState({
        status: 'dragging',
        direction: isRightSide ? 'next' : 'prev',
        progress: 0,
      });

      bookRef.current?.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (zoom > 1 && isPanningRef.current) {
      // Zoom Panning
      const newX = e.clientX - panStartRef.current.x;
      const newY = e.clientY - panStartRef.current.y;
      
      // Calculate boundaries based on zoom factor
      const maxX = (rect().width * (zoom - 1)) / 2;
      const maxY = (rect().height * (zoom - 1)) / 2;

      setPan({
        x: Math.max(-maxX, Math.min(maxX, newX)),
        y: Math.max(-maxY, Math.min(maxY, newY)),
      });
    } else if (isDraggingRef.current && flipState.status === 'dragging') {
      // Page Turning
      const deltaX = e.clientX - dragStartRef.current.x;
      const width = bookRef.current?.getBoundingClientRect().width || 1;
      const dragLimit = viewMode === 'double' ? width / 2 : width;

      let progress = 0;
      if (flipState.direction === 'next') {
        progress = -deltaX / dragLimit;
      } else {
        progress = deltaX / dragLimit;
      }

      setFlipState((prev) => ({
        ...prev,
        progress: Math.max(0, Math.min(1, progress)),
      }));
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (zoom > 1) {
      isPanningRef.current = false;
      bookRef.current?.releasePointerCapture(e.pointerId);
    } else if (isDraggingRef.current && flipState.status === 'dragging') {
      isDraggingRef.current = false;
      bookRef.current?.releasePointerCapture(e.pointerId);

      const deltaX = e.clientX - dragStartRef.current.x;
      const velocity = Math.abs(deltaX) / (Date.now() - e.timeStamp); // Simple velocity check

      // Threshold to complete turn: drag past 35% or fast flick
      const shouldComplete = flipState.progress > 0.35 || velocity > 0.5;

      if (shouldComplete) {
        // Trigger completion animation
        setFlipState((prev) => ({
          ...prev,
          status: 'animating',
        }));
        
        // Let CSS animate the remainder to 1
        setTimeout(() => {
          setFlipState((prev) => ({ ...prev, progress: 1 }));
        }, 10);
      } else {
        // Cancel and snap back
        setFlipState((prev) => ({
          ...prev,
          status: 'animating',
        }));
        
        setTimeout(() => {
          setFlipState((prev) => ({ ...prev, progress: 0 }));
        }, 10);
      }
    }
  };

  const rect = () => {
    return bookRef.current?.getBoundingClientRect() || { width: 0, height: 0 };
  };

  // Flip rotations
  // Turning Next: from 0deg (right) to -180deg (left)
  // Turning Prev: from -180deg (left) to 0deg (right)
  const getFlippingStyle = () => {
    if (flipState.status === 'idle') return {};

    let angle = 0;
    if (flipState.direction === 'next') {
      angle = -180 * flipState.progress;
    } else {
      angle = -180 + (180 * flipState.progress);
    }

    const scaleAdjustment = 1 - (Math.sin(Math.PI * flipState.progress) * 0.08); // foreshortening bending look
    const zIndex = 30;

    return {
      transform: `rotateY(${angle}deg) scaleX(${scaleAdjustment})`,
      zIndex,
      transition: flipState.status === 'animating' ? 'transform 0.5s ease-out' : 'none',
    };
  };

  // Shadow opacity calculation for turning page
  const getFlipShadowOpacity = () => {
    // Peak shadow when perpendicular (90 degrees, progress = 0.5)
    return Math.sin(Math.PI * flipState.progress) * 0.35;
  };

  return (
    <div className="relative w-full max-w-5xl aspect-[3/2] md:aspect-[3/2] flex items-center justify-center select-none perspective-[2000px] sm:perspective-[2500px]">
      
      {/* Book Outer Shadow Container */}
      <div 
        ref={bookRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="relative w-full h-[90%] flex bg-slate-950/20 rounded-xl transition-transform duration-300"
        style={{
          transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
          cursor: zoom > 1 ? (isPanningRef.current ? 'grabbing' : 'grab') : 'default',
        }}
      >
        
        {/* Underlay shadow beneath the entire book */}
        <div className="absolute inset-x-4 -bottom-6 h-8 bg-black/60 blur-xl rounded-full pointer-events-none z-0" />
        
        {viewMode === 'double' ? (
          /* ========================================================
             DESKTOP: TWO-PAGE OPEN SPREAD
             ======================================================== */
          <div className="w-full h-full flex relative z-10 select-none overflow-visible">
            
            {/* Left Page (Underneath) */}
            <div className="w-1/2 h-full bg-slate-950 border-r border-slate-900 rounded-l-md shadow-lg overflow-hidden relative">
              {leftPageNum ? (
                <Page
                  pdfDoc={pdfDoc}
                  pageNum={leftPageNum}
                  isActive={flipState.status === 'idle'}
                  isPreload={flipState.status !== 'idle' && flipState.direction === 'prev'}
                  side="left"
                  zoom={zoom}
                />
              ) : (
                /* Blank page if before Cover */
                <div className="w-full h-full bg-slate-950/50" />
              )}
            </div>

            {/* Right Page (Underneath) */}
            <div className="w-1/2 h-full bg-slate-950 rounded-r-md shadow-lg overflow-hidden relative">
              {rightPageNum ? (
                <Page
                  pdfDoc={pdfDoc}
                  pageNum={rightPageNum}
                  isActive={flipState.status === 'idle'}
                  isPreload={flipState.status !== 'idle' && flipState.direction === 'next'}
                  side="right"
                  zoom={zoom}
                />
              ) : (
                /* Blank page if past end */
                <div className="w-full h-full bg-slate-950/50" />
              )}
            </div>

            {/* Spine depth gutter detail */}
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-4 z-20 pointer-events-none bg-gradient-to-r from-black/50 via-black/10 to-black/50 border-x border-black/30" />

            {/* ACTIVE FLIPPING LEAF */}
            {flipState.status !== 'idle' && (
              <div 
                className="absolute top-0 bottom-0 left-1/2 w-1/2 h-full origin-left preserve-3d pointer-events-none select-none z-30"
                style={getFlippingStyle()}
                onTransitionEnd={handleTransitionEnd}
              >
                {/* Front of leaf: Turning away from right to left */}
                <div className="absolute inset-0 backface-hidden z-20 rounded-r-md overflow-hidden">
                  <Page
                    pdfDoc={pdfDoc}
                    pageNum={flipState.direction === 'next' ? rightPageNum! : leftPageNum! + 1}
                    isActive={true}
                    isPreload={false}
                    side="right"
                    zoom={zoom}
                  />
                  {/* Dynamic bending shade shadow */}
                  <div 
                    className="absolute inset-0 bg-black pointer-events-none mix-blend-multiply"
                    style={{ opacity: getFlipShadowOpacity() }}
                  />
                </div>

                {/* Back of leaf: Turning into view on left */}
                <div className="absolute inset-0 backface-hidden z-10 rounded-l-md overflow-hidden rotate-y-180">
                  <Page
                    pdfDoc={pdfDoc}
                    pageNum={flipState.direction === 'next' ? leftPageNum! + 2 : leftPageNum!}
                    isActive={true}
                    isPreload={false}
                    side="left"
                    zoom={zoom}
                  />
                  {/* Dynamic bending shade shadow */}
                  <div 
                    className="absolute inset-0 bg-black pointer-events-none mix-blend-multiply"
                    style={{ opacity: getFlipShadowOpacity() }}
                  />
                </div>

              </div>
            )}

            {/* Cast shadows underneath turning page */}
            {flipState.status !== 'idle' && (
              <div 
                className={`absolute top-0 bottom-0 pointer-events-none z-20 mix-blend-multiply bg-black transition-opacity duration-300 ${
                  flipState.direction === 'next' 
                    ? 'left-0 w-1/2 bg-gradient-to-l from-black to-transparent' 
                    : 'left-1/2 w-1/2 bg-gradient-to-r from-black to-transparent'
                }`}
                style={{
                  opacity: flipState.progress * 0.45,
                }}
              />
            )}

          </div>
        ) : (
          /* ========================================================
             MOBILE: SINGLE PAGE CAROUSEL / SWIPE LAYOUT
             ======================================================== */
          <div className="w-full h-full relative z-10 overflow-hidden rounded-xl shadow-2xl bg-slate-900 select-none">
            {/* Sliding animation layer */}
            <div 
              className="w-full h-full flex transform"
              style={{
                transform: flipState.status !== 'idle'
                  ? flipState.direction === 'next'
                    ? `translateX(${-flipState.progress * 100}%)`
                    : `translateX(${(1 - flipState.progress) * -100}%)`
                  : 'none',
                transition: flipState.status === 'animating' ? 'transform 0.4s ease-out' : 'none',
              }}
              onTransitionEnd={handleTransitionEnd}
            >
              {/* Previous/Left slide container */}
              {flipState.status !== 'idle' && flipState.direction === 'prev' && (
                <div className="w-full h-full flex-shrink-0">
                  <Page
                    pdfDoc={pdfDoc}
                    pageNum={Math.max(1, currentPage - 1)}
                    isActive={true}
                    isPreload={false}
                    side="single"
                    zoom={zoom}
                  />
                </div>
              )}

              {/* Current active slide container */}
              <div className="w-full h-full flex-shrink-0">
                <Page
                  pdfDoc={pdfDoc}
                  pageNum={currentPage}
                  isActive={flipState.status === 'idle'}
                  isPreload={false}
                  side="single"
                  zoom={zoom}
                />
              </div>

              {/* Next/Right slide container */}
              {flipState.status !== 'idle' && flipState.direction === 'next' && (
                <div className="w-full h-full flex-shrink-0">
                  <Page
                    pdfDoc={pdfDoc}
                    pageNum={Math.min(totalPages, currentPage + 1)}
                    isActive={true}
                    isPreload={false}
                    side="single"
                    zoom={zoom}
                  />
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
