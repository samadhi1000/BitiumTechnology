'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getProducts, Product } from '@/lib/products';
import { Layers, Shirt, ArrowRight, ShieldCheck, Zap, Sparkles } from 'lucide-react';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState<'all' | 'dtf_sheet' | 'apparel'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getProducts();
      setProducts(data);
      setLoading(false);
    }
    load();
  }, []);

  const filteredProducts = products.filter((product) => {
    if (filter === 'all') return true;
    return product.category === filter;
  });

  return (
    <div className="w-full min-h-screen bg-zinc-950 text-white">
      {/* Hero Banner */}
      <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8 border-b border-zinc-900 bg-radial-[at_top_right,_var(--tw-gradient-stops)] from-violet-950/20 via-zinc-950 to-zinc-950">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-12">
          <div className="flex-1 space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-semibold"
            >
              <Sparkles size={12} />
              <span>Next-Gen DTF Printing</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-6xl font-extrabold tracking-tight"
            >
              Create Premium Prints on <span className="bg-gradient-to-r from-violet-400 to-fuchsia-500 bg-clip-text text-transparent">PrintGrid</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-zinc-400 max-w-xl"
            >
              Compile your logos and designs on our virtual sheet canvas, or buy premium heavyweight blank apparel tailored for DTF applications.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-4"
            >
              <Link 
                href="/canvas" 
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-violet-600 hover:bg-violet-500 font-semibold text-white transition-all shadow-lg hover:shadow-violet-600/20 flex items-center justify-center gap-2 group"
              >
                <span>Launch DTF Canvas</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a 
                href="#catalog" 
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 font-semibold text-zinc-300 hover:text-white transition-all flex items-center justify-center"
              >
                Browse Blank Apparel
              </a>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="flex-1 relative w-full max-w-[450px] aspect-square rounded-3xl overflow-hidden border border-zinc-800/80 shadow-2xl bg-zinc-900 group"
          >
            <Image 
              src="/images/products/dtf-sheet.jpg" 
              alt="DTF custom roll" 
              fill 
              sizes="(max-w-700px) 100vw, 450px"
              priority
              className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl glass backdrop-blur-md border border-zinc-800/50">
              <p className="text-sm font-semibold text-violet-300">Virtual Sheet Canvas</p>
              <h3 className="text-lg font-bold mt-1 text-white">Interactive 12" x 23" DTF Roll builder</h3>
              <p className="text-xs text-zinc-400 mt-1">Upload multiple designs, scale, overlap, and check print resolutions instantly.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Selling Points Section */}
      <section className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-6 rounded-2xl border border-zinc-900 bg-zinc-900/20 flex gap-4">
          <div className="p-3 h-fit rounded-xl bg-violet-600/10 text-violet-400">
            <Zap size={22} />
          </div>
          <div>
            <h4 className="font-semibold text-base text-zinc-200">Express Turnaround</h4>
            <p className="text-sm text-zinc-500 mt-1">Orders processed and printed within 24-48 hours. Express shipping available islandwide.</p>
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-zinc-900 bg-zinc-900/20 flex gap-4">
          <div className="p-3 h-fit rounded-xl bg-violet-600/10 text-violet-400">
            <Layers size={22} />
          </div>
          <div>
            <h4 className="font-semibold text-base text-zinc-200">Pro Fabric.js Canvas</h4>
            <p className="text-sm text-zinc-500 mt-1">Drag-and-drop your custom vector or raster designs. Scale precisely to real inch print sizes.</p>
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-zinc-900 bg-zinc-900/20 flex gap-4">
          <div className="p-3 h-fit rounded-xl bg-violet-600/10 text-violet-400">
            <ShieldCheck size={22} />
          </div>
          <div>
            <h4 className="font-semibold text-base text-zinc-200">Ultimate Quality</h4>
            <p className="text-sm text-zinc-500 mt-1">Direct-to-Film transfer sheet resolution checker, backing opaque white layers, high stretchability.</p>
          </div>
        </div>
      </section>

      {/* Catalog Grid Section */}
      <section id="catalog" className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 border-t border-zinc-900 scroll-mt-16">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-12">
          <div>
            <h2 className="text-3xl font-extrabold">Product Catalog</h2>
            <p className="text-zinc-500 text-sm mt-1">Select customizable templates or top-quality blank base apparel.</p>
          </div>
          
          {/* Category Selector */}
          <div className="flex p-1 rounded-xl bg-zinc-900 border border-zinc-800">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${filter === 'all' ? 'bg-violet-600 text-white' : 'text-zinc-400 hover:text-white'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('dtf_sheet')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${filter === 'dtf_sheet' ? 'bg-violet-600 text-white' : 'text-zinc-400 hover:text-white'}`}
            >
              DTF Sheets
            </button>
            <button
              onClick={() => setFilter('apparel')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${filter === 'apparel' ? 'bg-violet-600 text-white' : 'text-zinc-400 hover:text-white'}`}
            >
              Blank Apparel
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="animate-pulse rounded-2xl bg-zinc-900 border border-zinc-800 h-[380px]"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="group relative rounded-2xl border border-zinc-900 bg-zinc-900/30 hover:border-zinc-800/80 hover:bg-zinc-900/50 transition-all flex flex-col h-full overflow-hidden"
              >
                {/* Product Image */}
                <div className="relative w-full aspect-square bg-zinc-950 overflow-hidden">
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      sizes="(max-w-768px) 100vw, (max-w-1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-700">
                      <Shirt size={48} />
                    </div>
                  )}
                  {product.category === 'dtf_sheet' && (
                    <div className="absolute top-4 left-4 px-2.5 py-1 rounded-md bg-violet-600 text-[10px] font-bold tracking-wide uppercase">
                      Custom Builder
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <span className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">{product.category === 'dtf_sheet' ? 'DTF transfers' : 'Blanks apparel'}</span>
                  <h3 className="font-bold text-lg text-zinc-100 mt-1">{product.name}</h3>
                  <p className="text-zinc-400 text-xs mt-2 line-clamp-2 flex-grow">{product.description}</p>
                  
                  <div className="mt-6 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-zinc-500">Starting from</span>
                      <p className="font-bold text-lg text-violet-400">Rs. {product.price.toLocaleString()}</p>
                    </div>

                    <Link
                      href={product.category === 'dtf_sheet' ? '/canvas' : `/products/${product.id}`}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        product.category === 'dtf_sheet'
                          ? 'bg-violet-600 hover:bg-violet-500 text-white glow-primary'
                          : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
                      }`}
                    >
                      {product.category === 'dtf_sheet' ? 'Start Designing' : 'View Options'}
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
