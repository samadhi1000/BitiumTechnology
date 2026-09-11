'use client';

import React, { useState, useEffect } from 'react';
import { 
  PromoBanner, 
  DEFAULT_PROMO_BANNERS, 
  getPromoBanners, 
  savePromoBanners 
} from '@/lib/promo-banners';
import { supabase } from '@/lib/supabase';
import { 
  Megaphone, 
  Sparkles, 
  Save, 
  RotateCcw, 
  Upload, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  Check, 
  AlertCircle, 
  Eye, 
  ArrowRight, 
  X, 
  Palette, 
  Layers,
  Moon,
  Sun
} from 'lucide-react';

const THEMES = [
  { id: 'neon-green', name: 'Neon Green', color: '#2CFF05', border: 'border-[#2CFF05]/40', bg: 'bg-[#2CFF05]', text: 'text-[#2CFF05]', shadow: 'shadow-[#2CFF05]/20', darkGlow: 'bg-[#2CFF05]/15' },
  { id: 'amber-gold', name: 'Amber Gold', color: '#F59E0B', border: 'border-amber-500/40', bg: 'bg-amber-500', text: 'text-amber-400', shadow: 'shadow-amber-500/20', darkGlow: 'bg-amber-500/15' },
  { id: 'cyber-blue', name: 'Cyber Blue', color: '#06B6D4', border: 'border-cyan-500/40', bg: 'bg-cyan-500', text: 'text-cyan-400', shadow: 'shadow-cyan-500/20', darkGlow: 'bg-cyan-500/15' },
  { id: 'rose-red',   name: 'Rose Red',   color: '#F43F5E', border: 'border-rose-500/40', bg: 'bg-rose-500', text: 'text-rose-400', shadow: 'shadow-rose-500/20', darkGlow: 'bg-rose-500/15' },
  { id: 'purple-glow',name: 'Purple Glow',color: '#A855F7', border: 'border-purple-500/40', bg: 'bg-purple-500', text: 'text-purple-400', shadow: 'shadow-purple-500/20', darkGlow: 'bg-purple-500/15' },
] as const;

const QUICK_LINKS = [
  { label: 'Contact Form', href: '/contact' },
  { label: 'Online Order Form', href: '/order-form' },
  { label: 'Store Catalog', href: '/products' },
  { label: 'Screen Printing', href: '/screen-printing' },
  { label: 'Stencils', href: '/stencil' },
  { label: 'DTF Printing', href: '/dtf_sheet' },
  { label: 'Batik Stamps', href: '/batik-stamp' },
  { label: 'Laser Cutting', href: '/laser-cutting' },
  { label: 'Consumables & Inks', href: '/materials' },
];

export default function AdminPromoManager() {
  const [banners, setBanners] = useState<PromoBanner[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('screen-printing');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle');
  const [toastMsg, setToastMsg] = useState<string>('');
  const [previewThemeMode, setPreviewThemeMode] = useState<'dark' | 'light'>('dark');

  // Load banners on mount
  useEffect(() => {
    const loaded = getPromoBanners();
    setBanners(loaded);
  }, []);

  const currentBanner = banners.find(b => b.category === selectedCategory) || DEFAULT_PROMO_BANNERS[0];

  const updateCurrentBanner = (field: keyof PromoBanner, value: any) => {
    setBanners(prev => prev.map(b => {
      if (b.category === selectedCategory) {
        return { ...b, [field]: value, updatedAt: new Date().toISOString() };
      }
      return b;
    }));
    setSaveStatus('idle');
  };

  const handleSave = () => {
    try {
      savePromoBanners(banners);
      setSaveStatus('saved');
      setToastMsg(`Saved offer settings for "${currentBanner.categoryName}"!`);
      setTimeout(() => setSaveStatus('idle'), 3500);
      setTimeout(() => setToastMsg(''), 4000);
    } catch (e) {
      setSaveStatus('error');
      setToastMsg('Failed to save settings.');
    }
  };

  const handleResetCurrent = () => {
    const defaultOne = DEFAULT_PROMO_BANNERS.find(b => b.category === selectedCategory);
    if (defaultOne) {
      setBanners(prev => prev.map(b => b.category === selectedCategory ? { ...defaultOne } : b));
      savePromoBanners(banners.map(b => b.category === selectedCategory ? { ...defaultOne } : b));
      setToastMsg(`Reset "${currentBanner.categoryName}" to default.`);
      setTimeout(() => setToastMsg(''), 3000);
    }
  };

  const handleResetAll = () => {
    if (confirm('Are you sure you want to reset all offer and advertisement banners to system defaults?')) {
      setBanners(DEFAULT_PROMO_BANNERS);
      savePromoBanners(DEFAULT_PROMO_BANNERS);
      setToastMsg('All banners reset to default settings.');
      setTimeout(() => setToastMsg(''), 3000);
    }
  };

  // Upload image to Supabase storage with fallback to data URL
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `promo-${selectedCategory}-${Date.now()}.${fileExt}`;
      const filePath = `uploads/promos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('public-previews')
        .upload(filePath, file, { cacheControl: '3600', upsert: true });

      if (uploadError) {
        console.warn('Supabase storage upload error, falling back to FileReader:', uploadError.message);
        // Fallback to Base64 data URL
        const reader = new FileReader();
        reader.onloadend = () => {
          updateCurrentBanner('imageUrl', reader.result as string);
          setUploadingImage(false);
        };
        reader.readAsDataURL(file);
        return;
      }

      const { data } = supabase.storage.from('public-previews').getPublicUrl(filePath);
      updateCurrentBanner('imageUrl', data.publicUrl);
    } catch (err: any) {
      console.error('Upload failed:', err);
      // Fallback
      const reader = new FileReader();
      reader.onloadend = () => {
        updateCurrentBanner('imageUrl', reader.result as string);
        setUploadingImage(false);
      };
      reader.readAsDataURL(file);
      return;
    } finally {
      setUploadingImage(false);
    }
  };

  const activeThemeMeta = THEMES.find(t => t.id === currentBanner.theme) || THEMES[0];

  return (
    <div className="space-y-6">
      {/* Top Notification Toast */}
      {toastMsg && (
        <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold animate-fade-in">
          <div className="flex items-center gap-2">
            <Check size={16} className="text-emerald-400" />
            <span>{toastMsg}</span>
          </div>
          <button onClick={() => setToastMsg('')} className="p-1 text-emerald-400/70 hover:text-emerald-300">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Header & Controls Bar */}
      <div className="p-5 sm:p-6 rounded-3xl border border-border bg-card/20 backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-8 h-8 rounded-xl bg-[#2CFF05]/15 border border-[#2CFF05]/30 flex items-center justify-center text-[#2CFF05]">
              <Megaphone size={16} />
            </div>
            <h2 className="text-base sm:text-lg font-black text-foreground">
              Offer & Advertisement Banners Manager
            </h2>
          </div>
          <p className="text-xs text-muted-foreground max-w-xl">
            Customize the 3rd card on category pages with special seasonal discounts, custom artwork services, marketing promotions, images, and custom links.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <button
            onClick={handleResetAll}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-card/40 hover:bg-red-500/10 hover:border-red-500/30 text-muted-foreground hover:text-red-400 text-xs font-semibold transition-all cursor-pointer"
            title="Reset all banners to default"
          >
            <RotateCcw size={13} />
            <span>Reset All</span>
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2CFF05] text-[#0a0a0a] text-xs font-black uppercase tracking-wider hover:bg-[#3af816] transition-all shadow-lg shadow-[#2CFF05]/20 hover:scale-105 cursor-pointer ml-auto md:ml-0"
          >
            {saveStatus === 'saved' ? <Check size={15} /> : <Save size={15} />}
            <span>{saveStatus === 'saved' ? 'Saved Successfully!' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {banners.map((banner) => {
          const isSelected = banner.category === selectedCategory;
          const themeMeta = THEMES.find(t => t.id === banner.theme) || THEMES[0];
          return (
            <button
              key={banner.id}
              onClick={() => setSelectedCategory(banner.category)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-card border-2 border-[#2CFF05] text-foreground shadow-md shadow-[#2CFF05]/10 scale-105'
                  : 'bg-card/40 border border-border text-muted-foreground hover:text-foreground hover:bg-card'
              }`}
            >
              <div 
                className="w-2.5 h-2.5 rounded-full shrink-0" 
                style={{ backgroundColor: banner.isActive ? themeMeta.color : '#64748b' }} 
              />
              <span>{banner.categoryName}</span>
              {!banner.isActive && (
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">Disabled</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Grid: Left Editor & Right Live Card Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Configuration Form (7 cols) */}
        <div className="lg:col-span-7 space-y-5 bg-card/20 border border-border rounded-3xl p-5 sm:p-7 backdrop-blur-sm">
          
          {/* Active Status & Reset Row */}
          <div className="flex items-center justify-between pb-4 border-b border-border/60">
            <div className="flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={currentBanner.isActive}
                  onChange={(e) => updateCurrentBanner('isActive', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2CFF05]"></div>
              </label>
              <div>
                <span className="text-xs font-bold text-foreground block">
                  {currentBanner.isActive ? 'Banner Enabled' : 'Banner Hidden'}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Visible on "{currentBanner.categoryName}" category page
                </span>
              </div>
            </div>

            <button
              onClick={handleResetCurrent}
              className="text-[11px] font-bold text-muted-foreground hover:text-[#2CFF05] flex items-center gap-1 cursor-pointer transition-colors"
            >
              <RotateCcw size={12} />
              <span>Reset this tab</span>
            </button>
          </div>

          {/* Color Theme Selector */}
          <div>
            <label className="block text-xs font-bold text-foreground mb-2 flex items-center gap-1.5">
              <Palette size={14} className="text-[#2CFF05]" /> Accent Color Theme
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {THEMES.map((th) => {
                const isSelected = currentBanner.theme === th.id;
                return (
                  <button
                    key={th.id}
                    type="button"
                    onClick={() => updateCurrentBanner('theme', th.id)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'border-white bg-card shadow-md scale-102 text-foreground'
                        : 'border-border bg-card/30 text-muted-foreground hover:bg-card'
                    }`}
                  >
                    <span 
                      className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm" 
                      style={{ backgroundColor: th.color }}
                    />
                    <span className="truncate">{th.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Badge / Pill Text */}
          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5 flex items-center gap-1.5">
              <Sparkles size={14} className="text-amber-400" /> Offer Badge / Label (Optional)
            </label>
            <input
              type="text"
              value={currentBanner.badgeText || ''}
              onChange={(e) => updateCurrentBanner('badgeText', e.target.value)}
              placeholder="e.g., Special Offer 20% OFF, Custom Service, New Arrival"
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:border-[#2CFF05]"
            />
          </div>

          {/* Heading / Title */}
          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">
              Card Headline / Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={currentBanner.title}
              onChange={(e) => updateCurrentBanner('title', e.target.value)}
              placeholder="e.g., Need a custom screen exposed? or Seasonal Offer!"
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-xs font-bold text-foreground focus:outline-none focus:border-[#2CFF05]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">
              Description / Offer Details <span className="text-red-400">*</span>
            </label>
            <textarea
              rows={3}
              value={currentBanner.desc}
              onChange={(e) => updateCurrentBanner('desc', e.target.value)}
              placeholder="Explain what the service or promotion offers..."
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:border-[#2CFF05]"
            />
          </div>

          {/* Promotional Graphic / Image Section */}
          <div className="p-4 rounded-2xl border border-border bg-card/40 space-y-3">
            <label className="block text-xs font-bold text-foreground flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ImageIcon size={14} className="text-cyan-400" /> Banner Image / Mockup (Optional)
              </span>
              {currentBanner.imageUrl && (
                <button
                  onClick={() => updateCurrentBanner('imageUrl', '')}
                  className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-1"
                >
                  <X size={12} /> Remove Image
                </button>
              )}
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              <div>
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-3 hover:border-[#2CFF05] cursor-pointer transition-colors bg-background/50">
                  <Upload size={18} className="text-muted-foreground mb-1" />
                  <span className="text-[11px] font-bold text-foreground">
                    {uploadingImage ? 'Uploading Image...' : 'Upload Image File'}
                  </span>
                  <span className="text-[9px] text-muted-foreground">PNG, JPG, WebP (Max 5MB)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                </label>
              </div>

              <div>
                <input
                  type="url"
                  value={currentBanner.imageUrl || ''}
                  onChange={(e) => updateCurrentBanner('imageUrl', e.target.value)}
                  placeholder="Or paste image URL here..."
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:border-[#2CFF05]"
                />
              </div>
            </div>

            {currentBanner.imageUrl && (
              <div className="relative w-28 h-20 rounded-xl overflow-hidden border border-border bg-black/40">
                <img
                  src={currentBanner.imageUrl}
                  alt="Banner preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Button Text & Link */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">
                Button Text <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={currentBanner.buttonText}
                onChange={(e) => updateCurrentBanner('buttonText', e.target.value)}
                placeholder="e.g., Order Custom Screen, Claim Offer"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-xs font-bold text-foreground focus:outline-none focus:border-[#2CFF05]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5 flex items-center justify-between">
                <span>Button Target URL <span className="text-red-400">*</span></span>
              </label>
              <input
                type="text"
                value={currentBanner.buttonHref}
                onChange={(e) => updateCurrentBanner('buttonHref', e.target.value)}
                placeholder="e.g., /contact or https://..."
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:border-[#2CFF05]"
              />
            </div>
          </div>

          {/* Quick Preset Links */}
          <div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">
              Quick Preset Links:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_LINKS.map(ql => (
                <button
                  key={ql.href}
                  type="button"
                  onClick={() => updateCurrentBanner('buttonHref', ql.href)}
                  className={`text-[10px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                    currentBanner.buttonHref === ql.href
                      ? 'border-[#2CFF05] bg-[#2CFF05]/15 text-[#2CFF05] font-bold'
                      : 'border-border bg-card/40 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {ql.label}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Side: Live Customer View Simulation (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-foreground">
              <Eye size={15} className="text-[#2CFF05]" />
              <span>Live Card Preview ({currentBanner.categoryName})</span>
            </div>

            {/* Dark / Light Toggle */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-card border border-border">
              <button
                type="button"
                onClick={() => setPreviewThemeMode('dark')}
                className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                  previewThemeMode === 'dark' ? 'bg-zinc-800 text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}
                title="Dark Mode Preview"
              >
                <Moon size={13} />
              </button>
              <button
                type="button"
                onClick={() => setPreviewThemeMode('light')}
                className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                  previewThemeMode === 'light' ? 'bg-white text-slate-900 shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}
                title="Light Mode Preview"
              >
                <Sun size={13} />
              </button>
            </div>
          </div>

          {/* Actual Card Simulation */}
          <div className={`p-6 rounded-3xl border transition-all ${
            previewThemeMode === 'dark' ? 'bg-[#080d1a] border-white/10' : 'bg-slate-100 border-slate-300'
          }`}>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3">
              Storefront Category Viewport:
            </p>

            {/* Card 3 Component Preview */}
            <div className={`rounded-2xl border p-5 sm:p-6 shadow-md flex flex-col justify-between relative overflow-hidden transition-all ${
              previewThemeMode === 'dark' 
                ? 'bg-[#0d1527] border-white/10 text-white' 
                : 'bg-white border-slate-200/90 text-slate-900'
            }`}>
              
              {/* Optional Header Image / Mockup Banner */}
              {currentBanner.imageUrl && (
                <div className="mb-4 rounded-xl overflow-hidden border border-border/50 max-h-40 bg-black/40 relative z-10">
                  <img
                    src={currentBanner.imageUrl}
                    alt={currentBanner.title}
                    className="w-full h-32 sm:h-36 object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              <div className="relative z-10">
                {/* Badge if present */}
                {currentBanner.badgeText && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider mb-2.5 border"
                    style={{
                      borderColor: `${activeThemeMeta.color}60`,
                      backgroundColor: `${activeThemeMeta.color}20`,
                      color: activeThemeMeta.color
                    }}
                  >
                    <Sparkles size={10} />
                    <span>{currentBanner.badgeText}</span>
                  </div>
                )}

                <h3 className={`font-heading font-extrabold text-base mb-2 leading-snug ${
                  previewThemeMode === 'dark' ? 'text-white' : 'text-slate-900'
                }`}>
                  {currentBanner.title || 'Untitled Offer Headline'}
                </h3>
                <p className={`text-xs leading-relaxed mb-5 ${
                  previewThemeMode === 'dark' ? 'text-zinc-400' : 'text-slate-500'
                }`}>
                  {currentBanner.desc || 'No description provided.'}
                </p>
              </div>

              <div className="relative z-10">
                <div
                  className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-full text-xs font-black transition-all shadow-md cursor-pointer"
                  style={{
                    backgroundColor: activeThemeMeta.color,
                    color: activeThemeMeta.id === 'neon-green' ? '#0a0a0a' : '#ffffff',
                    boxShadow: `0 4px 14px ${activeThemeMeta.color}40`
                  }}
                >
                  <span>{currentBanner.buttonText || 'Click Here'}</span>
                  <ArrowRight size={13} />
                </div>
              </div>

              {/* Ambient Glow */}
              <div 
                className="absolute -bottom-6 -right-6 w-28 h-28 rounded-full blur-2xl pointer-events-none opacity-40" 
                style={{ backgroundColor: activeThemeMeta.color }}
              />
            </div>

            {/* Quick Helper Note */}
            <div className="mt-4 p-3 rounded-xl bg-card/40 border border-border text-[11px] text-muted-foreground flex items-center gap-2">
              <AlertCircle size={14} className="text-[#2CFF05] shrink-0" />
              <span>
                Changes saved here reflect instantly across all visitor sessions for the <strong>{currentBanner.categoryName}</strong> category!
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
