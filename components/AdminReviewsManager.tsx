'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  CustomerFeedbackItem, 
  defaultCustomerFeedbacks, 
  fetchCustomerFeedbacks, 
  saveCustomerFeedbacks 
} from '@/lib/data/customerFeedbacks';
import { supabase } from '@/lib/supabase';
import CustomerReviewsCarousel from '@/components/CustomerReviewsCarousel';
import { 
  Star, 
  Plus, 
  Edit, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Save, 
  Eye, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Image as ImageIcon, 
  Upload, 
  X, 
  Sparkles,
  MessageSquareHeart,
  Tag
} from 'lucide-react';

const PRESET_IMAGES = [
  { label: 'DTF Apparel Studio', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Laser Cut Mural Art', url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Screen Printing Press', url: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Batik Silk & Craft', url: 'https://images.unsplash.com/photo-1606159068539-43f36b99d1b2?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Streetwear Merch Workshop', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Creative Designer Desk', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80' },
];

const PRESET_COLORS = [
  '#22c55e', // Green
  '#8b5cf6', // Violet
  '#0284c7', // Blue
  '#ec4899', // Pink
  '#f59e0b', // Amber / Gold
  '#06b6d4', // Cyan
  '#e11d48', // Red
  '#64748b', // Slate
];

export default function AdminReviewsManager() {
  const [feedbacks, setFeedbacks] = useState<CustomerFeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Edit / Create Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CustomerFeedbackItem | null>(null);
  const [isNew, setIsNew] = useState(false);

  // Live Preview Modal State
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Image Uploading State
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const loadFeedbacks = async () => {
    setLoading(true);
    try {
      const data = await fetchCustomerFeedbacks();
      setFeedbacks(data);
    } catch (err) {
      console.error('Failed to load feedbacks:', err);
      setFeedbacks(defaultCustomerFeedbacks);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToDatabase = async () => {
    setSaving(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const ok = await saveCustomerFeedbacks(feedbacks);
      if (ok) {
        setSuccessMsg('🎉 Customer Reviews saved and published live to the homepage!');
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        setSuccessMsg('Saved locally to browser cache and fallback storage.');
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save customer reviews.');
    } finally {
      setSaving(false);
    }
  };

  const handleOpenNew = () => {
    if (feedbacks.length >= 10) {
      alert('Maximum limit reached! You can only add up to 10 customer review cards.');
      return;
    }
    setEditingItem({
      id: `review-${Date.now()}`,
      name: '',
      nameSi: '',
      role: '',
      roleSi: '',
      rating: 5,
      text: '',
      textSi: '',
      avatar: 'CU',
      avatarBg: '#22c55e',
      image: PRESET_IMAGES[0].url,
      categoryTag: 'DTF Printing',
    });
    setIsNew(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: CustomerFeedbackItem) => {
    setEditingItem({ ...item });
    setIsNew(false);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this customer review card?')) {
      const updated = feedbacks.filter((f) => f.id !== id);
      setFeedbacks(updated);
    }
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= feedbacks.length) return;

    const copy = [...feedbacks];
    const [moved] = copy.splice(index, 1);
    copy.splice(targetIndex, 0, moved);
    setFeedbacks(copy);
  };

  const handleModalSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    if (!editingItem.name.trim() || !editingItem.text.trim()) {
      alert('Please provide customer name and feedback quote text.');
      return;
    }

    if (isNew && feedbacks.length >= 10) {
      alert('Maximum limit reached! You can only add up to 10 customer review cards.');
      return;
    }

    // Auto-generate avatar initials if empty
    let avatar = editingItem.avatar.trim();
    if (!avatar && editingItem.name) {
      avatar = editingItem.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
    }

    const finalizedItem: CustomerFeedbackItem = {
      ...editingItem,
      avatar: avatar || 'CU',
    };

    if (isNew) {
      setFeedbacks([...feedbacks, finalizedItem]);
    } else {
      setFeedbacks(feedbacks.map((f) => (f.id === finalizedItem.id ? finalizedItem : f)));
    }

    setIsModalOpen(false);
    setEditingItem(null);
  };

  // Image upload handler
  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingItem) return;

    setUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop() || 'jpg';
      const fileName = `review-${Date.now()}.${fileExt}`;
      const filePath = `reviews/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file, { cacheControl: '3600', upsert: true });

      if (uploadError) {
        // Fallback: Read as base64 Data URL for zero-dependency instant use
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result && editingItem) {
            setEditingItem({ ...editingItem, image: event.target.result as string });
          }
        };
        reader.readAsDataURL(file);
      } else {
        const { data } = supabase.storage.from('products').getPublicUrl(filePath);
        if (data?.publicUrl) {
          setEditingItem({ ...editingItem, image: data.publicUrl });
        }
      }
    } catch (err) {
      console.warn('Image upload error:', err);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleResetDefaults = () => {
    if (confirm('Reset customer reviews to original default showcase?')) {
      setFeedbacks(defaultCustomerFeedbacks);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="p-6 rounded-2xl border border-border bg-card/20 backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-[#2CFF05]/10 border border-[#2CFF05]/20 rounded-full px-3 py-1 mb-2">
            <MessageSquareHeart size={13} className="text-[#2CFF05]" />
            <span className="text-[11px] font-bold text-[#2CFF05] uppercase tracking-wider">
              Reviews &amp; Feedbacks Controller ({feedbacks.length}/10 Cards)
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-heading text-foreground tracking-tight">
            Customer Feedback Carousel Manager
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Add, edit, reorder, or customize customer reviews (Maximum 10 cards allowed).
          </p>
        </div>

        {/* Top Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsPreviewOpen(true)}
            className="px-4 py-2 rounded-xl border border-border bg-card hover:bg-card/80 text-foreground text-xs font-bold flex items-center gap-2 transition-all hover:scale-105 cursor-pointer"
          >
            <Eye size={14} className="text-[#2CFF05]" />
            Live Preview
          </button>

          <button
            onClick={handleOpenNew}
            disabled={feedbacks.length >= 10}
            title={feedbacks.length >= 10 ? 'Maximum 10 review cards limit reached' : 'Add new customer review card'}
            className={`px-4 py-2 rounded-xl bg-card border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              feedbacks.length >= 10
                ? 'border-zinc-700 text-zinc-500 opacity-50 cursor-not-allowed bg-transparent'
                : 'border-[#2CFF05]/40 text-[#2CFF05] hover:bg-[#2CFF05]/10 hover:scale-105'
            }`}
          >
            <Plus size={14} />
            Add Review ({feedbacks.length}/10)
          </button>

          <button
            onClick={handleSaveToDatabase}
            disabled={saving}
            className="px-5 py-2 rounded-xl bg-[#2CFF05] text-[#0a0a0a] text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#2CFF05]/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
          >
            {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
            {saving ? 'Publishing...' : 'Save & Publish'}
          </button>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-[#2CFF05]/10 border border-[#2CFF05]/30 text-[#2CFF05] text-xs flex items-center gap-2.5 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 size={16} className="shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2.5">
          <AlertCircle size={16} className="shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Reviews Cards List Grid */}
      {loading ? (
        <div className="p-16 text-center text-muted-foreground flex flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-card/10">
          <RefreshCw size={24} className="animate-spin text-[#2CFF05]" />
          <p className="text-xs">Fetching customer reviews...</p>
        </div>
      ) : feedbacks.length === 0 ? (
        <div className="p-16 text-center text-muted-foreground space-y-3 rounded-2xl border border-border bg-card/10">
          <MessageSquareHeart size={36} className="mx-auto text-muted-foreground" />
          <p className="text-sm font-bold text-foreground">No customer reviews configured yet</p>
          <button
            onClick={handleOpenNew}
            className="px-4 py-2 rounded-xl bg-[#2CFF05] text-[#0a0a0a] text-xs font-bold inline-flex items-center gap-2"
          >
            <Plus size={14} /> Create First Review
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {feedbacks.map((item, index) => (
            <div
              key={item.id}
              className="relative rounded-2xl border border-border bg-card/30 overflow-hidden flex flex-col justify-between group shadow-sm hover:border-[#2CFF05]/40 transition-all duration-300"
            >
              {/* Card Thumbnail & Rating Preview */}
              <div className="relative h-44 w-full bg-zinc-900 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="400px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30" />

                {/* Tag & Order Badge */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold text-zinc-300">
                    Card #{index + 1}
                  </span>
                  {item.categoryTag && (
                    <span className="px-2.5 py-0.5 rounded-full bg-[#2CFF05]/20 border border-[#2CFF05]/30 text-[10px] font-extrabold text-[#2CFF05]">
                      {item.categoryTag}
                    </span>
                  )}
                </div>

                {/* Stars Preview */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star
                      key={s}
                      size={13}
                      className={s < item.rating ? 'fill-amber-400 text-amber-400' : 'fill-transparent text-zinc-600'}
                    />
                  ))}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                {/* Quote Text */}
                <p className="text-xs text-foreground/90 italic leading-relaxed line-clamp-3">
                  {item.text}
                </p>

                {/* Customer Profile Row */}
                <div className="flex items-center gap-3 pt-3 border-t border-border/60">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center font-heading font-extrabold text-xs text-white shrink-0 shadow-sm"
                    style={{ backgroundColor: item.avatarBg || '#22c55e' }}
                  >
                    {item.avatar}
                  </div>
                  <div className="overflow-hidden flex-1">
                    <div className="font-heading font-bold text-xs text-foreground truncate">
                      {item.name}
                    </div>
                    <div className="text-[11px] text-muted-foreground truncate">
                      {item.role}
                    </div>
                  </div>
                </div>

                {/* Actions Toolbar */}
                <div className="flex items-center justify-between pt-2 border-t border-border/40 text-xs">
                  {/* Reorder Buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleMove(index, 'up')}
                      disabled={index === 0}
                      title="Move card left/up"
                      className="p-1.5 rounded-lg hover:bg-card border border-border/60 text-muted-foreground hover:text-foreground disabled:opacity-20 cursor-pointer"
                    >
                      <ArrowUp size={13} />
                    </button>
                    <button
                      onClick={() => handleMove(index, 'down')}
                      disabled={index === feedbacks.length - 1}
                      title="Move card right/down"
                      className="p-1.5 rounded-lg hover:bg-card border border-border/60 text-muted-foreground hover:text-foreground disabled:opacity-20 cursor-pointer"
                    >
                      <ArrowDown size={13} />
                    </button>
                  </div>

                  {/* Edit & Delete Buttons */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="px-2.5 py-1.5 rounded-lg bg-card hover:bg-[#2CFF05]/10 border border-border hover:border-[#2CFF05]/40 text-foreground hover:text-[#2CFF05] text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Edit size={12} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 rounded-lg hover:bg-red-500/10 border border-border/60 hover:border-red-500/40 text-muted-foreground hover:text-red-400 transition-colors cursor-pointer"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer Reset Tool */}
      <div className="pt-4 flex justify-between items-center text-xs text-muted-foreground">
        <span>Total Showcase Reviews: {feedbacks.length} cards</span>
        <button
          onClick={handleResetDefaults}
          className="text-muted-foreground hover:text-red-400 underline transition-colors cursor-pointer"
        >
          Reset to Factory Defaults
        </button>
      </div>

      {/* ─── ADD / EDIT REVIEW MODAL ────────────────────────────────────────── */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-zinc-950 border border-white/15 rounded-2xl p-6 shadow-2xl text-white my-8 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#2CFF05]/15 border border-[#2CFF05]/30 flex items-center justify-center text-[#2CFF05]">
                  <Sparkles size={16} />
                </div>
                <h3 className="font-heading font-black text-lg text-white">
                  {isNew ? 'Create New Customer Review' : 'Edit Customer Review'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleModalSave} className="space-y-4">
              {/* Row 1: Name (EN & SI) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                    Customer Name (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.name}
                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                    placeholder="e.g. Kavinda P."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-xs text-white focus:outline-none focus:border-[#2CFF05]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                    Customer Name (Sinhala)
                  </label>
                  <input
                    type="text"
                    value={editingItem.nameSi || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, nameSi: e.target.value })}
                    placeholder="e.g. කවින්ද පී."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-xs text-white focus:outline-none focus:border-[#2CFF05]"
                  />
                </div>
              </div>

              {/* Row 2: Role (EN & SI) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                    Role / Business (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.role}
                    onChange={(e) => setEditingItem({ ...editingItem, role: e.target.value })}
                    placeholder="e.g. Apparel Brand Owner"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-xs text-white focus:outline-none focus:border-[#2CFF05]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                    Role / Business (Sinhala)
                  </label>
                  <input
                    type="text"
                    value={editingItem.roleSi || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, roleSi: e.target.value })}
                    placeholder="e.g. ඇඟලුම් සන්නාම හිමිකරු"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-xs text-white focus:outline-none focus:border-[#2CFF05]"
                  />
                </div>
              </div>

              {/* Row 3: Rating, Avatar Initials, Avatar Color & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {/* Rating Selector */}
                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                    Star Rating ({editingItem.rating} ★)
                  </label>
                  <div className="flex items-center gap-1.5 py-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setEditingItem({ ...editingItem, rating: star })}
                        className="cursor-pointer hover:scale-125 transition-transform"
                      >
                        <Star
                          size={18}
                          className={star <= editingItem.rating ? 'fill-amber-400 text-amber-400' : 'fill-transparent text-zinc-600'}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Avatar Initials */}
                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                    Initials (Avatar)
                  </label>
                  <input
                    type="text"
                    maxLength={3}
                    value={editingItem.avatar}
                    onChange={(e) => setEditingItem({ ...editingItem, avatar: e.target.value.toUpperCase() })}
                    placeholder="KP"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-xs text-white uppercase focus:outline-none focus:border-[#2CFF05]"
                  />
                </div>

                {/* Avatar Color */}
                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                    Avatar Color
                  </label>
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    {PRESET_COLORS.map((color) => (
                      <button
                        type="button"
                        key={color}
                        onClick={() => setEditingItem({ ...editingItem, avatarBg: color })}
                        className={`w-6 h-6 rounded-full transition-transform cursor-pointer ${
                          editingItem.avatarBg === color ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                {/* Category Tag */}
                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                    Category Tag
                  </label>
                  <input
                    type="text"
                    value={editingItem.categoryTag || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, categoryTag: e.target.value })}
                    placeholder="DTF Printing"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-xs text-white focus:outline-none focus:border-[#2CFF05]"
                  />
                </div>
              </div>

              {/* Row 4: Background Image Selection & Upload */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider">
                  Background Image URL / Preset / Upload
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    value={editingItem.image}
                    onChange={(e) => setEditingItem({ ...editingItem, image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-xs text-white focus:outline-none focus:border-[#2CFF05]"
                  />
                  <label className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold flex items-center gap-2 shrink-0 cursor-pointer border border-white/15">
                    <Upload size={14} />
                    <span>{uploadingImage ? 'Uploading...' : 'Upload'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Quick Presets */}
                <div className="flex items-center gap-2 flex-wrap pt-1">
                  <span className="text-[11px] text-zinc-400 font-medium">Quick Presets:</span>
                  {PRESET_IMAGES.map((preset) => (
                    <button
                      type="button"
                      key={preset.label}
                      onClick={() => setEditingItem({ ...editingItem, image: preset.url })}
                      className="text-[10px] px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-zinc-300 hover:text-white cursor-pointer"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Row 5: Review Quote (EN) */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                  Testimonial Quote (English) *
                </label>
                <textarea
                  required
                  rows={3}
                  value={editingItem.text}
                  onChange={(e) => setEditingItem({ ...editingItem, text: e.target.value })}
                  placeholder='"Bitium Technology provided the cleanest DTF prints I have ever seen. The colors popped instantly."'
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-xs text-white focus:outline-none focus:border-[#2CFF05]"
                />
              </div>

              {/* Row 6: Review Quote (SI) */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                  Testimonial Quote (Sinhala)
                </label>
                <textarea
                  rows={2}
                  value={editingItem.textSi || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, textSi: e.target.value })}
                  placeholder='"Bitium Technology වෙතින් ලැබුණු DTF මුද්‍රණ අතිශය පැහැදිලි සහ උසස් තත්ත්වයෙන් යුක්තයි."'
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-xs text-white focus:outline-none focus:border-[#2CFF05]"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-white/15 hover:bg-white/5 text-xs font-bold text-zinc-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#2CFF05] text-[#0a0a0a] text-xs font-black uppercase tracking-wider shadow-lg shadow-[#2CFF05]/20 hover:scale-105 transition-transform cursor-pointer"
                >
                  {isNew ? 'Add Card to List' : 'Apply Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── LIVE CAROUSEL PREVIEW MODAL ────────────────────────────────────── */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-6xl bg-zinc-950 border border-white/20 rounded-3xl overflow-hidden shadow-2xl my-6">
            <div className="p-4 sm:p-5 bg-zinc-900/90 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye size={16} className="text-[#2CFF05]" />
                <span className="font-heading font-black text-sm text-white uppercase tracking-wider">
                  Live Customer Reviews Carousel Preview
                </span>
              </div>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold cursor-pointer"
              >
                Close Preview
              </button>
            </div>
            <div className="p-2 sm:p-6 bg-[#090d16]">
              <CustomerReviewsCarousel feedbacks={feedbacks} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
