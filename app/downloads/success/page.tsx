'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Download, ShieldCheck, AlertTriangle, RefreshCw, ArrowLeft, FileText, CheckCircle2 } from 'lucide-react';

interface PurchaseDetails {
  id: string;
  download_count: number;
  max_downloads: number;
  expires_at: string;
}

interface ArtworkDetails {
  id: string;
  title: string;
  description: string;
  preview_url: string;
  file_format: string;
  file_size?: string;
  resolution?: string;
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [purchase, setPurchase] = useState<PurchaseDetails | null>(null);
  const [artwork, setArtwork] = useState<ArtworkDetails | null>(null);
  const [downloading, setDownloading] = useState<boolean>(false);

  useEffect(() => {
    if (token) {
      verifyToken();
    } else {
      setError('Missing download security token.');
      setLoading(false);
    }
  }, [token]);

  const verifyToken = async () => {
    setLoading(true);
    setError(null);
    try {
      // In development, we can test using our secure verification helper:
      const res = await fetch(`/api/downloads/secure?token=${token}`);
      const data = await res.json();

      if (res.ok) {
        // Mocking the model relations returned:
        setPurchase({
          id: 'p-id',
          download_count: data.downloadCount || 0,
          max_downloads: 5,
          expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString()
        });
        setArtwork({
          id: 'art-id',
          title: data.fileName?.split('_high_res')[0]?.replace(/_/g, ' ') || 'High Resolution Artwork',
          description: 'Secure digital artwork file package containing print-ready vector formats.',
          preview_url: 'https://images.unsplash.com/photo-1590736704728-f4730bb30770?auto=format&fit=crop&w=600&q=80',
          file_format: data.fileName?.split('.').pop()?.toUpperCase() || 'ZIP'
        });
      } else {
        setError(data.error || 'Verification failed');
      }
    } catch (err) {
      console.error('Error verifying download token:', err);
      setError('Connection failed. Could not verify download credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadClick = async () => {
    if (!token) return;
    setDownloading(true);
    try {
      // Directly redirect browser or open window to download
      window.location.href = `/api/downloads/secure?token=${token}&redirect=true`;
      
      // Update local download counter view
      if (purchase) {
        setPurchase(prev => prev ? { ...prev, download_count: prev.download_count + 1 } : null);
      }
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setTimeout(() => setDownloading(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <RefreshCw className="animate-spin text-[#2CFF05]" size={36} />
        <span className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Verifying Security Credentials...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-16 p-6 rounded-3xl border border-border bg-card glass text-center space-y-5">
        <span className="inline-flex p-3 rounded-full bg-red-950/10 border border-red-500/30 text-red-500">
          <AlertTriangle size={32} />
        </span>
        <div className="space-y-2">
          <h2 className="text-lg font-black text-foreground">Access Verification Failed</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">{error}</p>
        </div>
        <div className="pt-4 border-t border-border flex flex-col gap-2">
          <Link href="/downloads" className="py-2.5 rounded-xl bg-background/60 hover:bg-muted border border-border text-xs font-bold transition-all flex items-center justify-center gap-1.5">
            <ArrowLeft size={13} />
            Back to Downloads Gallery
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-16 p-6 rounded-3xl border border-border bg-card glass space-y-6">
      
      {/* Success Badge */}
      <div className="text-center space-y-2 pb-4 border-b border-border">
        <span className="inline-flex p-3 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-2">
          <ShieldCheck size={36} />
        </span>
        <h2 className="text-xl font-black text-foreground">Payment Verified Successfully!</h2>
        {email && (
          <p className="text-xs text-muted-foreground">
            A confirmation receipt and backup download link have been sent to **{email}**.
          </p>
        )}
      </div>

      {/* Product Detail Card */}
      {artwork && purchase && (
        <div className="p-4 rounded-2xl bg-background border border-border flex items-center gap-4">
          <div className="p-3 rounded-xl bg-[#2CFF05]/10 text-[#FFCB9A] shrink-0">
            <FileText size={28} />
          </div>
          <div className="flex-grow">
            <span className="text-[9px] font-bold text-[#2CFF05] uppercase tracking-wider block">Ready for Download</span>
            <h3 className="text-md font-extrabold capitalize text-foreground mt-0.5">{artwork.title}</h3>
            <div className="flex gap-4 mt-2 text-[10px] text-muted-foreground">
              <span>Format: <strong className="text-[#D9B08C]">{artwork.file_format}</strong></span>
              <span>•</span>
              <span>Expires in: <strong>7 Days</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* Download constraints progress */}
      {purchase && (
        <div className="p-4 rounded-2xl border border-border bg-card/40 space-y-3">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-muted-foreground">Download Attempts:</span>
            <span className="text-[#FFCB9A]">{purchase.download_count} of {purchase.max_downloads} used</span>
          </div>
          {/* Progress bar */}
          <div className="w-full h-1.5 rounded-full bg-background overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#116466] to-[#FFCB9A] transition-all duration-500"
              style={{ width: `${(purchase.download_count / purchase.max_downloads) * 100}%` }}
            />
          </div>
          <p className="text-[10px] text-muted-foreground leading-normal">
            For security reasons, this download link will remain active for a maximum of 5 attempts. Do not share this URL.
          </p>
        </div>
      )}

      {/* Download trigger button */}
      <button
        onClick={handleDownloadClick}
        disabled={downloading}
        className="w-full py-4 rounded-xl bg-gradient-to-r from-[#116466] to-[#FFCB9A] text-zinc-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all hover:scale-[1.01] shadow-lg shadow-[#2CFF05]/10"
      >
        <Download size={16} />
        {downloading ? 'Preparing secure file...' : 'Download Print Artwork'}
      </button>

      <div className="pt-2 flex justify-center">
        <Link href="/downloads" className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 font-bold">
          <ArrowLeft size={13} />
          Return to Downloads Gallery
        </Link>
      </div>

    </div>
  );
}

export default function DownloadSuccessPage() {
  return (
    <div className="w-full min-h-screen bg-background text-[#0a0a0a] selection:bg-[#2CFF05]/40 selection:text-[#0a0a0a] pb-24 px-4 sm:px-6">
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
          <RefreshCw className="animate-spin text-[#2CFF05]" size={36} />
          <span className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Loading...</span>
        </div>
      }>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
