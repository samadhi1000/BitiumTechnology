'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { 
  getProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  Product,
  SizeVariantInput
} from '@/lib/products';
import { 
  getDigitalArtworks, 
  createDigitalArtwork, 
  updateDigitalArtwork, 
  deleteDigitalArtwork, 
  DigitalArtwork 
} from '@/lib/digital';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  RefreshCw, 
  Package, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  X, 
  Lock, 
  Key, 
  LogOut, 
  Folder, 
  Sparkles, 
  Upload, 
  Mail, 
  Printer, 
  FileText,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Image from 'next/image';
import { sanitizeText } from '@/lib/security/sanitize';
import AdminBatchPrint from '@/components/AdminBatchPrint';
import OrderFormComponent from '@/components/OrderFormComponent';
import POSInvoiceGenerator from '@/components/POSInvoiceGenerator';

// ─── Size presets per category ─────────────────────────────────────────────
const CATEGORY_SIZES: Record<string, string[]> = {
  'stencil':        ['A4', 'A3', 'A2', 'A1'],
  'screen-printing':['A4', 'A3', 'A2', 'A1'],
  'dtf_sheet':      ['A6', 'A5', 'A4', 'A3', 'A2', 'A1', 'Meters'],
  'batik-stamp':    [],
  'materials':      [],
  'laser-cutting':  [],
};

// Price scaling per size index (multiplier over base price)
const SIZE_PRICE_MULTIPLIERS: Record<string, number[]> = {
  'stencil':        [1.0, 1.7, 2.8, 4.2],
  'screen-printing':[1.0, 1.7, 2.8, 4.2],
  'dtf_sheet':      [0.5, 0.7, 1.0, 1.7, 2.8, 4.2, 1.2],
};

function getDefaultSizeVariants(category: string, basePrice: number): SizeVariantInput[] {
  const sizes = CATEGORY_SIZES[category] ?? [];
  const mults = SIZE_PRICE_MULTIPLIERS[category] ?? [];
  return sizes.map((size, i) => ({
    size,
    price: Math.round((basePrice || 500) * (mults[i] ?? 1.0)),
    stock: 100,
  }));
}

export default function AdminPanelPage() {
  const { user, profile, loading: authLoading, signOut } = useAuth();
  
  // Tab states: 'products' | 'digital' | 'batch-print' | 'order-form' | 'pos-invoice'
  const [activeTab, setActiveTab] = useState<'products' | 'digital' | 'batch-print' | 'order-form' | 'pos-invoice'>('products');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [digitalArtworks, setDigitalArtworks] = useState<DigitalArtwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  
  // Authentication Form States
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginSubmitting, setLoginSubmitting] = useState(false);

  // Modal states for physical products
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Physical Product Form states
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState<'stencil' | 'screen-printing' | 'dtf_sheet' | 'batik-stamp' | 'materials' | 'laser-cutting'>('dtf_sheet');
  const [prodSubCategory, setProdSubCategory] = useState('');
  const [prodDescription, setProdDescription] = useState('');
  const [prodPrice, setProdPrice] = useState(0);
  const [prodOriginalPrice, setProdOriginalPrice] = useState<number | undefined>(undefined);
  const [prodImageUrl, setProdImageUrl] = useState('');
  const [prodSizeVariants, setProdSizeVariants] = useState<SizeVariantInput[]>([]);
  const [prodIsActive, setProdIsActive] = useState(true);
  const [prodImageFile, setProdImageFile] = useState<File | null>(null);
  
  // Modal states for digital artworks
  const [isDigitalModalOpen, setIsDigitalModalOpen] = useState(false);
  const [editingDigital, setEditingDigital] = useState<DigitalArtwork | null>(null);

  // Digital Artwork Form states
  const [digTitle, setDigTitle] = useState('');
  const [digDescription, setDigDescription] = useState('');
  const [digPrice, setDigPrice] = useState(0);
  const [digCategory, setDigCategory] = useState<'batik' | 'vector' | 'dtf' | 'wall-art'>('batik');
  const [digTags, setDigTags] = useState('');
  const [digFileFormat, setDigFileFormat] = useState('ZIP');
  const [digFileSize, setDigFileSize] = useState('');
  const [digResolution, setDigResolution] = useState('');
  const [digPreviewUrl, setDigPreviewUrl] = useState('');
  const [digFileKey, setDigFileKey] = useState('');
  
  const [digPreviewFile, setDigPreviewFile] = useState<File | null>(null);
  const [digSourceFile, setDigSourceFile] = useState<File | null>(null);

  // General Upload & Saving states
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Fetch catalogs if authenticated
  const fetchAllCatalogs = async () => {
    setLoading(true);
    try {
      const prodData = await getProducts();
      setProducts(prodData);
      
      const digData = await getDigitalArtworks();
      setDigitalArtworks(digData);
    } catch (err) {
      console.error('Failed to load catalogs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && profile?.role === 'admin') {
      fetchAllCatalogs();
    }
  }, [user, profile]);

  // Handle Supabase Auth Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginSubmitting(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: emailInput,
        password: passwordInput,
      });

      if (error) {
        setLoginError(error.message);
      }
    } catch (err: any) {
      setLoginError(err.message || 'An error occurred during login.');
    } finally {
      setLoginSubmitting(false);
    }
  };

  // Secure File Upload to Supabase Storage helper
  const uploadToSupabaseStorage = async (file: File, bucketName: string): Promise<string> => {
    setUploadProgress(`Uploading ${file.name}...`);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const { error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      throw new Error(`Storage upload failed: ${error.message}`);
    }

    if (bucketName === 'public-previews') {
      const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
      return data.publicUrl;
    }
    
    // For secure/private buckets, return the database reference path
    return filePath;
  };

  // ──── PHYSICAL PRODUCT ACTION HANDLERS ────
  const openAddProductModal = () => {
    setEditingProduct(null);
    setProdName('');
    setProdCategory('dtf_sheet');
    setProdSubCategory('');
    setProdDescription('');
    setProdPrice(0);
    setProdOriginalPrice(undefined);
    setProdImageUrl('');
    // Pre-fill standard DTF size tiers as a helpful default
    setProdSizeVariants(getDefaultSizeVariants('dtf_sheet', 500));
    setProdIsActive(true);
    setProdImageFile(null);
    setErrorMsg('');
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (product: Product) => {
    setEditingProduct(product);
    setProdName(product.name);
    setProdCategory(product.category);
    setProdSubCategory(product.sub_category || '');
    setProdDescription(product.description || '');
    setProdPrice(product.price);
    setProdOriginalPrice(product.original_price);
    setProdImageUrl(product.image_url);
    // Populate size tiers from existing variants (skip "Default" single-variant products)
    const existingVariants = product.variants ?? [];
    const hasRealSizes = existingVariants.some(v => v.attributes.size && v.attributes.size !== 'Default');
    if (hasRealSizes) {
      setProdSizeVariants(
        existingVariants
          .filter(v => v.attributes.size)
          .map(v => ({
            size: v.attributes.size as string,
            price: v.price_override ?? product.price,
            stock: v.stock_quantity,
          }))
      );
    } else {
      setProdSizeVariants([]);
    }
    setProdIsActive(product.is_active);
    setProdImageFile(null);
    setErrorMsg('');
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const sanitizedName = sanitizeText(prodName, 150);
    if (!sanitizedName || prodPrice <= 0) {
      setErrorMsg('Please specify a valid Name and Price.');
      return;
    }

    setSaving(true);
    setErrorMsg('');
    setUploadProgress('');

    try {
      let finalImageUrl = prodImageUrl;

      // Handle Image File Upload
      if (prodImageFile) {
        finalImageUrl = await uploadToSupabaseStorage(prodImageFile, 'public-previews');
      }

      if (!finalImageUrl) {
        throw new Error('Please select an image file or specify an Image URL.');
      }

      const pData: Partial<Product> = {
        name: sanitizedName,
        category: prodCategory,
        sub_category: prodSubCategory ? sanitizeText(prodSubCategory, 50) : undefined,
        description: sanitizeText(prodDescription, 1000),
        price: Number(prodPrice),
        original_price: prodOriginalPrice ? Number(prodOriginalPrice) : undefined,
        image_url: finalImageUrl,
        is_active: prodIsActive
      };

      // Build size variants: use the tier rows if any, else single Default
      const sizeVariants: SizeVariantInput[] = prodSizeVariants.length > 0
        ? prodSizeVariants.filter(sv => sv.size.trim() !== '').map(sv => ({
            size: sv.size.trim(),
            price: sv.price || Number(prodPrice),
            stock: sv.stock || 100,
          }))
        : [];

      if (editingProduct) {
        await updateProduct(editingProduct.id, pData, sizeVariants.length > 0 ? sizeVariants : undefined);
        setSuccessMsg('Product updated successfully!');
      } else {
        await createProduct(pData as Omit<Product, 'id' | 'is_active'>, sizeVariants);
        setSuccessMsg('Product added successfully!');
      }

      setIsProductModalOpen(false);
      fetchAllCatalogs();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred while saving the product.');
    } finally {
      setSaving(false);
      setUploadProgress('');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to archive this product?')) {
      try {
        await deleteProduct(id);
        setSuccessMsg('Product archived successfully!');
        fetchAllCatalogs();
        setTimeout(() => setSuccessMsg(''), 3000);
      } catch (err) {
        console.error('Archiving failed:', err);
      }
    }
  };

  // ──── DIGITAL ARTWORK ACTION HANDLERS ────
  const openAddDigitalModal = () => {
    setEditingDigital(null);
    setDigTitle('');
    setDigDescription('');
    setDigPrice(0);
    setDigCategory('batik');
    setDigTags('');
    setDigFileFormat('ZIP');
    setDigFileSize('');
    setDigResolution('');
    setDigPreviewUrl('');
    setDigFileKey('');
    setDigPreviewFile(null);
    setDigSourceFile(null);
    setErrorMsg('');
    setIsDigitalModalOpen(true);
  };

  const openEditDigitalModal = (art: DigitalArtwork) => {
    setEditingDigital(art);
    setDigTitle(art.title);
    setDigDescription(art.description);
    setDigPrice(art.price);
    setDigCategory(art.category);
    setDigTags(art.tags?.join(', ') || '');
    setDigFileFormat(art.file_format || 'ZIP');
    setDigFileSize(art.file_size || '');
    setDigResolution(art.resolution || '');
    setDigPreviewUrl(art.preview_url || '');
    setDigFileKey(art.file_key || '');
    setDigPreviewFile(null);
    setDigSourceFile(null);
    setErrorMsg('');
    setIsDigitalModalOpen(true);
  };

  const handleSaveDigital = async (e: React.FormEvent) => {
    e.preventDefault();
    const sanitizedTitle = sanitizeText(digTitle, 150);
    if (!sanitizedTitle || digPrice <= 0) {
      setErrorMsg('Please specify a valid Title and Price.');
      return;
    }

    setSaving(true);
    setErrorMsg('');
    setUploadProgress('');

    try {
      let finalPreviewUrl = digPreviewUrl;
      let finalFileKey = digFileKey;

      // Upload Preview Image
      if (digPreviewFile) {
        finalPreviewUrl = await uploadToSupabaseStorage(digPreviewFile, 'public-previews');
      }

      // Upload Secure ZIP source file
      if (digSourceFile) {
        finalFileKey = await uploadToSupabaseStorage(digSourceFile, 'digital-artworks-secure');
      }

      if (!finalPreviewUrl) {
        throw new Error('Please select a preview image file or input a URL.');
      }
      if (!finalFileKey) {
        throw new Error('Please upload a high-resolution secure design file.');
      }

      // Parse tags
      const parsedTags = digTags
        .split(',')
        .map(t => sanitizeText(t.trim(), 40))
        .filter(t => t.length > 0);

      const dData: Omit<DigitalArtwork, 'id' | 'is_active' | 'created_at'> = {
        title: sanitizedTitle,
        description: sanitizeText(digDescription, 1000),
        price: Number(digPrice),
        preview_url: finalPreviewUrl,
        file_key: finalFileKey,
        category: digCategory,
        tags: parsedTags,
        file_format: digFileFormat || 'ZIP',
        file_size: digFileSize || `${(digSourceFile ? (digSourceFile.size / (1024 * 1024)).toFixed(1) : 0)} MB`,
        resolution: digResolution || 'Vector Format'
      };

      if (editingDigital) {
        await updateDigitalArtwork(editingDigital.id, dData);
        setSuccessMsg('Digital artwork updated successfully!');
      } else {
        await createDigitalArtwork(dData);
        setSuccessMsg('Digital artwork added successfully!');
      }

      setIsDigitalModalOpen(false);
      fetchAllCatalogs();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred while saving digital artwork.');
    } finally {
      setSaving(false);
      setUploadProgress('');
    }
  };

  const handleDeleteDigital = async (id: string) => {
    if (confirm('Are you sure you want to delete this digital artwork design?')) {
      try {
        await deleteDigitalArtwork(id);
        setSuccessMsg('Digital artwork design deleted!');
        fetchAllCatalogs();
        setTimeout(() => setSuccessMsg(''), 3000);
      } catch (err) {
        console.error('Delete digital artwork failed:', err);
      }
    }
  };

  // Filter systems
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const filteredDigital = digitalArtworks.filter((d) => {
    const matchesSearch = d.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          d.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          d.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || d.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Admin Pagination States (10 items per page)
  const [adminProdPage, setAdminProdPage] = useState(1);
  const [adminDigPage, setAdminDigPage] = useState(1);
  const adminItemsPerPage = 10;

  // Reset pagination on filter or search change
  useEffect(() => {
    setAdminProdPage(1);
    setAdminDigPage(1);
  }, [searchQuery, categoryFilter, activeTab]);

  const totalProdPages = Math.ceil(filteredProducts.length / adminItemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (adminProdPage - 1) * adminItemsPerPage,
    adminProdPage * adminItemsPerPage
  );

  const totalDigPages = Math.ceil(filteredDigital.length / adminItemsPerPage);
  const paginatedDigital = filteredDigital.slice(
    (adminDigPage - 1) * adminItemsPerPage,
    adminDigPage * adminItemsPerPage
  );

  // Calculate statistics
  const totalProductsCount = products.length;
  const totalDigitalCount = digitalArtworks.length;
  const lowStockCount = products.filter((p) => {
    const s = p.variants?.[0]?.stock_quantity ?? 0;
    return s > 0 && s < 20;
  }).length;
  const inactiveCount = products.filter((p) => !p.is_active).length + digitalArtworks.filter(d => d.is_active === false).length;

  // 1. LOADING SCREEN
  if (authLoading) {
    return (
      <div className="w-full min-h-screen bg-background flex flex-col items-center justify-center gap-3">
        <RefreshCw size={28} className="animate-spin text-[#2CFF05]" />
        <span className="text-xs text-muted-foreground font-semibold">Verifying secure administrator session...</span>
      </div>
    );
  }

  // 2. UNAUTHENTICATED / NOT ADMIN SIGN IN PORTAL
  if (!user || profile?.role !== 'admin') {
    return (
      <div className="w-full min-h-screen bg-background text-foreground flex items-center justify-center py-24 px-4 relative overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-[#2CFF05]/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(rgba(141,255,0,0.01)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

        <div className="w-full max-w-md rounded-3xl border border-border bg-card/25 backdrop-blur-md p-8 space-y-6 shadow-2xl relative z-10">
          
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#2CFF05] to-[#7acc00] flex items-center justify-center text-foreground mx-auto shadow-lg shadow-[#2CFF05]/25 mb-4">
              <Lock size={26} className="text-[#0a0a0a]" />
            </div>
            <h1 className="text-2xl font-black tracking-tight uppercase">Admin Console</h1>
            <p className="text-muted-foreground text-xs leading-relaxed">
              {user && profile?.role !== 'admin' 
                ? 'Your account profile does not possess administrator credentials.' 
                : 'Authentication required. Enter your admin portal credentials below.'}
            </p>
          </div>

          {loginError && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold flex items-center gap-2">
              <AlertTriangle size={14} className="shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          {user && profile?.role !== 'admin' ? (
            <button
              onClick={signOut}
              className="w-full py-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider transition-all"
            >
              Sign Out & Switch Account
            </button>
          ) : (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Admin Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="admin@bitiumtechnology.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:border-[#2CFF05] focus:ring-1 focus:ring-[#2CFF05] transition-colors"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Admin Password</label>
                <div className="relative">
                  <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <input
                    type="password"
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:border-[#2CFF05] focus:ring-1 focus:ring-[#2CFF05] transition-colors"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loginSubmitting}
                className="w-full py-3.5 px-6 rounded-xl bg-[#2CFF05] hover:bg-[#7acc00] disabled:bg-zinc-700 disabled:opacity-50 text-[#0a0a0a] font-black text-xs uppercase tracking-wider shadow-lg shadow-[#2CFF05]/15 hover:shadow-[#2CFF05]/30 transition-all hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer"
              >
                {loginSubmitting && <RefreshCw size={14} className="animate-spin" />}
                <span>{loginSubmitting ? 'Verifying...' : 'Unlock Admin Panel'}</span>
              </button>
            </form>
          )}

        </div>
      </div>
    );
  }

  // 3. MAIN AUTHENTICATED ADMIN PANEL DASHBOARD
  return (
    <>
      <div className="w-full min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background glows */}
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-[#2CFF05]/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 left-1/4 w-[350px] h-[350px] bg-[#2CFF05]/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10 space-y-8">
          
          {/* Top row heading */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border/60 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#2CFF05]/10 border border-[#2CFF05]/25 rounded-full px-3.5 py-1 mb-2">
                <Sparkles size={11} className="text-[#2CFF05]" />
                <span className="font-heading font-semibold text-[10px] text-[#2CFF05] tracking-wider uppercase">System Authenticated</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight flex items-center gap-2 uppercase">
                Unified <span className="text-[#2CFF05]">Admin Panel</span>
              </h1>
              <p className="text-muted-foreground text-xs sm:text-sm mt-0.5">Control both storefront inventory items and secure design artworks vault files.</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={fetchAllCatalogs}
                className="p-3 rounded-xl border border-border bg-card/25 hover:bg-card transition-colors text-muted-foreground hover:text-foreground cursor-pointer"
                title="Refresh Catalogs"
              >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              </button>
              
              {activeTab === 'batch-print' ? (
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#2CFF05] hover:bg-[#7acc00] text-[#0a0a0a] font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#2CFF05]/20 transition-all hover:scale-105 cursor-pointer"
                >
                  <Printer size={16} />
                  <span>Print 4-in-1 A4</span>
                </button>
              ) : activeTab === 'order-form' || activeTab === 'pos-invoice' ? null : (
                <button
                  onClick={() => {
                    if (activeTab === 'products') {
                      openAddProductModal();
                    } else {
                      openAddDigitalModal();
                    }
                  }}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#2CFF05] hover:bg-[#7acc00] text-[#0a0a0a] font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#2CFF05]/20 transition-all hover:scale-105 cursor-pointer"
                >
                  <Plus size={16} />
                  <span>{activeTab === 'products' ? 'Add Product' : 'Add Design'}</span>
                </button>
              )}
              
              <button
                onClick={signOut}
                className="p-3 rounded-xl border border-rose-950/20 bg-rose-950/10 hover:bg-rose-950/30 text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                title="Lock Dashboard"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>

          {/* Alert Toast feedback */}
          {successMsg && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-fade-in shadow-lg">
              <CheckCircle size={16} />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Dashboard Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl border border-border bg-card/10 backdrop-blur-md flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#2CFF05]/10 border border-[#2CFF05]/20 flex items-center justify-center text-[#2CFF05] shrink-0">
                <Package size={20} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Physical Products</span>
                <span className="text-xl sm:text-2xl font-black text-foreground">{totalProductsCount} Items</span>
              </div>
            </div>
            <div className="p-5 rounded-2xl border border-border bg-card/10 backdrop-blur-md flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-600/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                <Folder size={20} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Digital Artworks</span>
                <span className="text-xl sm:text-2xl font-black text-cyan-400">{totalDigitalCount} Designs</span>
              </div>
            </div>
            <div className="p-5 rounded-2xl border border-border bg-card/10 backdrop-blur-md flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-600/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <AlertTriangle size={20} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Low Inventory</span>
                <span className="text-xl sm:text-2xl font-black text-amber-400">{lowStockCount} alert-items</span>
              </div>
            </div>
            <div className="p-5 rounded-2xl border border-border bg-card/10 backdrop-blur-md flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-zinc-600/15 border border-border flex items-center justify-center text-muted-foreground shrink-0">
                <XCircle size={20} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Archived / Hidden</span>
                <span className="text-xl sm:text-2xl font-black text-muted-foreground">{inactiveCount} items</span>
              </div>
            </div>
          </div>

          {/* Top Level Segmented Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-3 border-b border-border/60 pb-3">
            <button
              onClick={() => { setActiveTab('products'); setCategoryFilter('all'); }}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-[#2CFF05] text-[#0a0a0a] shadow-xl shadow-[#2CFF05]/20 scale-105'
                  : 'bg-card/40 border border-border text-muted-foreground hover:text-foreground hover:bg-card'
              }`}
            >
              <Package size={16} />
              <span>Store Catalog</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${activeTab === 'products' ? 'bg-black text-[#2CFF05]' : 'bg-muted text-muted-foreground'}`}>
                {totalProductsCount}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('digital'); setCategoryFilter('all'); }}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'digital'
                  ? 'bg-[#2CFF05] text-[#0a0a0a] shadow-xl shadow-[#2CFF05]/20 scale-105'
                  : 'bg-card/40 border border-border text-muted-foreground hover:text-foreground hover:bg-card'
              }`}
            >
              <Folder size={16} />
              <span>Digital Artworks</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${activeTab === 'digital' ? 'bg-black text-[#2CFF05]' : 'bg-muted text-muted-foreground'}`}>
                {totalDigitalCount}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('batch-print'); }}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'batch-print'
                  ? 'bg-[#2CFF05] text-[#0a0a0a] shadow-xl shadow-[#2CFF05]/20 scale-105'
                  : 'bg-card/40 border border-border text-muted-foreground hover:text-foreground hover:bg-card'
              }`}
            >
              <Printer size={16} />
              <span>Batch Print (4-in-1 A4)</span>
              <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase ${activeTab === 'batch-print' ? 'bg-black text-[#2CFF05]' : 'bg-indigo-600/30 text-indigo-300'}`}>
                PRINT A4
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('order-form'); }}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'order-form'
                  ? 'bg-[#2CFF05] text-[#0a0a0a] shadow-xl shadow-[#2CFF05]/20 scale-105'
                  : 'bg-card/40 border border-border text-muted-foreground hover:text-foreground hover:bg-card'
              }`}
            >
              <FileText size={16} />
              <span>Order Form</span>
              <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase ${activeTab === 'order-form' ? 'bg-black text-[#2CFF05]' : 'bg-lime-500/20 text-lime-400'}`}>
                FORM
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('pos-invoice'); }}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'pos-invoice'
                  ? 'bg-[#2CFF05] text-[#0a0a0a] shadow-xl shadow-[#2CFF05]/20 scale-105'
                  : 'bg-card/40 border border-border text-muted-foreground hover:text-foreground hover:bg-card'
              }`}
            >
              <FileText size={16} />
              <span>POS Invoice</span>
              <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase ${activeTab === 'pos-invoice' ? 'bg-black text-[#2CFF05]' : 'bg-amber-500/20 text-amber-400'}`}>
                BILL
              </span>
            </button>
          </div>

          {/* Secondary Filter & Search Row - Shown only for Store & Digital Catalogs */}
          {activeTab !== 'batch-print' && activeTab !== 'order-form' && activeTab !== 'pos-invoice' && (
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 rounded-2xl border border-border bg-card/20 backdrop-blur-sm">
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mr-2 flex items-center gap-1.5"><Filter size={12} /> Category:</span>
                
                {activeTab === 'products' ? (
                  // Store categories
                  [
                    { id: 'all', label: 'All' },
                    { id: 'stencil', label: 'Stencils' },
                    { id: 'screen-printing', label: 'Screen Print' },
                    { id: 'dtf_sheet', label: 'DTF Printing' },
                    { id: 'batik-stamp', label: 'Batik Stamps' },
                    { id: 'materials', label: 'Consumables' },
                    { id: 'laser-cutting', label: 'Laser Cut' }
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setCategoryFilter(cat.id)}
                      className={`px-3 py-1.5 rounded-lg text-[9px] font-bold transition-all cursor-pointer ${
                        categoryFilter === cat.id 
                          ? 'bg-[#2CFF05]/25 border border-[#2CFF05]/40 text-[#2CFF05]' 
                          : 'bg-card border border-border text-muted-foreground hover:text-[#0a0a0a]'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))
                ) : (
                  // Digital Artwork categories
                  [
                    { id: 'all', label: 'All' },
                    { id: 'batik', label: 'Batik Designs' },
                    { id: 'vector', label: 'Vector Artwork' },
                    { id: 'dtf', label: 'DTF Layouts' },
                    { id: 'wall-art', label: 'Wall Art' }
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setCategoryFilter(cat.id)}
                      className={`px-3 py-1.5 rounded-lg text-[9px] font-bold transition-all cursor-pointer ${
                        categoryFilter === cat.id 
                          ? 'bg-[#2CFF05]/25 border border-[#2CFF05]/40 text-[#2CFF05]' 
                          : 'bg-card border border-border text-muted-foreground hover:text-[#0a0a0a]'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))
                )}
              </div>

              {/* Search Input */}
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={15} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search catalog titles, details..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:border-[#2CFF05] transition-colors"
                />
              </div>
            </div>
          )}

          {activeTab === 'batch-print' ? (
            <AdminBatchPrint />
          ) : activeTab === 'order-form' ? (
            <div className="p-4 sm:p-6 rounded-2xl border border-border bg-card/10 backdrop-blur-sm">
              <OrderFormComponent hideNavbar={true} />
            </div>
          ) : activeTab === 'pos-invoice' ? (
            <div className="p-4 sm:p-6 rounded-2xl border border-border bg-card/10 backdrop-blur-sm">
              <POSInvoiceGenerator />
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-card/10 backdrop-blur-sm overflow-hidden">
              {loading ? (
                <div className="p-16 text-center text-muted-foreground flex flex-col items-center justify-center gap-2">
                  <RefreshCw size={24} className="animate-spin text-[#2CFF05]" />
                  <p className="text-xs">Fetching storefront catalog databases...</p>
                </div>
              ) : activeTab === 'products' ? (
                // 1. STORE PRODUCTS TABLE
                filteredProducts.length === 0 ? (
                  <div className="p-16 text-center text-muted-foreground space-y-2">
                    <Package size={36} className="mx-auto text-muted-foreground mb-1" />
                    <p className="text-sm font-semibold">No store products found</p>
                    <p className="text-xs text-muted-foreground">Adjust filters or create a new catalog item.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-xs">
                      <thead>
                        <tr className="bg-background/80 border-b border-border text-muted-foreground font-bold uppercase tracking-wider text-[10px]">
                          <th className="p-4 w-16">Image</th>
                          <th className="p-4 w-60">Product Details</th>
                          <th className="p-4">Category</th>
                          <th className="p-4">Price</th>
                          <th className="p-4">Discount</th>
                          <th className="p-4 text-center">Stock</th>
                          <th className="p-4 text-center">Status</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-900/50">
                        {paginatedProducts.map((p) => {
                          const primaryStock = p.variants?.[0]?.stock_quantity ?? 0;
                          const discount = p.original_price ? Math.round(((p.original_price - p.price) / p.original_price) * 100) : 0;
                          
                          return (
                            <tr key={p.id} className="hover:bg-card/25 transition-colors">
                              <td className="p-4">
                                <div className="relative w-12 h-12 rounded-xl bg-background overflow-hidden border border-border">
                                  <Image src={p.image_url} alt={p.name} fill className="object-cover" />
                                </div>
                              </td>
                              <td className="p-4">
                                <div className="space-y-0.5">
                                  <span className="font-extrabold text-foreground block text-xs line-clamp-1">{p.name}</span>
                                  <span className="text-[10px] text-muted-foreground block truncate max-w-[200px]">{p.description}</span>
                                  <span className="text-[9px] font-mono text-zinc-550 block select-all">UUID: {p.id}</span>
                                </div>
                              </td>
                              <td className="p-4">
                                <span className="px-2 py-0.5 rounded bg-card border border-border text-muted-foreground text-[10px] font-bold uppercase">
                                  {p.category.replace('_', ' ')}
                                </span>
                              </td>
                              <td className="p-4 font-bold text-foreground">
                                Rs. {p.price.toLocaleString()}
                              </td>
                              <td className="p-4">
                                {p.original_price ? (
                                  <div className="space-y-0.5">
                                    <span className="text-[10px] text-muted-foreground line-through block">Rs. {p.original_price.toLocaleString()}</span>
                                    <span className="px-1.5 py-0.5 rounded bg-rose-600/10 text-rose-450 text-[9px] font-bold uppercase inline-block">
                                      -{discount}%
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-zinc-650">—</span>
                                )}
                              </td>
                              <td className="p-4 text-center">
                                <span className={`font-black text-xs ${
                                  primaryStock === 0 ? 'text-rose-500' : primaryStock < 20 ? 'text-amber-500' : 'text-foreground'
                                }`}>
                                  {primaryStock}
                                </span>
                              </td>
                              <td className="p-4 text-center">
                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                                  p.is_active 
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                    : 'bg-muted text-muted-foreground border border-border'
                                }`}>
                                  {p.is_active ? 'Active' : 'Hidden'}
                                </span>
                              </td>
                              <td className="p-4 text-right">
                                <div className="flex justify-end gap-2">
                                  <button
                                    onClick={() => openEditProductModal(p)}
                                    className="p-2 rounded-lg bg-card border border-border hover:border-[#2CFF05]/40 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                                  >
                                    <Edit size={13} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteProduct(p.id)}
                                    className="p-2 rounded-lg bg-card border border-border hover:border-rose-500/40 text-muted-foreground hover:text-rose-400 transition-colors cursor-pointer"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>

                    {/* Pagination Bar for Store Products (10 items per page) */}
                    {totalProdPages > 1 && (
                      <div className="p-4 border-t border-border bg-card/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <span className="text-[11px] text-muted-foreground">
                          Showing <strong className="text-foreground">{(adminProdPage - 1) * adminItemsPerPage + 1}</strong> to{' '}
                          <strong className="text-foreground">{Math.min(adminProdPage * adminItemsPerPage, filteredProducts.length)}</strong> of{' '}
                          <strong className="text-foreground">{filteredProducts.length}</strong> products
                        </span>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setAdminProdPage((p) => Math.max(1, p - 1))}
                            disabled={adminProdPage === 1}
                            className="w-8 h-8 rounded-full border border-border bg-card/40 hover:bg-card text-muted-foreground hover:text-foreground disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center transition-all cursor-pointer"
                            title="Previous Page"
                          >
                            <ChevronLeft size={14} />
                          </button>

                          {Array.from({ length: totalProdPages }, (_, i) => i + 1).map((page) => (
                            <button
                              key={page}
                              onClick={() => setAdminProdPage(page)}
                              className={`w-8 h-8 rounded-full text-xs font-black transition-all cursor-pointer ${
                                adminProdPage === page
                                  ? 'bg-[#2CFF05] text-[#0a0a0a] shadow-lg shadow-[#2CFF05]/20 scale-105'
                                  : 'border border-border bg-card/40 hover:bg-card text-muted-foreground hover:text-foreground'
                              }`}
                            >
                              {page}
                            </button>
                          ))}

                          <button
                            onClick={() => setAdminProdPage((p) => Math.min(totalProdPages, p + 1))}
                            disabled={adminProdPage === totalProdPages}
                            className="w-8 h-8 rounded-full border border-border bg-card/40 hover:bg-card text-muted-foreground hover:text-foreground disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center transition-all cursor-pointer"
                            title="Next Page"
                          >
                            <ChevronRight size={14} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )
              ) : (
                // 2. DIGITAL ARTWORKS TABLE
                filteredDigital.length === 0 ? (
                  <div className="p-16 text-center text-muted-foreground space-y-2">
                    <Folder size={36} className="mx-auto text-muted-foreground mb-1" />
                    <p className="text-sm font-semibold">No digital designs found</p>
                    <p className="text-xs text-muted-foreground">Adjust filters or create a new digital item.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-xs">
                      <thead>
                        <tr className="bg-background/80 border-b border-border text-muted-foreground font-bold uppercase tracking-wider text-[10px]">
                          <th className="p-4 w-16">Preview</th>
                          <th className="p-4 w-60">Design Details</th>
                          <th className="p-4">Category</th>
                          <th className="p-4">Price</th>
                          <th className="p-4">Format</th>
                          <th className="p-4">Resolution</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-900/50">
                        {paginatedDigital.map((d) => (
                          <tr key={d.id} className="hover:bg-card/25 transition-colors">
                            <td className="p-4">
                              <div className="relative w-12 h-12 rounded-xl bg-background overflow-hidden border border-border">
                                <Image src={d.preview_url} alt={d.title} fill className="object-cover" />
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="space-y-0.5">
                                <span className="font-extrabold text-foreground block text-xs line-clamp-1">{d.title}</span>
                                <span className="text-[10px] text-muted-foreground block truncate max-w-[200px]">{d.description}</span>
                                <span className="text-[9px] font-mono text-zinc-550 block select-all">File Ref: {d.file_key}</span>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className="px-2 py-0.5 rounded bg-card border border-border text-muted-foreground text-[10px] font-bold uppercase">
                                {d.category}
                              </span>
                            </td>
                            <td className="p-4 font-bold text-foreground">
                              Rs. {d.price.toLocaleString()}
                            </td>
                            <td className="p-4 font-semibold text-muted-foreground">
                              {d.file_format} ({d.file_size || 'N/A'})
                            </td>
                            <td className="p-4 text-muted-foreground">
                              {d.resolution || 'Standard'}
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => openEditDigitalModal(d)}
                                  className="p-2 rounded-lg bg-card border border-border hover:border-[#2CFF05]/40 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                                >
                                  <Edit size={13} />
                                </button>
                                <button
                                  onClick={() => handleDeleteDigital(d.id)}
                                  className="p-2 rounded-lg bg-card border border-border hover:border-rose-500/40 text-muted-foreground hover:text-rose-400 transition-colors cursor-pointer"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Pagination Bar for Digital Artworks (10 items per page) */}
                    {totalDigPages > 1 && (
                      <div className="p-4 border-t border-border bg-card/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <span className="text-[11px] text-muted-foreground">
                          Showing <strong className="text-foreground">{(adminDigPage - 1) * adminItemsPerPage + 1}</strong> to{' '}
                          <strong className="text-foreground">{Math.min(adminDigPage * adminItemsPerPage, filteredDigital.length)}</strong> of{' '}
                          <strong className="text-foreground">{filteredDigital.length}</strong> designs
                        </span>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setAdminDigPage((p) => Math.max(1, p - 1))}
                            disabled={adminDigPage === 1}
                            className="w-8 h-8 rounded-full border border-border bg-card/40 hover:bg-card text-muted-foreground hover:text-foreground disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center transition-all cursor-pointer"
                            title="Previous Page"
                          >
                            <ChevronLeft size={14} />
                          </button>

                          {Array.from({ length: totalDigPages }, (_, i) => i + 1).map((page) => (
                            <button
                              key={page}
                              onClick={() => setAdminDigPage(page)}
                              className={`w-8 h-8 rounded-full text-xs font-black transition-all cursor-pointer ${
                                adminDigPage === page
                                  ? 'bg-[#2CFF05] text-[#0a0a0a] shadow-lg shadow-[#2CFF05]/20 scale-105'
                                  : 'border border-border bg-card/40 hover:bg-card text-muted-foreground hover:text-foreground'
                              }`}
                            >
                              {page}
                            </button>
                          ))}

                          <button
                            onClick={() => setAdminDigPage((p) => Math.min(totalDigPages, p + 1))}
                            disabled={adminDigPage === totalDigPages}
                            className="w-8 h-8 rounded-full border border-border bg-card/40 hover:bg-card text-muted-foreground hover:text-foreground disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center transition-all cursor-pointer"
                            title="Next Page"
                          >
                            <ChevronRight size={14} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          )}
          
        </div>
      </div>

      {/* MODAL 1: ADD/EDIT STORE PRODUCT */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-xl rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            
            <div className="flex justify-between items-center border-b border-border pb-4">
              <h2 className="text-lg font-black text-foreground uppercase tracking-tight flex items-center gap-2">
                {editingProduct ? <Edit size={18} className="text-[#2CFF05]" /> : <Plus size={18} className="text-[#2CFF05]" />}
                <span>{editingProduct ? 'Edit Catalog Product' : 'Add Storefront Item'}</span>
              </h2>
              <button onClick={() => setIsProductModalOpen(false)} className="p-1 rounded-full bg-card border border-border text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                <X size={16} />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold flex items-center gap-2">
                <AlertTriangle size={14} />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Product Name *</label>
                <input
                  type="text"
                  required
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  placeholder="e.g. Premium White Screen Ink 1L"
                  className="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-xs text-foreground focus:outline-none focus:border-[#2CFF05] transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Category *</label>
                  <select
                    value={prodCategory}
                    onChange={(e: any) => setProdCategory(e.target.value)}
                    className="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-xs text-foreground focus:outline-none focus:border-[#2CFF05] transition-colors"
                  >
                    <option value="stencil">Stencils</option>
                    <option value="screen-printing">Screen Printing</option>
                    <option value="dtf_sheet">DTF Printing</option>
                    <option value="batik-stamp">Batik Stamps</option>
                    <option value="materials">Materials & Ink</option>
                    <option value="laser-cutting">Laser Cutting</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Sub-category ID</label>
                  <input
                    type="text"
                    value={prodSubCategory}
                    onChange={(e) => setProdSubCategory(e.target.value)}
                    placeholder="e.g. printing-materials, saree, acrylic"
                    className="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-xs text-foreground focus:outline-none focus:border-[#2CFF05] transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Description</label>
                <textarea
                  value={prodDescription}
                  onChange={(e) => setProdDescription(e.target.value)}
                  placeholder="Provide details about materials, sizes, compatibility..."
                  rows={3}
                  className="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-xs text-foreground focus:outline-none focus:border-[#2CFF05] transition-colors resize-none"
                />
              </div>

              {/* ── SIZE & PRICE TIERS ────────────────────────────────── */}
              <div className="p-4 rounded-xl border border-[#2CFF05]/20 bg-[#2CFF05]/5 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <label className="text-[10px] font-bold text-[#2CFF05] uppercase tracking-wider flex items-center gap-1.5">
                    <span>📐</span> Size &amp; Price Tiers
                  </label>
                  {(CATEGORY_SIZES[prodCategory]?.length ?? 0) > 0 && (
                    <button
                      type="button"
                      onClick={() => setProdSizeVariants(getDefaultSizeVariants(prodCategory, prodPrice || 500))}
                      className="text-[9px] font-bold text-[#2CFF05] hover:text-[#45ff24] border border-[#2CFF05]/30 hover:border-[#2CFF05]/60 px-2.5 py-1 rounded-lg transition-all"
                    >
                      ↺ Auto-fill {CATEGORY_SIZES[prodCategory]?.join(' / ')}
                    </button>
                  )}
                </div>

                {prodSizeVariants.length > 0 ? (
                  <div className="space-y-2">
                    {/* Header row */}
                    <div className="grid grid-cols-[1fr_1fr_68px_32px] gap-2 text-[9px] font-bold text-muted-foreground uppercase tracking-wider px-1">
                      <span>Size Name</span>
                      <span>Price (Rs.)</span>
                      <span>Stock</span>
                      <span></span>
                    </div>
                    {prodSizeVariants.map((sv, idx) => (
                      <div key={idx} className="grid grid-cols-[1fr_1fr_68px_32px] gap-2 items-center">
                        <input
                          type="text"
                          value={sv.size}
                          onChange={e => {
                            const next = [...prodSizeVariants];
                            next[idx] = { ...sv, size: e.target.value };
                            setProdSizeVariants(next);
                          }}
                          placeholder="A4"
                          className="bg-card border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-[#2CFF05] transition-colors"
                        />
                        <input
                          type="number"
                          value={sv.price || ''}
                          onChange={e => {
                            const next = [...prodSizeVariants];
                            next[idx] = { ...sv, price: Number(e.target.value) };
                            setProdSizeVariants(next);
                          }}
                          placeholder="450"
                          className="bg-card border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-[#2CFF05] transition-colors"
                        />
                        <input
                          type="number"
                          value={sv.stock}
                          onChange={e => {
                            const next = [...prodSizeVariants];
                            next[idx] = { ...sv, stock: Number(e.target.value) };
                            setProdSizeVariants(next);
                          }}
                          className="bg-card border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-[#2CFF05] transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => setProdSizeVariants(prodSizeVariants.filter((_, i) => i !== idx))}
                          className="w-8 h-8 flex items-center justify-center rounded-lg border border-rose-900/30 text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10px] text-muted-foreground italic">
                    No size tiers — product will use single base price. Click &ldquo;Auto-fill&rdquo; or add rows manually.
                  </p>
                )}

                <button
                  type="button"
                  onClick={() => setProdSizeVariants([...prodSizeVariants, { size: '', price: prodPrice || 0, stock: 100 }])}
                  className="flex items-center gap-1.5 text-[10px] font-bold text-[#2CFF05] hover:text-[#45ff24] transition-colors mt-1 cursor-pointer"
                >
                  <Plus size={12} /> Add Size Row
                </button>
              </div>

              {/* Base price + original price (reference / fallback when no size tiers) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Base Price (Rs.) *
                    <span className="ml-1 font-normal text-muted-foreground normal-case">(fallback / reference)</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={prodPrice || ''}
                    onChange={(e) => setProdPrice(Number(e.target.value))}
                    placeholder="2500"
                    className="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-xs text-foreground focus:outline-none focus:border-[#2CFF05] transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Original Price (Crossed)</label>
                  <input
                    type="number"
                    value={prodOriginalPrice || ''}
                    onChange={(e) => setProdOriginalPrice(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="3000"
                    className="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-xs text-foreground focus:outline-none focus:border-[#2CFF05] transition-colors"
                  />
                </div>
              </div>

              {/* Secure Image Upload System */}
              <div className="p-4 rounded-xl border border-border bg-background/50 space-y-3">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Product Image Upload</label>
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <label className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-dashed border-border hover:border-[#2CFF05]/40 hover:bg-card cursor-pointer transition-colors text-xs font-semibold text-muted-foreground">
                    <Upload size={14} />
                    <span>Choose File</span>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files?.[0]) setProdImageFile(e.target.files[0]);
                      }}
                      className="hidden"
                    />
                  </label>
                  <div className="text-xs truncate text-muted-foreground flex-grow max-w-[200px]">
                    {prodImageFile ? prodImageFile.name : 'No file selected (Optional)'}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-zinc-550 block">OR Paste Hosted URL:</span>
                  <input
                    type="text"
                    value={prodImageUrl}
                    onChange={(e) => setProdImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full bg-card border border-border rounded-xl px-4 py-2 text-xs text-foreground focus:outline-none focus:border-[#2CFF05] transition-colors"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 py-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold">
                  <input
                    type="checkbox"
                    checked={prodIsActive}
                    onChange={(e) => setProdIsActive(e.target.checked)}
                    className="w-4 h-4 rounded border-border bg-card text-[#2CFF05] focus:ring-[#2CFF05]"
                  />
                  <span>Show product in live catalog</span>
                </label>
              </div>

              {uploadProgress && (
                <div className="text-xs text-cyan-400 font-bold flex items-center gap-1.5 animate-pulse">
                  <RefreshCw size={12} className="animate-spin" />
                  <span>{uploadProgress}</span>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
                <button type="button" onClick={() => setIsProductModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-border hover:bg-card text-muted-foreground text-xs font-bold transition-all cursor-pointer">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="px-6 py-2.5 rounded-xl bg-[#2CFF05] hover:bg-[#7acc00] text-[#0a0a0a] font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#2CFF05]/10 transition-all flex items-center gap-2 cursor-pointer">
                  {saving && <RefreshCw size={12} className="animate-spin" />}
                  <span>{editingProduct ? 'Save Changes' : 'Publish Product'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD/EDIT DIGITAL ARTWORK */}
      {isDigitalModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-xl rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            
            <div className="flex justify-between items-center border-b border-border pb-4">
              <h2 className="text-lg font-black text-foreground uppercase tracking-tight flex items-center gap-2">
                {editingDigital ? <Edit size={18} className="text-[#2CFF05]" /> : <Plus size={18} className="text-[#2CFF05]" />}
                <span>{editingDigital ? 'Edit Digital Design' : 'Add Secure Artwork Vault File'}</span>
              </h2>
              <button onClick={() => setIsDigitalModalOpen(false)} className="p-1 rounded-full bg-card border border-border text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                <X size={16} />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold flex items-center gap-2">
                <AlertTriangle size={14} />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveDigital} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Artwork Title *</label>
                <input
                  type="text"
                  required
                  value={digTitle}
                  onChange={(e) => setDigTitle(e.target.value)}
                  placeholder="e.g. Royal Peacock Traditional Pattern"
                  className="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-xs text-foreground focus:outline-none focus:border-[#2CFF05] transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Artwork Description</label>
                <textarea
                  value={digDescription}
                  onChange={(e) => setDigDescription(e.target.value)}
                  placeholder="Write details explaining design styles, dimensions, format layers..."
                  rows={2}
                  className="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-xs text-foreground focus:outline-none focus:border-[#2CFF05] transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Category *</label>
                  <select
                    value={digCategory}
                    onChange={(e: any) => setDigCategory(e.target.value)}
                    className="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-xs text-foreground focus:outline-none focus:border-[#2CFF05] transition-colors"
                  >
                    <option value="batik">Batik stamp designs</option>
                    <option value="vector">Vector artwork</option>
                    <option value="dtf">DTF Sticker layouts</option>
                    <option value="wall-art">Wall Art</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Price (LKR / Rs.) *</label>
                  <input
                    type="number"
                    required
                    value={digPrice || ''}
                    onChange={(e) => setDigPrice(Number(e.target.value))}
                    placeholder="1200"
                    className="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-xs text-foreground focus:outline-none focus:border-[#2CFF05] transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Resolution</label>
                  <input
                    type="text"
                    value={digResolution}
                    onChange={(e) => setDigResolution(e.target.value)}
                    placeholder="e.g. 300 DPI, Vector format"
                    className="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-xs text-foreground focus:outline-none focus:border-[#2CFF05] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">File Format</label>
                  <input
                    type="text"
                    value={digFileFormat}
                    onChange={(e) => setDigFileFormat(e.target.value)}
                    placeholder="e.g. ZIP, PNG, SVG"
                    className="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-xs text-foreground focus:outline-none focus:border-[#2CFF05] transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Tags (Comma Separated)</label>
                  <input
                    type="text"
                    value={digTags}
                    onChange={(e) => setDigTags(e.target.value)}
                    placeholder="e.g. traditional, blue, pattern"
                    className="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-xs text-foreground focus:outline-none focus:border-[#2CFF05] transition-colors"
                  />
                </div>
              </div>

              {/* Secure Image Upload System */}
              <div className="p-4 rounded-xl border border-border bg-background/50 space-y-4">
                {/* 1. Preview Image file select */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Preview Image File (Watermarked) *</label>
                  <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <label className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-dashed border-border hover:border-[#2CFF05]/40 hover:bg-card cursor-pointer transition-colors text-xs font-semibold text-muted-foreground">
                      <Upload size={14} />
                      <span>Choose Preview</span>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files?.[0]) setDigPreviewFile(e.target.files[0]);
                        }}
                        className="hidden"
                      />
                    </label>
                    <div className="text-xs truncate text-muted-foreground flex-grow max-w-[200px]">
                      {digPreviewFile ? digPreviewFile.name : 'No preview selected'}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-zinc-550 block">OR Preview URL:</span>
                    <input
                      type="text"
                      value={digPreviewUrl}
                      onChange={(e) => setDigPreviewUrl(e.target.value)}
                      placeholder="https://res.cloudinary.com/..."
                      className="w-full bg-card border border-border rounded-xl px-4 py-2 text-xs text-foreground focus:outline-none focus:border-[#2CFF05] transition-colors"
                    />
                  </div>
                </div>

                <hr className="border-border/60" />

                {/* 2. High-Res Source File (ZIP) select */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Private Source File (ZIP/Vector) *</label>
                  <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <label className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-dashed border-border hover:border-cyan-500/40 hover:bg-card cursor-pointer transition-colors text-xs font-semibold text-muted-foreground">
                      <Upload size={14} />
                      <span>Choose Secure Zip</span>
                      <input 
                        type="file" 
                        accept=".zip,.rar,.svg,.ai,.psd,.pdf"
                        onChange={(e) => {
                          if (e.target.files?.[0]) setDigSourceFile(e.target.files[0]);
                        }}
                        className="hidden"
                      />
                    </label>
                    <div className="text-xs truncate text-muted-foreground flex-grow max-w-[200px]">
                      {digSourceFile ? digSourceFile.name : 'No secure source file selected'}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-zinc-550 block">OR Database File Path:</span>
                    <input
                      type="text"
                      value={digFileKey}
                      onChange={(e) => setDigFileKey(e.target.value)}
                      placeholder="uploads/1723-custom-design.zip"
                      className="w-full bg-card border border-border rounded-xl px-4 py-2 text-xs text-foreground focus:outline-none focus:border-[#2CFF05] transition-colors"
                    />
                  </div>
                </div>
              </div>

              {uploadProgress && (
                <div className="text-xs text-cyan-400 font-bold flex items-center gap-1.5 animate-pulse">
                  <RefreshCw size={12} className="animate-spin" />
                  <span>{uploadProgress}</span>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
                <button type="button" onClick={() => setIsDigitalModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-border hover:bg-card text-muted-foreground text-xs font-bold transition-all cursor-pointer">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="px-6 py-2.5 rounded-xl bg-[#2CFF05] hover:bg-[#7acc00] text-[#0a0a0a] font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#2CFF05]/10 transition-all flex items-center gap-2 cursor-pointer">
                  {saving && <RefreshCw size={12} className="animate-spin" />}
                  <span>{editingDigital ? 'Save Changes' : 'Upload Design'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
