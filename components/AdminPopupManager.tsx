'use client';

import React, { useState, useEffect } from 'react';
import {
  OfferPopupConfig,
  DEFAULT_OFFER_POPUP,
  fetchOfferPopupConfig,
  saveOfferPopupConfig,
} from '@/lib/promo-popup';
import OfferPopupBanner from '@/components/OfferPopupBanner';
import { supabase } from '@/lib/supabase';
import {
  Sparkles,
  Eye,
  Save,
  CheckCircle2,
  AlertCircle,
  Clock,
  Upload,
  Image as ImageIcon,
  Link as LinkIcon,
  Tag,
  Layers,
  Plus,
  Trash2,
  RefreshCw,
  Zap,
} from 'lucide-react';

export default function AdminPopupManager() {
  const [config, setConfig] = useState<OfferPopupConfig>(DEFAULT_OFFER_POPUP);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  // Live Preview Modal State
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Feature tag input state
  const [newFeatureInput, setNewFeatureInput] = useState('');

  // Image Upload state
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    setLoading(true);
    try {
      const data = await fetchOfferPopupConfig();
      setConfig(data);
    } catch (err) {
      console.error('Failed to load popup config:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const ok = await saveOfferPopupConfig(config);
      if (ok) {
        setSuccessMsg('🎉 Offer Popup settings saved and updated live across the site!');
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        setErrorMsg('Saved locally, but failed to sync to server database. Please check Supabase schema.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save popup settings');
    } finally {
      setSaving(false);
    }
  };

  const handleAddFeature = () => {
    if (!newFeatureInput.trim()) return;
    const current = config.features || [];
    setConfig({
      ...config,
      features: [...current, newFeatureInput.trim()],
    });
    setNewFeatureInput('');
  };

  const handleRemoveFeature = (index: number) => {
    const current = [...(config.features || [])];
    current.splice(index, 1);
    setConfig({ ...config, features: current });
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setErrorMsg('');

    try {
      const fileExt = file.name.split('.').pop() || 'jpg';
      const fileName = `promo_${Date.now()}.${fileExt}`;
      const filePath = `promos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('public-previews')
        .upload(filePath, file, { cacheControl: '3600', upsert: true });

      if (!uploadError) {
        const { data } = supabase.storage.from('public-previews').getPublicUrl(filePath);
        if (data?.publicUrl) {
          setConfig(prev => ({ ...prev, image_url: data.publicUrl }));
          setSuccessMsg('Banner image uploaded successfully!');
          setTimeout(() => setSuccessMsg(''), 3000);
          return;
        }
      }

      // Convert to Base64 data URI fallback
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const base64 = uploadEvent.target?.result as string;
        if (base64) {
          setConfig(prev => ({ ...prev, image_url: base64 }));
          setSuccessMsg('Banner image loaded successfully!');
          setTimeout(() => setSuccessMsg(''), 3000);
        }
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setErrorMsg('Image upload failed: ' + (err.message || 'Unknown error'));
    } finally {
      setUploadingImage(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-16">
        <RefreshCw size={28} className="animate-spin text-[#2CFF05]" />
        <span className="ml-3 text-sm text-zinc-400 font-bold">Loading Popup Settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-emerald-500/10 via-zinc-900 to-black border border-emerald-500/25 rounded-3xl p-6 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#2CFF05]/20 border border-[#2CFF05]/40 flex items-center justify-center text-[#2CFF05] shadow-lg shadow-[#2CFF05]/10">
            <Sparkles size={28} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading font-black text-xl sm:text-2xl text-white tracking-wide">
                Special Offers & Seasonal Popup Banner
              </h2>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  config.is_active
                    ? 'bg-[#2CFF05]/20 text-[#2CFF05] border border-[#2CFF05]/40'
                    : 'bg-zinc-800 text-zinc-400 border border-white/10'
                }`}
              >
                {config.is_active ? '● LIVE ON SITE' : '○ DISABLED'}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1 max-w-xl">
              Design and publish high-converting greeting popups with special seasonal discounts, promo codes, and direct call-to-actions for incoming site visitors.
            </p>
          </div>
        </div>

        {/* Live Preview Button */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-white/15 text-white font-heading font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all hover:border-[#2CFF05] hover:text-[#2CFF05] cursor-pointer shadow-sm"
          >
            <Eye size={15} />
            <span>Preview Live Popup</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-[#2CFF05]/10 border border-[#2CFF05]/40 text-[#2CFF05] text-xs font-bold flex items-center gap-2.5 shadow-md">
          <CheckCircle2 size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold flex items-center gap-2.5 shadow-md">
          <AlertCircle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Configuration Form */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Core Campaign Settings (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Main Content Box */}
          <div className="bg-card border border-border rounded-3xl p-6 space-y-5 shadow-sm">
            <h3 className="font-heading font-black text-sm uppercase tracking-wider text-foreground flex items-center gap-2 pb-3 border-b border-border">
              <Tag size={16} className="text-[#2CFF05]" />
              Campaign & Headline Content
            </h3>

            {/* Live Enable Switch */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/40 border border-border">
              <div>
                <span className="font-bold text-sm text-foreground block">
                  Enable Popup on Website
                </span>
                <span className="text-xs text-muted-foreground">
                  When enabled, visitors entering the site will see this popup banner.
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.is_active}
                  onChange={(e) => setConfig({ ...config, is_active: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-12 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2CFF05]"></div>
              </label>
            </div>

            {/* Campaign Name & Badge */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                  Internal Campaign Title
                </label>
                <input
                  type="text"
                  value={config.campaign_name}
                  onChange={(e) => setConfig({ ...config, campaign_name: e.target.value })}
                  placeholder="e.g. Seasonal Mega Offer 2026"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm text-slate-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-[#2CFF05] dark:focus:border-[#2CFF05]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                  Top Badge Text
                </label>
                <input
                  type="text"
                  value={config.badge_text}
                  onChange={(e) => setConfig({ ...config, badge_text: e.target.value })}
                  placeholder="e.g. 🔥 SPECIAL SEASONAL OFFER"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm text-slate-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-[#2CFF05] dark:focus:border-[#2CFF05]"
                  required
                />
              </div>
            </div>

            {/* Headline (Discount) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                Main Headline / Discount Title
              </label>
              <input
                type="text"
                value={config.headline}
                onChange={(e) => setConfig({ ...config, headline: e.target.value })}
                placeholder="e.g. UP TO 40% OFF"
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-base font-black text-slate-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-[#2CFF05] dark:focus:border-[#2CFF05]"
                required
              />
            </div>

            {/* Subheadline description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                Subheadline / Description Message
              </label>
              <textarea
                value={config.subheadline}
                onChange={(e) => setConfig({ ...config, subheadline: e.target.value })}
                rows={3}
                placeholder="Short, attractive description highlighting the promotion..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs text-slate-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-[#2CFF05] dark:focus:border-[#2CFF05] resize-none"
              />
            </div>

            {/* Promo Voucher Code */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                Promo / Voucher Code (Optional)
              </label>
              <input
                type="text"
                value={config.promo_code}
                onChange={(e) => setConfig({ ...config, promo_code: e.target.value.toUpperCase() })}
                placeholder="e.g. BITIUM40"
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border font-mono font-black text-sm text-[#2CFF05] dark:text-[#2CFF05] placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-[#2CFF05]"
              />
              <span className="text-[11px] text-muted-foreground dark:text-zinc-400 mt-1 block">
                Customers can click 1 button on the popup to automatically copy this coupon code.
              </span>
            </div>

            {/* Trust Badges / Feature Chips */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-2">
                Highlight Features / Trust Badges
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {(config.features || []).map((feat, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-muted border border-border text-xs font-bold text-slate-900 dark:text-white"
                  >
                    <span>{feat}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(idx)}
                      className="text-muted-foreground hover:text-red-400 p-0.5 rounded-full"
                    >
                      <Trash2 size={12} />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newFeatureInput}
                  onChange={(e) => setNewFeatureInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddFeature();
                    }
                  }}
                  placeholder="e.g. ⚡ 24H Express Dispatch"
                  className="flex-grow px-3.5 py-2 rounded-xl bg-background border border-border text-xs text-slate-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-[#2CFF05]"
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="px-3 py-2 rounded-xl bg-muted hover:bg-muted/80 border border-border text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={14} />
                  <span>Add Badge</span>
                </button>
              </div>
            </div>

          </div>

          {/* Call-to-Action & Timing Box */}
          <div className="bg-card border border-border rounded-3xl p-6 space-y-5 shadow-sm">
            <h3 className="font-heading font-black text-sm uppercase tracking-wider text-foreground flex items-center gap-2 pb-3 border-b border-border">
              <LinkIcon size={16} className="text-[#2CFF05]" />
              Call to Action & Destination
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                  Button Text (CTA)
                </label>
                <input
                  type="text"
                  value={config.cta_text}
                  onChange={(e) => setConfig({ ...config, cta_text: e.target.value })}
                  placeholder="e.g. Claim Offer & Shop Now"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm font-bold text-slate-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-[#2CFF05]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                  Target Destination URL
                </label>
                <input
                  type="text"
                  value={config.cta_link}
                  onChange={(e) => setConfig({ ...config, cta_link: e.target.value })}
                  placeholder="e.g. /gang-sheet or /screen-exposed"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm font-mono text-slate-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-[#2CFF05]"
                  required
                />
              </div>
            </div>

            {/* Quick Link presets */}
            <div className="flex flex-wrap gap-1.5 items-center">
              <span className="text-[11px] text-muted-foreground dark:text-zinc-400 mr-1">Presets:</span>
              {[
                { label: 'DTF Gang Sheet', url: '/gang-sheet' },
                { label: 'Screen Printing', url: '/screen-exposed' },
                { label: 'Batik Stamp', url: '/batik-stamp' },
                { label: 'Artwork Catalog', url: '/artwork' },
                { label: 'Hand Painting', url: '/stencil' },
              ].map((preset) => (
                <button
                  key={preset.url}
                  type="button"
                  onClick={() => setConfig({ ...config, cta_link: preset.url })}
                  className="text-[10px] font-bold px-2 py-1 rounded bg-muted/60 hover:bg-muted border border-border text-slate-800 dark:text-white transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Countdown timer expiry */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                Countdown Timer End Date/Time (Optional)
              </label>
              <input
                type="datetime-local"
                value={config.countdown_end ? config.countdown_end.slice(0, 16) : ''}
                onChange={(e) => setConfig({ ...config, countdown_end: e.target.value ? new Date(e.target.value).toISOString() : '' })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs text-slate-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-[#2CFF05]"
              />
              <span className="text-[11px] text-muted-foreground dark:text-zinc-400 mt-1 block">
                If specified, an animated countdown timer (e.g. "Offer Ends in: 05:22:18") will appear on the popup.
              </span>
            </div>

          </div>

        </div>

        {/* Right Column: Visual Media & Display Behavior (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Visual Banner Media Box */}
          <div className="bg-card border border-border rounded-3xl p-6 space-y-4 shadow-sm">
            <h3 className="font-heading font-black text-sm uppercase tracking-wider text-foreground flex items-center gap-2 pb-3 border-b border-border">
              <ImageIcon size={16} className="text-[#2CFF05]" />
              Promotional Banner Artwork
            </h3>

            {/* Preview Box */}
            <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden border border-border bg-zinc-950 flex items-center justify-center group">
              {config.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={config.image_url}
                  alt="Banner preview"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              ) : (
                <div className="text-center p-4">
                  <ImageIcon size={32} className="mx-auto text-zinc-600 mb-2" />
                  <span className="text-xs text-zinc-500 font-bold">No Image Selected</span>
                </div>
              )}
            </div>

            {/* Direct URL Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                Image Public URL
              </label>
              <input
                type="url"
                value={config.image_url}
                onChange={(e) => setConfig({ ...config, image_url: e.target.value })}
                placeholder="https://..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs font-mono text-slate-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-[#2CFF05]"
              />
            </div>

            {/* Or Upload file */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                Or Upload New Banner Artwork
              </label>
              <label className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-dashed border-border bg-muted/30 hover:bg-muted/60 text-xs font-bold text-slate-800 dark:text-white cursor-pointer transition-colors">
                <Upload size={14} className="text-[#2CFF05]" />
                <span>{uploadingImage ? 'Uploading image...' : 'Choose Image File (JPG / PNG / WEBP)'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  disabled={uploadingImage}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Display Behavior / Timing Box */}
          <div className="bg-card border border-border rounded-3xl p-6 space-y-4 shadow-sm">
            <h3 className="font-heading font-black text-sm uppercase tracking-wider text-foreground flex items-center gap-2 pb-3 border-b border-border">
              <Clock size={16} className="text-[#2CFF05]" />
              Display Behavior & Frequency
            </h3>

            {/* Frequency options */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-2">
                Display Frequency
              </label>
              <div className="space-y-2">
                {[
                  {
                    id: 'once_per_session',
                    title: 'Once Per Browser Session (Recommended)',
                    desc: 'Shows once when the user opens the website. Does not re-appear on every page reload.',
                  },
                  {
                    id: 'once_per_day',
                    title: 'Once Per Day',
                    desc: 'Shows at most once every 24 hours per visitor.',
                  },
                  {
                    id: 'always',
                    title: 'Every Visit (Testing Mode)',
                    desc: 'Always pops up whenever the site is opened.',
                  },
                ].map((freq) => (
                  <label
                    key={freq.id}
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      config.show_frequency === freq.id
                        ? 'bg-[#2CFF05]/10 border-[#2CFF05]/50'
                        : 'bg-muted/20 border-border hover:bg-muted/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name="frequency"
                      checked={config.show_frequency === freq.id}
                      onChange={() => setConfig({ ...config, show_frequency: freq.id as any })}
                      className="mt-0.5 text-[#2CFF05] focus:ring-[#2CFF05]"
                    />
                    <div>
                      <span className="font-bold text-xs text-slate-900 dark:text-white block">{freq.title}</span>
                      <span className="text-[11px] text-muted-foreground dark:text-zinc-400 block leading-tight mt-0.5">{freq.desc}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Entrance delay */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider">
                  Entrance Delay
                </label>
                <span className="text-xs font-mono font-bold text-[#2CFF05]">
                  {config.show_delay_seconds || 1.2} seconds
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="10"
                step="0.5"
                value={config.show_delay_seconds || 1.2}
                onChange={(e) => setConfig({ ...config, show_delay_seconds: parseFloat(e.target.value) })}
                className="w-full accent-[#2CFF05]"
              />
              <span className="text-[10px] text-muted-foreground">
                Smooth delay after page load before the banner springs into view.
              </span>
            </div>
          </div>

          {/* Action Save Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="w-full py-4 px-6 rounded-2xl bg-[#2CFF05] hover:bg-[#3af816] text-[#0a0a0a] font-heading font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(44,255,5,0.35)] hover:shadow-[0_0_35px_rgba(44,255,5,0.5)] transition-all cursor-pointer disabled:opacity-50"
            >
              <Save size={18} />
              <span>{saving ? 'Saving Live Settings...' : 'Save & Publish Live Popup'}</span>
            </button>
          </div>

        </div>

      </form>

      {/* Live Preview Modal */}
      {isPreviewOpen && (
        <OfferPopupBanner
          forcePreview={true}
          previewConfig={config}
          onClosePreview={() => setIsPreviewOpen(false)}
        />
      )}
    </div>
  );
}
