'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import * as fabric from 'fabric';
import { 
  Eye, ArrowLeft, ShoppingBag, Loader2, ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/lib/store/cartStore';
import { uploadCanvasToCloudinary } from '@/lib/cloudinary';

import { ColorSelector, ColorOption } from '@/components/customizer/ColorSelector';
import { SizeSelector } from '@/components/customizer/SizeSelector';
import { PrintStyleSelector, PrintFinish } from '@/components/customizer/PrintStyleSelector';
import { DesignUploader } from '@/components/customizer/DesignUploader';

const T_SHIRT_COLORS: ColorOption[] = [
  { name: 'Pitch Black', hex: '#09090b' },
  { name: 'Classic White', hex: '#f4f4f5' },
  { name: 'Navy Blue', hex: '#1e3a8a' },
  { name: 'Ruby Red', hex: '#991b1b' },
  { name: 'Forest Green', hex: '#065f46' },
  { name: 'Muted Pink', hex: '#db2777' },
  { name: 'Mustard Yellow', hex: '#d97706' },
];

const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

export default function DynamicMockupCustomizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const backCanvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [backCanvas, setBackCanvas] = useState<fabric.Canvas | null>(null);
  const [activeView, setActiveView] = useState<'front' | 'back'>('front');
  const [selectedColor, setSelectedColor] = useState(T_SHIRT_COLORS[0]);
  const [selectedSize, setSelectedSize] = useState('M');
  const [logoImage, setLogoImage] = useState<string | null>(null);
  const [backLogoImage, setBackLogoImage] = useState<string | null>(null);
  const [printStyle, setPrintStyle] = useState<'flat' | 'embossed' | 'vintage'>('flat');
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const tShirtRef = useRef<fabric.Path | null>(null);
  const backTShirtRef = useRef<fabric.Path | null>(null);
  const foldsRef = useRef<fabric.Object[]>([]);
  const backFoldsRef = useRef<fabric.Object[]>([]);
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);

  // Initialize Canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const fc = new fabric.Canvas(canvasRef.current, {
      width: 360,
      height: 450,
      backgroundColor: 'transparent',
      selection: false
    });

    // 1. Base T-Shirt outline path (perfectly symmetric & centered)
    const tShirt = new fabric.Path('M 140,40 C 170,55 230,55 260,40 L 330,65 L 370,140 L 320,165 L 310,150 L 310,430 C 310,440 300,450 290,450 L 110,450 C 100,450 90,440 90,430 L 90,150 L 80,165 L 30,140 L 70,65 Z', {
      left: 180,
      top: 225,
      originX: 'center',
      originY: 'center',
      fill: selectedColor.hex,
      stroke: '#1f1f23',
      strokeWidth: 2.5,
      selectable: false,
      hoverCursor: 'default'
    });
    fc.add(tShirt);
    tShirtRef.current = tShirt;

    // 2. Collar trim
    const collar = new fabric.Path('M 140,40 C 170,55 230,55 260,40 C 250,55 150,55 140,40 Z', {
      left: 180,
      top: 48,
      originX: 'center',
      originY: 'center',
      fill: '#18181b',
      opacity: 0.15,
      selectable: false,
      hoverCursor: 'default'
    });
    fc.add(collar);

    // 3. Folds & crease lines (gives vectors a realistic 3D appearance)
    const sleeveL = new fabric.Path('M 90,150 L 110,180', {
      fill: 'transparent',
      stroke: '#000000',
      strokeWidth: 2,
      opacity: 0.12,
      selectable: false,
      hoverCursor: 'default'
    });
    const sleeveR = new fabric.Path('M 270,180 L 290,150', {
      fill: 'transparent',
      stroke: '#000000',
      strokeWidth: 2,
      opacity: 0.12,
      selectable: false,
      hoverCursor: 'default'
    });
    const fold1 = new fabric.Path('M 180,90 C 170,220 190,300 180,410', {
      fill: 'transparent',
      stroke: '#000000',
      strokeWidth: 1.5,
      opacity: 0.08,
      selectable: false,
      hoverCursor: 'default'
    });
    fc.add(sleeveL);
    fc.add(sleeveR);
    fc.add(fold1);

    foldsRef.current = [collar, sleeveL, sleeveR, fold1];

    setCanvas(fc);

    return () => {
      fc.dispose();
    };
  }, []);

  // Initialize Back Canvas
  useEffect(() => {
    if (!backCanvasRef.current) return;

    const bfc = new fabric.Canvas(backCanvasRef.current, {
      width: 360,
      height: 450,
      backgroundColor: 'transparent',
      selection: false
    });

    // Back T-Shirt path (no collar - back view)
    const backShirt = new fabric.Path('M 140,40 L 70,65 L 30,140 L 80,165 L 90,150 L 90,430 C 90,440 100,450 110,450 L 290,450 C 300,450 310,440 310,430 L 310,150 L 320,165 L 370,140 L 330,65 L 260,40 L 200,30 Z', {
      left: 180,
      top: 225,
      originX: 'center',
      originY: 'center',
      fill: selectedColor.hex,
      stroke: '#1f1f23',
      strokeWidth: 2.5,
      selectable: false,
      hoverCursor: 'default'
    });
    bfc.add(backShirt);
    backTShirtRef.current = backShirt;

    // Neck seam line (back)
    const neckSeam = new fabric.Path('M 155,40 C 175,25 225,25 245,40', {
      fill: 'transparent',
      stroke: '#000000',
      strokeWidth: 1.5,
      opacity: 0.12,
      selectable: false,
      hoverCursor: 'default'
    });
    // Center seam (back)
    const centerSeam = new fabric.Path('M 200,45 L 200,420', {
      fill: 'transparent',
      stroke: '#000000',
      strokeWidth: 1,
      opacity: 0.06,
      strokeDashArray: [6, 8],
      selectable: false,
      hoverCursor: 'default'
    });
    // Shoulder seams
    const shoulderL = new fabric.Path('M 90,150 L 105,170', {
      fill: 'transparent',
      stroke: '#000000',
      strokeWidth: 2,
      opacity: 0.10,
      selectable: false,
      hoverCursor: 'default'
    });
    const shoulderR = new fabric.Path('M 275,170 L 290,150', {
      fill: 'transparent',
      stroke: '#000000',
      strokeWidth: 2,
      opacity: 0.10,
      selectable: false,
      hoverCursor: 'default'
    });
    bfc.add(neckSeam);
    bfc.add(centerSeam);
    bfc.add(shoulderL);
    bfc.add(shoulderR);

    backFoldsRef.current = [neckSeam, centerSeam, shoulderL, shoulderR];
    setBackCanvas(bfc);

    return () => {
      bfc.dispose();
    };
  }, []);

  // Update T-shirt color dynamically (both front and back)
  useEffect(() => {
    if (tShirtRef.current && canvas) {
      tShirtRef.current.set({ fill: selectedColor.hex });
      canvas.renderAll();
    }
    if (backTShirtRef.current && backCanvas) {
      backTShirtRef.current.set({ fill: selectedColor.hex });
      backCanvas.renderAll();
    }
  }, [selectedColor, canvas, backCanvas]);

  // Handle Logo Image Upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !canvas) return;

    setLoading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setLogoImage(dataUrl);

      const imgElement = document.createElement('img');
      imgElement.src = dataUrl;
      imgElement.onload = () => {
        // Remove existing logos
        canvas.getObjects().forEach((obj) => {
          if (obj instanceof fabric.FabricImage) {
            canvas.remove(obj);
          }
        });

        // Add logo to canvas
        const fabImg = new fabric.FabricImage(imgElement, {
          left: 180,
          top: 220,
          originX: 'center',
          originY: 'center',
          cornerColor: '#8b5cf6',
          cornerStrokeColor: '#ffffff',
          borderColor: '#8b5cf6',
          cornerSize: 8,
          transparentCorners: false,
          padding: 6
        });

        // Scale to fit chest area
        if (fabImg.width > 120) {
          fabImg.scaleToWidth(120);
        }

        canvas.add(fabImg);
        canvas.setActiveObject(fabImg);

        // Re-apply textures / emboss parameters
        applyStyleToLogo(fabImg, printStyle);

        // Bring folds to front so they layer overlay details on the logo
        foldsRef.current.forEach((fold) => {
          canvas.remove(fold);
          canvas.add(fold);
        });

        canvas.renderAll();
        setLoading(false);
      };
    };
    reader.readAsDataURL(file);
  };

  // Apply print texture effects
  const applyStyleToLogo = (logo: fabric.FabricImage, style: 'flat' | 'embossed' | 'vintage') => {
    if (style === 'flat') {
      logo.set({
        opacity: 1.0,
        shadow: null
      });
    } else if (style === 'embossed') {
      logo.set({
        opacity: 0.98,
        shadow: new fabric.Shadow({
          color: 'rgba(0,0,0,0.35)',
          blur: 4,
          offsetX: 1,
          offsetY: 2
        })
      });
    } else if (style === 'vintage') {
      logo.set({
        opacity: 0.78,
        shadow: null
      });
    }
  };

  // Change style dropdown handler
  const handleStyleChange = (style: 'flat' | 'embossed' | 'vintage') => {
    setPrintStyle(style);
    if (!canvas) return;

    const logo = canvas.getObjects().find(obj => obj instanceof fabric.FabricImage) as fabric.FabricImage;
    if (logo) {
      applyStyleToLogo(logo, style);
      canvas.renderAll();
    }
  };

  // Remove logo object
  const handleRemoveLogo = () => {
    if (!canvas) return;
    canvas.getObjects().forEach((obj) => {
      if (obj instanceof fabric.FabricImage) {
        canvas.remove(obj);
      }
    });
    setLogoImage(null);
    canvas.discardActiveObject();
    canvas.renderAll();
  };

  // Handle Back Logo Upload
  const handleBackLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !backCanvas) return;
    setLoading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setBackLogoImage(dataUrl);
      const imgElement = document.createElement('img');
      imgElement.src = dataUrl;
      imgElement.onload = () => {
        backCanvas.getObjects().forEach((obj) => {
          if (obj instanceof fabric.FabricImage) backCanvas.remove(obj);
        });
        const fabImg = new fabric.FabricImage(imgElement, {
          left: 180,
          top: 230,
          originX: 'center',
          originY: 'center',
          cornerColor: '#d946ef',
          cornerStrokeColor: '#ffffff',
          borderColor: '#d946ef',
          cornerSize: 8,
          transparentCorners: false,
          padding: 6
        });
        if (fabImg.width > 130) fabImg.scaleToWidth(130);
        backCanvas.add(fabImg);
        backCanvas.setActiveObject(fabImg);
        applyStyleToLogo(fabImg, printStyle);
        backFoldsRef.current.forEach((fold) => {
          backCanvas.remove(fold);
          backCanvas.add(fold);
        });
        backCanvas.renderAll();
        setLoading(false);
      };
    };
    reader.readAsDataURL(file);
  };

  // Remove Back Logo
  const handleRemoveBackLogo = () => {
    if (!backCanvas) return;
    backCanvas.getObjects().forEach((obj) => {
      if (obj instanceof fabric.FabricImage) backCanvas.remove(obj);
    });
    setBackLogoImage(null);
    backCanvas.discardActiveObject();
    backCanvas.renderAll();
  };


  // Add customized tee to cart (async — uploads previews to Cloudinary first)
  const handleAddToCart = async () => {
    if (!canvas) return;
    setUploadError(null);

    // Deselect active object to get a clean export
    canvas.discardActiveObject();
    canvas.renderAll();

    // Export canvas Data URLs (only used locally — not stored in cart)
    const frontDataUrl = canvas.toDataURL({ format: 'png', multiplier: 1.5 });

    let backDataUrl: string | undefined;
    if (backCanvas) {
      backCanvas.discardActiveObject();
      backCanvas.renderAll();
      backDataUrl = backCanvas.toDataURL({ format: 'png', multiplier: 1.5 });
    }

    const originalFileNames: string[] = [];
    if (logoImage) originalFileNames.push('front-logo.png');
    if (backLogoImage) originalFileNames.push('back-logo.png');

    // ── Upload previews to Cloudinary ──────────────────────────────────────
    // We upload BEFORE dispatching to the store so that only tiny CDN URLs
    // land in localStorage — never raw base64 blobs.
    setIsUploading(true);
    let frontPreviewCloudinaryUrl: string | undefined;
    let backPreviewCloudinaryUrl: string | undefined;
    let productImageUrl: string | undefined;

    try {
      const frontResult = await uploadCanvasToCloudinary(frontDataUrl, 'bitium/mockups');
      frontPreviewCloudinaryUrl = frontResult.secureUrl;
      productImageUrl = frontResult.secureUrl;

      if (backDataUrl) {
        const backResult = await uploadCanvasToCloudinary(backDataUrl, 'bitium/mockups');
        backPreviewCloudinaryUrl = backResult.secureUrl;
      }
    } catch (err) {
      console.error('[3D Customizer] Cloudinary upload failed:', err);
      // Graceful fallback: proceed without CDN URLs so the customer isn't blocked.
      // The cart item will show a placeholder image instead of the preview.
      setUploadError('Preview upload failed — your item was still added to cart.');
    } finally {
      setIsUploading(false);
    }

    // ── Dispatch to cart store ─────────────────────────────────────────────
    addItem({
      id: crypto.randomUUID(),
      type: 'apparel',
      product: {
        id: `custom-shirt-${selectedColor.name.toLowerCase().replace(/\s+/g, '-')}`,
        name: `Customized ${selectedColor.name} Tee`,
        description: `Custom ${selectedColor.name} T-shirt. Print Finish: ${printStyle.toUpperCase()}`,
        image_url: productImageUrl,
      },
      variant: {
        id: `var-custom-${selectedColor.name.toLowerCase().replace(/\s+/g, '-')}-${selectedSize.toLowerCase()}`,
        name: `${selectedSize} / ${selectedColor.name}`,
        sku: `CUSTOM-${selectedColor.name.substring(0, 3).toUpperCase()}-${selectedSize}`,
        price: 2490.00,
        attributes: { size: selectedSize, color: selectedColor.name, customPrint: true, printStyle },
      },
      customization: {
        frontPreviewCloudinaryUrl,
        backPreviewCloudinaryUrl,
        garmentColor: { name: selectedColor.name, hex: selectedColor.hex },
        garmentSize: selectedSize as import('@/lib/store/cartStore').GarmentSize,
        printStyle: printStyle as import('@/lib/store/cartStore').PrintStyle,
        printPosition: backPreviewCloudinaryUrl ? 'both' : 'front',
        originalFileNames,
        designLayersCount: originalFileNames.length,
        source: 'mockup_studio',
      },
      quantity: 1,
      price: 2490.00,
    });

    openCart();
  };

  return (
    <div className="w-full">
      {/* Canonical Link */}
      <link rel="canonical" href="https://www.bitiumtechnology.com/3d-customizer" />

      {/* WebPage Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "3D apparel Mockup Studio | Bitium Technology",
            "description": "Visualize your custom prints on hoodies and t-shirts in real-time with our custom interactive 3D apparel viewer.",
            "url": "https://www.bitiumtechnology.com/3d-customizer"
          })
        }}
      />

      {/* ── TOP HERO HEADER SECTION MATCHING STORE CATEGORY PAGES ── */}
      <header className="relative bg-white dark:bg-[#080d1a] border-b border-slate-200/80 dark:border-white/10 overflow-hidden pt-8 pb-10 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
        {/* Right side Contextual Image with Seamless Smooth Gradient Fade Mask */}
        <div className="absolute right-0 top-0 bottom-0 w-full sm:w-2/3 md:w-1/2 lg:w-5/12 pointer-events-none select-none z-0 hidden sm:block overflow-hidden">
          <div className="relative w-full h-full">
            <Image
              src="/images/hero-cards/toolkit.jpg"
              alt="3D Mockup Studio Toolkit"
              fill
              priority
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
              Home
            </Link>
            <ChevronRight size={12} className="text-slate-400" />
            <span className="text-slate-900 dark:text-white font-semibold">
              3D Mockup Studio
            </span>
          </nav>

          {/* Title & Description */}
          <div className="max-w-2xl">
            <h1 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-3">
              3D Mockup <span className="text-emerald-600 dark:text-[#2CFF05]">Studio</span>
            </h1>
            <p className="text-slate-600 dark:text-zinc-300 text-sm sm:text-[15px] leading-relaxed max-w-xl font-normal">
              Visualize your custom artwork on apparel in real-time with our interactive 3D studio viewer. Upload artwork, adjust garment colors, and test print finishes.
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-8">
        {/* LEFT COLUMN: Controls */}
        <div className="w-full lg:w-80 flex flex-col gap-6">

        {/* Base Colors Selector */}
        <ColorSelector 
          colors={T_SHIRT_COLORS} 
          selectedColor={selectedColor} 
          onChange={setSelectedColor} 
        />

        {/* Size Selector */}
        <SizeSelector 
          sizes={SIZES} 
          selectedSize={selectedSize} 
          onChange={setSelectedSize} 
        />

        {/* Logo Graphic Upload */}
        <DesignUploader 
          activeView={activeView}
          onViewChange={setActiveView}
          loading={loading}
          frontLogo={logoImage}
          backLogo={backLogoImage}
          onUploadFront={handleLogoUpload}
          onUploadBack={handleBackLogoUpload}
          onRemoveFront={handleRemoveLogo}
          onRemoveBack={handleRemoveBackLogo}
        />

        {/* Print Emboss Finishes */}
        <PrintStyleSelector 
          selectedStyle={printStyle} 
          onChange={handleStyleChange} 
        />
      </div>

      {/* CANVAS AREA: Front + Back side-by-side */}
      <div className="flex-1 flex flex-col gap-6">
        {/* Title bar */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-foreground uppercase tracking-widest flex items-center gap-2">
            <Eye size={15} className="text-[#2CFF05]" /> Interactive Mockup Studio
          </h2>
          <span className="text-xs text-muted-foreground font-medium">Both canvases update color in sync</span>
        </div>

        {/* Dual canvas grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* FRONT CANVAS */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#45ff24] animate-pulse" />
              <span className="text-xs font-bold text-foreground uppercase tracking-widest">Front View</span>
            </div>
            <div className="relative rounded-3xl overflow-hidden border border-border bg-gradient-to-br from-zinc-900 to-zinc-950 shadow-2xl flex items-center justify-center p-4 min-h-[500px]">
              <div className="relative bg-transparent rounded-2xl overflow-hidden border border-border/20 shadow-lg">
                <canvas ref={canvasRef} id="apparel-canvas" className="z-10" />
              </div>
              <div className="absolute bottom-3 left-0 right-0 text-center pointer-events-none">
                <p className="text-[10px] text-muted-foreground font-bold">
                  {logoImage ? 'Drag · Resize · Rotate the logo on the T-shirt' : 'Use Front View upload to add a chest graphic'}
                </p>
              </div>
            </div>
          </div>

          {/* BACK CANVAS */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#45ff24]" />
              <span className="text-xs font-bold text-foreground uppercase tracking-widest">Back View</span>
            </div>
            <div className="relative rounded-3xl overflow-hidden border border-border bg-gradient-to-br from-zinc-900 to-zinc-950 shadow-2xl flex items-center justify-center p-4 min-h-[500px]">
              <div className="relative bg-transparent rounded-2xl overflow-hidden border border-border/20 shadow-lg">
                <canvas ref={backCanvasRef} id="apparel-canvas-back" className="z-10" />
              </div>
              <div className="absolute bottom-3 left-0 right-0 text-center pointer-events-none">
                <p className="text-[10px] text-muted-foreground font-bold">
                  {backLogoImage ? 'Drag · Resize · Rotate the back graphic' : 'Use Back View upload to add a back print'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Add to Cart */}
        <div className="w-full space-y-2">
          <button
            onClick={handleAddToCart}
            disabled={isUploading}
            className="w-full py-4 rounded-xl bg-[#2CFF05] hover:bg-[#45ff24] disabled:opacity-60 disabled:cursor-not-allowed font-bold text-sm text-[#0a0a0a] flex items-center justify-center gap-2 transition-all glow-primary shadow-lg shadow-[#2CFF05]/20"
          >
            {isUploading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Uploading Preview…
              </>
            ) : (
              <>
                <ShoppingBag size={16} /> Add Custom Design to Cart (Rs. 2,490.00)
              </>
            )}
          </button>
          {uploadError && (
            <p className="text-[10px] text-amber-400 text-center font-medium">{uploadError}</p>
          )}
        </div>
      </div>
    </div>
  </div>
);
}
