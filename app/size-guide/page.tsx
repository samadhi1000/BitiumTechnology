'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Ruler, 
  HelpCircle, 
  ChevronRight, 
  Calculator, 
  Activity,
  ThumbsUp
} from 'lucide-react';

type DimensionKey = 'chest' | 'length' | 'shoulder';

interface SizeSpec {
  chest: number; // in inches
  length: number; // in inches
  shoulder: number; // in inches
}

const SIZE_SPECS: Record<string, SizeSpec> = {
  S: { chest: 20.25, length: 27.0, shoulder: 15.5 },
  M: { chest: 21.25, length: 28.0, shoulder: 16.5 },
  L: { chest: 22.25, length: 29.0, shoulder: 17.25 },
  XL: { chest: 23.25, length: 30.0, shoulder: 18.0 },
  '2XL': { chest: 24.25, length: 31.0, shoulder: 18.75 },
  '3XL': { chest: 25.25, length: 32.0, shoulder: 19.25 }
};

export default function SizeGuidePage() {
  const [unit, setUnit] = useState<'inches' | 'cms'>('inches');
  const [selectedSize, setSelectedSize] = useState<string>('S');
  const [hoveredDim, setHoveredDim] = useState<DimensionKey | null>(null);

  // Fit Finder state
  const [chestInput, setChestInput] = useState<string>('');
  const [heightInput, setHeightInput] = useState<string>('');
  const [preference, setPreference] = useState<'slim' | 'standard' | 'relaxed'>('standard');
  const [recommendedSize, setRecommendedSize] = useState<string | null>(null);

  const convertValue = (val: number) => {
    if (unit === 'cms') {
      return (val * 2.54).toFixed(1) + ' cm';
    }
    return val.toFixed(2) + '"';
  };

  const handleCalculateFit = (e: React.FormEvent) => {
    e.preventDefault();
    const chestNum = parseFloat(chestInput);
    const heightNum = parseFloat(heightInput);

    if (isNaN(chestNum) || chestNum <= 0) return;

    let baseSize = 'M';
    if (chestNum < 35) baseSize = 'S';
    else if (chestNum >= 35 && chestNum < 38) baseSize = 'S';
    else if (chestNum >= 38 && chestNum < 41) baseSize = 'M';
    else if (chestNum >= 41 && chestNum < 44) baseSize = 'L';
    else if (chestNum >= 44 && chestNum < 47) baseSize = 'XL';
    else if (chestNum >= 47 && chestNum < 50) baseSize = '2XL';
    else baseSize = '3XL';

    // Adjust based on fit preference
    const sizes = ['S', 'M', 'L', 'XL', '2XL', '3XL'];
    let finalIdx = sizes.indexOf(baseSize);

    if (preference === 'relaxed') {
      finalIdx = Math.min(finalIdx + 1, sizes.length - 1);
    } else if (preference === 'slim') {
      finalIdx = Math.max(finalIdx - 1, 0);
    }

    setRecommendedSize(sizes[finalIdx]);
  };

  const currentSpec = SIZE_SPECS[selectedSize];

  return (
    <div className="w-full min-h-screen bg-zinc-950 text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/4 w-[350px] h-[350px] bg-fuchsia-600/5 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.005)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.005)_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none"></div>

      <div className="max-w-[1400px] mx-auto relative z-10 space-y-16">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-semibold">
            <Ruler size={12} className="animate-pulse" />
            <span>Interactive Fit Assistant</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight">
            T-Shirt <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-400 bg-clip-text text-transparent">Size & Fit Guide</span>
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Find your perfect fit. Toggle between units, view dimensions on our interactive model, or use the Fit Calculator for an instant recommendation.
          </p>
        </div>

        {/* Main Interface Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT PANEL: Interactive Blueprint (5 cols) */}
          <div className="lg:col-span-5 rounded-3xl border border-zinc-800 bg-zinc-900/30 backdrop-blur-md p-6 sm:p-8 space-y-8 shadow-2xl">
            <div>
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                <Activity size={18} className="text-violet-400" />
                Interactive Blueprint
              </h2>
              <p className="text-zinc-500 text-xs mt-1">Hover parts of the diagram or blueprint rows to inspect specs</p>
            </div>

            {/* SVG Interactive Blueprint Area */}
            <div className="relative aspect-[4/3] w-full rounded-2xl bg-zinc-950/60 border border-zinc-850 p-6 flex justify-center items-center overflow-hidden">
              {/* Grid backdrop */}
              <div className="absolute inset-0 bg-[radial-gradient(rgba(139,92,246,0.05)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none"></div>
              
              <div className="flex justify-center items-center gap-8 w-full max-w-[380px]">
                {/* FRONT VIEW */}
                <div className="relative flex-1 flex flex-col items-center">
                  <span className="text-[10px] font-extrabold text-zinc-500 tracking-wider mb-2">FRONT</span>
                  <svg viewBox="0 0 100 100" className="w-full h-auto fill-zinc-800/40 stroke-zinc-700 transition-all duration-300" strokeWidth="1">
                    {/* Shirt Front Path */}
                    <path d="M 30,12 C 40,20 60,20 70,12 L 88,26 L 80,38 L 74,35 L 74,88 L 26,88 L 26,35 L 20,38 L 12,26 Z" />
                    
                    {/* Chest measurement line (Interactive) */}
                    <g 
                      onMouseEnter={() => setHoveredDim('chest')} 
                      onMouseLeave={() => setHoveredDim(null)}
                      className={`cursor-pointer group transition-all duration-300 ${hoveredDim === 'chest' ? 'stroke-rose-500' : 'stroke-rose-500/40'}`}
                      strokeWidth={hoveredDim === 'chest' ? '2' : '1.5'}
                    >
                      <line x1="26" y1="48" x2="74" y2="48" strokeDasharray="3 3" />
                      <circle cx="26" cy="48" r="2.5" className="fill-rose-500 stroke-none" />
                      <circle cx="74" cy="48" r="2.5" className="fill-rose-500 stroke-none" />
                      {/* Interactive floating badge */}
                      <rect x="36" y="42" width="28" height="12" rx="2" className={`fill-zinc-900 stroke-zinc-800 transition-all duration-300 ${hoveredDim === 'chest' ? 'stroke-rose-500' : ''}`} strokeWidth="0.5" />
                      <text x="50" y="50" className="fill-zinc-300 font-extrabold text-[5px] text-center" textAnchor="middle" stroke="none">CHEST</text>
                    </g>

                    {/* Height / Length measurement line (Interactive) */}
                    <g 
                      onMouseEnter={() => setHoveredDim('length')} 
                      onMouseLeave={() => setHoveredDim(null)}
                      className={`cursor-pointer group transition-all duration-300 ${hoveredDim === 'length' ? 'stroke-emerald-500' : 'stroke-emerald-500/40'}`}
                      strokeWidth={hoveredDim === 'length' ? '2' : '1.5'}
                    >
                      <line x1="50" y1="15" x2="50" y2="88" strokeDasharray="3 3" />
                      <circle cx="50" cy="15" r="2.5" className="fill-emerald-500 stroke-none" />
                      <circle cx="50" cy="88" r="2.5" className="fill-emerald-500 stroke-none" />
                      {/* Interactive floating badge */}
                      <rect x="36" y="62" width="28" height="12" rx="2" className={`fill-zinc-900 stroke-zinc-800 transition-all duration-300 ${hoveredDim === 'length' ? 'stroke-emerald-500' : ''}`} strokeWidth="0.5" />
                      <text x="50" y="70" className="fill-zinc-300 font-extrabold text-[5px] text-center" textAnchor="middle" stroke="none">LENGTH</text>
                    </g>
                  </svg>
                </div>

                {/* BACK VIEW */}
                <div className="relative flex-1 flex flex-col items-center">
                  <span className="text-[10px] font-extrabold text-zinc-500 tracking-wider mb-2">BACK</span>
                  <svg viewBox="0 0 100 100" className="w-full h-auto fill-zinc-800/40 stroke-zinc-700 transition-all duration-300" strokeWidth="1">
                    {/* Shirt Back Path */}
                    <path d="M 30,12 C 40,16 60,16 70,12 L 88,26 L 80,38 L 74,35 L 74,88 L 26,88 L 26,35 L 20,38 L 12,26 Z" />
                    
                    {/* Shoulder measurement line (Interactive) */}
                    <g 
                      onMouseEnter={() => setHoveredDim('shoulder')} 
                      onMouseLeave={() => setHoveredDim(null)}
                      className={`cursor-pointer group transition-all duration-300 ${hoveredDim === 'shoulder' ? 'stroke-sky-500' : 'stroke-sky-500/40'}`}
                      strokeWidth={hoveredDim === 'shoulder' ? '2' : '1.5'}
                    >
                      <line x1="22" y1="21" x2="78" y2="21" strokeDasharray="3 3" />
                      <circle cx="22" cy="21" r="2.5" className="fill-sky-500 stroke-none" />
                      <circle cx="78" cy="21" r="2.5" className="fill-sky-500 stroke-none" />
                      {/* Interactive floating badge */}
                      <rect x="34" y="15" width="32" height="12" rx="2" className={`fill-zinc-900 stroke-zinc-800 transition-all duration-300 ${hoveredDim === 'shoulder' ? 'stroke-sky-500' : ''}`} strokeWidth="0.5" />
                      <text x="50" y="23" className="fill-zinc-300 font-extrabold text-[5px] text-center" textAnchor="middle" stroke="none">SHOULDER</text>
                    </g>
                  </svg>
                </div>
              </div>
            </div>

            {/* Spec readout card */}
            <div className="rounded-2xl border border-zinc-850 bg-zinc-950/80 p-5 space-y-4">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Selected Dimension Spec</span>
              
              <div className="space-y-3">
                {/* Chest readout */}
                <div 
                  onMouseEnter={() => setHoveredDim('chest')}
                  onMouseLeave={() => setHoveredDim(null)}
                  className={`flex justify-between items-center p-2.5 rounded-xl border transition-all duration-300 ${
                    hoveredDim === 'chest' 
                      ? 'border-rose-500/40 bg-rose-500/5' 
                      : 'border-zinc-850 hover:border-zinc-800'
                  }`}
                >
                  <span className="text-xs font-bold flex items-center gap-2 text-zinc-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></span>
                    Chest (Width)
                  </span>
                  <span className="text-sm font-black text-rose-400">{convertValue(currentSpec.chest)}</span>
                </div>

                {/* Length readout */}
                <div 
                  onMouseEnter={() => setHoveredDim('length')}
                  onMouseLeave={() => setHoveredDim(null)}
                  className={`flex justify-between items-center p-2.5 rounded-xl border transition-all duration-300 ${
                    hoveredDim === 'length' 
                      ? 'border-emerald-500/40 bg-emerald-500/5' 
                      : 'border-zinc-850 hover:border-zinc-800'
                  }`}
                >
                  <span className="text-xs font-bold flex items-center gap-2 text-zinc-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                    Back Length
                  </span>
                  <span className="text-sm font-black text-emerald-400">{convertValue(currentSpec.length)}</span>
                </div>

                {/* Shoulder readout */}
                <div 
                  onMouseEnter={() => setHoveredDim('shoulder')}
                  onMouseLeave={() => setHoveredDim(null)}
                  className={`flex justify-between items-center p-2.5 rounded-xl border transition-all duration-300 ${
                    hoveredDim === 'shoulder' 
                      ? 'border-sky-500/40 bg-sky-500/5' 
                      : 'border-zinc-850 hover:border-zinc-800'
                  }`}
                >
                  <span className="text-xs font-bold flex items-center gap-2 text-zinc-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.5)]"></span>
                    Shoulder Width
                  </span>
                  <span className="text-sm font-black text-sky-400">{convertValue(currentSpec.shoulder)}</span>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT PANEL: Matrix and Fit Finder (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* INTERACTIVE SIZE MATRIX CARD */}
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/30 backdrop-blur-md p-6 sm:p-8 space-y-6 shadow-2xl">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <h2 className="text-xl font-extrabold text-white">Interactive Size Matrix</h2>
                  <p className="text-zinc-500 text-xs mt-1">Select a size column or toggle measurement units</p>
                </div>

                {/* Unit Switcher */}
                <div className="flex p-1 rounded-xl bg-zinc-950 border border-zinc-850 self-start">
                  <button
                    onClick={() => setUnit('inches')}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all ${
                      unit === 'inches' ? 'bg-violet-600 text-white' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Inches
                  </button>
                  <button
                    onClick={() => setUnit('cms')}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all ${
                      unit === 'cms' ? 'bg-violet-600 text-white' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Centimeters
                  </button>
                </div>
              </div>

              {/* Size Select Buttons */}
              <div className="flex flex-wrap gap-2">
                {Object.keys(SIZE_SPECS).map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 rounded-xl text-sm font-black transition-all ${
                      selectedSize === size
                        ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-600/20 scale-105 border-0'
                        : 'border border-zinc-800 hover:border-zinc-700 bg-zinc-900/20 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>

              {/* Matrix Table */}
              <div className="overflow-hidden rounded-2xl border border-zinc-850 shadow-lg">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="bg-gradient-to-r from-zinc-900 to-zinc-950 border-b border-zinc-850">
                      <th className="p-4 text-xs font-black uppercase text-zinc-400 tracking-wider">Size Spec</th>
                      {Object.keys(SIZE_SPECS).map((size) => (
                        <th 
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`p-4 text-xs font-black uppercase tracking-wider text-center cursor-pointer transition-colors ${
                            selectedSize === size ? 'text-violet-400 bg-violet-600/5' : 'text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          {size}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Chest Row */}
                    <tr 
                      onMouseEnter={() => setHoveredDim('chest')}
                      onMouseLeave={() => setHoveredDim(null)}
                      className={`border-b border-zinc-850 transition-colors ${
                        hoveredDim === 'chest' ? 'bg-rose-500/5' : 'hover:bg-zinc-900/10'
                      }`}
                    >
                      <td className="p-4 text-xs font-bold text-zinc-300">
                        <span className="inline-block w-2 h-2 rounded-full bg-rose-500 mr-2"></span>
                        Chest Width
                      </td>
                      {Object.keys(SIZE_SPECS).map((size) => (
                        <td 
                          key={size}
                          className={`p-4 text-xs text-center font-semibold transition-colors ${
                            selectedSize === size ? 'text-rose-400 font-extrabold bg-violet-600/5' : 'text-zinc-400'
                          }`}
                        >
                          {convertValue(SIZE_SPECS[size].chest)}
                        </td>
                      ))}
                    </tr>

                    {/* Length Row */}
                    <tr 
                      onMouseEnter={() => setHoveredDim('length')}
                      onMouseLeave={() => setHoveredDim(null)}
                      className={`border-b border-zinc-850 transition-colors ${
                        hoveredDim === 'length' ? 'bg-emerald-500/5' : 'hover:bg-zinc-900/10'
                      }`}
                    >
                      <td className="p-4 text-xs font-bold text-zinc-300">
                        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                        Back Length
                      </td>
                      {Object.keys(SIZE_SPECS).map((size) => (
                        <td 
                          key={size}
                          className={`p-4 text-xs text-center font-semibold transition-colors ${
                            selectedSize === size ? 'text-emerald-400 font-extrabold bg-violet-600/5' : 'text-zinc-400'
                          }`}
                        >
                          {convertValue(SIZE_SPECS[size].length)}
                        </td>
                      ))}
                    </tr>

                    {/* Shoulder Row */}
                    <tr 
                      onMouseEnter={() => setHoveredDim('shoulder')}
                      onMouseLeave={() => setHoveredDim(null)}
                      className={`transition-colors ${
                        hoveredDim === 'shoulder' ? 'bg-sky-500/5' : 'hover:bg-zinc-900/10'
                      }`}
                    >
                      <td className="p-4 text-xs font-bold text-zinc-300">
                        <span className="inline-block w-2 h-2 rounded-full bg-sky-500 mr-2"></span>
                        Shoulder Width
                      </td>
                      {Object.keys(SIZE_SPECS).map((size) => (
                        <td 
                          key={size}
                          className={`p-4 text-xs text-center font-semibold transition-colors ${
                            selectedSize === size ? 'text-sky-400 font-extrabold bg-violet-600/5' : 'text-zinc-400'
                          }`}
                        >
                          {convertValue(SIZE_SPECS[size].shoulder)}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* INTERACTIVE FIT FINDER (CALCULATOR) CARD */}
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/30 backdrop-blur-md p-6 sm:p-8 space-y-6 shadow-2xl">
              <div>
                <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                  <Calculator size={20} className="text-fuchsia-400" />
                  Interactive Fit Finder
                </h2>
                <p className="text-zinc-500 text-xs mt-1">Input your chest measurements to determine the recommended size</p>
              </div>

              <form onSubmit={handleCalculateFit} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                {/* Chest input */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Your Chest Size (Inches)</label>
                  <input
                    type="number"
                    value={chestInput}
                    onChange={(e) => setChestInput(e.target.value)}
                    placeholder="e.g. 38"
                    required
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
                  />
                </div>

                {/* Preference select */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Fit Preference</label>
                  <select
                    value={preference}
                    onChange={(e: any) => setPreference(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-300 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
                  >
                    <option value="slim">Slim Fit (Tight)</option>
                    <option value="standard">Standard Fit</option>
                    <option value="relaxed">Relaxed Fit (Loose)</option>
                  </select>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-violet-600/10 hover:shadow-violet-600/35 transition-all hover:scale-[1.02]"
                >
                  Find My Size
                </button>
              </form>

              {/* Recommendation Output Display */}
              {recommendedSize && (
                <div className="p-5 rounded-2xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-between gap-4 animate-fade-in">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-violet-400 uppercase tracking-wider block">Our Recommendation</span>
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      Based on your chest size and fit preferences, we recommend size <span className="text-white font-black text-sm">{recommendedSize}</span>.
                    </p>
                  </div>
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-violet-600 to-fuchsia-600 flex items-center justify-center text-white font-black text-xl shadow-lg">
                      {recommendedSize}
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Fit Guide Tips */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="p-6 rounded-2xl border border-zinc-900 bg-zinc-900/10 flex flex-col justify-between">
            <h4 className="font-extrabold text-sm text-white mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400"></span>
              How to Measure Chest
            </h4>
            <p className="text-zinc-500 text-xs leading-relaxed">
              Measure around the fullest part of your chest, keeping the tape horizontal. Divide by 2 to compare with our flat-lay chest specifications.
            </p>
          </div>
          <div className="p-6 rounded-2xl border border-zinc-900 bg-zinc-900/10 flex flex-col justify-between">
            <h4 className="font-extrabold text-sm text-white mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400"></span>
              How to Measure Back Length
            </h4>
            <p className="text-zinc-500 text-xs leading-relaxed">
              Measure from the highest point of the shoulder (near the collar base) straight down to the bottom hem of the garment.
            </p>
          </div>
          <div className="p-6 rounded-2xl border border-zinc-900 bg-zinc-900/10 flex flex-col justify-between">
            <h4 className="font-extrabold text-sm text-white mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400"></span>
              Shrinkage & Tolerance
            </h4>
            <p className="text-zinc-500 text-xs leading-relaxed">
              Allow for a 0.5" flat-lay measurement tolerance. Cotton garments may experience up to 3% shrinkage after the first wash cycle.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
