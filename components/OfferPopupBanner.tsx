'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, ArrowRight, Clock } from 'lucide-react';
import {
  OfferPopupConfig,
  DEFAULT_OFFER_POPUP,
  fetchOfferPopupConfig,
  shouldDisplayPopup,
  markPopupAsSeen,
} from '@/lib/promo-popup';

interface OfferPopupBannerProps {
  forcePreview?: boolean;
  onClosePreview?: () => void;
  previewConfig?: OfferPopupConfig;
}

export default function OfferPopupBanner({
  forcePreview = false,
  onClosePreview,
  previewConfig,
}: OfferPopupBannerProps) {
  const [config, setConfig] = useState<OfferPopupConfig>(previewConfig || DEFAULT_OFFER_POPUP);
  const [isOpen, setIsOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);

  // Sync preview config changes
  useEffect(() => {
    if (previewConfig) {
      setConfig(previewConfig);
      if (forcePreview) setIsOpen(true);
    }
  }, [previewConfig, forcePreview]);

  // Load config on initial mount for live visitors
  useEffect(() => {
    if (forcePreview) return;

    let isMounted = true;
    let timer: NodeJS.Timeout;

    const init = async () => {
      const liveConfig = await fetchOfferPopupConfig();
      if (!isMounted) return;

      setConfig(liveConfig);

      if (shouldDisplayPopup(liveConfig, false)) {
        const delayMs = Math.max(500, (liveConfig.show_delay_seconds || 1.2) * 1000);
        timer = setTimeout(() => {
          if (isMounted) setIsOpen(true);
        }, delayMs);
      }
    };

    init();

    return () => {
      isMounted = false;
      if (timer) clearTimeout(timer);
    };
  }, [forcePreview]);

  // Countdown timer calculation if countdown_end is provided
  useEffect(() => {
    if (!config.countdown_end) {
      setTimeLeft(null);
      return;
    }

    const calculateTime = () => {
      const target = new Date(config.countdown_end!).getTime();
      const now = Date.now();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft(null);
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ hours, minutes, seconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [config.countdown_end]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    if (forcePreview && onClosePreview) {
      onClosePreview();
    } else {
      markPopupAsSeen(config);
    }
  }, [config, forcePreview, onClosePreview]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center p-3 sm:p-4 overflow-y-auto overflow-x-hidden">
          {/* 1. Backdrop Grey-out / Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
            aria-hidden="true"
          />

          {/* 2. Main Modal Card Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 25 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-[380px] sm:max-w-[430px] rounded-[28px] bg-[#0c1322] border border-[#2CFF05]/40 shadow-[0_0_50px_rgba(44,255,5,0.18)] overflow-hidden flex flex-col my-auto z-10 select-none"
            role="dialog"
            aria-modal="true"
            aria-label={config.campaign_name}
          >
            {/* Ambient Background Glow Highlights */}
            <div className="absolute -top-20 -left-20 w-48 h-48 bg-[#2CFF05]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#2CFF05]/[0.06] via-transparent to-black/40 pointer-events-none" />

            {/* Upper-Right Corner Close Button */}
            <button
              type="button"
              onClick={handleClose}
              className="absolute top-3.5 right-3.5 z-30 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 border border-white/10 text-zinc-400 hover:text-white transition-all flex items-center justify-center backdrop-blur-sm cursor-pointer"
              aria-label="Close offer banner"
            >
              <X size={16} />
            </button>

            {/* Content Body */}
            <div className="relative p-5 sm:p-6 flex flex-col items-center text-center z-10">
              
              {/* Campaign / Seasonal Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2CFF05]/15 border border-[#2CFF05]/40 text-[#2CFF05] text-[11px] sm:text-xs font-black uppercase tracking-wider mb-3.5 shadow-sm">
                <Sparkles size={13} className="animate-pulse text-[#2CFF05]" />
                <span>{config.badge_text}</span>
              </div>

              {/* Massive Discount Headline */}
              <h2 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight leading-none uppercase mb-2 drop-shadow-md">
                <span className="bg-gradient-to-r from-white via-slate-100 to-white/90 bg-clip-text text-transparent">
                  {config.headline}
                </span>
              </h2>

              {/* Subheadline description */}
              <p className="text-xs sm:text-[13px] text-white/90 dark:text-white font-medium line-clamp-2 max-w-[90%] leading-relaxed mb-4">
                {config.subheadline}
              </p>

              {/* Trust Badges Bar */}
              {config.features && config.features.length > 0 && (
                <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mb-4">
                  {config.features.map((feat, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md bg-white/[0.08] border border-white/20 text-[10px] sm:text-[11px] font-black text-white shadow-sm"
                    >
                      {feat}
                    </span>
                  ))}
                </div>
              )}

              {/* Hero Visual Mockup Box */}
              {config.image_url && (
                <div className="relative w-full aspect-[16/10] sm:aspect-[16/9.5] rounded-2xl overflow-hidden border border-white/15 bg-zinc-900/80 mb-4 group shadow-inner">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={config.image_url}
                    alt={config.campaign_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                </div>
              )}

              {/* Countdown Timer (Optional) */}
              {timeLeft && (
                <div className="w-full mb-3.5 py-1.5 px-3 rounded-xl bg-black/40 border border-amber-500/30 flex items-center justify-center gap-2 text-amber-300 text-xs font-bold">
                  <Clock size={13} className="text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
                  <span className="text-white font-bold">Offer Ends in:</span>
                  <span className="font-mono font-black text-white bg-black/60 px-1.5 py-0.5 rounded border border-white/10">
                    {String(timeLeft.hours).padStart(2, '0')}:
                    {String(timeLeft.minutes).padStart(2, '0')}:
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                </div>
              )}

              {/* Primary Call To Action Button */}
              <Link
                href={config.cta_link || '/gang-sheet'}
                onClick={handleClose}
                className="w-full py-3.5 sm:py-4 px-6 rounded-2xl bg-[#2CFF05] hover:bg-[#3af816] text-[#0a0a0a] font-heading font-black text-sm sm:text-base uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(44,255,5,0.4)] hover:shadow-[0_0_35px_rgba(44,255,5,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <span>{config.cta_text || 'Claim Offer & Shop Now'}</span>
                <ArrowRight size={16} className="font-bold stroke-[3]" />
              </Link>
            </div>
          </motion.div>

          {/* 3. Modern Floating Circular "✕" Close Button Below Modal (E-Commerce Standard) */}
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ delay: 0.1, duration: 0.2 }}
            type="button"
            onClick={handleClose}
            className="mt-4 w-11 h-11 rounded-full bg-black/80 hover:bg-black border-2 border-white/30 hover:border-[#2CFF05] text-white hover:text-[#2CFF05] shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer z-20 backdrop-blur-md"
            aria-label="Dismiss offer"
            title="Close popup"
          >
            <X size={20} className="stroke-[2.5]" />
          </motion.button>
        </div>
      )}
    </AnimatePresence>
  );
}
