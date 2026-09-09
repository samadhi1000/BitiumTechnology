'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Trash2, 
  Printer, 
  Search, 
  User, 
  FileText, 
  Check, 
  DollarSign, 
  ShoppingBag, 
  Info,
  ChevronDown,
  Download,
  FileSpreadsheet,
  Calendar,
  TrendingUp,
  RotateCcw,
  Eye,
  Save,
  History,
  CreditCard,
  Wallet,
  Receipt,
  X,
  Clock,
  Sparkles
} from 'lucide-react';
import { getProducts, Product, Variant } from '@/lib/products';

export interface InvoiceLineItem {
  id: string; // unique for this line
  productId?: string;
  variantId?: string;
  name: string;
  size: string;
  price: number;
  quantity: number;
}

export interface SavedPOSInvoice {
  id: string;
  invoiceNo: string;
  invoiceDate: string;
  createdAt: string; // ISO timestamp
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  paymentMethod: 'Cash' | 'Card' | 'Bank Transfer' | 'PayHere';
  discountValue: number;
  discountType: 'percentage' | 'flat';
  discountAmount: number;
  extraCharges: number;
  extraChargesNotes: string;
  subtotal: number;
  totalAmount: number;
  lineItems: InvoiceLineItem[];
  printLayout: 'A4' | 'POS-80mm';
  status: 'PAID' | 'REFUNDED' | 'CANCELLED';
}

export default function POSInvoiceGenerator() {
  const [activeTab, setActiveTab] = useState<'generator' | 'history'>('generator');
  const [catalog, setCatalog] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [lineItems, setLineItems] = useState<InvoiceLineItem[]>([]);
  
  // Custom manual item inputs
  const [manualName, setManualName] = useState('');
  const [manualSize, setManualSize] = useState('Default');
  const [manualPrice, setManualPrice] = useState<number | ''>('');
  const [manualQty, setManualQty] = useState(1);

  // Customer details
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  
  // Invoice config
  const [invoiceNo, setInvoiceNo] = useState('');
  const [invoiceDate, setInvoiceDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Card' | 'Bank Transfer' | 'PayHere'>('Cash');
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [discountType, setDiscountType] = useState<'percentage' | 'flat'>('flat');
  const [extraCharges, setExtraCharges] = useState<number>(0);
  const [extraChargesNotes, setExtraChargesNotes] = useState('');

  // Print layout sizing format
  const [printLayout, setPrintLayout] = useState<'A4' | 'POS-80mm'>('A4');

  // Saved Invoices & Reports State
  const [savedInvoices, setSavedInvoices] = useState<SavedPOSInvoice[]>([]);
  const [historySearchQuery, setHistorySearchQuery] = useState('');
  const [dateFilterPreset, setDateFilterPreset] = useState<'all' | 'today' | 'week' | 'month' | 'custom'>('all');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [filterPaymentMethod, setFilterPaymentMethod] = useState<string>('all');
  const [loadedInvoiceId, setLoadedInvoiceId] = useState<string | null>(null);
  const [saveSuccessToast, setSaveSuccessToast] = useState('');

  const [isClient, setIsClient] = useState(false);

  // Generate a fresh unique invoice number
  const generateNewInvoiceNumber = () => {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeRef = now.getTime().toString().slice(-5);
    return `INV-${dateStr.replace(/-/g, '')}-${timeRef}`;
  };

  useEffect(() => {
    setIsClient(true);
    
    // Fetch products catalog
    async function loadCatalog() {
      const data = await getProducts();
      setCatalog(data);
    }
    loadCatalog();

    // Auto-generate invoice date and number
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    setInvoiceDate(dateStr);
    setInvoiceNo(generateNewInvoiceNumber());

    // Load saved POS invoices from localStorage
    try {
      const stored = localStorage.getItem('bitium_pos_invoices');
      if (stored) {
        setSavedInvoices(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load saved POS invoices from storage:', e);
    }
  }, []);

  // Filter products matching search in generator
  const filteredProducts = searchQuery.trim() === '' 
    ? [] 
    : catalog.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5);

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setSearchQuery('');
    if (product.variants && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
    } else {
      setSelectedVariant(null);
    }
  };

  const handleAddCatalogItem = () => {
    if (!selectedProduct) return;
    
    const price = selectedVariant 
      ? (selectedVariant.price_override ?? selectedProduct.price) 
      : selectedProduct.price;
      
    const sizeLabel = selectedVariant 
      ? (selectedVariant.attributes.size ?? 'Default') 
      : 'Default';

    // Check if duplicate exists
    const duplicateIndex = lineItems.findIndex(
      item => item.productId === selectedProduct.id && item.size === sizeLabel
    );

    if (duplicateIndex !== -1) {
      const updated = [...lineItems];
      updated[duplicateIndex].quantity += 1;
      setLineItems(updated);
    } else {
      const newItem: InvoiceLineItem = {
        id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
        productId: selectedProduct.id,
        variantId: selectedVariant?.id,
        name: selectedProduct.name,
        size: sizeLabel,
        price: price,
        quantity: 1
      };
      setLineItems([...lineItems, newItem]);
    }

    setSelectedProduct(null);
    setSelectedVariant(null);
  };

  const handleAddManualItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName.trim() || Number(manualPrice) <= 0) return;

    const newItem: InvoiceLineItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      name: manualName.trim(),
      size: manualSize.trim(),
      price: Number(manualPrice),
      quantity: manualQty
    };

    setLineItems([...lineItems, newItem]);
    setManualName('');
    setManualSize('Default');
    setManualPrice('');
    setManualQty(1);
  };

  const handleRemoveItem = (id: string) => {
    setLineItems(lineItems.filter(item => item.id !== id));
  };

  const handleQtyChange = (id: string, newQty: number) => {
    if (newQty < 1) return;
    setLineItems(lineItems.map(item => 
      item.id === id ? { ...item, quantity: newQty } : item
    ));
  };

  // Calculations
  const subtotal = lineItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = discountType === 'percentage' 
    ? Math.round(subtotal * (discountValue / 100)) 
    : discountValue;
  const totalAmount = Math.max(0, subtotal - discountAmount + extraCharges);

  // Save Invoice Record to LocalStorage
  const handleSaveInvoice = (silent = false): SavedPOSInvoice | null => {
    if (lineItems.length === 0) {
      if (!silent) alert('Please add at least one item before saving the invoice.');
      return null;
    }

    const currentInvNo = invoiceNo || generateNewInvoiceNumber();
    const currentInvDate = invoiceDate || new Date().toISOString().split('T')[0];

    const record: SavedPOSInvoice = {
      id: loadedInvoiceId || `inv-${Date.now()}`,
      invoiceNo: currentInvNo,
      invoiceDate: currentInvDate,
      createdAt: new Date().toISOString(),
      customerName: customerName.trim() || 'Walk-in Client',
      customerPhone: customerPhone.trim(),
      customerAddress: customerAddress.trim(),
      paymentMethod,
      discountValue,
      discountType,
      discountAmount,
      extraCharges,
      extraChargesNotes,
      subtotal,
      totalAmount,
      lineItems: [...lineItems],
      printLayout,
      status: 'PAID'
    };

    const existingIndex = savedInvoices.findIndex(i => i.invoiceNo === record.invoiceNo);
    let updated: SavedPOSInvoice[];
    if (existingIndex >= 0) {
      updated = [...savedInvoices];
      updated[existingIndex] = record;
    } else {
      updated = [record, ...savedInvoices];
    }

    setSavedInvoices(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('bitium_pos_invoices', JSON.stringify(updated));
    }

    setSaveSuccessToast(`Invoice ${record.invoiceNo} saved successfully!`);
    setTimeout(() => setSaveSuccessToast(''), 4000);

    return record;
  };

  // Print & Auto-Save
  const handlePrintAndSave = () => {
    if (lineItems.length === 0) return;
    handleSaveInvoice(true);
    window.print();
  };

  // Reset to a blank new invoice
  const handleResetNewInvoice = () => {
    setLineItems([]);
    setCustomerName('');
    setCustomerPhone('');
    setCustomerAddress('');
    setDiscountValue(0);
    setExtraCharges(0);
    setExtraChargesNotes('');
    setPaymentMethod('Cash');
    setLoadedInvoiceId(null);
    setInvoiceDate(new Date().toISOString().split('T')[0]);
    setInvoiceNo(generateNewInvoiceNumber());
    setSaveSuccessToast('Initialized a new blank invoice.');
    setTimeout(() => setSaveSuccessToast(''), 3000);
  };

  // Load an invoice from history into editor
  const handleLoadInvoice = (inv: SavedPOSInvoice) => {
    setLoadedInvoiceId(inv.id);
    setInvoiceNo(inv.invoiceNo);
    setInvoiceDate(inv.invoiceDate);
    setCustomerName(inv.customerName === 'Walk-in Client' ? '' : inv.customerName);
    setCustomerPhone(inv.customerPhone || '');
    setCustomerAddress(inv.customerAddress || '');
    setPaymentMethod(inv.paymentMethod || 'Cash');
    setDiscountValue(inv.discountValue || 0);
    setDiscountType(inv.discountType || 'flat');
    setExtraCharges(inv.extraCharges || 0);
    setExtraChargesNotes(inv.extraChargesNotes || '');
    setLineItems(inv.lineItems || []);
    setPrintLayout(inv.printLayout || 'A4');
    setActiveTab('generator');

    setSaveSuccessToast(`Loaded invoice ${inv.invoiceNo} into preview!`);
    setTimeout(() => setSaveSuccessToast(''), 4000);
  };

  // Delete an invoice from history
  const handleDeleteInvoice = (id: string, invNo: string) => {
    if (confirm(`Are you sure you want to delete invoice ${invNo} from history?`)) {
      const updated = savedInvoices.filter(i => i.id !== id && i.invoiceNo !== invNo);
      setSavedInvoices(updated);
      if (typeof window !== 'undefined') {
        localStorage.setItem('bitium_pos_invoices', JSON.stringify(updated));
      }
      if (loadedInvoiceId === id) {
        handleResetNewInvoice();
      }
    }
  };

  // ─── Filtered Invoices for History & Reports ───
  const filteredHistoryInvoices = useMemo(() => {
    return savedInvoices.filter(inv => {
      // 1. Text Search Filter
      const q = historySearchQuery.trim().toLowerCase();
      if (q) {
        const matchNo = inv.invoiceNo.toLowerCase().includes(q);
        const matchName = inv.customerName.toLowerCase().includes(q);
        const matchPhone = inv.customerPhone.toLowerCase().includes(q);
        const matchItems = inv.lineItems.some(item => item.name.toLowerCase().includes(q));
        if (!matchNo && !matchName && !matchPhone && !matchItems) return false;
      }

      // 2. Payment Method Filter
      if (filterPaymentMethod !== 'all' && inv.paymentMethod !== filterPaymentMethod) {
        return false;
      }

      // 3. Date Presets Filter
      const invDate = new Date(inv.invoiceDate || inv.createdAt);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (dateFilterPreset === 'today') {
        const checkDate = new Date(inv.invoiceDate);
        checkDate.setHours(0, 0, 0, 0);
        if (checkDate.getTime() !== today.getTime()) return false;
      } else if (dateFilterPreset === 'week') {
        const weekAgo = new Date(today);
        weekAgo.setDate(today.getDate() - 7);
        if (invDate < weekAgo) return false;
      } else if (dateFilterPreset === 'month') {
        const monthAgo = new Date(today);
        monthAgo.setDate(today.getDate() - 30);
        if (invDate < monthAgo) return false;
      } else if (dateFilterPreset === 'custom') {
        if (filterStartDate) {
          const start = new Date(filterStartDate);
          start.setHours(0, 0, 0, 0);
          if (invDate < start) return false;
        }
        if (filterEndDate) {
          const end = new Date(filterEndDate);
          end.setHours(23, 59, 59, 999);
          if (invDate > end) return false;
        }
      }

      return true;
    });
  }, [savedInvoices, historySearchQuery, filterPaymentMethod, dateFilterPreset, filterStartDate, filterEndDate]);

  // Financial KPIs
  const totalSalesRevenue = filteredHistoryInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const totalInvoicesCount = filteredHistoryInvoices.length;
  const cashSalesTotal = filteredHistoryInvoices.filter(i => i.paymentMethod === 'Cash').reduce((sum, i) => sum + i.totalAmount, 0);
  const cardAndOnlineTotal = filteredHistoryInvoices.filter(i => i.paymentMethod !== 'Cash').reduce((sum, i) => sum + i.totalAmount, 0);
  const averageOrderValue = totalInvoicesCount > 0 ? Math.round(totalSalesRevenue / totalInvoicesCount) : 0;

  // Export to Excel CSV Report
  const handleExportCSV = () => {
    if (filteredHistoryInvoices.length === 0) {
      alert('No invoices found matching current filters to export.');
      return;
    }

    const headers = [
      'Invoice No',
      'Date',
      'Time',
      'Customer Name',
      'Customer Phone',
      'Billing Address',
      'Items Summary',
      'Total Items Qty',
      'Subtotal (Rs.)',
      'Discount (Rs.)',
      'Extra Charges (Rs.)',
      'Grand Total (Rs.)',
      'Payment Method',
      'Format',
      'Status'
    ];

    const rows = filteredHistoryInvoices.map(inv => {
      const itemsSummary = inv.lineItems.map(i => `${i.name} [${i.size}] x${i.quantity} (Rs.${i.price})`).join('; ');
      const totalQty = inv.lineItems.reduce((sum, i) => sum + i.quantity, 0);
      const createdTime = inv.createdAt ? new Date(inv.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

      return [
        `"${inv.invoiceNo}"`,
        `"${inv.invoiceDate}"`,
        `"${createdTime}"`,
        `"${(inv.customerName || 'Walk-in Client').replace(/"/g, '""')}"`,
        `"${(inv.customerPhone || '').replace(/"/g, '""')}"`,
        `"${(inv.customerAddress || '').replace(/"/g, '""')}"`,
        `"${itemsSummary.replace(/"/g, '""')}"`,
        totalQty,
        inv.subtotal,
        inv.discountAmount,
        inv.extraCharges,
        inv.totalAmount,
        `"${inv.paymentMethod}"`,
        `"${inv.printLayout}"`,
        `"${inv.status || 'PAID'}"`
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    const dateTag = new Date().toISOString().split('T')[0];
    link.setAttribute('download', `Bitium_POS_Sales_Report_${dateTag}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isClient) return null;

  return (
    <div className="space-y-6">
      
      {/* ─── TOP LEVEL TAB SWITCHER & HEADER (Hidden in Print) ─── */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-card/40 border border-border print:hidden">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('generator')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'generator'
                ? 'bg-[#2CFF05] text-black shadow-lg shadow-[#2CFF05]/15'
                : 'bg-card text-muted-foreground hover:text-foreground border border-border'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>Create Invoice</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'history'
                ? 'bg-[#2CFF05] text-black shadow-lg shadow-[#2CFF05]/15'
                : 'bg-card text-muted-foreground hover:text-foreground border border-border'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Invoice History &amp; Reports</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
              activeTab === 'history' ? 'bg-black text-[#2CFF05]' : 'bg-[#2CFF05]/20 text-[#2CFF05]'
            }`}>
              {savedInvoices.length}
            </span>
          </button>
        </div>

        {/* Status Toast / Loaded indicator */}
        <div className="flex items-center gap-2.5">
          {saveSuccessToast && (
            <span className="text-xs font-semibold text-[#2CFF05] bg-[#2CFF05]/10 border border-[#2CFF05]/30 px-3 py-1.5 rounded-xl flex items-center gap-1.5 animate-in fade-in duration-200">
              <Check className="w-3.5 h-3.5" />
              {saveSuccessToast}
            </span>
          )}

          {activeTab === 'generator' && (
            <button
              type="button"
              onClick={handleResetNewInvoice}
              className="px-3 py-2 rounded-xl bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              title="Start a new blank invoice"
            >
              <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
              <span>New Invoice</span>
            </button>
          )}
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* ── TAB 1: CREATE INVOICE GENERATOR & LIVE BILL PREVIEW ───── */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'generator' && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          
          {/* ─── LEFT COLUMN: PRODUCT INTAKE & INVOICE CONTROLS (7 cols) ─── */}
          <div className="xl:col-span-7 space-y-6 print:hidden">
            
            {/* Step 1: Customer Details */}
            <div className="p-5 rounded-2xl border border-border bg-card/15 backdrop-blur-md space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#2CFF05] flex items-center gap-2">
                <User size={14} />
                <span>01. Walk-In Customer Info</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-muted-foreground uppercase">Customer Name</label>
                  <input 
                    type="text" 
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    placeholder="Walk-in Buyer / Cash Customer"
                    className="w-full bg-background border border-border rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-[#2CFF05] transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-muted-foreground uppercase">Phone / WhatsApp</label>
                  <input 
                    type="text" 
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value)}
                    placeholder="e.g. 077 123 4567"
                    className="w-full bg-background border border-border rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-[#2CFF05] transition-colors"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-muted-foreground uppercase">Billing Address (Optional)</label>
                <input 
                  type="text" 
                  value={customerAddress}
                  onChange={e => setCustomerAddress(e.target.value)}
                  placeholder="Store purchase / Colombo, Sri Lanka"
                  className="w-full bg-background border border-border rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-[#2CFF05] transition-colors"
                />
              </div>
            </div>

            {/* Step 2: Catalog Selector */}
            <div className="relative z-[40] p-5 rounded-2xl border border-border bg-card/15 backdrop-blur-md space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#2CFF05] flex items-center gap-2">
                <ShoppingBag size={14} />
                <span>02. Select Products from Catalog</span>
              </h3>
              
              <div className="relative z-[50]">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={15} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search store items to add (e.g. stencil, dtf)..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-xs focus:outline-none focus:border-[#2CFF05] transition-colors"
                />
                {filteredProducts.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 border border-border bg-slate-950 rounded-xl shadow-2xl overflow-hidden z-[60]">
                    {filteredProducts.map(p => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleProductSelect(p)}
                        className="w-full px-4 py-2.5 text-left text-xs hover:bg-card/40 flex items-center justify-between border-b border-border/50 last:border-b-0 cursor-pointer"
                      >
                        <div>
                          <strong className="text-foreground">{p.name}</strong>
                          <span className="text-[9px] text-muted-foreground ml-2 uppercase font-semibold">({p.category})</span>
                        </div>
                        <span className="font-extrabold text-[#2CFF05]">Rs. {p.price.toLocaleString()}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {selectedProduct && (
                <div className="p-4 rounded-xl border border-[#2CFF05]/20 bg-[#2CFF05]/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-foreground">{selectedProduct.name}</h4>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Base price: Rs. {selectedProduct.price.toLocaleString()}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {selectedProduct.variants && selectedProduct.variants.length > 0 && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-bold text-muted-foreground uppercase">Size:</span>
                        <select
                          value={selectedVariant?.id || ''}
                          onChange={e => {
                            const find = selectedProduct.variants?.find(v => v.id === e.target.value);
                            if (find) setSelectedVariant(find);
                          }}
                          className="bg-background border border-border rounded-lg px-2.5 py-1 text-[11px] focus:outline-none text-foreground font-bold"
                        >
                          {selectedProduct.variants.map(v => (
                            <option key={v.id} value={v.id}>
                              {v.attributes.size} - Rs.{(v.price_override ?? selectedProduct.price).toLocaleString()}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={handleAddCatalogItem}
                      className="px-4 py-1.5 rounded-lg bg-[#2CFF05] hover:bg-[#7acc00] text-black font-extrabold text-[11px] uppercase tracking-wider transition-all cursor-pointer"
                    >
                      Add Item
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Step 3: Manual Custom Item Adder */}
            <form onSubmit={handleAddManualItem} className="relative z-10 p-5 rounded-2xl border border-border bg-card/15 backdrop-blur-md space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#2CFF05] flex items-center gap-2">
                <Plus size={14} />
                <span>03. Add Custom / Manual Work</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                <div className="sm:col-span-5 space-y-1">
                  <label className="text-[9px] font-bold text-muted-foreground uppercase">Description / Custom Work</label>
                  <input 
                    type="text" 
                    required
                    value={manualName}
                    onChange={e => setManualName(e.target.value)}
                    placeholder="e.g. Printing services, exposed screen custom"
                    className="w-full bg-background border border-border rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-[#2CFF05] transition-colors"
                  />
                </div>
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[9px] font-bold text-muted-foreground uppercase">Size</label>
                  <input 
                    type="text" 
                    value={manualSize}
                    onChange={e => setManualSize(e.target.value)}
                    placeholder="e.g. A3, Meters"
                    className="w-full bg-background border border-border rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-[#2CFF05] transition-colors"
                  />
                </div>
                <div className="sm:col-span-3 space-y-1">
                  <label className="text-[9px] font-bold text-muted-foreground uppercase">Price (Rs.)</label>
                  <input 
                    type="number" 
                    required
                    value={manualPrice}
                    onChange={e => setManualPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="Price"
                    className="w-full bg-background border border-border rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-[#2CFF05] transition-colors"
                  />
                </div>
                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-card border border-border hover:border-[#2CFF05]/45 hover:bg-card/50 text-[#2CFF05] font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus size={14} /> Add
                  </button>
                </div>
              </div>
            </form>

            {/* Step 4: Invoice Charges, Discount & Payments */}
            <div className="p-5 rounded-2xl border border-border bg-card/15 backdrop-blur-md space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#2CFF05] flex items-center gap-2">
                <DollarSign size={14} />
                <span>04. Discounts, Extra Fees &amp; Pay Type</span>
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Discount */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-muted-foreground uppercase">Discount Value</label>
                  <div className="flex rounded-xl overflow-hidden border border-border">
                    <input 
                      type="number" 
                      value={discountValue || ''}
                      onChange={e => setDiscountValue(Number(e.target.value))}
                      placeholder="0"
                      className="w-full bg-background border-none px-3 py-2 text-xs focus:outline-none text-foreground font-bold"
                    />
                    <button
                      type="button"
                      onClick={() => setDiscountType(discountType === 'percentage' ? 'flat' : 'percentage')}
                      className="bg-card px-3 text-[10px] font-black border-l border-border hover:bg-muted text-primary cursor-pointer"
                    >
                      {discountType === 'percentage' ? '%' : 'Rs.'}
                    </button>
                  </div>
                </div>

                {/* Extra Charges */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-muted-foreground uppercase">Delivery / Extra Fees (Rs.)</label>
                  <input 
                    type="number" 
                    value={extraCharges || ''}
                    onChange={e => setExtraCharges(Number(e.target.value))}
                    placeholder="0"
                    className="w-full bg-background border border-border rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-[#2CFF05] transition-colors text-foreground font-bold"
                  />
                </div>

                {/* Payment Method */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-muted-foreground uppercase">Payment Type</label>
                  <select
                    value={paymentMethod}
                    onChange={e => setPaymentMethod(e.target.value as any)}
                    className="w-full bg-background border border-border rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-[#2CFF05] transition-colors text-foreground font-bold cursor-pointer"
                  >
                    <option value="Cash">💵 Cash</option>
                    <option value="Card">💳 Card Payment</option>
                    <option value="Bank Transfer">🏦 Bank Transfer</option>
                    <option value="PayHere">🔒 PayHere Online</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-muted-foreground uppercase">Notes for Delivery / Extra Fees</label>
                <input 
                  type="text" 
                  value={extraChargesNotes}
                  onChange={e => setExtraChargesNotes(e.target.value)}
                  placeholder="e.g. Shipping cost, special packaging, design review service"
                  className="w-full bg-background border border-border rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-[#2CFF05] transition-colors"
                />
              </div>
            </div>

          </div>

          {/* ─── RIGHT COLUMN: INVOICE PREVIEW & PRINTING (5 cols) ─── */}
          <div className="xl:col-span-5 space-y-6">
            
            {/* Toggle print Layout formats */}
            <div className="p-4 rounded-2xl border border-border bg-card/10 backdrop-blur-sm space-y-2.5 print:hidden">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider block">📐 Select Receipt / Bill Format</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPrintLayout('A4')}
                  className={`py-2 rounded-xl text-[11px] font-black uppercase tracking-wider border transition-all cursor-pointer ${
                    printLayout === 'A4'
                      ? 'bg-[#2CFF05]/15 border-[#2CFF05]/30 text-[#2CFF05]'
                      : 'bg-background border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  📄 A4 Standard Bill
                </button>
                <button
                  type="button"
                  onClick={() => setPrintLayout('POS-80mm')}
                  className={`py-2 rounded-xl text-[11px] font-black uppercase tracking-wider border transition-all cursor-pointer ${
                    printLayout === 'POS-80mm'
                      ? 'bg-[#2CFF05]/15 border-[#2CFF05]/30 text-[#2CFF05]'
                      : 'bg-background border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  📟 POS Receipt (80mm)
                </button>
              </div>
            </div>

            {/* Action Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 print:hidden">
              <button
                type="button"
                onClick={() => handleSaveInvoice(false)}
                disabled={lineItems.length === 0}
                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-card border border-border hover:border-[#2CFF05]/40 hover:bg-card/60 disabled:opacity-40 text-foreground font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                <Save size={15} className="text-[#2CFF05]" />
                <span>Save Invoice</span>
              </button>

              <button
                type="button"
                onClick={handlePrintAndSave}
                disabled={lineItems.length === 0}
                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#2CFF05] hover:bg-[#7acc00] disabled:bg-zinc-700 disabled:opacity-40 text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-[#2CFF05]/15 transition-all cursor-pointer hover:scale-[1.01]"
              >
                <Printer size={15} />
                <span>Print &amp; Auto-Save</span>
              </button>
            </div>

            {/* ── INVOICE SHEET AREA ── */}
            <div 
              id="invoice-print-area" 
              className={`bg-white text-zinc-900 border border-zinc-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative print:border-none print:shadow-none print:p-0 print:m-0 ${
                printLayout === 'POS-80mm' ? 'invoice-pos-layout max-w-[80mm] mx-auto' : 'invoice-a4-layout'
              }`}
            >
              {/* Print Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5 logo-wrapper shrink-0">
                    <img 
                      src="/images/bitium-logo.webp" 
                      alt="Bitium Technology Logo" 
                      className="w-10 h-10 rounded-full object-cover border border-zinc-200 shadow-sm shrink-0" 
                    />
                    <div className="flex flex-col justify-center">
                      <div className="font-black text-base tracking-wider text-zinc-950 uppercase leading-none flex items-center gap-0.5">
                        B<span className="text-[#ff1a3c]">!</span>T<span className="text-[#ff1a3c]">!</span>UM
                      </div>
                      <div className="text-[8.5px] font-extrabold tracking-[0.22em] text-zinc-800 uppercase leading-tight mt-0.5">
                        TECHNOLOGY
                      </div>
                    </div>
                  </div>
                  <p className="text-[9px] text-zinc-600 font-medium leading-relaxed max-w-[240px] shop-details">
                    <strong className="text-zinc-900 font-bold block">Bitium Technology (Pvt) Ltd.</strong>
                    1391/1 New Town Digana Rajawella, Digana, Sri Lanka, 20180<br />
                    <span className="text-zinc-700">Email: hello@bitiumtechnology.com</span><br />
                    <span className="text-zinc-700">Phone: +94 77 973 1097 / +94 71 552 0897</span>
                  </p>
                </div>
                <div className="text-right space-y-1">
                  <h2 className="text-lg font-black tracking-tight text-emerald-800 uppercase leading-none header-title">Bill / Invoice</h2>
                  <div className="text-[10px] font-bold text-zinc-500 font-mono details-list">
                    <div>No: {invoiceNo || 'Draft'}</div>
                    <div>Date: {invoiceDate}</div>
                    <div>Pay Method: {paymentMethod}</div>
                  </div>
                </div>
              </div>

              <hr className="border-zinc-200" />

              {/* Customer info */}
              <div className="grid grid-cols-2 gap-4 text-[10px] leading-relaxed customer-section">
                <div>
                  <span className="font-extrabold text-zinc-400 uppercase block tracking-wider text-[8px]">Invoiced To:</span>
                  <strong className="text-zinc-800 text-xs block">{customerName || 'Cash Walk-in Client'}</strong>
                  {customerPhone && <div className="text-zinc-600 font-medium font-mono">WhatsApp: {customerPhone}</div>}
                  {customerAddress && <div className="text-zinc-500">{customerAddress}</div>}
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-zinc-400 uppercase block tracking-wider text-[8px]">Store Outlet:</span>
                  <strong className="text-zinc-700 block">Bitium Tech Main Branch</strong>
                  <span className="text-zinc-500">Walk-in Order Register</span>
                </div>
              </div>

              {/* Table of items */}
              <div className="space-y-2">
                <table className="w-full border-collapse text-left text-[10px] items-table">
                  <thead>
                    <tr className="border-b-2 border-zinc-300 text-zinc-500 font-extrabold uppercase text-[8px] tracking-wider">
                      <th className="py-2">Item Description</th>
                      <th className="py-2 text-center w-14 col-size">Size</th>
                      <th className="py-2 text-right w-16 col-price">Price</th>
                      <th className="py-2 text-center w-12 col-qty">Qty</th>
                      <th className="py-2 text-right w-20 col-total">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-150">
                    {lineItems.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-zinc-400 italic">
                          No items added to invoice yet. Add catalog products or manual work lines to generate bill layout.
                        </td>
                      </tr>
                    ) : (
                      lineItems.map(item => (
                        <tr key={item.id} className="align-middle">
                          <td className="py-2.5 font-bold text-zinc-800 item-name">
                            {item.name}
                          </td>
                          <td className="py-2.5 text-center text-zinc-500 font-mono font-bold col-size">
                            {item.size}
                          </td>
                          <td className="py-2.5 text-right font-mono text-zinc-600 font-semibold col-price">
                            Rs.{item.price.toLocaleString()}
                          </td>
                          <td className="py-2.5 text-center col-qty">
                            <div className="inline-flex items-center gap-1">
                              <button 
                                type="button"
                                onClick={() => handleQtyChange(item.id, item.quantity - 1)}
                                className="w-4 h-4 border border-zinc-300 rounded hover:bg-zinc-100 flex items-center justify-center font-bold text-[9px] print:hidden cursor-pointer"
                              >
                                -
                              </button>
                              <span className="font-extrabold text-zinc-800 font-mono w-4 text-center">{item.quantity}</span>
                              <button 
                                type="button"
                                onClick={() => handleQtyChange(item.id, item.quantity + 1)}
                                className="w-4 h-4 border border-zinc-300 rounded hover:bg-zinc-100 flex items-center justify-center font-bold text-[9px] print:hidden cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="py-2.5 text-right font-bold text-zinc-950 font-mono col-total">
                            Rs.{(item.price * item.quantity).toLocaleString()}
                          </td>
                          <td className="py-2.5 text-right pl-2 print:hidden w-8">
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(item.id)}
                              className="p-1 rounded text-rose-500 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
                              title="Remove item"
                            >
                              <Trash2 size={12} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <hr className="border-zinc-200" />

              {/* Pricing breakdowns */}
              <div className="flex justify-between items-start gap-4 flex-wrap sm:flex-nowrap summary-section">
                <div className="text-[9px] text-zinc-400 max-w-[200px] leading-relaxed payment-info flex-grow">
                  <span className="font-extrabold uppercase text-[8px] block tracking-wider mb-0.5">Payment Status:</span>
                  <div className="font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded inline-block text-[9px]">
                    ✓ FULLY PAID &mdash; RECEIVED via {paymentMethod.toUpperCase()}
                  </div>
                  <p className="mt-2 verify-note">Products are checked &amp; verified. Please inspect goods before leaving checkout register.</p>
                </div>
                
                <div className="w-48 text-[10px] space-y-1.5 font-mono text-zinc-650 shrink-0 calculations-list">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-bold text-zinc-800">Rs. {subtotal.toLocaleString()}</span>
                  </div>
                  
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-rose-650 font-bold">
                      <span>Discount:</span>
                      <span>-Rs. {discountAmount.toLocaleString()}</span>
                    </div>
                  )}

                  {extraCharges > 0 && (
                    <div className="flex justify-between">
                      <span className="truncate max-w-[100px]" title={extraChargesNotes || 'Extra charges'}>
                        Extra / Deliv:
                      </span>
                      <span className="font-bold text-zinc-800">Rs. {extraCharges.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="border-t border-zinc-200 pt-1.5 flex justify-between text-xs font-black text-zinc-950">
                    <span>Grand Total:</span>
                    <span className="text-emerald-800">Rs. {totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <hr className="border-zinc-200" />

              {/* Invoice Footer */}
              <div className="text-center space-y-2 pt-2 invoice-footer">
                <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest leading-none footer-thanks">
                  Thank you for printing with Bitium Technology!
                </p>
                <p className="text-[8px] text-zinc-400 leading-normal max-w-sm mx-auto footer-legal">
                  This is a computer generated invoice for store register purchases. No signature required. 
                  Returns accepted within 7 days with original packaging intact.
                </p>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* ── TAB 2: INVOICE HISTORY & SALES REPORTS ─────────────────── */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          
          {/* KPI Metrics Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl border border-border bg-card/15 backdrop-blur-md flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#2CFF05]/15 border border-[#2CFF05]/30 flex items-center justify-center text-[#2CFF05] shrink-0">
                <DollarSign size={24} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Total Sales Revenue</span>
                <span className="text-xl sm:text-2xl font-black text-foreground">Rs. {totalSalesRevenue.toLocaleString()}</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-border bg-card/15 backdrop-blur-md flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-600/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                <FileText size={24} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Invoices Issued</span>
                <span className="text-xl sm:text-2xl font-black text-cyan-400">{totalInvoicesCount} Orders</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-border bg-card/15 backdrop-blur-md flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-600/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <Wallet size={24} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Cash Payments</span>
                <span className="text-xl sm:text-2xl font-black text-emerald-400">Rs. {cashSalesTotal.toLocaleString()}</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-border bg-card/15 backdrop-blur-md flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-600/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                <CreditCard size={24} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Card &amp; Bank / Online</span>
                <span className="text-xl sm:text-2xl font-black text-purple-400">Rs. {cardAndOnlineTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="p-5 rounded-2xl border border-border bg-card/15 backdrop-blur-md space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              
              {/* Search input */}
              <div className="relative flex-1 min-w-[240px] max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={15} />
                <input 
                  type="text" 
                  value={historySearchQuery}
                  onChange={e => setHistorySearchQuery(e.target.value)}
                  placeholder="Search by Invoice No, Customer, Phone, Items..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-background text-xs focus:outline-none focus:border-[#2CFF05] transition-colors"
                />
                {historySearchQuery && (
                  <button 
                    type="button" 
                    onClick={() => setHistorySearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Date Presets */}
              <div className="flex flex-wrap items-center gap-1.5 bg-background p-1 rounded-xl border border-border">
                {(['all', 'today', 'week', 'month', 'custom'] as const).map(preset => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setDateFilterPreset(preset)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                      dateFilterPreset === preset
                        ? 'bg-[#2CFF05] text-black shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {preset === 'all' ? 'All Time' : preset === 'week' ? 'This Week' : preset === 'month' ? 'This Month' : preset}
                  </button>
                ))}
              </div>

              {/* Payment Method Selector */}
              <select
                value={filterPaymentMethod}
                onChange={e => setFilterPaymentMethod(e.target.value)}
                className="bg-background border border-border rounded-xl px-3 py-2 text-xs font-bold text-foreground focus:outline-none focus:border-[#2CFF05] cursor-pointer"
              >
                <option value="all">All Payment Types</option>
                <option value="Cash">Cash Only</option>
                <option value="Card">Card Only</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="PayHere">PayHere Online</option>
              </select>

              {/* Export to CSV Button */}
              <button
                type="button"
                onClick={handleExportCSV}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                title="Download Sales Report in CSV/Excel format"
              >
                <FileSpreadsheet size={15} />
                <span>Export Excel (CSV)</span>
              </button>

            </div>

            {/* Custom Date Range Picker */}
            {dateFilterPreset === 'custom' && (
              <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-border/50 animate-in fade-in duration-150">
                <span className="text-xs font-bold text-muted-foreground">From Date:</span>
                <input 
                  type="date" 
                  value={filterStartDate}
                  onChange={e => setFilterStartDate(e.target.value)}
                  className="bg-background border border-border rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-[#2CFF05]"
                />
                <span className="text-xs font-bold text-muted-foreground">To Date:</span>
                <input 
                  type="date" 
                  value={filterEndDate}
                  onChange={e => setFilterEndDate(e.target.value)}
                  className="bg-background border border-border rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-[#2CFF05]"
                />
                {(filterStartDate || filterEndDate) && (
                  <button
                    type="button"
                    onClick={() => { setFilterStartDate(''); setFilterEndDate(''); }}
                    className="text-xs text-red-400 hover:underline cursor-pointer"
                  >
                    Clear dates
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Invoices History Table */}
          <div className="bg-card/20 border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="bg-background/80 border-b border-border text-muted-foreground font-bold uppercase tracking-wider text-[10px]">
                    <th className="p-4 w-36">Invoice No</th>
                    <th className="p-4 w-28">Date</th>
                    <th className="p-4">Customer Details</th>
                    <th className="p-4">Items Summary</th>
                    <th className="p-4 text-center">Pay Method</th>
                    <th className="p-4 text-right">Grand Total</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {filteredHistoryInvoices.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-12 text-center text-muted-foreground italic">
                        {savedInvoices.length === 0 
                          ? 'No POS invoices have been saved yet. Print or Save an invoice from the "Create Invoice" tab to see records here.' 
                          : 'No invoices found matching your current filter / search query.'}
                      </td>
                    </tr>
                  ) : (
                    filteredHistoryInvoices.map(inv => (
                      <tr key={inv.id} className="hover:bg-card/40 transition-colors">
                        <td className="p-4 font-mono font-bold text-foreground">
                          <span className="px-2 py-1 rounded-lg bg-secondary/80 border border-border text-xs">
                            {inv.invoiceNo}
                          </span>
                        </td>
                        <td className="p-4 text-muted-foreground font-mono text-[11px]">
                          {inv.invoiceDate}
                        </td>
                        <td className="p-4">
                          <div className="space-y-0.5">
                            <span className="font-bold text-foreground block text-xs">
                              {inv.customerName || 'Walk-in Client'}
                            </span>
                            {inv.customerPhone && (
                              <span className="text-[11px] font-mono text-[#2CFF05] block">
                                {inv.customerPhone}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="max-w-xs truncate text-[11px] text-muted-foreground">
                            <span className="font-semibold text-foreground">
                              {inv.lineItems.reduce((sum, i) => sum + i.quantity, 0)} item(s):
                            </span>{' '}
                            {inv.lineItems.map(i => `${i.name} (${i.size}) x${i.quantity}`).join(', ')}
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            inv.paymentMethod === 'Cash'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                          }`}>
                            {inv.paymentMethod}
                          </span>
                        </td>
                        <td className="p-4 text-right font-black font-mono text-sm text-[#2CFF05]">
                          Rs. {inv.totalAmount.toLocaleString()}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleLoadInvoice(inv)}
                              className="p-2 rounded-xl bg-card border border-border hover:border-[#2CFF05]/50 text-muted-foreground hover:text-[#2CFF05] transition-all cursor-pointer"
                              title="Load & Reprint Invoice"
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteInvoice(inv.id, inv.invoiceNo)}
                              className="p-2 rounded-xl bg-card border border-border hover:border-red-500/50 text-muted-foreground hover:text-red-400 transition-all cursor-pointer"
                              title="Delete from history"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ─── PRINT CUSTOM STYLING RULES (Robust Page Break & Thermal POS Compatibility) ─── */}
      <style jsx global>{`
        @media print {
          /* Force page margins and sizing defaults */
          @page {
            margin: 0mm !important;
            size: auto;
          }

          /* Reset all potential display constraints of layouts, scroll views and sidebars */
          html, body {
            background-color: #ffffff !important;
            color: #000000 !important;
            height: auto !important;
            overflow: visible !important;
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* Hide everything by default using visibility */
          body * {
            visibility: hidden !important;
          }

          /* Make ONLY the invoice print area and its contents visible */
          #invoice-print-area,
          #invoice-print-area * {
            visibility: visible !important;
          }

          /* Explicitly hide interactive buttons or items with print:hidden or no-print */
          #invoice-print-area .print\:hidden,
          #invoice-print-area .no-print,
          .print\:hidden,
          .no-print,
          nav,
          footer,
          header,
          #whatsapp-button {
            display: none !important;
            visibility: hidden !important;
          }

          /* Position #invoice-print-area at top left of document */
          #invoice-print-area {
            display: block !important;
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            background: #ffffff !important;
            color: #000000 !important;
            border: none !important;
            box-shadow: none !important;
            margin: 0 !important;
            border-radius: 0 !important;
            z-index: 9999999 !important;
          }

          /* ─── A4 Print Specifics ─── */
          #invoice-print-area.invoice-a4-layout {
            width: 100% !important;
            max-width: 210mm !important;
            padding: 12mm 16mm !important;
            margin: 0 auto !important;
            box-sizing: border-box !important;
          }

          /* ─── POS 80mm Print Specifics (Thermal Printer Roll) ─── */
          #invoice-print-area.invoice-pos-layout {
            width: 80mm !important;
            max-width: 80mm !important;
            padding: 4mm !important;
            margin: 0 auto !important;
            font-size: 10px !important;
            box-sizing: border-box !important;
          }

          #invoice-print-area.invoice-pos-layout .logo-wrapper {
            transform: scale(0.85) !important;
            transform-origin: left top !important;
            margin-bottom: 2px !important;
          }

          #invoice-print-area.invoice-pos-layout .shop-details {
            font-size: 8px !important;
            max-width: 160px !important;
            line-height: 1.2 !important;
          }

          #invoice-print-area.invoice-pos-layout .header-title {
            font-size: 14px !important;
          }

          #invoice-print-area.invoice-pos-layout .details-list,
          #invoice-print-area.invoice-pos-layout .customer-section {
            font-size: 9px !important;
            line-height: 1.3 !important;
          }

          #invoice-print-area.invoice-pos-layout .items-table th,
          #invoice-print-area.invoice-pos-layout .items-table td {
            padding: 2px 0 !important;
            font-size: 9px !important;
          }

          #invoice-print-area.invoice-pos-layout .items-table th.col-size,
          #invoice-print-area.invoice-pos-layout .items-table td.col-size {
            display: none !important;
          }

          #invoice-print-area.invoice-pos-layout .summary-section {
            flex-direction: column !important;
            gap: 8px !important;
          }

          #invoice-print-area.invoice-pos-layout .summary-section .payment-info {
            max-width: 100% !important;
            font-size: 8.5px !important;
          }

          #invoice-print-area.invoice-pos-layout .summary-section .calculations-list {
            width: 100% !important;
            font-size: 9.5px !important;
            border-top: 1px dashed #ccc !important;
            padding-top: 6px !important;
          }

          #invoice-print-area.invoice-pos-layout .invoice-footer {
            font-size: 8px !important;
            border-top: 1px dashed #ccc !important;
            padding-top: 6px !important;
          }

          #invoice-print-area.invoice-pos-layout .invoice-footer .footer-thanks {
            font-size: 8px !important;
          }

          #invoice-print-area.invoice-pos-layout .invoice-footer .footer-legal {
            font-size: 7px !important;
            max-width: 100% !important;
          }
        }
      `}</style>
      
    </div>
  );
}
