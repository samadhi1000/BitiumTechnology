'use client';

import React, { useState, useRef } from 'react';
import { Upload, CheckCircle2, ShieldAlert, Sparkles, Loader2, FileText, Image as ImageIcon } from 'lucide-react';

export default function AdminDownloadsPage() {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [category, setCategory] = useState<string>('batik');
  const [tags, setTags] = useState<string>('');
  const [fileFormat, setFileFormat] = useState<string>('ZIP');
  const [fileSize, setFileSize] = useState<string>('');
  const [resolution, setResolution] = useState<string>('');
  
  // File upload states
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [highResFile, setHighResFile] = useState<File | null>(null);
  const [watermarkedPreviewUrl, setWatermarkedPreviewUrl] = useState<string | null>(null);
  const [generatingWatermark, setGeneratingWatermark] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Programmatic canvas-based watermarking
  const handlePreviewFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreviewFile(file);
    setGeneratingWatermark(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas bounds to match the image dimensions
        canvas.width = img.width;
        canvas.height = img.height;

        // 1. Draw original preview image
        ctx.drawImage(img, 0, 0);

        // 2. Draw protective watermarking patterns client-side
        ctx.save();
        ctx.rotate(-20 * Math.PI / 180); // Rotate 20 degrees counter-clockwise
        
        ctx.font = `bold ${Math.max(20, img.width / 22)}px Inter, sans-serif`;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
        ctx.lineWidth = 2;

        // Draw a repeating grid of watermarks
        const stepX = img.width / 2;
        const stepY = img.height / 3;

        for (let x = -img.width; x < img.width * 2; x += stepX) {
          for (let y = -img.height; y < img.height * 2; y += stepY) {
            ctx.fillText('BITIUM VAULT PREVIEW', x, y);
            ctx.strokeText('BITIUM VAULT PREVIEW', x, y);
          }
        }
        
        ctx.restore();

        // Convert the watermarked canvas output to a base64 DataURL
        const watermarkedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setWatermarkedPreviewUrl(watermarkedDataUrl);
        setGeneratingWatermark(false);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewFile || !highResFile) {
      alert('Please select both a preview image and a high-resolution file.');
      return;
    }

    setUploading(true);
    setSuccess(false);

    try {
      // Simulate API file upload delays and SQL triggers:
      // In production, we would upload to Supabase Storage:
      // const { data: pUpload } = await supabase.storage.from('public-previews').upload(...)
      // const { data: hUpload } = await supabase.storage.from('digital-artworks-secure').upload(...)
      // and insert metadata to public.digital_artworks table.
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Seeded digital artwork successfully:', {
        title,
        description,
        price: parseFloat(price),
        preview: watermarkedPreviewUrl ? 'base64_data_uri' : 'raw_file',
        file_key: `artworks/high_res/${highResFile.name}`
      });

      setSuccess(true);
      // Reset form
      setTitle('');
      setDescription('');
      setPrice('');
      setTags('');
      setFileSize('');
      setResolution('');
      setPreviewFile(null);
      setHighResFile(null);
      setWatermarkedPreviewUrl(null);
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-zinc-950 text-white selection:bg-[#116466]/40 selection:text-[#D1E8E2] pb-24">
      
      {/* Header */}
      <section className="relative py-14 border-b border-zinc-900 overflow-hidden bg-zinc-950">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-violet-600/10 border border-violet-500/20 text-[#FFCB9A] text-[10px] font-bold uppercase tracking-wider">
            Admin Console
          </span>
          <h1 className="text-2xl sm:text-4xl font-black uppercase">
            Upload & <span className="outline-text">Watermark</span> Artwork
          </h1>
          <p className="text-xs text-zinc-400 max-w-xl mx-auto">
            Configure new designs. Selected preview images automatically overlay client-side watermarks before uploading. Original raw ZIP files are stored in a locked private storage.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          
          {/* Left Form (3 Columns) */}
          <form onSubmit={handleUploadSubmit} className="md:col-span-3 space-y-5 bg-zinc-900 border border-zinc-850 p-6 rounded-3xl glass">
            
            {success && (
              <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-bold flex items-center gap-2 animate-fade-in">
                <CheckCircle2 size={16} />
                Artwork metadata uploaded & watermarked successfully!
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Artwork Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Royal Peacock Traditional Batik"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-950 text-xs text-white focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Artwork Description</label>
              <textarea
                required
                placeholder="Write a clear, detailed description explaining what elements are in this design..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-950 text-xs text-white focus:outline-none focus:border-violet-500 transition-colors resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Price (LKR / Rs.)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 1200"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-950 text-xs text-white focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-950 text-xs text-white focus:outline-none focus:border-violet-500 transition-colors"
                >
                  <option value="batik">Traditional Batik</option>
                  <option value="vector">Vector Art</option>
                  <option value="dtf">DTF Designs</option>
                  <option value="wall-art">Wall Art</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">File Format</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ZIP (SVG/PNG)"
                  value={fileFormat}
                  onChange={(e) => setFileFormat(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-950 text-xs text-white focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">File Size</label>
                <input
                  type="text"
                  placeholder="e.g. 24 MB"
                  value={fileSize}
                  onChange={(e) => setFileSize(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-950 text-xs text-white focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Resolution</label>
                <input
                  type="text"
                  placeholder="e.g. 5000x3500px"
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-950 text-xs text-white focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Tags (comma separated)</label>
              <input
                type="text"
                placeholder="peacock, traditional, vector, blue"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-950 text-xs text-white focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={uploading || generatingWatermark}
              className="w-full py-4 rounded-xl bg-[#116466] hover:bg-[#157a7c] disabled:opacity-50 text-[#D1E8E2] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-[#0d4e50] shadow-md shadow-[#116466]/10"
            >
              {uploading ? (
                <>
                  <Loader2 className="animate-spin" size={14} />
                  Uploading Assets...
                </>
              ) : (
                <>
                  <Sparkles size={14} />
                  Submit Design Package
                </>
              )}
            </button>

          </form>

          {/* Right Upload Panel (2 Columns) */}
          <div className="md:col-span-2 space-y-6">
            
            {/* File Inputs Card */}
            <div className="p-5 rounded-3xl border border-zinc-850 bg-zinc-900 glass space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider border-b border-zinc-850 pb-2">File Attachments</h3>
              
              {/* Preview Image Selector */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">1. Preview Thumbnail Image</label>
                <label className="flex flex-col items-center justify-center p-4 border border-dashed border-zinc-800 hover:border-violet-500/50 rounded-xl cursor-pointer hover:bg-zinc-950/40 transition-colors">
                  <ImageIcon className="text-zinc-500 mb-1" size={20} />
                  <span className="text-[11px] font-semibold text-zinc-400">
                    {previewFile ? previewFile.name : 'Select JPG/PNG Preview'}
                  </span>
                  <input type="file" accept="image/*" className="hidden" onChange={handlePreviewFileChange} />
                </label>
              </div>

              {/* High-Res File Package Selector */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">2. High-Resolution File (ZIP/Vector)</label>
                <label className="flex flex-col items-center justify-center p-4 border border-dashed border-zinc-800 hover:border-violet-500/50 rounded-xl cursor-pointer hover:bg-zinc-950/40 transition-colors">
                  <FileText className="text-zinc-500 mb-1" size={20} />
                  <span className="text-[11px] font-semibold text-zinc-400">
                    {highResFile ? highResFile.name : 'Select original ZIP package'}
                  </span>
                  <input type="file" className="hidden" onChange={(e) => setHighResFile(e.target.files?.[0] || null)} />
                </label>
              </div>
            </div>

            {/* Live Watermarked Preview render box */}
            <div className="p-5 rounded-3xl border border-zinc-850 bg-zinc-900 glass space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider border-b border-zinc-850 pb-2 flex items-center gap-1.5">
                <ShieldAlert size={14} className="text-[#FFCB9A]" />
                Watermark Output
              </h3>
              
              <div className="aspect-[4/3] rounded-2xl border border-zinc-850 bg-zinc-950 flex items-center justify-center relative overflow-hidden select-none">
                {generatingWatermark ? (
                  <Loader2 className="animate-spin text-[#116466]" size={24} />
                ) : watermarkedPreviewUrl ? (
                  <img src={watermarkedPreviewUrl} alt="Watermark Render" className="object-cover w-full h-full" />
                ) : (
                  <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest text-center px-4">
                    Rendered preview outputs will appear here.
                  </span>
                )}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Hidden canvas element for image rendering */}
      <canvas ref={canvasRef} className="hidden" />

    </div>
  );
}
