'use client';

import React, { useState, useEffect, useRef } from 'react';
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
      
      {/* ─── LEFT COLUMN: PRODUCT INTAKE & INVOICE CONTROLS (8 cols) ─── */}
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
        
        {/* Action Bar */}
        <div className="flex items-center gap-3 print:hidden">
          <button
            onClick={handlePrint}
            disabled={lineItems.length === 0}
            className="flex-grow flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#2CFF05] hover:bg-[#7acc00] disabled:bg-zinc-700 disabled:opacity-40 text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-[#2CFF05]/15 transition-all cursor-pointer hover:scale-[1.01]"
          >
            <Printer size={16} />
            <span>Print Customer Bill / Invoice</span>
          </button>
        </div>

        {/* ── INVOICE SHEET AREA ── */}
        <div 
          id="invoice-print-area" 
          className="bg-white text-zinc-900 border border-zinc-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative print:border-none print:shadow-none print:p-0 print:m-0"
          style={{ contentVisibility: 'auto' }}
        >
          {/* Print Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="h-8 w-28 text-emerald-900 flex items-center">
                <BitiumLogo />
              </div>
              <p className="text-[9px] text-zinc-500 font-semibold leading-relaxed max-w-[200px]">
                Bitium Technology (Pvt) Ltd.<br />
                No. 123 Main Street, Colombo, LK.<br />
                support@bitiumtechnology.com | +94 77 123 4567
              </p>
            </div>
            <div className="text-right space-y-1">
              <h2 className="text-lg font-black tracking-tight text-emerald-800 uppercase leading-none">Bill / Invoice</h2>
              <div className="text-[10px] font-bold text-zinc-500 font-mono">
                <div>No: {invoiceNo || 'Draft'}</div>
                <div>Date: {invoiceDate}</div>
                <div>Pay Method: {paymentMethod}</div>
              </div>
            </div>
          </div>

          <hr className="border-zinc-200" />

          {/* Customer info */}
          <div className="grid grid-cols-2 gap-4 text-[10px] leading-relaxed">
            <div>
              <span className="font-extrabold text-zinc-400 uppercase block tracking-wider text-[8px]">Invoiced To:</span>
              <strong className="text-zinc-800 text-xs block">{customerName || 'Cash Walk-in Client'}</strong>
              {customerPhone && <div className="text-zinc-600 font-medium">WhatsApp: {customerPhone}</div>}
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
            <table className="w-full border-collapse text-left text-[10px]">
              <thead>
                <tr className="border-b-2 border-zinc-300 text-zinc-500 font-extrabold uppercase text-[8px] tracking-wider">
                  <th className="py-2">Item Description</th>
                  <th className="py-2 text-center w-14">Size</th>
                  <th className="py-2 text-right w-16">Price</th>
                  <th className="py-2 text-center w-12">Qty</th>
                  <th className="py-2 text-right w-20">Total</th>
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
                      <td className="py-2.5 font-bold text-zinc-800">
                        {item.name}
                      </td>
                      <td className="py-2.5 text-center text-zinc-500 font-mono font-bold">
                        {item.size}
                      </td>
                      <td className="py-2.5 text-right font-mono text-zinc-600 font-semibold">
                        Rs.{item.price.toLocaleString()}
                      </td>
                      <td className="py-2.5 text-center">
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
                      <td className="py-2.5 text-right font-bold text-zinc-950 font-mono">
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
          <div className="flex justify-between items-start gap-4">
            <div className="text-[9px] text-zinc-400 max-w-[200px] leading-relaxed">
              <span className="font-extrabold uppercase text-[8px] block tracking-wider mb-0.5">Payment Status:</span>
              <div className="font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded inline-block">
                ✓ FULLY PAID &mdash; RECEIVED via {paymentMethod.toUpperCase()}
              </div>
              <p className="mt-2">Products are checked &amp; verified. Please inspect goods before leaving checkout register.</p>
            </div>
            
            <div className="w-48 text-[10px] space-y-1.5 font-mono text-zinc-650">
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
          <div className="text-center space-y-2 pt-2">
            <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest leading-none">
              Thank you for printing with Bitium Technology!
            </p>
            <p className="text-[8px] text-zinc-400 leading-normal max-w-sm mx-auto">
              This is a computer generated invoice for store register purchases. No signature required. 
              Returns accepted within 7 days with original packaging intact.
            </p>
          </div>
        </div>

      </div>

      {/* ─── PRINT CUSTOM STYLING RULES (hidden in screen browser view) ─── */}
      <style jsx global>{`
        @media print {
          /* Hide layout wrapper header, navbar, footer, admin sidebar tabs, etc. */
          body * {
            visibility: hidden;
            background: none !important;
            color: #000 !important;
          }
          /* Show only the invoice print container element */
          #invoice-print-area, #invoice-print-area * {
            visibility: visible;
          }
          #invoice-print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            max-width: 100% !important;
            border: none !important;
            padding: 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
      
    </div>
  );
}
