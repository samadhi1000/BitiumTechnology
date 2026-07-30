"use client";

import React from "react";

interface PoweredByProps {
  /**
   * 'brand' uses Stack Unleash's signature orange/cyan gradients and animations.
   * 'adaptive' matches the host website's text color using Tailwind's text utilities.
   */
  theme?: "brand" | "adaptive";
  /**
   * Optional custom URL for click tracking or custom navigation.
   */
  href?: string;
  /**
   * Layout alignment. Defaults to 'center'.
   */
  align?: "left" | "center" | "right";
  /**
   * Additional CSS classes for styling adjustments.
   */
  className?: string;
}

export default function PoweredBy({
  theme = "brand",
  href = "https://stackunleash.com",
  align = "center",
  className = "",
}: PoweredByProps) {
  // Setup wrapper styles based on alignment
  const alignmentClass =
    align === "left"
      ? "justify-start text-left"
      : align === "right"
      ? "justify-end text-right"
      : "justify-center text-center";

  const isBrand = theme === "brand";

  return (
    <div className={`flex flex-col items-center py-6 ${className}`}>
      {/* CSS Styles to bundle animations inside the component so it is 100% self-contained */}
      <style jsx global>{`
        @keyframes su-gradient-flow {
          0% { background-position: 0% center; }
          50% { background-position: 100% center; }
          100% { background-position: 0% center; }
        }
        @keyframes su-text-shine {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
        @keyframes su-lava-pulse {
          0%, 100% {
            filter: drop-shadow(0 0 2px rgba(255, 77, 0, 0.75)) drop-shadow(0 0 8px rgba(255, 77, 0, 0.45));
            opacity: 0.9;
          }
          50% {
            filter: drop-shadow(0 0 5px rgba(255, 107, 0, 1.0)) drop-shadow(0 0 20px rgba(255, 107, 0, 0.75));
            opacity: 1.0;
          }
        }
        @keyframes su-lava-flow {
          0% {
            stroke-dashoffset: 120;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
        
        .su-brand-stack {
          background: linear-gradient(to right, #FF5100 0%, #FFB300 30%, #FF7F00 50%, #FFB300 70%, #FF5100 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: su-gradient-flow 4s ease infinite;
        }

        .su-brand-unleash {
          background: linear-gradient(to right, #00D5FF 0%, #7A35FF 40%, #0088FF 70%, #00D5FF 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: su-gradient-flow 4s ease infinite;
        }

        .su-brand-shine {
          background: linear-gradient(
            to right,
            rgba(255, 255, 255, 0.4) 0%,
            rgba(255, 255, 255, 0.4) 30%,
            rgba(255, 255, 255, 1) 50%,
            rgba(255, 255, 255, 0.4) 70%,
            rgba(255, 255, 255, 0.4) 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: su-text-shine 3.5s linear infinite;
        }
        
        .su-adaptive-shine {
          background: linear-gradient(
            to right,
            currentColor 0%,
            currentColor 30%,
            rgba(255, 255, 255, 0.9) 50%,
            currentColor 70%,
            currentColor 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: su-text-shine 3.5s linear infinite;
        }

        .su-animate-lava {
          animation: su-lava-pulse 3s ease-in-out infinite;
        }
        
        .su-animate-flow-dash {
          stroke-dasharray: 24 36;
          animation: su-lava-flow 6s linear infinite;
        }
      `}</style>

      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center gap-3 group transition-opacity duration-300 hover:opacity-95 ${alignmentClass}`}
        aria-label="Powered by Stack Unleash"
      >
        {/* Powered By Text Label */}
        <span className="text-xs uppercase tracking-widest text-zinc-500 group-hover:text-zinc-400 transition-colors">
          Powered By
        </span>

        <div className="flex items-start">
          {/* Animated SVG Stack Unleash Logo Icon */}
          <div className="transition-transform duration-300 group-hover:scale-105 flex-shrink-0 mr-2">
            <svg 
              className="w-10 h-10" 
              viewBox="0 0 100 100" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Metallic column gradients */}
                <linearGradient id="su-top-face" x1="28" y1="26" x2="72" y2="26" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#2c3e50" />
                  <stop offset="100%" stopColor="#1a252f" />
                </linearGradient>
                <linearGradient id="su-left-face" x1="28" y1="50" x2="50" y2="50" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#0f172a" />
                  <stop offset="100%" stopColor="#1e293b" />
                </linearGradient>
                <linearGradient id="su-right-face" x1="50" y1="50" x2="72" y2="50" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#1e293b" />
                  <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>

                {/* Animated glowing lava gradient */}
                <linearGradient id="su-lava-grad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#FF3300" />
                  <stop offset="50%" stopColor="#FF9900" />
                  <stop offset="100%" stopColor="#FF3300" />
                </linearGradient>
              </defs>

              {/* SECTION 1: Lava Ribbon Back Segment (Wraps behind the column for 3D depth) */}
              <path
                d="M 32 64 C 18 55, 18 35, 38 24 C 50 16, 68 18, 72 26"
                stroke="url(#su-lava-grad)"
                strokeWidth="7"
                strokeLinecap="round"
                fill="none"
                className="su-animate-lava"
              />
              <path
                d="M 32 64 C 18 55, 18 35, 38 24 C 50 16, 68 18, 72 26"
                stroke="#FFE5B4"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
                className="su-animate-flow-dash"
              />

              {/* SECTION 2: 3D Isometric Column (The Stack) */}
              {/* Left Side Face */}
              <path
                d="M 28 26 L 50 37 L 50 75 L 28 64 Z"
                fill="url(#su-left-face)"
                stroke="#334155"
                strokeWidth="0.5"
              />
              {/* Right Side Face */}
              <path
                d="M 50 37 L 72 26 L 72 64 L 50 75 Z"
                fill="url(#su-right-face)"
                stroke="#1e293b"
                strokeWidth="0.5"
              />
              {/* Top Face */}
              <path
                d="M 50 15 L 72 26 L 50 37 L 28 26 Z"
                fill="url(#su-top-face)"
                stroke="#475569"
                strokeWidth="0.75"
              />

              {/* Coding Symbol Details on Top Face </ > */}
              <path
                d="M 43 23 L 39 25 L 43 27"
                stroke="#00E5FF"
                strokeWidth="0.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M 57 23 L 61 25 L 57 27"
                stroke="#00E5FF"
                strokeWidth="0.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M 51 21 L 49 29"
                stroke="#00E5FF"
                strokeWidth="0.75"
                strokeLinecap="round"
              />

              {/* SECTION 3: Lava Ribbon Front Segment (Wraps in front of the column for 3D depth) */}
              <path
                d="M 72 26 C 85 45, 62 60, 50 60 C 35 60, 25 72, 35 81 C 45 89, 65 89, 70 75"
                stroke="url(#su-lava-grad)"
                strokeWidth="7"
                strokeLinecap="round"
                fill="none"
                className="su-animate-lava"
              />
              <path
                d="M 72 26 C 85 45, 62 60, 50 60 C 35 60, 25 72, 35 81 C 45 89, 65 89, 70 75"
                stroke="#FFE5B4"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
                className="su-animate-flow-dash"
              />
            </svg>
          </div>

          {/* Typography details */}
          <div className="flex flex-col items-start leading-none pt-0.5">
            <div className="flex flex-col w-full leading-none">
              {/* STACK text block */}
              <div
                className="w-[72px] flex justify-between text-[13px] font-black leading-[0.85] tracking-widest su-brand-stack"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                <span>S</span><span>T</span><span>A</span><span>C</span><span>K</span>
              </div>
              
              {/* UNLEASH text block */}
              <span
                className="text-[12px] font-black tracking-tight leading-[0.85] mt-[2px] block whitespace-nowrap su-brand-unleash"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                UNLEASH
              </span>
            </div>

            {/* Subtitle taglines (BUILD • AUTOMATE • SCALE) */}
            <div
              className="w-[72px] flex justify-between text-[4.5px] font-black uppercase mt-1.5 su-brand-shine"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              <span>BUILD</span>
              <span>&bull;</span>
              <span>AUTOMATE</span>
              <span>&bull;</span>
              <span>SCALE</span>
            </div>
          </div>
        </div>
      </a>
    </div>
  );
}
