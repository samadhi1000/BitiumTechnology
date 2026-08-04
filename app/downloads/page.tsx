'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Search, Grid, Eye, Shield, Tag, Download, ShoppingBag, Loader2, ArrowRight } from 'lucide-react';
import { loadPayHereScript } from '@/lib/payhere-loader';

interface DigitalArtwork {
  id: string;
  title: string;
  description: string;
  price: number;
  preview_url: string;
  category: 'batik' | 'vector' | 'dtf' | 'wall-art';
  tags: string[];
  file_format: string;
  file_size?: string;
  resolution?: string;
}

export default function DownloadsPage() {
  const [artworks, setArtworks] = useState<DigitalArtwork[]>([]);
  const [category, setCategory] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedArt, setSelectedArt] = useState<DigitalArtwork | null>(null);
  
  // Checkout Modal State
  const [checkoutArt, setCheckoutArt] = useState<DigitalArtwork | null>(null);
  const [email, setEmail] = useState<string>('');
  const [checkingOut, setCheckingOut] = useState<boolean>(false);

  useEffect(() => {
    fetchCatalog();
  }, [category, search]);

  const fetchCatalog = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category && category !== 'all') params.append('category', category);
      if (search) params.append('search', search);

      const res = await fetch(`/api/downloads?${params.toString()}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setArtworks(data);
      }
    } catch (err) {
      console.error('Error loading digital downloads catalog:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutArt || !email) return;

    setCheckingOut(true);
    try {
      const res = await fetch('/api/checkout/payhere', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [{ id: checkoutArt.id, quantity: 1 }],
          customerEmail: email,
          customerName: 'Digital Customer' // Using a default name as we only collect email
        })
      });

      const data = await res.json();
      if (res.ok && data.hash) {
        try {
          await loadPayHereScript();
        } catch (scriptErr) {
          console.error('Failed to load PayHere script:', scriptErr);
          alert('Could not load the payment gateway. Please check your internet connection or disable ad blockers and try again.');
          return;
        }

        (window as any).payhere.onCompleted = function onCompleted(orderId: string) {
          console.log("Payment completed. OrderID:" + orderId);
          window.location.href = data.return_url;
        };

        (window as any).payhere.onDismissed = function onDismissed() {
          console.log("Payment window closed by the customer");
        };

        (window as any).payhere.onError = function onError(error: string) {
          console.log("Payment Error:" + error);
          alert("Payment failed: " + error);
        };

        (window as any).payhere.startPayment(data);
      } else {
        alert(data.error || 'Failed to initialize checkout payment');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Network request failed');
    } finally {
      setCheckingOut(false);
    }
  };

  const categoryOptions = [
    { value: 'all', label: 'All Designs' },
    { value: 'batik', label: 'Traditional Batik' },
    { value: 'vector', label: 'Vector & SVG Graphics' },
    { value: 'dtf', label: 'DTF Transfer Sheets' },
    { value: 'wall-art', label: 'Wall Decor Stencils' }
  ];

  return (
    <div className="w-full min-h-screen bg-zinc-950 text-white selection:bg-[#116466]/40 selection:text-[#D1E8E2] pb-24">
      
      {/* Hero Header */}
      <section className="relative py-16 sm:py-20 border-b border-zinc-900 overflow-hidden bg-zinc-950">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }} />
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-violet-600/10 border border-violet-500/20 text-[#FFCB9A] text-xs font-bold uppercase tracking-wider">
            <Shield size={12} className="text-[#FFCB9A]" />
            Secure Asset Vault
          </span>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight">
            Digital Designs & <span className="outline-text">Downloads</span>
          </h1>
          <p className="text-sm text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Browse and purchase from our catalog of 2,000+ print-ready, high-resolution original digital vector files, batik layouts, and stencils. Instantly access signed storage download keys upon payment.
          </p>
        </div>
      </section>

      <section className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {/* Search and Filters Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 rounded-2xl bg-zinc-900 border border-zinc-850 glass mb-8">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {categoryOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => setCategory(opt.value)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  category === opt.value
                    ? 'bg-[#116466] text-[#D1E8E2] shadow-md shadow-[#116466]/20'
                    : 'bg-zinc-950/60 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
            <input
              type="text"
              placeholder="Search design number or tag..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>
        </div>

        {/* Catalog Grid View */}
        {loading ? (
          <div className="w-full py-32 flex flex-col items-center justify-center gap-3">
            <Loader2 className="animate-spin text-[#116466]" size={36} />
            <span className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Loading Digital Assets...</span>
          </div>
        ) : artworks.length === 0 ? (
          <div className="w-full py-32 text-center border border-dashed border-zinc-800 rounded-3xl">
            <Grid className="mx-auto text-zinc-600 mb-4" size={40} />
            <h3 className="text-lg font-bold">No digital artworks found</h3>
            <p className="text-xs text-zinc-500 mt-1">Try relaxing your search terms or selecting another category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {artworks.map((art) => (
              <div 
                key={art.id}
                className="group flex flex-col bg-zinc-900 border border-zinc-850 rounded-3xl overflow-hidden hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 relative"
              >
                {/* Image Container with Watermark */}
                <div className="relative aspect-[4/3] bg-zinc-950 overflow-hidden select-none">
                  {/* Actual preview image */}
                  <Image
                    src={art.preview_url}
                    alt={art.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  
                  {/* Dynamic Protective Watermark Pattern Overlay */}
                  <div className="absolute inset-0 z-10 pointer-events-none bg-[repeating-linear-gradient(45deg,transparent,transparent_30px,rgba(0,0,0,0.06)_30px,rgba(0,0,0,0.06)_60px)] opacity-80" />
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 pointer-events-none select-none">
                    <div className="px-3 py-1 rounded-md bg-zinc-950/70 border border-white/5 backdrop-blur-[2px]">
                      <span className="text-[10px] font-black text-white/35 uppercase tracking-[0.2em] rotate-[-15deg] block">
                        Bitium Technologies
                      </span>
                    </div>
                  </div>

                  {/* Format Badge */}
                  <span className="absolute top-3 right-3 z-20 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-zinc-950/80 border border-zinc-800 text-zinc-300">
                    {art.file_format}
                  </span>
                </div>

                {/* Details */}
                <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-md font-extrabold text-white group-hover:text-[#FFCB9A] transition-colors line-clamp-1">
                      {art.title}
                    </h3>
                    <p className="text-[11px] text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
                      {art.description}
                    </p>

                    {/* Metadata tags */}
                    <div className="flex flex-wrap gap-1 mt-3">
                      {art.tags.slice(0, 3).map((t, idx) => (
                        <span key={idx} className="text-[9px] font-bold text-[#D9B08C] bg-zinc-950/60 border border-zinc-850 px-2 py-0.5 rounded-full">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-zinc-850 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-zinc-500 uppercase font-bold block">Resolution</span>
                      <span className="text-xs font-semibold text-zinc-300">{art.resolution || 'Vector / A3'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-500 uppercase font-bold block">Secure Price</span>
                      <span className="text-md font-black text-[#FFCB9A]">Rs. {art.price.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => setSelectedArt(art)}
                      className="w-full py-2.5 rounded-xl border border-zinc-800 hover:border-zinc-700 bg-zinc-950/60 hover:bg-zinc-850 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Eye size={13} />
                      Details
                    </button>
                    <button
                      onClick={() => setCheckoutArt(art)}
                      className="w-full py-2.5 rounded-xl bg-[#116466] hover:bg-[#157a7c] text-[#D1E8E2] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors border border-[#0d4e50] shadow-md shadow-[#116466]/10"
                    >
                      <ShoppingBag size={13} />
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 1. Artwork Details Modal */}
      {selectedArt && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-xl rounded-3xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl space-y-6">
            <button 
              onClick={() => setSelectedArt(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              ✕
            </button>
            <div className="flex flex-col sm:flex-row gap-5">
              <div className="w-full sm:w-1/2 aspect-square relative bg-zinc-950 rounded-2xl overflow-hidden select-none border border-zinc-850">
                <Image src={selectedArt.preview_url} alt={selectedArt.title} fill className="object-cover" />
                <div className="absolute inset-0 z-10 pointer-events-none bg-[repeating-linear-gradient(45deg,transparent,transparent_35px,rgba(0,0,0,0.06)_35px,rgba(0,0,0,0.06)_70px)]" />
              </div>
              <div className="w-full sm:w-1/2 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-black text-violet-400 uppercase tracking-widest block">{selectedArt.category}</span>
                  <h2 className="text-xl font-black mt-1 text-white">{selectedArt.title}</h2>
                  <p className="text-xs text-zinc-400 mt-2 leading-relaxed">{selectedArt.description}</p>
                </div>
                <div className="space-y-2 pt-4 border-t border-zinc-850 mt-4">
                  <div className="flex justify-between text-xs"><span className="text-zinc-500">File Size:</span><span className="font-bold">{selectedArt.file_size || 'N/A'}</span></div>
                  <div className="flex justify-between text-xs"><span className="text-zinc-500">Format:</span><span className="font-bold text-violet-400">{selectedArt.file_format}</span></div>
                  <div className="flex justify-between text-xs"><span className="text-zinc-500">Resolution:</span><span className="font-bold">{selectedArt.resolution || 'Vector'}</span></div>
                  <div className="flex justify-between text-xs pt-1 border-t border-zinc-850/60"><span className="text-zinc-400 font-bold">Secure Price:</span><span className="font-extrabold text-[#FFCB9A]">Rs. {selectedArt.price.toLocaleString()}</span></div>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                setCheckoutArt(selectedArt);
                setSelectedArt(null);
              }}
              className="w-full py-3.5 rounded-xl bg-[#116466] hover:bg-[#157a7c] text-[#D1E8E2] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-[#0d4e50]"
            >
              <ShoppingBag size={14} />
              Confirm Checkout & Buy Now
            </button>
          </div>
        </div>
      )}

      {/* 2. Direct Checkout Email input Modal */}
      {checkoutArt && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl space-y-5">
            <button 
              onClick={() => setCheckoutArt(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
              disabled={checkingOut}
            >
              ✕
            </button>
            <div className="text-center space-y-2">
              <span className="inline-flex items-center justify-center p-3 rounded-full bg-violet-600/10 border border-violet-500/20 text-[#FFCB9A] mb-1">
                <Shield size={24} />
              </span>
              <h2 className="text-lg font-black text-white">Secure Checkout</h2>
              <p className="text-xs text-zinc-400">
                You are purchasing **{checkoutArt.title}** for **Rs. {checkoutArt.price.toLocaleString()}**. Enter your email to confirm transaction and receive the secure download credentials.
              </p>
            </div>

            <form onSubmit={handleCheckoutSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Customer Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={checkingOut}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-950 text-xs text-white focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={checkingOut}
                className="w-full py-3.5 rounded-xl bg-[#116466] hover:bg-[#157a7c] disabled:opacity-50 text-[#D1E8E2] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all border border-[#0d4e50] shadow-lg shadow-[#116466]/10"
              >
                {checkingOut ? (
                  <>
                    <Loader2 className="animate-spin" size={14} />
                    Validating Gateway...
                  </>
                ) : (
                  <>
                    Proceed to Payment
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
