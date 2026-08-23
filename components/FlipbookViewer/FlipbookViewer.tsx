'use client';

import React, { useState, useEffect, useRef } from 'react';
import * as pdfjs from 'pdfjs-dist';
import LoadingState from './LoadingState';
import Controls from './Controls';
import ThumbnailPanel from './ThumbnailPanel';
import Book from './Book';
import { pageCache } from './PageCache';

// Serve PDF.js worker from local /public folder to avoid CDN CORS/MIME module errors
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

// Module-level PDF document cache — persists across tab switches without re-downloading
// Key: pdfUrl string, Value: loaded PDFDocumentProxy object
const pdfDocCache = new Map<string, any>();

interface FlipbookViewerProps {
  pdfUrl: string;
}

export default function FlipbookViewer({ pdfUrl }: FlipbookViewerProps) {
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadProgress, setLoadProgress] = useState<number>(0);
  const [loadingMessage, setLoadingMessage] = useState<string>('Loading catalog...');
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [zoom, setZoom] = useState<number>(1.0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isThumbnailOpen, setIsThumbnailOpen] = useState<boolean>(false);
  
  const viewerRef = useRef<HTMLDivElement>(null);

  // Load PDF document on mount or when URL changes
  useEffect(() => {
    let active = true;

    // Reset viewer state for the new catalog
    setCurrentPage(1);
    setZoom(1.0);
    setError(null);
    setLoadProgress(0);
    pageCache.clear();

    // ── CACHE HIT: already downloaded this PDF ──────────────────────────────
    if (pdfDocCache.has(pdfUrl)) {
      const cached = pdfDocCache.get(pdfUrl);
      setPdfDoc(cached);
      setTotalPages(cached.numPages);
      setLoading(false);
      return;
    }

    // ── CACHE MISS: fetch from server ───────────────────────────────────────
    setLoading(true);
    setLoadingMessage('Fetching digital publishing assets...');

    const loadPdf = async () => {
      try {
        if (!active) return;

        // Pass the URL directly to PDF.js
        // Works for: local paths (/dummy.pdf), proxy routes (/api/catalog/pdf), or any direct URL
        const loadingTask = pdfjs.getDocument({ url: pdfUrl });

        // Monitor download progress
        loadingTask.onProgress = (progressData: any) => {
          if (active && progressData.total > 0) {
            const percent = progressData.loaded / progressData.total;
            setLoadProgress(percent);
            setLoadingMessage(`Downloading catalog pages (${Math.round(percent * 100)}%)...`);
          }
        };

        const pdf = await loadingTask.promise;
        if (!active) return;

        // Store in module-level cache for instant retrieval next time
        pdfDocCache.set(pdfUrl, pdf);

        setPdfDoc(pdf);
        setTotalPages(pdf.numPages);
        setLoadingMessage('Initializing realistic canvas layers...');

        // Short delay to allow animations to settle
        setTimeout(() => {
          if (active) {
            setLoading(false);
          }
        }, 800);
      } catch (err) {
        if (!active) return;
        console.error('Error loading PDF:', err);
        setError('Failed to load the product catalog. Please check your connection and try again.');
        setLoading(false);
      }
    };

    loadPdf();

    return () => {
      active = false;
    };
  }, [pdfUrl]);



  // Keyboard zoom controls (+ / -)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '=' || e.key === '+') {
        e.preventDefault();
        zoomIn();
      } else if (e.key === '-') {
        e.preventDefault();
        zoomOut();
      } else if (e.key === 'Escape') {
        if (isFullscreen) {
          exitFullscreen();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, zoom]);

  // Monitor fullscreen changes from browser escape/events
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Zoom handlers
  const zoomIn = () => setZoom((z) => Math.min(3.0, z + 0.5));
  const zoomOut = () => setZoom((z) => Math.max(1.0, z - 0.5));
  const resetZoom = () => setZoom(1.0);

  // Fullscreen handlers
  const requestFullscreen = () => {
    const el = viewerRef.current;
    if (el?.requestFullscreen) {
      el.requestFullscreen().then(() => setIsFullscreen(true));
    }
  };

  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  };

  const toggleFullscreen = () => {
    if (isFullscreen) {
      exitFullscreen();
    } else {
      requestFullscreen();
    }
  };

  const handleSelectPage = (pageNum: number) => {
    setCurrentPage(pageNum);
    setIsThumbnailOpen(false);
    resetZoom();
  };

  const handlePageChange = (pageNum: number) => {
    setCurrentPage(pageNum);
    resetZoom();
  };

  if (loading) {
    return (
      <div className="w-full min-h-[80vh] flex items-center justify-center bg-slate-950 text-foreground">
        <LoadingState progress={loadProgress} message={loadingMessage} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-[80vh] flex items-center justify-center bg-slate-950 text-foreground">
        <LoadingState 
          error={error} 
          onRetry={() => {
            setError(null);
            setLoading(true);
            window.location.reload();
          }} 
        />
      </div>
    );
  }

  return (
    <div 
      ref={viewerRef}
      className={`relative w-full min-h-screen bg-gradient-to-b from-[#0f172a] via-[#090d16] to-[#020617] flex flex-col items-center justify-center overflow-hidden py-10 px-4 md:px-8 select-none z-30 ${
        isFullscreen ? 'fixed inset-0 py-16' : ''
      }`}
    >
      
      {/* Background glow lighting effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#2CFF05]/5 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="absolute top-10 right-10 w-[300px] h-[300px] bg-sky-500/5 rounded-full blur-[100px] pointer-events-none z-0" />

      {/* Main interactive book space */}
      <div className="w-full flex-1 flex items-center justify-center z-10 max-h-[80vh]">
        <Book
          pdfDoc={pdfDoc}
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          zoom={zoom}
          onZoomReset={resetZoom}
        />
      </div>

      {/* Floating control bar */}
      <Controls
        currentPage={currentPage}
        totalPages={totalPages}
        zoom={zoom}
        isFullscreen={isFullscreen}
        onPrevPage={() => handlePageChange(Math.max(1, currentPage - (window.innerWidth < 768 ? 1 : 2)))}
        onNextPage={() => handlePageChange(Math.min(totalPages, currentPage + (window.innerWidth < 768 ? 1 : 2)))}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onToggleFullscreen={toggleFullscreen}
        onToggleThumbnails={() => setIsThumbnailOpen(!isThumbnailOpen)}
        isThumbnailOpen={isThumbnailOpen}
        pdfUrl={pdfUrl}
      />

      {/* Side page thumbnails drawer */}
      <ThumbnailPanel
        isOpen={isThumbnailOpen}
        onClose={() => setIsThumbnailOpen(false)}
        pdfDoc={pdfDoc}
        totalPages={totalPages}
        currentPage={currentPage}
        onSelectPage={handleSelectPage}
      />

    </div>
  );
}
