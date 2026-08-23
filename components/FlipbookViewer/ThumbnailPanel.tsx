'use client';

import React, { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { pageCache } from './PageCache';

interface ThumbnailPanelProps {
  isOpen: boolean;
  onClose: () => void;
  pdfDoc: any;
  totalPages: number;
  currentPage: number;
  onSelectPage: (pageNum: number) => void;
}

export default function ThumbnailPanel({
  isOpen,
  onClose,
  pdfDoc,
  totalPages,
  currentPage,
  onSelectPage,
}: ThumbnailPanelProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-background/95 border-l border-border shadow-2xl z-50 flex flex-col backdrop-blur-md animate-slide-in">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h3 className="font-bold text-sm text-foreground uppercase tracking-wider">Catalog Pages</h3>
        <button 
          onClick={onClose} 
          className="p-1.5 rounded-lg hover:bg-card text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 gap-4">
        {Array.from({ length: totalPages }).map((_, idx) => {
          const pageNum = idx + 1;
          const isSelected = pageNum === currentPage;
          return (
            <ThumbnailItem
              key={pageNum}
              pdfDoc={pdfDoc}
              pageNum={pageNum}
              isSelected={isSelected}
              onClick={() => onSelectPage(pageNum)}
            />
          );
        })}
      </div>
    </div>
  );
}

interface ThumbnailItemProps {
  pdfDoc: any;
  pageNum: number;
  isSelected: boolean;
  onClick: () => void;
}

function ThumbnailItem({ pdfDoc, pageNum, isSelected, onClick }: ThumbnailItemProps) {
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const renderTaskRef = useRef<any>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isVisible || !pdfDoc) return;

    // Check cache (using a separate namespace for thumbnails by adding 100000)
    const cacheKey = pageNum + 100000;
    const cached = pageCache.get(cacheKey);
    if (cached) {
      setImgUrl(cached);
      return;
    }

    let isCancelled = false;

    async function renderThumbnail() {
      try {
        const page = await pdfDoc.getPage(pageNum);
        if (isCancelled) return;

        const viewport = page.getViewport({ scale: 0.25 }); // Low-res preview
        const canvas = document.createElement('canvas');
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

        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        pageCache.set(cacheKey, dataUrl);
        setImgUrl(dataUrl);
      } catch (err) {
        console.error('Error rendering thumbnail:', err);
      }
    }

    renderThumbnail();

    return () => {
      isCancelled = true;
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }
    };
  }, [isVisible, pdfDoc, pageNum]);

  return (
    <div
      ref={containerRef}
      onClick={onClick}
      className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border cursor-pointer transition-all duration-200 group ${
        isSelected
          ? 'border-[#2CFF05] bg-[#2CFF05]/5 shadow-[0_0_10px_rgba(44,255,5,0.15)]'
          : 'border-border bg-card/40 hover:border-muted-foreground/40 hover:bg-card/80'
      }`}
    >
      <div className="aspect-[3/4] w-full bg-slate-950/60 rounded-lg overflow-hidden flex items-center justify-center border border-border/50 relative shadow-inner">
        {imgUrl ? (
          <img 
            src={imgUrl} 
            alt={`Page ${pageNum}`} 
            className="w-full h-full object-contain transition-opacity duration-300 opacity-0"
            onLoad={(e) => e.currentTarget.classList.remove('opacity-0')}
          />
        ) : (
          <div className="w-5 h-5 rounded-full border border-slate-800 border-t-[#2CFF05] animate-spin opacity-50" />
        )}
      </div>
      <span className={`text-[10px] font-bold tracking-wider ${isSelected ? 'text-[#2CFF05]' : 'text-muted-foreground group-hover:text-foreground'}`}>
        PAGE {pageNum}
      </span>
    </div>
  );
}
