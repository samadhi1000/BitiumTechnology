'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';

export default function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Show a helpful welcome tooltip after 4 seconds on page load
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    setShowTooltip(false);
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end font-sans">
      {/* 1. CSS Keyframe styles for animations */}
      <style>{`
        @keyframes wa-pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.7);
          }
          70% {
            box-shadow: 0 0 0 15px rgba(37, 211, 102, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(37, 211, 102, 0);
          }
        }
        .wa-btn-pulse {
          animation: wa-pulse 2s infinite;
        }
        @keyframes wa-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .wa-avatar-bounce {
          animation: wa-bounce 3s ease-in-out infinite;
        }
      `}</style>

      {/* 2. Interactive Chat Dialog Box */}
      {isOpen && (
        <div className="mb-4 w-[310px] sm:w-[330px] rounded-2xl overflow-hidden border border-border bg-card shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-[#075E54] p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Support Specialist Avatar */}
              <div className="relative w-10 h-10 rounded-full bg-slate-800 border border-white/20 flex items-center justify-center overflow-hidden flex-shrink-0">
                {/* Specialist Avatar SVG */}
                <svg className="w-6 h-6 text-slate-300" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 16h-2v-2h2v2zm0-4h-2V7h2v7z" />
                </svg>
                {/* Active Status indicator */}
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#25D366] border-2 border-[#075E54]" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold leading-tight">Bitium Support</p>
                <p className="text-[10px] text-white/80 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
                  Online • Replies instantly
                </p>
              </div>
            </div>
            <button 
              onClick={handleClose} 
              className="text-white/70 hover:text-white transition-colors cursor-pointer p-1 hover:bg-white/10 rounded-full"
              aria-label="Close chat window"
            >
              <X size={16} />
            </button>
          </div>

          {/* Chat Body */}
          <div className="p-4 bg-slate-950/40 relative min-h-[100px] flex flex-col justify-between">
            {/* Grid pattern overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:12px_12px] pointer-events-none" />
            
            <div className="bg-muted/80 p-3.5 rounded-2xl rounded-tl-none border border-border max-w-[90%] relative z-10 text-left">
              <p className="text-xs text-foreground leading-relaxed font-medium">
                Hello! Looking for custom DTF gang sheets, stencils, or custom prints? Let's chat on WhatsApp!
              </p>
              <span className="text-[9px] text-muted-foreground block text-right mt-1.5">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            
            <div className="pt-4 relative z-10">
              <a
                href="https://wa.me/94779731097"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all duration-300 hover:scale-[1.02] cursor-pointer"
              >
                <Send size={14} />
                <span>Start WhatsApp Chat</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 3. Welcome Tooltip */}
      {showTooltip && !isOpen && (
        <div className="mb-3 px-4 py-2.5 bg-card border border-border text-foreground text-xs font-bold rounded-xl shadow-lg relative flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <span>Need help? Chat with us!</span>
          <button 
            onClick={(e) => { e.stopPropagation(); setShowTooltip(false); }} 
            className="text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X size={12} />
          </button>
          {/* Arrow pointing down */}
          <div className="absolute bottom-[-6px] right-6 w-3 h-3 bg-card border-r border-b border-border rotate-45" />
        </div>
      )}

      {/* 4. Floating Trigger Button */}
      <div className="flex flex-col items-center">
        {/* The main green WhatsApp trigger button */}
        <button
          onClick={handleToggle}
          className={`flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl hover:bg-[#20ba5a] hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer ${
            !isOpen ? 'wa-btn-pulse' : ''
          }`}
          aria-label="Toggle contact popup"
        >
          {isOpen ? (
            <MessageSquare className="w-7 h-7 relative z-10 animate-in spin-in duration-300" />
          ) : (
            <svg
              className="w-8 h-8 fill-current relative z-10"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
