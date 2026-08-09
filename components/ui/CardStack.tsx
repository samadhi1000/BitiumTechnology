'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/products';
import HoverZoomImage from './HoverZoomImage';
import { Layers, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

interface CardStackProps {
  products: Product[];
}

export default function CardStack({ products }: CardStackProps) {
  const [stack, setStack] = useState<Product[]>(products);

  const handleSwipe = (direction: 'left' | 'right') => {
    // Move the top card to the bottom of the stack
    setStack((prevStack) => {
      const copy = [...prevStack];
      const topCard = copy.shift();
      if (topCard) {
        copy.push(topCard);
      }
      return copy;
    });
  };

  return (
    <div className="relative w-full max-w-[340px] sm:max-w-[400px] h-[480px] flex items-center justify-center mx-auto">
      <AnimatePresence mode="popLayout">
        {stack.map((product, index) => {
          // Render only the top 3 cards for performance and clean look
          if (index > 2) return null;

          const isTop = index === 0;
          const scale = 1 - index * 0.05;
          const yOffset = index * 20;
          const rotate = isTop ? 0 : index * 4 * (index % 2 === 0 ? 1 : -1);

          return (
            <motion.div
              key={product.id}
              style={{
                zIndex: 30 - index,
                transformOrigin: 'top center',
              }}
              animate={{
                y: yOffset,
                scale: scale,
                rotate: rotate,
                opacity: 1 - index * 0.2,
              }}
              exit={{
                x: isTop ? (Math.random() > 0.5 ? 300 : -300) : 0,
                opacity: 0,
                scale: 0.8,
                transition: { duration: 0.35 },
              }}
              drag={isTop ? 'x' : false}
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(event, info) => {
                if (info.offset.x > 140) {
                  handleSwipe('right');
                } else if (info.offset.x < -140) {
                  handleSwipe('left');
                }
              }}
              whileHover={isTop ? { scale: 1.02, rotate: -1 } : {}}
              className="absolute w-full h-[440px] rounded-3xl border border-border bg-card shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing flex flex-col justify-between"
            >
              {/* Product Image & Glow */}
              <div className="relative w-full h-[260px] bg-background overflow-hidden">
                {isTop ? (
                  <HoverZoomImage
                    src={product.image_url}
                    alt={product.name}
                    priority={true}
                  />
                ) : (
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    sizes="(max-w-768px) 100vw, 400px"
                    className="object-cover pointer-events-none select-none"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/10 to-transparent"></div>
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2 pointer-events-none">
                  {product.original_price && (
                    <span className="px-2.5 py-1 rounded-md bg-rose-600 text-[10px] font-extrabold uppercase tracking-wider text-foreground">
                      Sale {Math.round(((product.original_price - product.price) / product.original_price) * 100)}% Off
                    </span>
                  )}
                  {product.category === 'dtf_sheet' && (
                    <span className="px-2.5 py-1 rounded-md bg-[#2CFF05] text-[10px] font-bold tracking-wider uppercase text-[#0a0a0a] flex items-center gap-1">
                      <Layers size={10} />
                      DTF
                    </span>
                  )}
                </div>

                {isTop && (
                  <div className="absolute top-4 right-4 animate-bounce pointer-events-none">
                    <span className="px-2.5 py-1 rounded-full bg-card/80 backdrop-blur border border-border text-[9px] font-bold text-foreground flex items-center gap-1">
                      <Sparkles size={10} className="text-[#2CFF05]" />
                      Swipe Me!
                    </span>
                  </div>
                )}
              </div>

              {/* Details & Action */}
              <div className="p-6 bg-card flex-grow flex flex-col justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-[#2CFF05] uppercase tracking-widest">
                    {product.sub_category === 'anime' ? 'Anime Apparel' : 'DTF Print Transfer'}
                  </span>
                  <h3 className="font-extrabold text-base text-foreground line-clamp-1 leading-snug">
                    {product.name.replace('TeeDesign ', '')}
                  </h3>
                  <p className="text-muted-foreground text-xs line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                  <div>
                    {product.original_price && (
                      <span className="text-xs text-muted-foreground line-through font-semibold">
                        Rs. {product.original_price.toLocaleString()}
                      </span>
                    )}
                    <p className="font-black text-lg text-[#2CFF05] leading-none">
                      Rs. {product.price.toLocaleString()}
                    </p>
                  </div>

                  <Link
                    href={product.category === 'dtf_sheet' && product.id.startsWith('b2a8') ? '/canvas' : `/products/${product.id}`}
                    className="px-5 py-2.5 rounded-xl bg-[#2CFF05] hover:bg-[#45ff24] text-[#0a0a0a] font-bold text-xs flex items-center gap-1.5 transition-all glow-primary select-none"
                  >
                    <span>Get Design</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
