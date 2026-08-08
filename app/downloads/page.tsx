'use client';

import React, { useState, useEffect } from 'react';
import { Search, Grid, Eye, Shield, Tag, Download, ShoppingBag, Loader2, ArrowRight, CheckCircle2, AlertTriangle } from 'lucide-react';
import { loadPayHereScript } from '@/lib/payhere-loader';
import SecureWatermarkedImage from '@/components/SecureWatermarkedImage';

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

  // Secure Fulfillment State (revealing Google Drive links)
  const [fulfillmentOrderId, setFulfillmentOrderId] = useState<string | null>(null);
  const [fulfillmentEmail, setFulfillmentEmail] = useState<string>('');
  const [fulfillmentLinks, setFulfillmentLinks] = useState<{ title: string; link: string }[]>([]);
  const [fulfillmentStatus, setFulfillmentStatus] = useState<'idle' | 'verifying' | 'input_email' | 'ready' | 'error'>('idle');
  const [fulfillmentError, setFulfillmentError] = useState<string>('');

  useEffect(() => {
    fetchCatalog();
  }, [category, search]);

  // Handle PayHere Success/Cancel redirect detection
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const status = params.get('status');
    const orderId = params.get('order_id');

    if (orderId) {
      if (status === 'success') {
        setFulfillmentOrderId(orderId);
        const storedEmail = localStorage.getItem(`bitium_order_email_${orderId}`);
        if (storedEmail) {
          setFulfillmentEmail(storedEmail);
          verifyFulfillment(orderId, storedEmail);
        } else {
          setFulfillmentStatus('input_email');
        }
      } else if (status === 'cancelled') {
        alert('Payment was cancelled. You can try checking out again.');
        // Clean URL params
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);

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

  // Securely query post-payment assets
  const verifyFulfillment = async (orderId: string, emailAddress: string, attempts = 0) => {
    setFulfillmentStatus('verifying');
    setFulfillmentError('');

    try {
      const res = await fetch('/api/downloads/retrieve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, email: emailAddress.trim() })
      });

      const data = await res.json();

      if (res.ok && data.success && data.links) {
        setFulfillmentLinks(data.links);
        setFulfillmentStatus('ready');
        // Save to localStorage so email is persisted
        localStorage.setItem(`bitium_order_email_${orderId}`, emailAddress.trim());
      } else {
        // Webhooks might have minor transit delays, poll a few times
        if (attempts < 8) {
          setTimeout(() => {
            verifyFulfillment(orderId, emailAddress, attempts + 1);
          }, 3000);
        } else {
          setFulfillmentStatus('error');
          setFulfillmentError(data.error || 'Unable to verify payment or retrieve download permissions. Please check if your email is correct or contact support.');
        }
      }
    } catch (err) {
      console.error('Fulfillment error:', err);
      setFulfillmentStatus('error');
      setFulfillmentError('Connection error occurred while fetching download keys.');
    }
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutArt || !email) return;

    setCheckingOut(true);
    try {
      // Call secure Next.js API hash generator
      const res = await fetch('/api/payhere/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [{ id: checkoutArt.id, quantity: 1 }],
          customerEmail: email,
          customerName: 'Digital Customer'
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

        // Cache customer email to handle post-payment download access auto-verification
        localStorage.setItem(`bitium_order_email_${data.order_id}`, email);

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

        console.log('🔍 [PayHere] Initiating payment:', JSON.stringify(data, null, 2));
        (window as any).payhere.startPayment(data);
      } else {
        alert(data.error || 'Failed to initialize checkout payment');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Network request failed. Unable to initiate gateway.');
    } finally {
      setCheckingOut(false);
    }
  };

  const handleFulfillmentEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fulfillmentOrderId && fulfillmentEmail) {
      verifyFulfillment(fulfillmentOrderId, fulfillmentEmail);
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
    <div className="w-full min-h-screen bg-background text-[#0a0a0a] selection:bg-[#8DFF00]/40 selection:text-[#0a0a0a] pb-24">
      {/* Canonical Link */}
      <link rel="canonical" href="https://www.bitiumtechnology.com/downloads" />

      {/* CollectionPage Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Digital Artwork Downloads | Bitium Technology",
            "description": "Download secure watermarked digital artwork vector files, stencils, and printing sheets.",
            "url": "https://www.bitiumtechnology.com/downloads"
          })
        }}
      />
      
      {/* Hero Header */}
      <section className="relative py-16 sm:py-20 border-b border-border overflow-hidden bg-background">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }} />
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#8DFF00]/10 border border-[#8DFF00]/30 text-[#4c8a00] dark:text-[#8DFF00] text-xs font-bold uppercase tracking-wider">
            <Shield size={12} className="text-[#FFCB9A]" />
            Secure Asset Vault
          </span>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#8DFF00]">
            Digital Designs & Downloads
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Browse and purchase from our catalog of print-ready, high-resolution original digital vector files, batik layouts, and stencils. Instantly access Google Drive download keys upon payment.
          </p>
        </div>
      </section>

      <section className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {/* Search and Filters Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 rounded-2xl bg-card border border-border glass mb-8">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {categoryOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => setCategory(opt.value)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  category === opt.value
                    ? 'bg-[#8DFF00] text-[#0a0a0a] shadow-md shadow-[#8DFF00]/20'
                    : 'bg-background/60 hover:bg-muted text-muted-foreground hover:text-foreground border border-border'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input
              type="text"
              placeholder="Search design number or tag..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-xs text-foreground placeholder-zinc-500 focus:outline-none focus:border-[#8DFF00] transition-colors"
            />
          </div>
        </div>

        {/* Catalog Grid View */}
        {loading ? (
          <div className="w-full py-32 flex flex-col items-center justify-center gap-3">
            <Loader2 className="animate-spin text-[#8DFF00]" size={36} />
            <span className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Loading Digital Assets...</span>
          </div>
        ) : artworks.length === 0 ? (
          <div className="w-full py-32 text-center border border-dashed border-border rounded-3xl">
            <Grid className="mx-auto text-zinc-600 mb-4" size={40} />
            <h3 className="text-lg font-bold">No digital artworks found</h3>
            <p className="text-xs text-muted-foreground mt-1">Try relaxing your search terms or selecting another category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {artworks.map((art) => (
              <div 
                key={art.id}
                className="group flex flex-col bg-card border border-border rounded-3xl overflow-hidden hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 relative"
              >
                {/* Image Container with Dynamic Canvas Watermark & Security Overlay */}
                <div className="relative overflow-hidden bg-background">
                  <SecureWatermarkedImage
                    src={art.preview_url}
                    alt={art.title}
                    watermarkText="Bitium Technology"
                    aspectRatio="4/3"
                  />

                  {/* Format Badge */}
                  <span className="absolute top-3 right-3 z-40 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-background/80 border border-border text-foreground">
                    {art.file_format}
                  </span>
                </div>

                {/* Details */}
                <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-md font-extrabold text-foreground group-hover:text-[#FFCB9A] transition-colors line-clamp-1">
                      {art.title}
                    </h3>
                    <p className="text-[11px] text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                      {art.description}
                    </p>

                    {/* Metadata tags */}
                    <div className="flex flex-wrap gap-1 mt-3">
                      {art.tags.slice(0, 3).map((t, idx) => (
                        <span key={idx} className="text-[9px] font-bold text-[#D9B08C] bg-background/60 border border-border px-2 py-0.5 rounded-full">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase font-bold block">Resolution</span>
                      <span className="text-xs font-semibold text-foreground">{art.resolution || 'Vector / A3'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase font-bold block">Secure Price</span>
                      <span className="text-md font-black text-[#FFCB9A]">Rs. {art.price.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => setSelectedArt(art)}
                      className="w-full py-2.5 rounded-xl border border-border hover:border-zinc-700 bg-background/60 hover:bg-muted text-foreground hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Eye size={13} />
                      Details
                    </button>
                    <button
                      onClick={() => setCheckoutArt(art)}
                      className="w-full py-2.5 rounded-xl bg-[#8DFF00] hover:bg-[#9eff1a] text-[#0a0a0a] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors border border-[#7acc00] shadow-md shadow-[#8DFF00]/10 cursor-pointer"
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-xl rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-6">
            <button 
              onClick={() => setSelectedArt(null)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              ✕
            </button>
            <div className="flex flex-col sm:flex-row gap-5">
              <div className="w-full sm:w-1/2 relative bg-background rounded-2xl overflow-hidden select-none border border-border">
                <SecureWatermarkedImage
                  src={selectedArt.preview_url}
                  alt={selectedArt.title}
                  watermarkText="Bitium Technology"
                  aspectRatio="1/1"
                />
              </div>
              <div className="w-full sm:w-1/2 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-black text-[#8DFF00] uppercase tracking-widest block">{selectedArt.category}</span>
                  <h2 className="text-xl font-black mt-1 text-foreground">{selectedArt.title}</h2>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{selectedArt.description}</p>
                </div>
                <div className="space-y-2 pt-4 border-t border-border mt-4">
                  <div className="flex justify-between text-xs"><span className="text-muted-foreground">File Size:</span><span className="font-bold">{selectedArt.file_size || 'N/A'}</span></div>
                  <div className="flex justify-between text-xs"><span className="text-muted-foreground">Format:</span><span className="font-bold text-[#8DFF00]">{selectedArt.file_format}</span></div>
                  <div className="flex justify-between text-xs"><span className="text-muted-foreground">Resolution:</span><span className="font-bold">{selectedArt.resolution || 'Vector'}</span></div>
                  <div className="flex justify-between text-xs pt-1 border-t border-border/60"><span className="text-muted-foreground font-bold">Secure Price:</span><span className="font-extrabold text-[#FFCB9A]">Rs. {selectedArt.price.toLocaleString()}</span></div>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                setCheckoutArt(selectedArt);
                setSelectedArt(null);
              }}
              className="w-full py-3.5 rounded-xl bg-[#8DFF00] hover:bg-[#9eff1a] text-[#0a0a0a] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-[#7acc00] cursor-pointer"
            >
              <ShoppingBag size={14} />
              Confirm Checkout & Buy Now
            </button>
          </div>
        </div>
      )}

      {/* 2. Direct Checkout Email Input Modal */}
      {checkoutArt && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-5">
            <button 
              onClick={() => setCheckoutArt(null)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground cursor-pointer"
              disabled={checkingOut}
            >
              ✕
            </button>
            <div className="text-center space-y-2">
              <span className="inline-flex items-center justify-center p-3 rounded-full bg-[#8DFF00]/10 border border-[#8DFF00]/30 text-[#FFCB9A] mb-1">
                <Shield size={24} />
              </span>
              <h2 className="text-lg font-black text-foreground">Secure Checkout</h2>
              <p className="text-xs text-muted-foreground">
                You are purchasing <strong>{checkoutArt.title}</strong> for <strong>Rs. {checkoutArt.price.toLocaleString()}</strong>. Enter your email to confirm the transaction and receive secure Google Drive access.
              </p>
            </div>

            <form onSubmit={handleCheckoutSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Customer Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={checkingOut}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:border-[#8DFF00] transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={checkingOut}
                className="w-full py-3.5 rounded-xl bg-[#8DFF00] hover:bg-[#9eff1a] disabled:opacity-50 text-[#0a0a0a] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all border border-[#7acc00] shadow-lg shadow-[#8DFF00]/10 cursor-pointer"
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

      {/* 3. Secure Asset Delivery Fulfillment Modal */}
      {fulfillmentOrderId && fulfillmentStatus !== 'idle' && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-background/90 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-6 text-center">
            
            {fulfillmentStatus === 'verifying' && (
              <div className="space-y-4 py-8">
                <Loader2 className="w-12 h-12 animate-spin text-[#8DFF00] mx-auto" />
                <h2 className="text-xl font-bold uppercase tracking-tight">Verifying Payment Status</h2>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
                  We are securely checking your payment status with PayHere. Please do not close this window. This may take a few seconds.
                </p>
                <div className="inline-block px-3 py-1.5 rounded-full bg-background/60 border border-border text-[10px] font-mono text-muted-foreground">
                  Order ID: {fulfillmentOrderId}
                </div>
              </div>
            )}

            {fulfillmentStatus === 'input_email' && (
              <div className="space-y-4 py-4">
                <Shield className="w-12 h-12 text-[#FFCB9A] mx-auto animate-pulse" />
                <h2 className="text-xl font-bold uppercase tracking-tight">Access Verification Required</h2>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                  To securely download your digital products, please verify the customer email address used during checkout.
                </p>
                <form onSubmit={handleFulfillmentEmailSubmit} className="space-y-4 max-w-xs mx-auto">
                  <input
                    type="email"
                    required
                    placeholder="Enter your checkout email"
                    value={fulfillmentEmail}
                    onChange={(e) => setFulfillmentEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-xs text-center text-foreground focus:outline-none focus:border-[#8DFF00] transition-colors"
                  />
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#8DFF00] hover:bg-[#9eff1a] text-[#0a0a0a] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-[#7acc00]"
                  >
                    Unlock My Downloads
                    <ArrowRight size={13} />
                  </button>
                </form>
              </div>
            )}

            {fulfillmentStatus === 'ready' && (
              <div className="space-y-4 py-4 text-left">
                <div className="text-center space-y-2 mb-4">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                  <h2 className="text-xl font-bold uppercase tracking-tight">Assets Unlocked!</h2>
                  <p className="text-xs text-muted-foreground">
                    Payment verified. High-resolution files have been successfully shared and are ready for download.
                  </p>
                </div>

                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block border-b border-border pb-1.5">Your Download Links</span>
                  <div className="max-h-60 overflow-y-auto space-y-2.5 pr-1">
                    {fulfillmentLinks.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3.5 bg-background border border-border rounded-2xl">
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-foreground block truncate max-w-[260px]">{item.title}</span>
                          <span className="text-[9px] text-muted-foreground uppercase block font-medium">Shared via Google Drive</span>
                        </div>
                        <a 
                          href={item.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-[#8DFF00] hover:bg-[#9eff1a] text-[#0a0a0a] font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-[#8DFF00]/10 cursor-pointer"
                        >
                          <Download size={13} />
                          Download
                        </a>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-border flex justify-between items-center text-[10px] text-muted-foreground">
                  <span>Authorized to: {fulfillmentEmail}</span>
                  <button 
                    onClick={() => {
                      setFulfillmentOrderId(null);
                      setFulfillmentStatus('idle');
                      window.history.replaceState({}, document.title, window.location.pathname);
                    }}
                    className="underline text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}

            {fulfillmentStatus === 'error' && (
              <div className="space-y-4 py-6">
                <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto animate-bounce" />
                <h2 className="text-xl font-bold uppercase tracking-tight">Fulfillment Error</h2>
                <p className="text-xs text-rose-400 max-w-sm mx-auto leading-relaxed bg-rose-500/10 border border-rose-500/20 p-3 rounded-2xl">
                  {fulfillmentError}
                </p>
                <div className="flex gap-2 justify-center max-w-xs mx-auto pt-2">
                  <button
                    onClick={() => setFulfillmentStatus('input_email')}
                    className="w-1/2 py-3 rounded-xl border border-border hover:border-zinc-700 bg-background text-xs font-bold transition-colors cursor-pointer"
                  >
                    Try Another Email
                  </button>
                  <button
                    onClick={() => {
                      if (fulfillmentOrderId && fulfillmentEmail) {
                        verifyFulfillment(fulfillmentOrderId, fulfillmentEmail);
                      }
                    }}
                    className="w-1/2 py-3 rounded-xl bg-[#8DFF00] hover:bg-[#9eff1a] text-[#0a0a0a] text-xs font-black transition-colors cursor-pointer border border-[#7acc00]"
                  >
                    Retry Verification
                  </button>
                </div>
                <button
                  onClick={() => {
                    setFulfillmentOrderId(null);
                    setFulfillmentStatus('idle');
                    window.history.replaceState({}, document.title, window.location.pathname);
                  }}
                  className="text-xs text-muted-foreground hover:text-foreground underline cursor-pointer mt-4 block"
                >
                  Close & Browse Products
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
