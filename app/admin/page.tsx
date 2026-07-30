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
  DollarSign, 
  Tags,
  CheckCircle,
  XCircle,
  Eye,
  Check,
  X
} from 'lucide-react';
import Image from 'next/image';

export default function AdminPanelPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'stencil' | 'screen-printing' | 'dtf_sheet' | 'batik-stamp' | 'materials'>('dtf_sheet');
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

  // Fetch products
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
    fetchProductsList();
  }, []);

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
        // Edit product
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
        // Add product
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

  return (
    <div className="w-full min-h-screen bg-zinc-950 text-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/4 w-[350px] h-[350px] bg-fuchsia-600/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-8">
        
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight flex items-center gap-2">
              <Package className="text-violet-400" />
              Product <span className="bg-gradient-to-r from-violet-400 to-fuchsia-500 bg-clip-text text-transparent">Admin Panel</span>
            </h1>
            <p className="text-zinc-500 text-xs sm:text-sm mt-1">Manage your storefront product items, pricing, discounts, and inventory details.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchProductsList}
              className="p-3 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 transition-colors text-zinc-400 hover:text-white"
              title="Refresh Catalog"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-violet-600/25 hover:shadow-violet-600/40 transition-all hover:scale-105"
            >
              <Plus size={16} />
              <span>Add Product</span>
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

        {/* Dashboard Statistics Widget */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1 */}
          <div className="p-5 rounded-2xl border border-zinc-900 bg-zinc-900/10 backdrop-blur-md flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400 shrink-0">
              <Package size={20} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Total Catalog</span>
              <span className="text-xl sm:text-2xl font-black text-white">{totalProducts} Items</span>
            </div>
          </div>
          {/* Card 2 */}
          <div className="p-5 rounded-2xl border border-zinc-900 bg-zinc-900/10 backdrop-blur-md flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-rose-600/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
              <XCircle size={20} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Out of Stock</span>
              <span className="text-xl sm:text-2xl font-black text-rose-400">{outOfStockCount} Items</span>
            </div>
          </div>
          {/* Card 3 */}
          <div className="p-5 rounded-2xl border border-zinc-900 bg-zinc-900/10 backdrop-blur-md flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-600/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <AlertTriangle size={20} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Low Inventory</span>
              <span className="text-xl sm:text-2xl font-black text-amber-400">{lowStockCount} items</span>
            </div>
          </div>
          {/* Card 4 */}
          <div className="p-5 rounded-2xl border border-zinc-900 bg-zinc-900/10 backdrop-blur-md flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <CheckCircle size={20} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Active Products</span>
              <span className="text-xl sm:text-2xl font-black text-emerald-400">{activeCount} listed</span>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 rounded-2xl border border-zinc-900 bg-zinc-900/20 backdrop-blur-sm">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, ID..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mr-2 flex items-center gap-1.5"><Filter size={12} /> Filter:</span>
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
                    ? 'bg-violet-600 text-white' 
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Products Table Container */}
        <div className="rounded-2xl border border-zinc-900 bg-zinc-900/10 backdrop-blur-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-zinc-500 flex flex-col items-center justify-center gap-2">
              <RefreshCw size={24} className="animate-spin text-violet-500" />
              <p className="text-xs mt-1">Loading product database catalog...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-16 text-center text-zinc-500">
              <Package size={36} className="mx-auto text-zinc-700 mb-3" />
              <p className="text-sm font-semibold">No products found</p>
              <p className="text-xs mt-1">Try modifying your query or category filters, or add a new item.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="bg-zinc-950 border-b border-zinc-900 text-zinc-400 font-bold uppercase tracking-wider text-[10px]">
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
                      <tr key={p.id} className="hover:bg-zinc-900/20 transition-colors">
                        {/* Image */}
                        <td className="p-4">
                          <div className="relative w-12 h-12 rounded-xl bg-zinc-950 overflow-hidden border border-zinc-800">
                            <Image 
                              src={p.image_url} 
                              alt={p.name} 
                              fill 
                              className="object-cover"
                            />
                          </div>
                        </td>

                        {/* Info */}
                        <td className="p-4">
                          <div className="space-y-0.5">
                            <span className="font-extrabold text-zinc-200 block text-xs line-clamp-1">{p.name}</span>
                            <span className="text-[10px] text-zinc-500 block truncate max-w-[190px]">{p.description}</span>
                            <span className="text-[9px] font-mono text-zinc-550 block select-all">ID: {p.id}</span>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="p-4">
                          <span className="px-2 py-1 rounded bg-zinc-900 border border-zinc-850 text-zinc-400 text-[10px] font-semibold uppercase">
                            {p.category.replace('_', ' ')}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="p-4 font-bold text-zinc-200">
                          Rs. {p.price.toLocaleString()}
                        </td>

                        {/* Discount */}
                        <td className="p-4">
                          {p.original_price ? (
                            <div className="space-y-0.5">
                              <span className="text-[10px] text-zinc-500 line-through block">Rs. {p.original_price.toLocaleString()}</span>
                              <span className="px-1.5 py-0.5 rounded bg-rose-600/10 text-rose-400 text-[9px] font-bold uppercase inline-block">
                                -{discount}% OFF
                              </span>
                            </div>
                          ) : (
                            <span className="text-zinc-650">—</span>
                          )}
                        </td>

                        {/* Stock */}
                        <td className="p-4 text-center">
                          <span className={`font-black text-xs ${
                            primaryStock === 0 
                              ? 'text-rose-500' 
                              : primaryStock < 20 
                              ? 'text-amber-500' 
                              : 'text-zinc-300'
                          }`}>
                            {primaryStock}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="p-4 text-center">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                            p.is_active 
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                              : 'bg-zinc-800 text-zinc-500 border border-zinc-850'
                          }`}>
                            {p.is_active ? 'Active' : 'Hidden'}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => openEditModal(p)}
                              className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-violet-500/40 text-zinc-400 hover:text-white transition-colors"
                              title="Edit Product"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(p.id)}
                              className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-rose-500/40 text-zinc-400 hover:text-rose-400 transition-colors"
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

      {/* UPSERT PRODUCT FORM MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-xl rounded-2xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-zinc-850 pb-4">
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                {editingProduct ? <Edit size={18} className="text-violet-400" /> : <Plus size={18} className="text-violet-400" />}
                {editingProduct ? 'Edit Product Details' : 'Add New Catalog Item'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full bg-zinc-900 border border-zinc-850 text-zinc-400 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] font-semibold flex items-center gap-2">
                <AlertTriangle size={14} />
                {errorMsg}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSave} className="space-y-4">
              
              {/* Product Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Product Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Premium White DTF Ink 1L"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>

              {/* Grid 2 Columns (Category & Sub-category) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Category *</label>
                  <select
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-300 focus:outline-none focus:border-violet-500 transition-colors"
                  >
                    <option value="stencil">Stencils</option>
                    <option value="screen-printing">Screen Printing</option>
                    <option value="dtf_sheet">DTF Printing</option>
                    <option value="batik-stamp">Batik Stamps</option>
                    <option value="materials">DTF printing Consumables</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Sub-category</label>
                  <input
                    type="text"
                    value={subCategory}
                    onChange={(e) => setSubCategory(e.target.value)}
                    placeholder="e.g. printing-materials, saree"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500 transition-colors"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter detailed product description..."
                  rows={3}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500 transition-colors resize-none"
                />
              </div>

              {/* Grid 3 Columns (Price, Original Price, Stock) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Price (Rs.) *</label>
                  <input
                    type="number"
                    required
                    value={price || ''}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    placeholder="2500"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500 transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Original Price (Discount)</label>
                  <input
                    type="number"
                    value={originalPrice || ''}
                    onChange={(e) => setOriginalPrice(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="3000"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500 transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    placeholder="100"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500 transition-colors"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Image URL *</label>
                <input
                  type="text"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="e.g. /images/products/dtf-white-ink.jpg"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>

              {/* Toggles (Is Active / Listed) */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 rounded border-zinc-800 bg-zinc-900 text-violet-600 focus:ring-violet-500"
                  />
                  <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-wider">Product Is Active (Show in Shop)</span>
                </label>
              </div>

              {/* Actions Footer */}
              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-850 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-zinc-850 hover:bg-zinc-900 text-zinc-400 hover:text-white text-xs font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-violet-600/10 hover:shadow-violet-600/35 transition-all flex items-center gap-2"
                >
                  {saving && <RefreshCw size={12} className="animate-spin" />}
                  <span>{editingProduct ? 'Update Product' : 'Add Product'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
