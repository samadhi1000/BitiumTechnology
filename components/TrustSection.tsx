'use client';

import React from 'react';
import { Star, ShieldCheck, Truck, Clock } from 'lucide-react';

export default function TrustSection() {
  return (
    <section className="w-full bg-background text-foreground py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-b border-border overflow-hidden">
      <div className="max-w-[1080px] mx-auto">
        
        {/* Header */}
        <div className="mb-12 text-center lg:text-left">
          <p className="font-sans font-bold tracking-[0.14em] uppercase text-xs text-primary mb-3">
            Our Quality Standards
          </p>
          <h2 className="font-black text-3xl sm:text-4xl lg:text-[44px] leading-[1.05] max-w-[720px] mx-auto lg:mx-0">
            INDUSTRIAL GRADE PRINTING. DELIVERED ON TIME.
          </h2>
        </div>

        {/* Stencil Border Stats Box */}
        <div className="relative border-2 border-dashed border-border rounded-lg p-6 sm:p-9">
          <div className="absolute -top-[11px] left-6 bg-background px-2.5 font-sans text-[10px] tracking-[0.12em] text-muted-foreground uppercase flex items-center gap-2">
            <span>✂</span> Cut Line
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0">
            
            {/* Stat 1 */}
            <div className="lg:pr-5 lg:border-r border-dashed border-border flex flex-col items-center lg:items-start text-center lg:text-left">
              <div className="font-black text-3xl sm:text-4xl text-primary leading-none mb-2.5">
                99%
              </div>
              <div className="text-[13px] font-semibold text-foreground mb-1">
                Perfect Print Accuracy
              </div>
              <div className="text-xs text-muted-foreground leading-relaxed">
                Our machinery is calibrated daily for exact color matching.
              </div>
            </div>

            {/* Stat 2 */}
            <div className="lg:px-5 lg:border-r border-dashed border-border flex flex-col items-center lg:items-start text-center lg:text-left">
              <div className="font-black text-3xl sm:text-4xl text-primary leading-none mb-2.5">
                24h
              </div>
              <div className="text-[13px] font-semibold text-foreground mb-1">
                Fast Turnaround
              </div>
              <div className="text-xs text-muted-foreground leading-relaxed">
                Most orders are processed and ready for dispatch in 24 hours.
              </div>
            </div>

            {/* Stat 3 */}
            <div className="lg:px-5 lg:border-r border-dashed border-border flex flex-col items-center lg:items-start text-center lg:text-left">
              <div className="font-black text-3xl sm:text-4xl text-primary leading-none mb-2.5">
                10k+
              </div>
              <div className="text-[13px] font-semibold text-foreground mb-1">
                Orders Fulfilled
              </div>
              <div className="text-xs text-muted-foreground leading-relaxed">
                Trusted by hundreds of local apparel brands.
              </div>
            </div>

            {/* Stat 4 */}
            <div className="lg:pl-5 flex flex-col items-center lg:items-start text-center lg:text-left">
              <div className="font-black text-3xl sm:text-4xl text-primary leading-none mb-2.5">
                5<span className="text-lg">★</span>
              </div>
              <div className="text-[13px] font-semibold text-foreground mb-1">
                Customer Satisfaction
              </div>
              <div className="text-xs text-muted-foreground leading-relaxed">
                Top-rated customer support & after-sales service.
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
