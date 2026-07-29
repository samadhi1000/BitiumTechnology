'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';
import { 
  Shirt, Sparkles, RefreshCw, Layers, 
  Settings2, Eye, Paintbrush, ArrowLeft,
  Trash2, UploadCloud, ShoppingBag
} from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/lib/store/cartStore';

const T_SHIRT_COLORS = [
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

  const tShirtRef = useRef<fabric.Path | null>(null);
  const backTShirtRef = useRef<fabric.Path | null>(null);
  const foldsRef = useRef<fabric.Object[]>([]);
  const backFoldsRef = useRef<fabric.Object[]>([]);
  const addItem = useCartStore((state) => state.addItem);

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

  // Add customized tee to cart
  const handleAddToCart = () => {
    if (!canvas) return;

    // Deselect active logo to clean up capture preview
    canvas.discardActiveObject();
    canvas.renderAll();

    // Export mockup layout image
    const dataUrl = canvas.toDataURL({ format: 'png', multiplier: 1.5 });

    addItem({
      id: crypto.randomUUID(),
      type: 'apparel',
      product: {
        id: `custom-shirt-${selectedColor.name.toLowerCase().replace(/\s+/g, '-')}`,
        name: `Customized ${selectedColor.name} Tee`,
        description: `Custom ${selectedColor.name} blank T-shirt printed with dynamic logo layout. Print Finish: ${printStyle.toUpperCase()}`,
        image_url: dataUrl
      },
      variant: {
        id: `var-custom-${selectedColor.name.toLowerCase().replace(/\s+/g, '-')}-${selectedSize.toLowerCase()}`,
        name: `${selectedSize} / ${selectedColor.name}`,
        sku: `CUSTOM-${selectedColor.name.substring(0,3).toUpperCase()}-${selectedSize}`,
        price: 2490.00,
        attributes: { size: selectedSize, color: selectedColor.name, customPrint: true, printStyle }
      },
      quantity: 1,
      price: 2490.00
    });

    alert('Successfully added customized T-shirt to your shopping cart!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-8">
      {/* LEFT COLUMN: Controls */}
      <div className="w-full lg:w-80 flex flex-col gap-6">
        <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm font-semibold mb-2">
          <ArrowLeft size={16} /> Back to Home
        </Link>

        {/* Base Colors */}
        <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 space-y-4">
          <h3 className="font-bold text-sm text-zinc-300 flex items-center gap-2">
            <Paintbrush size={16} className="text-violet-400" />
            1. Apparel Color
          </h3>
          <div className="flex flex-wrap gap-3">
            {T_SHIRT_COLORS.map((col) => (
              <button
                key={col.name}
                onClick={() => setSelectedColor(col)}
                style={{ backgroundColor: col.hex }}
                className={`w-10 h-10 rounded-full border-2 transition-all ${
                  selectedColor.name === col.name
                    ? 'border-violet-500 scale-110 shadow-lg shadow-violet-600/30'
                    : 'border-zinc-800 hover:border-zinc-500 hover:scale-105'
                }`}
                title={col.name}
              />
            ))}
          </div>
          <p className="text-xs text-zinc-500 font-medium">Selected Color: {selectedColor.name}</p>
        </div>

        {/* Size Selector */}
        <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 space-y-4">
          <h3 className="font-bold text-sm text-zinc-300 flex items-center gap-2">
            <Shirt size={16} className="text-violet-400" />
            2. Choose Size
          </h3>
          <div className="flex gap-2">
            {SIZES.map((sz) => (
              <button
                key={sz}
                onClick={() => setSelectedSize(sz)}
                className={`flex-1 py-2.5 rounded-lg font-bold text-xs border transition-all ${
                  selectedSize === sz
                    ? 'bg-violet-600 border-violet-500 text-white shadow-md'
                    : 'bg-zinc-950 border-zinc-850 text-zinc-400 hover:text-white hover:border-zinc-700'
                }`}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>

        {/* Logo Graphic Upload */}
        <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 space-y-4">
          <h3 className="font-bold text-sm text-zinc-300 flex items-center gap-2">
            <Layers size={16} className="text-violet-400" />
            3. Print Graphic
          </h3>

          {/* Front / Back Tab */}
          <div className="flex gap-1.5 p-1 rounded-xl bg-zinc-950 border border-zinc-800">
            {(['front', 'back'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setActiveView(v)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                  activeView === v
                    ? 'bg-violet-600 text-white shadow'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {v} View
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            {/* Front upload */}
            {activeView === 'front' && (
              <>
                <label className="w-full h-24 rounded-xl border border-dashed border-zinc-800 hover:border-violet-700/50 bg-zinc-950 hover:bg-zinc-950/60 cursor-pointer flex flex-col items-center justify-center gap-2 transition-all">
                  {loading ? (
                    <RefreshCw className="animate-spin text-zinc-500" size={20} />
                  ) : (
                    <>
                      <UploadCloud size={20} className="text-zinc-500" />
                      <span className="text-xs font-semibold text-zinc-400">Upload Front Print</span>
                    </>
                  )}
                  <input type="file" accept="image/png, image/jpeg" className="hidden" onChange={handleLogoUpload} />
                </label>
                {logoImage && (
                  <button onClick={handleRemoveLogo} className="w-full py-2.5 rounded-lg border border-red-500/30 bg-red-950/10 hover:bg-red-950/20 text-red-400 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors">
                    <Trash2 size={13} /> Remove Front Design
                  </button>
                )}
              </>
            )}

            {/* Back upload */}
            {activeView === 'back' && (
              <>
                <label className="w-full h-24 rounded-xl border border-dashed border-zinc-800 hover:border-violet-700/50 bg-zinc-950 hover:bg-zinc-950/60 cursor-pointer flex flex-col items-center justify-center gap-2 transition-all">
                  {loading ? (
                    <RefreshCw className="animate-spin text-zinc-500" size={20} />
                  ) : (
                    <>
                      <UploadCloud size={20} className="text-zinc-500" />
                      <span className="text-xs font-semibold text-zinc-400">Upload Back Print</span>
                    </>
                  )}
                  <input type="file" accept="image/png, image/jpeg" className="hidden" onChange={handleBackLogoUpload} />
                </label>
                {backLogoImage && (
                  <button onClick={handleRemoveBackLogo} className="w-full py-2.5 rounded-lg border border-red-500/30 bg-red-950/10 hover:bg-red-950/20 text-red-400 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors">
                    <Trash2 size={13} /> Remove Back Design
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Print Emboss Finishes */}
        <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 space-y-4">
          <h3 className="font-bold text-sm text-zinc-300 flex items-center gap-2">
            <Sparkles size={16} className="text-violet-400" />
            4. Print Style & Emboss
          </h3>
          <div className="flex flex-col gap-2">
            {[
              { id: 'flat', label: 'Vibrant Flat Print', desc: 'Sleek, direct flat ink transfer.' },
              { id: 'embossed', label: '3D Embossed Print', desc: 'Embossed edges with detailed shadow.' },
              { id: 'vintage', label: 'Vintage Faded Print', desc: 'A subtle faded look with low opacity.' },
            ].map((style) => (
              <button
                key={style.id}
                onClick={() => handleStyleChange(style.id as any)}
                className={`w-full p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                  printStyle === style.id
                    ? 'bg-violet-950/20 border-violet-500/60 shadow-lg'
                    : 'bg-zinc-950 border-zinc-850 hover:bg-zinc-950/60 hover:border-zinc-800'
                }`}
              >
                <span className={`text-xs font-bold ${printStyle === style.id ? 'text-violet-400' : 'text-zinc-300'}`}>
                  {style.label}
                </span>
                <span className="text-[10px] text-zinc-500 font-medium">
                  {style.desc}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CANVAS AREA: Front + Back side-by-side */}
      <div className="flex-1 flex flex-col gap-6">
        {/* Title bar */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-widest flex items-center gap-2">
            <Eye size={15} className="text-violet-400" /> Interactive Mockup Studio
          </h2>
          <span className="text-xs text-zinc-500 font-medium">Both canvases update color in sync</span>
        </div>

        {/* Dual canvas grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* FRONT CANVAS */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
              <span className="text-xs font-bold text-zinc-300 uppercase tracking-widest">Front View</span>
            </div>
            <div className="relative rounded-3xl overflow-hidden border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 shadow-2xl flex items-center justify-center p-4 min-h-[500px]">
              <div className="relative bg-transparent rounded-2xl overflow-hidden border border-zinc-800/20 shadow-lg">
                <canvas ref={canvasRef} id="apparel-canvas" className="z-10" />
              </div>
              <div className="absolute bottom-3 left-0 right-0 text-center pointer-events-none">
                <p className="text-[10px] text-zinc-500 font-bold">
                  {logoImage ? 'Drag · Resize · Rotate the logo on the T-shirt' : 'Use Front View upload to add a chest graphic'}
                </p>
              </div>
            </div>
          </div>

          {/* BACK CANVAS */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-fuchsia-500" />
              <span className="text-xs font-bold text-zinc-300 uppercase tracking-widest">Back View</span>
            </div>
            <div className="relative rounded-3xl overflow-hidden border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 shadow-2xl flex items-center justify-center p-4 min-h-[500px]">
              <div className="relative bg-transparent rounded-2xl overflow-hidden border border-zinc-800/20 shadow-lg">
                <canvas ref={backCanvasRef} id="apparel-canvas-back" className="z-10" />
              </div>
              <div className="absolute bottom-3 left-0 right-0 text-center pointer-events-none">
                <p className="text-[10px] text-zinc-500 font-bold">
                  {backLogoImage ? 'Drag · Resize · Rotate the back graphic' : 'Use Back View upload to add a back print'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Add to Cart */}
        <div className="w-full">
          <button
            onClick={handleAddToCart}
            className="w-full py-4 rounded-xl bg-violet-600 hover:bg-violet-500 font-bold text-sm text-white flex items-center justify-center gap-2 transition-all glow-primary shadow-lg shadow-violet-600/20"
          >
            <ShoppingBag size={16} /> Add Custom Design to Cart (Rs. 2,490.00)
          </button>
        </div>
      </div>
    </div>
  );
}
