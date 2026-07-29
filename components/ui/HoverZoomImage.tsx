'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface HoverZoomImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

export default function HoverZoomImage({ 
  src, 
  alt, 
  className = "", 
  sizes = "(max-w-768px) 100vw, 400px",
  priority = false
}: HoverZoomImageProps) {
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({
    transform: 'scale(1)',
    transformOrigin: 'center center'
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    // Calculate cursor position inside the element as percentage (0 to 100)
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    
    setZoomStyle({
      transform: 'scale(1.8)',
      transformOrigin: `${x}% ${y}%`,
      transition: 'transform 0.1s ease-out, transform-origin 0.05s ease-out'
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({
      transform: 'scale(1)',
      transformOrigin: 'center center',
      transition: 'transform 0.25s ease-in-out'
    });
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden w-full h-full cursor-zoom-in ${className}`}
    >
      <div 
        style={zoomStyle}
        className="w-full h-full relative"
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover pointer-events-none select-none"
        />
      </div>
    </div>
  );
}
