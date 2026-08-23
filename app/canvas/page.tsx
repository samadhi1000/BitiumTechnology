'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/lib/store/cartStore';
import { useAuth } from '@/lib/context/AuthContext';
import { uploadCanvasToCloudinary } from '@/lib/cloudinary';
import { useLanguage } from '@/lib/context/LanguageContext';
import * as fabric from 'fabric';
import { 
  Upload, Trash2, Copy, Trash, RefreshCw, ZoomIn, 
  HelpCircle, Sparkles, CheckCircle2, AlertTriangle, ArrowRight, ChevronRight,
  Maximize2, Move, Loader2
} from 'lucide-react';

interface SheetPreset {
  name: string;
  width: number; // inches
  height: number; // inches
  price: number;
}

const PRESETS: SheetPreset[] = [
  { name: 'Standard Sheet (12" x 23")', width: 12, height: 23, price: 1500 },
  { name: 'Jumbo Sheet (12" x 48")', width: 12, height: 48, price: 2800 },
  { name: 'Custom Banner (12" x 72")', width: 12, height: 72, price: 4200 },
];

export default function CanvasBuilder() {
  const { t } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<SheetPreset>(PRESETS[0]);
  
  // Design properties
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null);
  const [dpi, setDpi] = useState<number | null>(null);
  const [dpiStatus, setDpiStatus] = useState<'high' | 'medium' | 'low' | null>(null);
  
  // AI Tools states
  const [processingBg, setProcessingBg] = useState(false);
  const [processingUpscale, setProcessingUpscale] = useState(false);
  
  // Cart adding
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);
  const [cartSuccess, setCartSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Conversion factor: 1 inch = 30 screen pixels (for rendering scale)
  const PPI = 35; 

  // Calculate canvas dimensions based on preset
  const canvasWidth = selectedPreset.width * PPI;
  const canvasHeight = selectedPreset.height * PPI;

  // Initialize fabric canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const fc = new fabric.Canvas(canvasRef.current, {
      width: canvasWidth,
      height: canvasHeight,
      backgroundColor: '#111113', // Zinc-900
      preserveObjectStacking: true,
    });

    // Grid lines for standard DTF ruler visual assistance
    const drawGridLines = () => {
      // Draw grid helper lines directly on canvas background if wanted,
      // or we can use CSS container background styling. We will use CSS background grid for flexibility.
    };

    setCanvas(fc);

    // Event listeners
    const handleSelection = () => {
      const activeObject = fc.getActiveObject();
      setSelectedObject(activeObject || null);
      if (activeObject && activeObject.type === 'FabricImage') {
        calculateDPI(activeObject as fabric.FabricImage, fc.width || canvasWidth);
      } else {
        setDpi(null);
        setDpiStatus(null);
      }
    };

    fc.on('selection:created', handleSelection);
    fc.on('selection:updated', handleSelection);
    fc.on('selection:cleared', handleSelection);
    fc.on('object:scaling', handleSelection);
    fc.on('object:moving', handleSelection);

    // Initial check
    drawGridLines();

    return () => {
      fc.dispose();
    };
  }, [selectedPreset]);

  // Recalculate DPI when selection resizes
  const calculateDPI = (fabImg: fabric.FabricImage, cWidth: number) => {
    // Standard rule: canvas width corresponds to selectedPreset.width (12 inches)
    const imgElement = fabImg.getElement() as HTMLImageElement;
    if (!imgElement) return;

    const naturalWidth = imgElement.naturalWidth || 800; // fallback if dummy
    
    // Scale on canvas
    const currentWidthInCanvasUnits = fabImg.width * fabImg.scaleX;
    
    // Convert canvas units to physical inches
    const physicalWidthInInches = (currentWidthInCanvasUnits / cWidth) * selectedPreset.width;
    
    // DPI = Pixels / Inches
    const calculatedDpi = Math.round(naturalWidth / physicalWidthInInches);
    setDpi(calculatedDpi);

    if (calculatedDpi >= 300) {
      setDpiStatus('high');
    } else if (calculatedDpi >= 150) {
      setDpiStatus('medium');
    } else {
      setDpiStatus('low');
    }
  };

  // Upload image handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !canvas) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      
      const imgElement = document.createElement('img');
      imgElement.src = dataUrl;
      imgElement.onload = () => {
        const fabImg = new fabric.FabricImage(imgElement, {
          left: 40,
          top: 40,
        });

        // Scale down if image is too large for sheet
        const limitWidth = canvas.width ? canvas.width * 0.6 : 200;
        if (fabImg.width > limitWidth) {
          fabImg.scaleToWidth(limitWidth);
        }

        canvas.add(fabImg);
        canvas.setActiveObject(fabImg);
        canvas.renderAll();
      };
    };
    reader.readAsDataURL(file);
  };

  // Action helpers
  const deleteSelected = () => {
    if (!canvas) return;
    const activeObjects = canvas.getActiveObjects();
    activeObjects.forEach((obj) => canvas.remove(obj));
    canvas.discardActiveObject();
    canvas.renderAll();
  };

  const duplicateSelected = () => {
    if (!canvas) return;
    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;

    activeObject.clone().then((cloned) => {
      cloned.set({
        left: (activeObject.left || 0) + 20,
        top: (activeObject.top || 0) + 20,
      });
      canvas.add(cloned);
      canvas.setActiveObject(cloned);
      canvas.renderAll();
    });
  };

  const clearCanvas = () => {
    if (!canvas) return;
    if (confirm('Clear everything on the sheet?')) {
      canvas.clear();
      canvas.backgroundColor = '#111113';
      canvas.renderAll();
    }
  };

  const centerSelected = () => {
    if (!canvas) return;
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      canvas.centerObjectH(activeObject);
      canvas.renderAll();
    }
  };

  // AI Design Tools
  const handleRemoveBackground = async () => {
    if (!canvas || !selectedObject || selectedObject.type !== 'FabricImage') return;
    setProcessingBg(true);

    try {
      const dataUrl = (selectedObject as fabric.FabricImage).toDataURL({ multiplier: 1 });
      const res = await fetch('/api/ai/remove-bg', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: dataUrl }),
      });
      const data = await res.json();
      if (data.success) {
        const newImgElement = document.createElement('img');
        newImgElement.src = data.url;
        newImgElement.onload = () => {
          (selectedObject as fabric.FabricImage).setElement(newImgElement);
          canvas.renderAll();
          alert('AI Background Removal completed successfully!');
        };
      } else {
        alert('Failed to remove background: ' + (data.error || 'Unknown error'));
      }
    } catch (err: any) {
      console.error(err);
      alert('Error during AI background removal: ' + err.message);
    } finally {
      setProcessingBg(false);
    }
  };

  const handleUpscale = async () => {
    if (!canvas || !selectedObject || selectedObject.type !== 'FabricImage') return;
    setProcessingUpscale(true);

    try {
      const dataUrl = (selectedObject as fabric.FabricImage).toDataURL({ multiplier: 1 });
      const res = await fetch('/api/ai/upscale', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: dataUrl }),
      });
      const data = await res.json();
      if (data.success) {
        const newImgElement = document.createElement('img');
        newImgElement.src = data.url;
        newImgElement.onload = () => {
          (selectedObject as fabric.FabricImage).setElement(newImgElement);
          canvas.renderAll();
          if (dpi) {
            setDpi(Math.round(dpi * 2));
            setDpiStatus('high');
          }
          alert('AI Resolution Upscaling applied successfully!');
        };
      } else {
        alert('Failed to upscale image: ' + (data.error || 'Unknown error'));
      }
    } catch (err: any) {
      console.error(err);
      alert('Error during AI upscaling: ' + err.message);
    } finally {
      setProcessingUpscale(false);
    }
  };

  // Add sheet to cart (async - uploads preview to Cloudinary first)
  const handleAddToCart = async () => {
    if (!canvas) return;
    setUploadError(null);

    // Export canvas Data URL (only used locally for upload - not stored in cart)
    const previewDataUrl = canvas.toDataURL({
      format: 'png',
      quality: 0.9,
      multiplier: 1,
    });

    // Capture canvas JSON for potential re-editing
    const canvasJson = canvas.toJSON() as Record<string, unknown>;
    const layersCount = canvas.getObjects().length;

    // ── Upload to Cloudinary BEFORE dispatching to the store ─────────────
    setIsUploading(true);
    let sheetPreviewCloudinaryUrl: string | undefined;

    try {
      const uploadResult = await uploadCanvasToCloudinary(previewDataUrl, 'bitium/canvas-sheets');
      sheetPreviewCloudinaryUrl = uploadResult.secureUrl;
    } catch (err) {
      console.error('[Canvas Builder] Cloudinary upload failed:', err);
      // Graceful fallback - item still gets added without a CDN preview image
      setUploadError('Preview upload failed - your sheet was still added to cart.');
    } finally {
      setIsUploading(false);
    }

    // ── Dispatch to cart store ─────────────────────────────────────────────
    addItem({
      type: 'dtf_sheet',
      product: {
        id: 'b2a8d3e9-4e7a-4e2b-b6c8-2f1a3b4c5d6e',
        name: 'Custom DTF Sheet Builder',
        description: `Custom ${selectedPreset.width}" x ${selectedPreset.height}" DTF Transfer Sheet`,
        image_url: sheetPreviewCloudinaryUrl, // CDN URL - or undefined if upload failed
      },
      customSheet: {
        width: selectedPreset.width,
        height: selectedPreset.height,
        price: selectedPreset.price,
      },
      customization: {
        frontPreviewCloudinaryUrl: sheetPreviewCloudinaryUrl,
        sheetWidth: selectedPreset.width,
        sheetHeight: selectedPreset.height,
        canvasJson,
        designLayersCount: layersCount,
        printStyle: 'DTF',
        source: 'canvas_builder',
      },
      quantity: 1,
      price: selectedPreset.price,
    });

    setCartSuccess(true);
    setTimeout(() => setCartSuccess(false), 2500);
    openCart();
  };

  return (
    <div className="w-full">
      {/* WebPage Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "DTF Gang Sheet Builder Canvas | Bitium Technology",
            "description": "Drag, drop, resize, and arrange your custom designs onto gang sheets online with our interactive builder.",
            "url": "https://www.bitiumtechnology.com/canvas"
          })
        }}
      />

      {/* ── TOP HERO HEADER SECTION MATCHING STORE CATEGORY PAGES ── */}
      <header className="relative bg-white dark:bg-[#080d1a] border-b border-slate-200/80 dark:border-white/10 overflow-hidden pt-8 pb-10 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
        {/* Right side Contextual Image with Seamless Smooth Gradient Fade Mask */}
        <div className="absolute right-0 top-0 bottom-0 w-full sm:w-2/3 md:w-1/2 lg:w-5/12 pointer-events-none select-none z-0 hidden sm:block overflow-hidden">
          <div className="relative w-full h-full">
            <Image
              key="/images/hero-cards/toolkit.webp"
              src="/images/hero-cards/toolkit.webp"
              alt="DTF Gang Sheet Canvas Toolkit"
              fill
              priority
              unoptimized
              quality={90}
              className="object-cover object-center opacity-90 dark:opacity-85 transition-opacity duration-300"
              style={{
                maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)',
                WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)',
              }}
            />
            {/* Smooth Top & Bottom subtle edge blend */}
            <div className="absolute inset-0 bg-gradient-to-t from-white/40 dark:from-[#080d1a]/50 via-transparent to-white/20 dark:to-[#080d1a]/20" />
            <div className="absolute inset-0 bg-gradient-to-r from-white/80 dark:from-[#080d1a]/80 via-transparent to-transparent" />
          </div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-zinc-400 mb-4">
            <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              {t.canvasPage?.breadcrumbHome || 'Home'}
            </Link>
            <ChevronRight size={12} className="text-slate-400" />
            <span className="text-slate-900 dark:text-white font-semibold">
              {t.canvasPage?.breadcrumbCurrent || 'Canvas Builder'}
            </span>
          </nav>

          {/* Title & Description */}
          <div className="max-w-2xl">
            <h1 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-3">
              {t.canvasPage?.titleMain || 'Canvas '}
              <span className="text-emerald-600 dark:text-[#2CFF05]">
                {t.canvasPage?.titleHighlight || 'Builder'}
              </span>
            </h1>
            <p className="text-slate-600 dark:text-zinc-300 text-sm sm:text-[15px] leading-relaxed max-w-xl font-normal">
              {t.canvasPage?.description || 'Arrange, scale, duplicate, and optimize your print files onto high-resolution DTF sheets with instant AI background removal and resolution upscaling tools.'}
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-8">
        {/* LEFT COLUMN: Controls & Presets */}
        <div className="w-full lg:w-80 flex flex-col gap-6">
        {/* Preset Selector */}
        <div className="p-6 rounded-2xl border border-border bg-card/40 space-y-4">
          <h3 className="font-bold text-sm text-foreground">1. Select Sheet Dimensions</h3>
          <div className="flex flex-col gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => setSelectedPreset(preset)}
                className={`w-full text-left p-3.5 rounded-xl border text-sm font-semibold transition-all ${
                  selectedPreset.name === preset.name
                    ? 'border-[#2CFF05] bg-[#2CFF05]/10 text-[#0a0a0a]'
                    : 'border-border bg-card hover:bg-muted text-muted-foreground hover:text-[#0a0a0a]'
                }`}
              >
                <div>{preset.name}</div>
                <div className="text-xs text-[#2CFF05] mt-1">Rs. {preset.price.toLocaleString()}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Upload Button */}
        <div className="p-6 rounded-2xl border border-border bg-card/40 space-y-4">
          <h3 className="font-bold text-sm text-foreground">2. Import Custom Logos</h3>
          <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border hover:border-[#2CFF05] rounded-xl cursor-pointer hover:bg-card/50 transition-all text-center">
            <Upload className="text-muted-foreground hover:text-[#2CFF05] transition-colors" size={28} />
            <span className="text-xs text-muted-foreground mt-2 font-semibold">Upload PNG / JPEG</span>
            <span className="text-[10px] text-muted-foreground mt-1">Transparency recommended</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>
        </div>

        {/* Toolbars / Actions */}
        {selectedObject && (
          <div className="p-6 rounded-2xl border border-border bg-card/40 space-y-4 animate-fade-in">
            <h3 className="font-bold text-sm text-foreground">3. Edit Selected Graphic</h3>
            
            {/* DPI Status Indicator */}
            {dpi !== null && (
              <div className={`p-3 rounded-xl border flex items-center gap-3 ${
                dpiStatus === 'high' 
                  ? 'bg-emerald-950/20 border-emerald-800 text-emerald-400' 
                  : dpiStatus === 'medium'
                  ? 'bg-amber-950/20 border-amber-800 text-amber-400'
                  : 'bg-red-950/20 border-red-800 text-red-400'
              }`}>
                {dpiStatus === 'high' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider">Quality: {dpiStatus}</p>
                  <p className="text-[10px] font-semibold opacity-90 mt-0.5">{dpi} DPI (Standard: 300)</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={duplicateSelected}
                className="p-2.5 rounded-lg border border-border hover:bg-muted text-foreground font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <Copy size={14} /> Duplicate
              </button>
              <button
                onClick={deleteSelected}
                className="p-2.5 rounded-lg border border-red-950 bg-red-950/15 hover:bg-red-900/35 text-red-400 font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <Trash size={14} /> Delete
              </button>
              <button
                onClick={centerSelected}
                className="col-span-2 p-2.5 rounded-lg border border-border hover:bg-muted text-foreground font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <Move size={14} /> Center Horizontally
              </button>
            </div>

            {/* AI Tools Subpanel */}
            <div className="pt-4 border-t border-border/60 space-y-2">
              <span className="text-[10px] font-bold text-[#2CFF05] uppercase tracking-widest flex items-center gap-1">
                <Sparkles size={10} /> AI Enhancers
              </span>
              <button
                disabled={processingBg}
                onClick={handleRemoveBackground}
                className="w-full p-2.5 rounded-lg bg-card border border-border hover:border-[#2CFF05]/50 hover:bg-muted text-xs font-bold text-foreground hover:text-foreground transition-all flex items-center justify-center gap-2"
              >
                {processingBg ? <RefreshCw className="animate-spin" size={14} /> : <Sparkles size={14} className="text-[#2CFF05]" />}
                Remove Background (remove.bg)
              </button>
              <button
                disabled={processingUpscale}
                onClick={handleUpscale}
                className="w-full p-2.5 rounded-lg bg-card border border-border hover:border-[#2CFF05]/50 hover:bg-muted text-xs font-bold text-foreground hover:text-foreground transition-all flex items-center justify-center gap-2"
              >
                {processingUpscale ? <RefreshCw className="animate-spin" size={14} /> : <Maximize2 size={14} className="text-[#2CFF05]" />}
                Upscale to 300 DPI
              </button>
            </div>
          </div>
        )}

        {/* Global actions */}
        <button
          onClick={clearCanvas}
          className="w-full p-3 rounded-xl border border-border/80 hover:bg-card text-xs font-bold text-muted-foreground hover:text-foreground transition-all flex items-center justify-center gap-2"
        >
          <Trash2 size={14} /> Clear Sheet Canvas
        </button>
      </div>

      {/* MIDDLE: Interactive Virtual Sheet Workspace */}
      <div className="flex-1 flex flex-col items-center">
        {/* Dimensions banner */}
        <div className="mb-4 w-full max-w-[420px] flex justify-between items-center px-4 py-2 border border-border bg-card/60 rounded-xl text-xs text-muted-foreground">
          <span>Width: {selectedPreset.width} inches</span>
          <span>Height: {selectedPreset.height} inches</span>
        </div>

        {/* Outer Scroll Wrapper */}
        <div 
          ref={containerRef}
          className="w-full max-w-[420px] max-h-[600px] overflow-y-auto overflow-x-hidden p-6 bg-background border border-border rounded-3xl canvas-grid-pattern relative flex justify-center glow-primary"
        >
          {/* Fabric Canvas element */}
          <div className="border border-zinc-700/50 rounded-lg shadow-2xl overflow-hidden bg-black">
            <canvas ref={canvasRef} />
          </div>
        </div>

        {/* Tips / Guidelines */}
        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <HelpCircle size={14} className="text-muted-foreground" />
          <span>Tip: Grid cells help verify dimensions. Standard DPI check updates instantly.</span>
        </div>
      </div>

      {/* RIGHT COLUMN: Order Summary */}
      <div className="w-full lg:w-80 flex flex-col gap-6">
        <div className="p-6 rounded-2xl border border-border bg-card/40 space-y-6">
          <h3 className="font-bold text-base">Order Summary</h3>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Transfer Sheet:</span>
              <span className="font-semibold">{selectedPreset.name.split(' ')[0]} {selectedPreset.name.split(' ')[1]}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Ink Capacity:</span>
              <span className="font-semibold text-emerald-400">Auto-transparency</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Base Cost:</span>
              <span className="font-semibold text-foreground">Rs. {selectedPreset.price.toLocaleString()}</span>
            </div>
          </div>

          <div className="border-t border-border pt-4 flex justify-between items-end">
            <div>
              <span className="text-xs text-muted-foreground">Total Price</span>
              <p className="text-2xl font-black text-[#2CFF05]">Rs. {selectedPreset.price.toLocaleString()}</p>
            </div>
          </div>

          {cartSuccess ? (
            <button
              className="w-full py-4 rounded-xl bg-emerald-600 text-foreground font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-default"
            >
              <CheckCircle2 size={16} />
              Sheet Added to Cart
            </button>
          ) : (
            <div className="space-y-2">
              <button
                onClick={handleAddToCart}
                disabled={isUploading}
                className="w-full py-4 rounded-xl bg-[#2CFF05] hover:bg-[#45ff24] disabled:opacity-60 disabled:cursor-not-allowed text-[#0a0a0a] font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-[#2CFF05]/10"
              >
                {isUploading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Uploading Preview…
                  </>
                ) : (
                  <>
                    Add Custom Sheet to Cart
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
              {uploadError && (
                <p className="text-[10px] text-amber-400 text-center font-medium">{uploadError}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);
}
