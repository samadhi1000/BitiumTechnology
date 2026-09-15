'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ChevronLeft, ChevronRight, Users, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/lib/context/LanguageContext';
import { CustomerFeedbackItem, defaultCustomerFeedbacks, fetchCustomerFeedbacks, getLocalCustomerFeedbacks } from '@/lib/data/customerFeedbacks';

interface CustomerReviewsCarouselProps {
  feedbacks?: CustomerFeedbackItem[];
  title?: string;
  badge?: string;
  communityBtnText?: string;
}

export default function CustomerReviewsCarousel({
  feedbacks: initialFeedbacks,
  title,
  badge,
  communityBtnText,
}: CustomerReviewsCarouselProps) {
  const { isSinhala } = useLanguage();
  const [items, setItems] = useState<CustomerFeedbackItem[]>(initialFeedbacks || defaultCustomerFeedbacks);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Sync with live server API and listen for cross-tab updates
  React.useEffect(() => {
    if (initialFeedbacks && initialFeedbacks.length > 0) {
      setItems(initialFeedbacks);
      return;
    }

    const refreshData = () => {
      const local = getLocalCustomerFeedbacks();
      if (local && local.length > 0) {
        setItems(local);
      }
      fetchCustomerFeedbacks().then((latest) => {
        if (latest && latest.length > 0) {
          setItems(latest);
        }
      }).catch(() => {});
    };

    refreshData();

    const handleCustomUpdate = (e: any) => {
      if (e.detail && Array.isArray(e.detail)) {
        setItems(e.detail);
      } else {
        refreshData();
      }
    };

    const handleStorageUpdate = (e: StorageEvent) => {
      if (e.key === 'bitium_customer_feedbacks_data' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setItems(parsed);
          }
        } catch {}
      }
    };

    window.addEventListener('bitium_reviews_updated', handleCustomUpdate);
    window.addEventListener('storage', handleStorageUpdate);

    return () => {
      window.removeEventListener('bitium_reviews_updated', handleCustomUpdate);
      window.removeEventListener('storage', handleStorageUpdate);
    };
  }, [initialFeedbacks]);

  // Touch / Swipe handling refs
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const totalItems = items.length;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? totalItems - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === totalItems - 1 ? 0 : prev + 1));
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') handlePrev();
    if (e.key === 'ArrowRight') handleNext();
  };

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 45;
    const isRightSwipe = distance < -45;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Get 3 visible items based on currentIndex (prev, current, next)
  const getVisibleFeedbacks = () => {
    if (totalItems <= 1) return items.map((f, i) => ({ item: f, index: i, isCenter: true }));

    const prevIndex = (currentIndex - 1 + totalItems) % totalItems;
    const nextIndex = (currentIndex + 1) % totalItems;

    return [
      { item: items[prevIndex], index: prevIndex, isCenter: false },
      { item: items[currentIndex], index: currentIndex, isCenter: true },
      { item: items[nextIndex], index: nextIndex, isCenter: false },
    ];
  };

  const visibleCards = getVisibleFeedbacks();

  const sectionBadge = badge || (isSinhala ? 'පාරිභෝගික අදහස්' : 'REVIEWS');
  const sectionTitle = title || (isSinhala ? 'අපගේ පාරිභෝගිකයින් පවසන දේ' : 'What Our Customers Say');
  const communityLabel = communityBtnText || (isSinhala ? 'අපගේ සමූහයට එකතු වන්න' : 'Visit Our Community');

  return (
    <section 
      className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-white border-b border-slate-200 dark:border-white/10 relative overflow-hidden select-none transition-colors duration-300"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-label="Customer Reviews Section"
    >
      {/* Background ambient lighting effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-emerald-500/10 dark:bg-[#2CFF05]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-14">
          <span className="font-heading font-extrabold text-[12px] sm:text-[13px] text-emerald-600 dark:text-[#2CFF05] uppercase tracking-[0.25em] block mb-2">
            {sectionBadge}
          </span>
          <h2 className="font-heading font-black text-[clamp(28px,4.5vw,46px)] text-slate-900 dark:text-white tracking-tight leading-tight">
            {sectionTitle}
          </h2>
        </div>

        {/* Carousel Container with Left & Right Arrow Buttons */}
        <div 
          className="relative flex items-center justify-center gap-3 sm:gap-5 lg:gap-6"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Left Arrow Button */}
          <button
            onClick={handlePrev}
            aria-label="Previous review"
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white dark:bg-[#131b2e]/90 text-slate-700 dark:text-white hover:bg-emerald-600 dark:hover:bg-[#2CFF05] hover:text-white dark:hover:text-[#0a0a0a] border border-slate-200 dark:border-white/15 hover:border-emerald-600 dark:hover:border-[#2CFF05] flex items-center justify-center transition-all duration-300 shadow-md hover:scale-105 active:scale-95 shrink-0 z-20 cursor-pointer"
          >
            <ChevronLeft size={20} className="stroke-[2.5]" />
          </button>

          {/* Cards Grid / Display */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 items-stretch">
            {visibleCards.map(({ item, index, isCenter }, cardPos) => {
              const customerName = (isSinhala && item.nameSi) ? item.nameSi : item.name;
              const customerRole = (isSinhala && item.roleSi) ? item.roleSi : item.role;
              const customerText = (isSinhala && item.textSi) ? item.textSi : item.text;
              const avatarColor = item.avatarBg || '#2CFF05';

              // Hide 1st and 3rd card on smaller mobile screens for focused view, show all 3 on lg+
              const isHiddenOnMobile = cardPos === 0 || cardPos === 2;
              const isHiddenOnTablet = cardPos === 0;

              return (
                <div
                  key={`${item.id}-${index}-${cardPos}`}
                  onClick={() => setCurrentIndex(index)}
                  className={`
                    relative rounded-[22px] sm:rounded-[26px] overflow-hidden min-h-[380px] sm:min-h-[420px] flex flex-col justify-end p-6 sm:p-7 transition-all duration-500 cursor-pointer group bg-slate-900
                    ${isHiddenOnMobile ? 'hidden lg:flex' : 'flex'}
                    ${isHiddenOnTablet && !isHiddenOnMobile ? 'hidden md:flex' : ''}
                    ${
                      isCenter
                        ? 'border-[2px] border-emerald-500 dark:border-blue-500/70 shadow-[0_0_30px_rgba(16,185,129,0.25)] dark:shadow-[0_0_35px_rgba(59,130,246,0.3)] ring-1 ring-emerald-500/30 dark:ring-blue-500/40 lg:scale-[1.02] z-10'
                        : 'border border-slate-200/80 dark:border-white/10 hover:border-slate-400 dark:hover:border-white/25 shadow-md opacity-90 hover:opacity-100'
                    }
                  `}
                >
                  {/* Background Image with subtle zoom on hover */}
                  <div className="absolute inset-0 z-0">
                    <Image
                      src={item.image}
                      alt={customerName}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      priority={isCenter}
                    />
                    {/* Lightweight Bottom Scrim Gradient for maximum image clarity & text legibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 via-45% to-transparent" />
                  </div>

                  {/* Card Content (Overlayed over Image) */}
                  <div className="relative z-10 flex flex-col justify-end">
                    {/* Star Rating */}
                    <div className="flex items-center gap-1 mb-3">
                      {Array.from({ length: 5 }).map((_, s) => (
                        <Star
                          key={s}
                          size={15}
                          className={`${
                            s < item.rating
                              ? 'fill-[#f59e0b] text-[#f59e0b]'
                              : 'fill-transparent text-zinc-500'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Review Quote Text */}
                    <p className="text-[14px] sm:text-[15px] font-sans text-white leading-[1.65] mb-5 font-medium tracking-wide line-clamp-3 drop-shadow-sm">
                      {customerText}
                    </p>

                    {/* Customer Profile Row */}
                    <div className="flex items-center gap-3.5 pt-2.5 border-t border-white/20">
                      {/* Avatar Initials Badge */}
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center font-heading font-extrabold text-[13px] text-white shrink-0 shadow-md ring-2 ring-white/20"
                        style={{ backgroundColor: avatarColor }}
                      >
                        {item.avatar}
                      </div>

                      {/* Customer Name & Role */}
                      <div className="overflow-hidden">
                        <div className="font-heading font-bold text-[14px] sm:text-[15px] text-white truncate group-hover:text-emerald-400 dark:group-hover:text-[#2CFF05] transition-colors">
                          {customerName}
                        </div>
                        <div className="text-[11px] sm:text-[12px] text-zinc-300 font-medium truncate">
                          {customerRole}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Arrow Button */}
          <button
            onClick={handleNext}
            aria-label="Next review"
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white dark:bg-[#131b2e]/90 text-slate-700 dark:text-white hover:bg-emerald-600 dark:hover:bg-[#2CFF05] hover:text-white dark:hover:text-[#0a0a0a] border border-slate-200 dark:border-white/15 hover:border-emerald-600 dark:hover:border-[#2CFF05] flex items-center justify-center transition-all duration-300 shadow-md hover:scale-105 active:scale-95 shrink-0 z-20 cursor-pointer"
          >
            <ChevronRight size={20} className="stroke-[2.5]" />
          </button>
        </div>

        {/* Carousel Pagination Dots */}
        <div className="flex items-center justify-center gap-2 mt-7">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                currentIndex === i 
                  ? 'w-7 bg-emerald-600 dark:bg-[#2CFF05]' 
                  : 'w-2 bg-slate-300 dark:bg-white/20 hover:bg-slate-400 dark:hover:bg-white/40'
              }`}
            />
          ))}
        </div>

        {/* Bottom CTA & Decorative Star */}
        <div className="relative text-center mt-10 sm:mt-12 flex items-center justify-center">
          <Link
            href="/community"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full text-[14px] font-extrabold text-white dark:text-[#0a0a0a] bg-emerald-600 hover:bg-emerald-700 dark:bg-[#2CFF05] dark:hover:bg-[#28e604] shadow-[0_6px_25px_rgba(16,185,129,0.3)] dark:shadow-[0_6px_25px_rgba(44,255,5,0.35)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer group"
          >
            <Users size={18} className="text-white dark:text-[#0a0a0a]" />
            <span>{communityLabel}</span>
            <ArrowRight size={16} className="text-white dark:text-[#0a0a0a] group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* Decorative Sparkle */}
          <div className="hidden sm:block absolute right-4 sm:right-12 bottom-0 text-slate-300 dark:text-white/25 pointer-events-none">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z"/>
            </svg>
          </div>
        </div>

      </div>
    </section>
  );
}
