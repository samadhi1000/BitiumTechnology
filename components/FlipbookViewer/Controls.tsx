'use client';

import React, { useEffect, useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Maximize, 
  Minimize, 
  LayoutGrid, 
  Download, 
  X
} from 'lucide-react';
import Link from 'next/link';

interface ControlsProps {
  currentPage: number;
  totalPages: number;
  zoom: number;
  isFullscreen: boolean;
  onPrevPage: () => void;
  onNextPage: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onToggleFullscreen: () => void;
  onToggleThumbnails: () => void;
  isThumbnailOpen: boolean;
  pdfUrl: string;
}

export default function Controls({
  currentPage,
  totalPages,
  zoom,
  isFullscreen,
  onPrevPage,
  onNextPage,
  onZoomIn,
  onZoomOut,
  onToggleFullscreen,
  onToggleThumbnails,
  isThumbnailOpen,
  pdfUrl,
}: ControlsProps) {
  const [isVisible, setIsVisible] = useState(true);

  // Auto-hide controls when mouse/touch is inactive
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleInteraction = () => {
      setIsVisible(true);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsVisible(false);
      }, 3000); // Hide after 3 seconds of inactivity
    };

    window.addEventListener('mousemove', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);
    window.addEventListener('keydown', handleInteraction);

    // Initial timeout
    timeoutId = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    return () => {
      window.removeEventListener('mousemove', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div 
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-40 transition-all duration-500 ease-in-out ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 pointer-events-none'
      }`}
    >
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-950/80 hover:bg-slate-950/90 border border-border px-5 py-3 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-md transition-colors">
        
        {/* Navigation Section */}
        <div className="flex items-center gap-4 border-b sm:border-b-0 sm:border-r border-border/50 pb-2 sm:pb-0 sm:pr-4">
          <button
            onClick={onPrevPage}
            disabled={currentPage <= 1}
            className="p-1.5 rounded-lg text-slate-400 hover:text-[#2CFF05] hover:bg-card/50 transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
            title="Previous Page (Left Arrow)"
          >
            <ChevronLeft size={20} />
          </button>
          
          <span className="text-xs font-bold text-slate-200 min-w-[70px] text-center tracking-wide">
            {currentPage} / {totalPages}
          </span>

          <button
            onClick={onNextPage}
            disabled={currentPage >= totalPages}
            className="p-1.5 rounded-lg text-slate-400 hover:text-[#2CFF05] hover:bg-card/50 transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
            title="Next Page (Right Arrow)"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Action Button Section */}
        <div className="flex items-center gap-3">
          <button
            onClick={onZoomOut}
            disabled={zoom <= 1}
            className="p-1.5 rounded-lg text-slate-400 hover:text-[#2CFF05] hover:bg-card/50 transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
            title="Zoom Out (-)"
          >
            <ZoomOut size={16} />
          </button>

          <span className="text-[10px] font-bold text-slate-400 w-8 text-center">
            {Math.round(zoom * 100)}%
          </span>

          <button
            onClick={onZoomIn}
            disabled={zoom >= 3}
            className="p-1.5 rounded-lg text-slate-400 hover:text-[#2CFF05] hover:bg-card/50 transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
            title="Zoom In (+)"
          >
            <ZoomIn size={16} />
          </button>

          <div className="w-[1px] h-4 bg-border/50 mx-1" />

          <button
            onClick={onToggleThumbnails}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isThumbnailOpen ? 'text-[#2CFF05] bg-[#2CFF05]/10' : 'text-slate-400 hover:text-[#2CFF05] hover:bg-card/50'
            }`}
            title="Toggle Thumbnails"
          >
            <LayoutGrid size={16} />
          </button>

          <a
            href={pdfUrl}
            download="Bitium-Technology-Product-Catalog.pdf"
            className="p-1.5 rounded-lg text-slate-400 hover:text-[#2CFF05] hover:bg-card/50 transition-colors cursor-pointer"
            title="Download PDF"
          >
            <Download size={16} />
          </a>

          <button
            onClick={onToggleFullscreen}
            className="p-1.5 rounded-lg text-slate-400 hover:text-[#2CFF05] hover:bg-card/50 transition-colors cursor-pointer"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
          </button>
          
          <div className="w-[1px] h-4 bg-border/50 mx-1" />

          <Link
            href="/"
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
            title="Exit Catalog"
          >
            <X size={16} />
          </Link>
        </div>

      </div>
    </div>
  );
}
