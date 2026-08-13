'use client';

import React, { useState, useEffect } from 'react';
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
  ChevronDown
} from 'lucide-react';
import { getProducts, Product, Variant } from '@/lib/products';
import BitiumLogo from './BitiumLogo';

interface InvoiceLineItem {
  id: string; // unique for this line
  productId?: string;
  variantId?: string;
  name: string;
  size: string;
  price: number;
  quantity: number;
}

export default function POSInvoiceGenerator() {
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

  const [isClient, setIsClient] = useState(false);

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
    const timeRef = now.getTime().toString().slice(-5);
    setInvoiceDate(dateStr);
    setInvoiceNo(`INV-${dateStr.replace(/-/g, '')}-${timeRef}`);
  }, []);

  // Filter products matching search
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

  const handlePrint = () => {
    window.print();
  };

  if (!isClient) return null;

  return (
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
        <div className="p-5 rounded-2xl border border-border bg-card/15 backdrop-blur-md space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-[#2CFF05] flex items-center gap-2">
            <ShoppingBag size={14} />
            <span>02. Select Products from Catalog</span>
          </h3>
          
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={15} />
            <input 
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search store items to add (e.g. stencil, dtf)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-xs focus:outline-none focus:border-[#2CFF05] transition-colors"
            />
            {filteredProducts.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 border border-border bg-background/95 rounded-xl shadow-2xl overflow-hidden z-25">
                {filteredProducts.map(p => (
                  <button
                    key={p.id}
                    onClick={() => handleProductSelect(p)}
                    className="w-full px-4 py-2.5 text-left text-xs hover:bg-card/40 flex items-center justify-between border-b border-border/50 last:border-b-0"
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
                  onClick={handleAddCatalogItem}
                  className="px-4 py-1.5 rounded-lg bg-[#2CFF05] hover:bg-[#7acc00] text-black font-extrabold text-[11px] uppercase tracking-wider transition-all"
                >
                  Add Item
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Step 3: Manual Custom Item Adder */}
        <form onSubmit={handleAddManualItem} className="p-5 rounded-2xl border border-border bg-card/15 backdrop-blur-md space-y-4">
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
                className="w-full py-2.5 rounded-xl bg-card border border-border hover:border-[#2CFF05]/45 hover:bg-card/50 text-[#2CFF05] font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
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
            <span>04. Discounts, Extra Fees & Pay Type</span>
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
                  className="bg-card px-3 text-[10px] font-black border-l border-border hover:bg-muted text-primary"
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
                className="w-full bg-background border border-border rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-[#2CFF05] transition-colors text-foreground font-bold"
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
              onClick={() => setPrintLayout('A4')}
              className={`py-2 rounded-xl text-[11px] font-black uppercase tracking-wider border transition-all ${
                printLayout === 'A4'
                  ? 'bg-[#2CFF05]/15 border-[#2CFF05]/30 text-[#2CFF05]'
                  : 'bg-background border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              📄 A4 Standard Bill
            </button>
            <button
              onClick={() => setPrintLayout('POS-80mm')}
              className={`py-2 rounded-xl text-[11px] font-black uppercase tracking-wider border transition-all ${
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
        <div className="flex items-center gap-3 print:hidden">
          <button
            onClick={handlePrint}
            disabled={lineItems.length === 0}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#2CFF05] hover:bg-[#7acc00] disabled:bg-zinc-700 disabled:opacity-40 text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-[#2CFF05]/15 transition-all cursor-pointer hover:scale-[1.01]"
          >
            <Printer size={16} />
            <span>Print Customer Bill</span>
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
            <div className="space-y-1">
              <div className="flex items-center gap-2 logo-wrapper shrink-0">
                <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white font-black text-xs flex items-center justify-center tracking-tighter shadow-sm">
                  B!T
                </div>
                <div>
                  <div className="font-black text-sm tracking-wider text-zinc-950 uppercase leading-none">BITIUM</div>
                  <div className="text-[7.5px] font-bold tracking-[0.2em] text-emerald-700 uppercase">TECHNOLOGY</div>
                </div>
              </div>
              <p className="text-[9px] text-zinc-500 font-semibold leading-relaxed max-w-[180px] shop-details">
                Bitium Technology (Pvt) Ltd.<br />
                No. 123 Main Street, Colombo, LK.<br />
                support@bitiumtechnology.com | +94 77 123 4567
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
                            onClick={() => handleQtyChange(item.id, item.quantity - 1)}
                            className="w-4 h-4 border border-zinc-300 rounded hover:bg-zinc-100 flex items-center justify-center font-bold text-[9px] print:hidden cursor-pointer"
                          >
                            -
                          </button>
                          <span className="font-extrabold text-zinc-800 font-mono w-4 text-center">{item.quantity}</span>
                          <button 
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
