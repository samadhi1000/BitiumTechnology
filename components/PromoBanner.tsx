import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Award, 
  Clock, 
  CheckCircle2, 
  Target, 
  Layers, 
  Shirt, 
  Briefcase, 
  Globe2,
  ChevronRight
} from 'lucide-react';

export default function PromoBanner() {
  return (
    <section className="relative w-full bg-zinc-950 overflow-hidden border-b border-zinc-900">
      {/* Background glowing effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/15 via-zinc-950 to-zinc-950 pointer-events-none"></div>
      
      {/* Top Angled Banner Strip */}
      <div className="w-full flex justify-end px-4 sm:px-8 pt-4">
        <div 
          className="bg-blue-600/90 text-white px-8 py-1.5 font-black italic tracking-widest text-xs sm:text-sm uppercase shadow-[0_0_15px_rgba(37,99,235,0.4)]"
          style={{ clipPath: 'polygon(15px 0, 100% 0, 100% 100%, 0 100%)' }}
        >
          High Quality. Fast Turnaround. Built to Last.
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center">
          
          {/* Left Side: 4 Value Props (4 cols) */}
          <div className="lg:col-span-3 grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center text-center group">
              <div className="w-14 h-14 rounded-full border border-blue-500/30 bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500/20 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all duration-300">
                <Award size={28} />
              </div>
              <h4 className="mt-3 text-[13px] font-black text-white uppercase leading-tight tracking-wide">Premium<br/>Quality</h4>
              <p className="mt-1 text-[10px] text-zinc-400 leading-snug px-2">Top quality materials & flawless printing</p>
            </div>
            
            <div className="flex flex-col items-center text-center group">
              <div className="w-14 h-14 rounded-full border border-blue-500/30 bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500/20 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all duration-300">
                <Clock size={28} />
              </div>
              <h4 className="mt-3 text-[13px] font-black text-white uppercase leading-tight tracking-wide">Fast<br/>Turnaround</h4>
              <p className="mt-1 text-[10px] text-zinc-400 leading-snug px-2">Quick production without compromising</p>
            </div>
            
            <div className="flex flex-col items-center text-center group">
              <div className="w-14 h-14 rounded-full border border-blue-500/30 bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500/20 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all duration-300">
                <CheckCircle2 size={28} />
              </div>
              <h4 className="mt-3 text-[13px] font-black text-white uppercase leading-tight tracking-wide">No Minimum<br/>Orders</h4>
              <p className="mt-1 text-[10px] text-zinc-400 leading-snug px-2">No minimums, big or small, we got you</p>
            </div>
            
            <div className="flex flex-col items-center text-center group">
              <div className="w-14 h-14 rounded-full border border-blue-500/30 bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500/20 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all duration-300">
                <Target size={28} />
              </div>
              <h4 className="mt-3 text-[13px] font-black text-white uppercase leading-tight tracking-wide">Perfect for<br/>Anything</h4>
              <p className="mt-1 text-[10px] text-zinc-400 leading-snug px-2">Uniforms, events, streetwear & more</p>
            </div>
          </div>

          {/* Center Showcase: Apparel Images Overlapping (5 cols) */}
          <div className="lg:col-span-5 relative h-[380px] w-full flex justify-center items-center">
            {/* Ambient glowing cloud behind shirts */}
            <div className="absolute w-[80%] h-[80%] bg-blue-600/20 blur-[80px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
            
            {/* Background Shirt (Hoodie) */}
            <div className="absolute left-[10%] top-[15%] w-48 h-48 sm:w-56 sm:h-56 -rotate-6 opacity-70 group hover:opacity-100 hover:scale-105 hover:z-20 transition-all duration-500 drop-shadow-2xl">
              <Image 
                src="/images/products/streetwear-hoodie.jpg" 
                alt="Custom Hoodie" 
                fill 
                className="object-cover rounded-xl border border-zinc-800"
              />
            </div>
            
            {/* Background Shirt (Labubu) */}
            <div className="absolute right-[5%] top-[5%] w-44 h-44 sm:w-52 sm:h-52 rotate-12 opacity-80 group hover:opacity-100 hover:scale-105 hover:z-20 transition-all duration-500 drop-shadow-2xl">
              <Image 
                src="/images/products/labubu-new.jpg" 
                alt="Labubu Custom Tee" 
                fill 
                className="object-cover rounded-xl border border-zinc-800"
              />
            </div>
            
            {/* Foreground Main Shirt (Mountain Tee) */}
            <div className="absolute z-10 w-60 h-60 sm:w-72 sm:h-72 shadow-[0_0_40px_rgba(0,0,0,0.8)] hover:scale-105 transition-transform duration-500">
              <Image 
                src="/images/products/mountain-vintage-tee.jpg" 
                alt="Vintage Mountain Custom Tee" 
                fill 
                className="object-cover rounded-xl border-2 border-blue-500/30"
              />
            </div>
          </div>

          {/* Right Side: Service Stack (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            {/* Card 1 */}
            <div 
              className="bg-zinc-900/60 border border-zinc-800 hover:border-blue-500/50 p-4 pr-10 flex items-center gap-4 group cursor-pointer transition-colors backdrop-blur-sm"
              style={{ clipPath: 'polygon(0 0, 100% 0, 95% 100%, 0 100%)' }}
            >
              <div className="text-blue-500 drop-shadow-[0_0_8px_rgba(37,99,235,0.5)]">
                <Layers size={36} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-white font-black italic tracking-wide text-lg group-hover:text-blue-400 transition-colors">DTF PRINTING</h3>
                <p className="text-[11px] text-zinc-400 leading-snug">Vibrant colours, fine detail & long-lasting prints on any garment.</p>
              </div>
            </div>

            {/* Card 2 */}
            <div 
              className="bg-zinc-900/60 border border-zinc-800 hover:border-blue-500/50 p-4 pr-10 flex items-center gap-4 group cursor-pointer transition-colors backdrop-blur-sm"
              style={{ clipPath: 'polygon(0 0, 95% 0, 100% 100%, 0 100%)' }}
            >
              <div className="text-blue-500 drop-shadow-[0_0_8px_rgba(37,99,235,0.5)]">
                <Briefcase size={36} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-white font-black italic tracking-wide text-lg group-hover:text-blue-400 transition-colors">WORKWEAR & UNIFORMS</h3>
                <p className="text-[11px] text-zinc-400 leading-snug">Custom uniforms & workwear to elevate your brand.</p>
              </div>
            </div>

            {/* Card 3 */}
            <div 
              className="bg-zinc-900/60 border border-zinc-800 hover:border-blue-500/50 p-4 pr-10 flex items-center gap-4 group cursor-pointer transition-colors backdrop-blur-sm"
              style={{ clipPath: 'polygon(0 0, 100% 0, 95% 100%, 0 100%)' }}
            >
              <div className="text-blue-500 drop-shadow-[0_0_8px_rgba(37,99,235,0.5)]">
                <Shirt size={36} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-white font-black italic tracking-wide text-lg group-hover:text-blue-400 transition-colors">CUSTOM MERCH & MORE</h3>
                <p className="text-[11px] text-zinc-400 leading-snug">From hoodies to hats, we bring your ideas to life.</p>
              </div>
            </div>
          </div>
          
        </div>
      </div>

      {/* Footer CTA Bar */}
      <div className="w-full border-t border-blue-900/40 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Quality Tagline */}
          <div className="flex items-center gap-2 text-white font-bold italic tracking-wide text-sm sm:text-base">
            <Globe2 className="text-blue-500" size={20} />
            <span>QUALITY YOU CAN SEE. SERVICE YOU CAN TRUST.</span>
          </div>
          
          {/* Action Area */}
          <div className="flex items-center gap-6">
            <Link 
              href="/canvas"
              className="bg-blue-600 hover:bg-blue-500 text-white font-black italic uppercase tracking-wider text-sm px-6 py-2 flex items-center gap-2 shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:shadow-[0_0_25px_rgba(37,99,235,0.6)] transition-all group"
              style={{ clipPath: 'polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)' }}
            >
              START DESIGNING <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            
            {/* Socials */}
            <div className="flex items-center gap-3 text-blue-500">
              <a href="#" className="hover:text-white transition-colors text-sm font-bold">FB</a>
              <a href="#" className="hover:text-white transition-colors text-sm font-bold">IG</a>
              <span className="text-zinc-400 font-semibold text-sm hover:text-white transition-colors cursor-pointer ml-1 hidden sm:inline-block">bitiumtechnology.com</span>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
