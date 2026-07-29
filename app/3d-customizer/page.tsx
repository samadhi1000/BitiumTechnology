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
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [selectedColor, setSelectedColor] = useState(T_SHIRT_COLORS[0]);
  const [selectedSize, setSelectedSize] = useState('M');
  const [logoImage, setLogoImage] = useState<string | null>(null);
  const [printStyle, setPrintStyle] = useState<'flat' | 'embossed' | 'vintage'>('flat');
  const [loading, setLoading] = useState(false);

  const tShirtRef = useRef<fabric.Path | null>(null);
  const foldsRef = useRef<fabric.Object[]>([]);
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

  // Update T-shirt color dynamically
  useEffect(() => {
    if (tShirtRef.current && canvas) {
      tShirtRef.current.set({ fill: selectedColor.hex });
      canvas.renderAll();
    }
  }, [selectedColor, canvas]);

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
            3. Chest Logo/Image
          </h3>
          <div className="flex flex-col gap-3">
            <label className="w-full h-24 rounded-xl border border-dashed border-zinc-800 hover:border-zinc-700 bg-zinc-950 hover:bg-zinc-950/60 cursor-pointer flex flex-col items-center justify-center gap-2 transition-all">
              {loading ? (
                <RefreshCw className="animate-spin text-zinc-500" size={20} />
              ) : (
                <>
                  <UploadCloud size={20} className="text-zinc-500" />
                  <span className="text-xs font-semibold text-zinc-400">Upload Print Graphic</span>
                </>
              )}
              <input
                type="file"
                accept="image/png, image/jpeg"
                className="hidden"
                onChange={handleLogoUpload}
              />
            </label>

            {logoImage && (
              <button
                onClick={handleRemoveLogo}
                className="w-full py-2.5 rounded-lg border border-red-500/30 bg-red-950/10 hover:bg-red-950/20 text-red-400 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Trash2 size={13} /> Remove Design
              </button>
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

      {/* MIDDLE: Interactive Canvas Customizer */}
      <div className="flex-1 flex flex-col items-center justify-center min-w-[320px]">
        {/* Mockup Render Frame */}
        <div className="relative w-full max-w-[420px] h-[500px] rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-905 bg-gradient-to-br from-zinc-900 to-zinc-950 shadow-2xl flex items-center justify-center p-6">
          
          <div className="relative bg-transparent rounded-2xl overflow-hidden border border-zinc-800/20 shadow-lg">
            <canvas ref={canvasRef} id="apparel-canvas" className="z-10" />
          </div>

          {/* Top overlays */}
          <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-center pointer-events-none">
            <span className="px-3 py-1 rounded-full bg-zinc-900/80 backdrop-blur border border-zinc-800 text-[10px] font-bold uppercase tracking-wider text-zinc-300">
              Interactive Mockup Studio
            </span>
          </div>

          {/* Canvas Guide instructions */}
          <div className="absolute bottom-4 left-4 right-4 z-20 text-center pointer-events-none">
            <p className="text-[10px] text-zinc-500 font-bold">
              {logoImage ? 'Select & drag, resize, or rotate the logo directly on T-shirt' : 'Upload custom logo from menu to adjust placement'}
            </p>
          </div>
        </div>

        {/* Add to Cart Actions */}
        <div className="w-full max-w-[420px] mt-6">
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
