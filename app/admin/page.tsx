'use client';

import React, { useState, useEffect } from 'react';
import { 
  getProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  Product 
} from '@/lib/products';
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
  User,
  Key,
  Settings,
  LogOut,
  ChevronRight,
  ShoppingCart
} from 'lucide-react';
import Image from 'next/image';

// SHA-256 hashing helper using Web Crypto API (Browser Native, Secure)
async function sha256(str: string): Promise<string> {
  const buf = new TextEncoder().encode(str);
  const hash = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export default function AdminPanelPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  
  // Authentication States
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  
  // Rate Limit / Lockout states (Brute Force Defense)
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockoutTimeLeft, setLockoutTimeLeft] = useState(0);

  // Decrement lockout timer
  useEffect(() => {
    if (lockoutTimeLeft <= 0) return;
    const timer = setInterval(() => {
      setLockoutTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [lockoutTimeLeft]);

  // Settings/Change Password States
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [currUser, setCurrUser] = useState('');
  const [currPass, setCurrPass] = useState('');
  const [newUser, setNewUser] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [settingsError, setSettingsError] = useState('');
  const [settingsSuccess, setSettingsSuccess] = useState('');

  // Modal states for products
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Product Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'stencil' | 'screen-printing' | 'dtf_sheet' | 'batik-stamp' | 'materials' | 'laser-cutting'>('dtf_sheet');
  const [subCategory, setSubCategory] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [originalPrice, setOriginalPrice] = useState<number | undefined>(undefined);
  const [imageUrl, setImageUrl] = useState('');
  const [stock, setStock] = useState(100);
  const [isActive, setIsActive] = useState(true);

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Check login session on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const session = sessionStorage.getItem('bitium_admin_session');
      if (session === 'true') {
        setIsAuthenticated(true);
      }
    }
  }, []);

  // Fetch products if authenticated
  const fetchProductsList = async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchProductsList();
    }
  }, [isAuthenticated]);

  // Handle Login Action
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window === 'undefined') return;

    if (lockoutTimeLeft > 0) {
      setLoginError(`Too many failed attempts. Locked out for ${lockoutTimeLeft} seconds.`);
      return;
    }

    // Get current stored credentials or defaults
    const storedUsername = localStorage.getItem('bitium_admin_username') || 'admin';
    const storedPassword = localStorage.getItem('bitium_admin_password') || 'admin123';

    // Verify hashed password
    const inputHash = await sha256(passwordInput);
    const isSha256 = /^[a-f0-9]{64}$/i.test(storedPassword);
    let isPasswordCorrect = false;

    if (isSha256) {
      isPasswordCorrect = inputHash === storedPassword;
    } else {
      // Legacy plaintext check + automatic migration upgrade
      isPasswordCorrect = passwordInput === storedPassword;
      if (isPasswordCorrect) {
        localStorage.setItem('bitium_admin_password', inputHash);
      }
    }

    if (usernameInput === storedUsername && isPasswordCorrect) {
      sessionStorage.setItem('bitium_admin_session', 'true');
      setIsAuthenticated(true);
      setLoginError('');
      setLoginAttempts(0);
    } else {
      const nextAttempts = loginAttempts + 1;
      setLoginAttempts(nextAttempts);
      if (nextAttempts >= 5) {
        setLockoutTimeLeft(60); // Lockout for 60 seconds
        setLoginError('Too many failed login attempts. Locked out for 60 seconds.');
      } else {
        setLoginError(`Incorrect Admin Username or Password. Attempt ${nextAttempts} of 5.`);
      }
    }
  };

  // Handle Logout Action
  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('bitium_admin_session');
    }
    setIsAuthenticated(false);
    setUsernameInput('');
    setPasswordInput('');
  };

  // Handle Credentials Update Action
  const handleUpdateCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window === 'undefined') return;

    const storedUsername = localStorage.getItem('bitium_admin_username') || 'admin';
    const storedPassword = localStorage.getItem('bitium_admin_password') || 'bitium123';

    // Verify current credentials
    const inputHash = await sha256(currPass);
    const isSha256 = /^[a-f0-9]{64}$/i.test(storedPassword);
    let isCurrentPasswordCorrect = false;

    if (isSha256) {
      isCurrentPasswordCorrect = inputHash === storedPassword;
    } else {
      isCurrentPasswordCorrect = currPass === storedPassword;
    }

    if (currUser !== storedUsername || !isCurrentPasswordCorrect) {
      setSettingsError('Current Username or Password validation failed.');
      return;
    }

    if (!newUser || !newPass) {
      setSettingsError('New Username and New Password are required.');
      return;
    }

    if (newPass !== confirmPass) {
      setSettingsError('New Password confirmation does not match.');
      return;
    }

    // Save hashed credentials
    const hashedNewPass = await sha256(newPass);
    localStorage.setItem('bitium_admin_username', newUser);
    localStorage.setItem('bitium_admin_password', hashedNewPass);

    setSettingsSuccess('Credentials updated successfully!');
    setSettingsError('');
    
    // Reset form
    setCurrUser('');
    setCurrPass('');
    setNewUser('');
    setNewPass('');
    setConfirmPass('');

    setTimeout(() => {
      setSettingsSuccess('');
      setIsSettingsOpen(false);
    }, 2000);
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setName('');
    setCategory('dtf_sheet');
    setSubCategory('');
    setDescription('');
    setPrice(0);
    setOriginalPrice(undefined);
    setImageUrl('');
    setStock(100);
    setIsActive(true);
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setCategory(product.category);
    setSubCategory(product.sub_category || '');
    setDescription(product.description || '');
    setPrice(product.price);
    setOriginalPrice(product.original_price);
    setImageUrl(product.image_url);
    setStock(product.variants?.[0]?.stock_quantity ?? 100);
    setIsActive(product.is_active);
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || price <= 0 || !imageUrl) {
      setErrorMsg('Please fill in all required fields (Name, Price, Image URL).');
      return;
    }

    setSaving(true);
    setErrorMsg('');
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, {
          name,
          category,
          sub_category: subCategory || undefined,
          description,
          price: Number(price),
          original_price: originalPrice ? Number(originalPrice) : undefined,
          image_url: imageUrl,
          is_active: isActive
        }, Number(stock));
        setSuccessMsg('Product updated successfully!');
      } else {
        await createProduct({
          name,
          category,
          sub_category: subCategory || undefined,
          description,
          price: Number(price),
          original_price: originalPrice ? Number(originalPrice) : undefined,
          image_url: imageUrl
        }, Number(stock));
        setSuccessMsg('Product added successfully!');
      }
      
      setIsModalOpen(false);
      fetchProductsList();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setErrorMsg(err?.message || 'An error occurred while saving the product.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        setSuccessMsg('Product deleted successfully!');
        fetchProductsList();
        setTimeout(() => setSuccessMsg(''), 3000);
      } catch (err) {
        console.error('Delete failed:', err);
      }
    }
  };

  // Filter products list
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Calculate statistics
  const totalProducts = products.length;
  const outOfStockCount = products.filter((p) => (p.variants?.[0]?.stock_quantity ?? 0) === 0).length;
  const lowStockCount = products.filter((p) => {
    const s = p.variants?.[0]?.stock_quantity ?? 0;
    return s > 0 && s < 20;
  }).length;
  const activeCount = products.filter((p) => p.is_active).length;

  // 1. RENDER ADMIN LOGIN PORTAL IF NOT AUTHENTICATED
  if (!isAuthenticated) {
    return (
      <div className="w-full min-h-screen bg-background text-foreground flex items-center justify-center py-24 px-4 relative overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-[#8DFF00]/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(rgba(139,92,246,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

        <div className="w-full max-w-md rounded-3xl border border-border bg-card/20 backdrop-blur-md p-8 space-y-6 shadow-2xl relative z-10 animate-fade-in">
          
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#8DFF00] to-[#7acc00] flex items-center justify-center text-foreground mx-auto shadow-lg shadow-[#8DFF00]/20 mb-4">
              <Lock size={26} />
            </div>
            <h1 className="text-2xl font-black tracking-tight">Admin Authentication</h1>
            <p className="text-muted-foreground text-xs">Enter your administrative credentials to unlock the products catalog settings.</p>
          </div>

          {loginError && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold flex items-center gap-2 animate-pulse">
              <AlertTriangle size={14} className="shrink-0" />
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            
            {/* Username Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Admin Username</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <input
                  type="text"
                  required
                  disabled={lockoutTimeLeft > 0}
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="Enter admin username"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:border-[#8DFF00] focus:ring-1 focus:ring-[#8DFF00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                  disabled={lockoutTimeLeft > 0}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:border-[#8DFF00] focus:ring-1 focus:ring-[#8DFF00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={lockoutTimeLeft > 0}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#8DFF00] to-[#7acc00] hover:from-[#9eff1a] hover:to-[#9eff1a] disabled:from-zinc-700 disabled:to-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed text-foreground font-black text-xs uppercase tracking-wider shadow-lg shadow-[#8DFF00]/10 hover:shadow-[#8DFF00]/35 transition-all hover:scale-[1.02]"
            >
              {lockoutTimeLeft > 0 ? `Locked Out (Try in ${lockoutTimeLeft}s)` : 'Unlock Admin Panel'}
            </button>

          </form>

        </div>
      </div>
    );
  }

  // 2. RENDER MAIN ADMIN DASHBOARD
  return (
    <>
      <div className="w-full min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-[#8DFF00]/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/4 w-[350px] h-[350px] bg-[#8DFF00]/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-8">
        
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight flex items-center gap-2">
              <Package className="text-[#8DFF00]" />
              Product <span className="bg-gradient-to-r from-[#8DFF00] to-[#9eff1a] bg-clip-text text-transparent">Admin Panel</span>
            </h1>
            <p className="text-muted-foreground text-xs sm:text-sm mt-1">Manage your storefront product items, pricing, discounts, and inventory details.</p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Settings button */}
            <button
              onClick={() => {
                setSettingsError('');
                setSettingsSuccess('');
                setIsSettingsOpen(true);
              }}
              className="p-3 rounded-xl border border-border bg-card/50 hover:bg-card transition-colors text-muted-foreground hover:text-foreground"
              title="Credentials Settings"
            >
              <Settings size={16} />
            </button>
            {/* Refresh button */}
            <button
              onClick={fetchProductsList}
              className="p-3 rounded-xl border border-border bg-card/50 hover:bg-card transition-colors text-muted-foreground hover:text-foreground"
              title="Refresh Catalog"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
            {/* Add Product button */}
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#8DFF00] to-[#7acc00] hover:from-[#9eff1a] hover:to-[#9eff1a] text-foreground font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#8DFF00]/25 hover:shadow-[#8DFF00]/40 transition-all hover:scale-105"
            >
              <Plus size={16} />
              <span>Add Product</span>
            </button>
            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="p-3 rounded-xl border border-rose-950/20 bg-rose-950/10 hover:bg-rose-950/30 text-rose-450 hover:text-rose-400 transition-colors"
              title="Lock Admin Panel"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>

        {/* Success Notice */}
        {successMsg && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-fade-in">
            <CheckCircle size={16} />
            {successMsg}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl border border-border bg-card/10 backdrop-blur-md flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#8DFF00]/10 border border-[#8DFF00]/20 flex items-center justify-center text-[#8DFF00] shrink-0">
              <Package size={20} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Total Catalog</span>
              <span className="text-xl sm:text-2xl font-black text-foreground">{totalProducts} Items</span>
            </div>
          </div>
          <div className="p-5 rounded-2xl border border-border bg-card/10 backdrop-blur-md flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-rose-600/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
              <XCircle size={20} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Out of Stock</span>
              <span className="text-xl sm:text-2xl font-black text-rose-400">{outOfStockCount} Items</span>
            </div>
          </div>
          <div className="p-5 rounded-2xl border border-border bg-card/10 backdrop-blur-md flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-600/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <AlertTriangle size={20} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Low Inventory</span>
              <span className="text-xl sm:text-2xl font-black text-amber-400">{lowStockCount} items</span>
            </div>
          </div>
          <div className="p-5 rounded-2xl border border-border bg-card/10 backdrop-blur-md flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <CheckCircle size={20} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Active Products</span>
              <span className="text-xl sm:text-2xl font-black text-emerald-400">{activeCount} listed</span>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 rounded-2xl border border-border bg-card/20 backdrop-blur-sm">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, ID..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-xs text-foreground placeholder-zinc-500 focus:outline-none focus:border-[#8DFF00] transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mr-2 flex items-center gap-1.5"><Filter size={12} /> Filter:</span>
            {[
              { id: 'all', label: 'All' },
              { id: 'stencil', label: 'Stencils' },
              { id: 'screen-printing', label: 'Screen Print' },
              { id: 'dtf_sheet', label: 'DTF Printing' },
              { id: 'batik-stamp', label: 'Batik Stamps' },
              { id: 'materials', label: 'Consumables' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                  categoryFilter === cat.id 
                    ? 'bg-[#8DFF00] text-[#0a0a0a]' 
                    : 'bg-card border border-border text-muted-foreground hover:text-[#0a0a0a]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Table List */}
        <div className="rounded-2xl border border-border bg-card/10 backdrop-blur-sm overflow-hidden animate-fade-in">
          {loading ? (
            <div className="p-12 text-center text-muted-foreground flex flex-col items-center justify-center gap-2">
              <RefreshCw size={24} className="animate-spin text-[#8DFF00]" />
              <p className="text-xs mt-1">Loading product database catalog...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-16 text-center text-muted-foreground">
              <Package size={36} className="mx-auto text-muted-foreground mb-3" />
              <p className="text-sm font-semibold">No products found</p>
              <p className="text-xs mt-1">Try modifying filters or add a new item.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="bg-background border-b border-border text-muted-foreground font-bold uppercase tracking-wider text-[10px]">
                    <th className="p-4 w-16">Image</th>
                    <th className="p-4 w-52">Product Info</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Discount</th>
                    <th className="p-4 text-center">Stock</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900/50">
                  {filteredProducts.map((p) => {
                    const primaryStock = p.variants?.[0]?.stock_quantity ?? 0;
                    const discount = p.original_price ? Math.round(((p.original_price - p.price) / p.original_price) * 100) : 0;
                    
                    return (
                      <tr key={p.id} className="hover:bg-card/20 transition-colors">
                        <td className="p-4">
                          <div className="relative w-12 h-12 rounded-xl bg-background overflow-hidden border border-border">
                            <Image 
                              src={p.image_url} 
                              alt={p.name} 
                              fill 
                              className="object-cover"
                            />
                          </div>
                        </td>

                        <td className="p-4">
                          <div className="space-y-0.5">
                            <span className="font-extrabold text-foreground block text-xs line-clamp-1">{p.name}</span>
                            <span className="text-[10px] text-muted-foreground block truncate max-w-[190px]">{p.description}</span>
                            <span className="text-[9px] font-mono text-zinc-550 block select-all">ID: {p.id}</span>
                          </div>
                        </td>

                        <td className="p-4">
                          <span className="px-2 py-1 rounded bg-card border border-border text-muted-foreground text-[10px] font-semibold uppercase">
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
                              <span className="px-1.5 py-0.5 rounded bg-rose-600/10 text-rose-400 text-[9px] font-bold uppercase inline-block">
                                -{discount}% OFF
                              </span>
                            </div>
                          ) : (
                            <span className="text-zinc-650">—</span>
                          )}
                        </td>

                        <td className="p-4 text-center">
                          <span className={`font-black text-xs ${
                            primaryStock === 0 
                              ? 'text-rose-500' 
                              : primaryStock < 20 
                              ? 'text-amber-500' 
                              : 'text-foreground'
                          }`}>
                            {primaryStock}
                          </span>
                        </td>

                        <td className="p-4 text-center">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
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
                              onClick={() => openEditModal(p)}
                              className="p-2 rounded-lg bg-card border border-border hover:border-[#8DFF00]/40 text-muted-foreground hover:text-foreground transition-colors"
                              title="Edit Product"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(p.id)}
                              className="p-2 rounded-lg bg-card border border-border hover:border-rose-500/40 text-muted-foreground hover:text-rose-400 transition-colors"
                              title="Delete Product"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      </div> {/* End of main dashboard div */}

      {/* MODAL: CREDENTIALS SETTINGS */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-2xl">
            
            <div className="flex justify-between items-center border-b border-border pb-4">
              <h2 className="text-lg font-black text-foreground flex items-center gap-2">
                <Settings size={18} className="text-[#8DFF00]" />
                Change Admin Credentials
              </h2>
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="p-1 rounded-full bg-card border border-border text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {settingsError && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] font-semibold flex items-center gap-2">
                <AlertTriangle size={14} />
                {settingsError}
              </div>
            )}

            {settingsSuccess && (
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold flex items-center gap-2">
                <CheckCircle size={14} />
                {settingsSuccess}
              </div>
            )}

            <form onSubmit={handleUpdateCredentials} className="space-y-4">
              
              {/* Curr Username & Pass validation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">Current Username</label>
                  <input
                    type="text"
                    required
                    value={currUser}
                    onChange={(e) => setCurrUser(e.target.value)}
                    placeholder="admin"
                    className="w-full bg-card border border-border rounded-xl px-3.5 py-2 text-xs text-foreground focus:outline-none focus:border-[#8DFF00] transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">Current Password</label>
                  <input
                    type="password"
                    required
                    value={currPass}
                    onChange={(e) => setCurrPass(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-card border border-border rounded-xl px-3.5 py-2 text-xs text-foreground focus:outline-none focus:border-[#8DFF00] transition-colors"
                  />
                </div>
              </div>

              <hr className="border-border my-1" />

              {/* New Username */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">New Admin Username</label>
                <input
                  type="text"
                  required
                  value={newUser}
                  onChange={(e) => setNewUser(e.target.value)}
                  placeholder="e.g. admin_new"
                  className="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-xs text-foreground focus:outline-none focus:border-[#8DFF00] transition-colors"
                />
              </div>

              {/* New Password & Confirm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">New Password</label>
                  <input
                    type="password"
                    required
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-card border border-border rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:border-[#8DFF00] transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">Confirm Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-card border border-border rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:border-[#8DFF00] transition-colors"
                  />
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(false)}
                  className="px-5 py-2 text-xs font-bold border border-border hover:bg-card text-muted-foreground hover:text-foreground rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#8DFF00] to-[#7acc00] hover:from-[#9eff1a] hover:to-[#9eff1a] text-foreground font-black text-[10px] uppercase tracking-wider shadow-lg shadow-[#8DFF00]/10 hover:scale-[1.02] transition-all"
                >
                  Save Credentials
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* MODAL: ADD/EDIT PRODUCT */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-xl rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            
            <div className="flex justify-between items-center border-b border-border pb-4">
              <h2 className="text-lg font-black text-foreground flex items-center gap-2">
                {editingProduct ? <Edit size={18} className="text-[#8DFF00]" /> : <Plus size={18} className="text-[#8DFF00]" />}
                {editingProduct ? 'Edit Product Details' : 'Add New Catalog Item'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full bg-card border border-border text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] font-semibold flex items-center gap-2">
                <AlertTriangle size={14} />
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Product Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Premium White DTF Ink 1L"
                  className="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-xs text-foreground focus:outline-none focus:border-[#8DFF00] transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Category *</label>
                  <select
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                    className="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-xs text-foreground focus:outline-none focus:border-[#8DFF00] transition-colors"
                  >
                    <option value="stencil">Stencils</option>
                    <option value="screen-printing">Screen Printing</option>
                    <option value="dtf_sheet">DTF Printing</option>
                    <option value="batik-stamp">Batik Stamps</option>
                    <option value="materials">DTF printing Consumables</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Sub-category</label>
                  <input
                    type="text"
                    value={subCategory}
                    onChange={(e) => setSubCategory(e.target.value)}
                    placeholder="e.g. printing-materials, saree"
                    className="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-xs text-foreground focus:outline-none focus:border-[#8DFF00] transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter detailed product description..."
                  rows={3}
                  className="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-xs text-foreground focus:outline-none focus:border-[#8DFF00] transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Price (Rs.) *</label>
                  <input
                    type="number"
                    required
                    value={price || ''}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    placeholder="2500"
                    className="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-xs text-foreground focus:outline-none focus:border-[#8DFF00] transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Original Price (Discount)</label>
                  <input
                    type="number"
                    value={originalPrice || ''}
                    onChange={(e) => setOriginalPrice(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="3000"
                    className="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-xs text-foreground focus:outline-none focus:border-[#8DFF00] transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    placeholder="100"
                    className="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-xs text-foreground focus:outline-none focus:border-[#8DFF00] transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Image URL *</label>
                <input
                  type="text"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="e.g. /images/products/dtf-white-ink.jpg"
                  className="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-xs text-foreground focus:outline-none focus:border-[#8DFF00] transition-colors"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 rounded border-border bg-card text-[#7acc00] focus:ring-[#8DFF00]"
                  />
                  <span className="text-[10px] font-bold text-foreground uppercase tracking-wider">Product Is Active (Show in Shop)</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-border hover:bg-card text-muted-foreground hover:text-foreground text-xs font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#8DFF00] to-[#7acc00] hover:from-[#9eff1a] hover:to-[#9eff1a] text-foreground font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#8DFF00]/10 hover:shadow-[#8DFF00]/35 transition-all flex items-center gap-2"
                >
                  {saving && <RefreshCw size={12} className="animate-spin" />}
                  <span>{editingProduct ? 'Update Product' : 'Add Product'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </>
  );
}
