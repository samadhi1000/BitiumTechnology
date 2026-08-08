'use client';

import React, { useState } from 'react';
import { useCartStore } from '@/lib/store/cartStore';
import { useAuth } from '@/lib/context/AuthContext';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import {
  CheckCircle2,
  ShoppingBag,
  ArrowLeft,
  RefreshCw,
  Truck,
  Layers,
  Sparkles,
  FileText,
  ChevronDown,
  ChevronUp,
  Download,
  Mail,
  ShieldCheck
} from 'lucide-react';

const deliveryOptions = [
  { id: 'Paid Post', label: 'Paid Post', desc: 'Standard postal delivery with prior payment', cost: 250 },
  { id: 'Cash On Delivery', label: 'Cash On Delivery', desc: 'Pay cash when package arrives at your doorstep', cost: 350 },
  { id: 'Cash On Delivery (On weight)', label: 'Cash On Delivery (On weight)', desc: 'COD shipping calculated based on final package weight', cost: 450 },
  { id: 'Paid Courier', label: 'Paid Courier', desc: 'Fast courier service with prior payment', cost: 350 },
  { id: 'Courier (On weight)', label: 'Courier (On weight)', desc: 'Express courier service calculated on parcel weight', cost: 450 },
  { id: 'Store Pickup', label: 'Store Pickup', desc: 'Pick up directly from Bitium Shop (Free)', cost: 0 },
];

export default function CheckoutPage() {
  const { items, getSubtotal, clearCart } = useCartStore();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);

  // Digital vs Physical detection
  // If all items in cart are digital files / downloads, it is a pure digital order
  const isDigitalCart = items.length > 0 && items.every((item) => 
    (item as any).isDigital || 
    (item.product as any)?.is_digital || 
    item.product?.id?.startsWith('dig_') || 
    (item.product as any)?.category === 'digital'
  );

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [addressLine1, setAddressLine1] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('Cash On Delivery');

  // Custom Stencil / Fabric Painting details (Physical Order Details)
  const [showStencilDetails, setShowStencilDetails] = useState(false);
  const [stencilCodes, setStencilCodes] = useState({
    a3: '',
    a2: '',
    a4: '',
    fabricPainting: '',
    rollerBrush: false,
    paintBrush: false,
    fabricPaint: false,
    tracing: false,
    fabric: false,
  });

  const subtotal = getSubtotal();
  const selectedDelivery = deliveryOptions.find((d) => d.id === deliveryMethod) || deliveryOptions[1];
  const shippingCost = isDigitalCart ? 0 : selectedDelivery.cost;
  const total = subtotal + shippingCost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    if (!isDigitalCart && (!phone || !addressLine1)) {
      alert('Please fill your WhatsApp phone number and delivery address for physical dispatch.');
      return;
    }

    if (isDigitalCart && !email) {
      alert('Please provide a valid email address to receive your digital download links.');
      return;
    }

    setLoading(true);

    try {
      const savedItemDetails = [];
      let orderId = `ORD-${Date.now().toString().slice(-5)}`;
      let isSupabaseActive = true;

      const shippingAddressObj = {
        full_name: fullName,
        email: email,
        address_line1: isDigitalCart ? 'Digital Instant Delivery' : addressLine1,
        city: isDigitalCart ? 'Online' : city,
        phone: phone || 'N/A',
      };

      // Check if using placeholder configurations
      const sbUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      if (sbUrl.includes('your-project') || sbUrl.includes('placeholder')) {
        isSupabaseActive = false;
      }

      if (isSupabaseActive) {
        try {
          for (const item of items) {
            let customSheetId = null;

            if (item.type === 'dtf_sheet' && item.customSheet) {
              const { data: sheetData, error: sheetError } = await supabase
                .from('custom_sheets')
                .insert({
                  user_id: user?.id || null,
                  width: item.customSheet.width,
                  height: item.customSheet.height,
                  canvas_json: item.customization?.canvasJson ?? null,
                  preview_url: item.customization?.frontPreviewCloudinaryUrl ?? null,
                  price: item.customSheet.price,
                })
                .select()
                .single();

              if (sheetError) throw sheetError;
              customSheetId = sheetData.id;
            }

            savedItemDetails.push({
              ...item,
              custom_sheet_id: customSheetId,
            });
          }

          const { data: orderData, error: orderError } = await supabase
            .from('orders')
            .insert({
              user_id: user?.id || null,
              status: 'pending',
              total_price: total,
              shipping_address: shippingAddressObj,
              payment_method: isDigitalCart ? 'Online Payment / Instant Download' : deliveryMethod,
              payment_status: isDigitalCart ? 'paid' : 'unpaid',
            })
            .select()
            .single();

          if (orderError) throw orderError;
          orderId = orderData.id;

          const orderItemsToInsert = savedItemDetails.map((item) => ({
            order_id: orderId,
            product_id: item.type === 'apparel' ? item.product.id : null,
            variant_id: item.type === 'apparel' && item.variant ? item.variant.id : null,
            custom_sheet_id: item.custom_sheet_id,
            quantity: item.quantity,
            price: item.price,
          }));

          const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItemsToInsert);

          if (itemsError) throw itemsError;

        } catch (dbErr: any) {
          console.warn('[Checkout] Supabase fallback to local mode.', dbErr);
          isSupabaseActive = false;
        }
      }

      // If physical order, sync into Bitium A4 Batch Print queue
      if (!isDigitalCart) {
        const formatStencilsGrid = () => {
          const grid = Array.from({ length: 7 }, () =>
            Array.from({ length: 5 }, () => ({ code: '', checked: false }))
          );
          const a3List = stencilCodes.a3.split(/[\s,]+/).filter(Boolean);
          const a2List = stencilCodes.a2.split(/[\s,]+/).filter(Boolean);
          const a4List = stencilCodes.a4.split(/[\s,]+/).filter(Boolean);

          a3List.forEach((c, idx) => {
            const row = Math.floor(idx / 3);
            const col = idx % 3;
            if (row < 7) grid[row][col] = { code: c, checked: true };
          });

          a2List.forEach((c, idx) => {
            if (idx < 7) grid[idx][3] = { code: c, checked: true };
          });

          a4List.forEach((c, idx) => {
            if (idx < 7) grid[idx][4] = { code: c, checked: true };
          });

          return grid;
        };

        const formatFabricGrid = () => {
          const grid = Array.from({ length: 4 }, () =>
            Array.from({ length: 5 }, () => ({ code: '', checked: false }))
          );
          const fabList = stencilCodes.fabricPainting.split(/[\s,]+/).filter(Boolean);
          fabList.forEach((c, idx) => {
            const row = Math.floor(idx / 5);
            const col = idx % 5;
            if (row < 4) grid[row][col] = { code: c, checked: true };
          });
          return grid;
        };

        const batchOrderItem = {
          id: orderId,
          customerName: fullName,
          whatsappNo: phone,
          address: `${addressLine1}${city ? `, ${city}` : ''}`,
          note: note,
          date: new Date().toISOString().split('T')[0],
          totalAmount: total.toLocaleString(),
          deliveryMethod: deliveryMethod,
          stencils: formatStencilsGrid(),
          fabricPainting: formatFabricGrid(),
          accessories: {
            rollerBrush: stencilCodes.rollerBrush,
            paintBrush: stencilCodes.paintBrush,
            fabricPaint: stencilCodes.fabricPaint,
            tracing: stencilCodes.tracing,
            fabric: stencilCodes.fabric,
          },
        };

        try {
          const existingOrders = JSON.parse(localStorage.getItem('bitium_orders') || '[]');
          const updatedOrders = [batchOrderItem, ...existingOrders];
          localStorage.setItem('bitium_orders', JSON.stringify(updatedOrders));
        } catch (err) {
          console.error(err);
        }
      }

      setOrderSuccess(orderId);
      clearCart();

    } catch (err: any) {
      console.error('Checkout error:', err);
      alert('Failed to place order: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center space-y-6 animate-fade-in">
        <div className="w-20 h-20 bg-emerald-950/20 border border-emerald-800 rounded-full flex items-center justify-center mx-auto text-emerald-400 shadow-lg shadow-emerald-500/10">
          <CheckCircle2 size={40} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-foreground tracking-tight">
            {isDigitalCart ? 'Digital Order Confirmed!' : 'Physical Order Confirmed!'}
          </h2>
          <p className="text-muted-foreground text-sm">
            {isDigitalCart 
              ? `Your digital files have been prepared and sent to ${email}. You can also download them instantly below.`
              : `Thank you for ordering with Bitium Technology. Your package is registered for physical dispatch.`
            }
          </p>
          <div className="p-4 bg-card border border-border rounded-2xl mt-4 text-left space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground uppercase font-bold tracking-wider">Order Reference</span>
              <span className="font-mono font-bold text-primary select-all">{orderSuccess}</span>
            </div>
            <div className="flex justify-between items-center text-xs pt-1 border-t border-border/40">
              <span className="text-muted-foreground">Order Type:</span>
              <span className="font-semibold text-foreground">
                {isDigitalCart ? 'Instant Digital Download (No Shipping)' : deliveryMethod}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Total Paid:</span>
              <span className="font-bold text-foreground">Rs. {total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-3 rounded-xl bg-[#8DFF00] hover:bg-[#9eff1a] text-black text-sm font-bold transition-all shadow-md"
          >
            Go to Store
          </Link>
          {isDigitalCart ? (
            <Link
              href="/downloads"
              className="px-6 py-3 rounded-xl bg-card hover:bg-muted border border-border text-sm font-semibold text-foreground transition-all flex items-center justify-center gap-2"
            >
              <Download size={16} /> Digital Downloads
            </Link>
          ) : (
            <Link
              href="/order-form"
              className="px-6 py-3 rounded-xl bg-card hover:bg-muted border border-border text-sm font-semibold text-foreground transition-all flex items-center justify-center gap-2"
            >
              <FileText size={16} /> Custom Order Form
            </Link>
          )}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
        <ShoppingBag size={48} className="text-zinc-600 mx-auto" />
        <h2 className="text-xl font-bold">Your cart is empty</h2>
        <p className="text-xs text-muted-foreground">
          Looking for custom physical stencils or instant digital downloads?
        </p>
        <div className="flex flex-col gap-2.5 pt-2">
          <Link href="/stencil" className="inline-flex items-center justify-center gap-2 bg-primary text-black font-bold py-2.5 px-4 rounded-xl text-sm hover:bg-primary/90">
            Browse Physical Stencils
          </Link>
          <Link href="/downloads" className="inline-flex items-center justify-center gap-2 bg-card border border-border text-foreground font-semibold py-2.5 px-4 rounded-xl text-xs hover:bg-muted">
            <Download size={14} /> Instant Digital Artworks
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 font-sans">
      
      {/* Smart Order Mode Banner */}
      {isDigitalCart ? (
        <div className="mb-8 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl flex items-center justify-between gap-3 text-xs text-cyan-300">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold shrink-0">
              <Download size={20} />
            </div>
            <div>
              <p className="font-extrabold text-sm text-foreground">
                Instant Digital Download Checkout
              </p>
              <p className="text-muted-foreground text-[11px]">
                No physical shipping or order form required. Digital files are delivered directly to your email.
              </p>
            </div>
          </div>
          <span className="text-[10px] bg-cyan-500/20 text-cyan-300 font-bold px-2.5 py-1 rounded-full border border-cyan-500/40 uppercase">
            Instant Delivery (Rs. 0)
          </span>
        </div>
      ) : (
        <div className="mb-8 p-4 bg-gradient-to-r from-lime-500/10 via-emerald-500/10 to-transparent border border-lime-500/30 rounded-2xl flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-lime-500/20 text-lime-400 flex items-center justify-center font-bold shrink-0">
              <Truck size={20} />
            </div>
            <div>
              <p className="font-extrabold text-sm text-foreground">
                Physical Print & Dispatch Checkout
              </p>
              <p className="text-muted-foreground text-[11px]">
                Please provide your WhatsApp number and delivery address for parcel dispatch and courier tracking.
              </p>
            </div>
          </div>
          <Link
            href="/order-form"
            className="text-xs font-bold text-lime-400 hover:text-lime-300 flex items-center gap-1 underline"
          >
            Direct Stencil Order Form &rarr;
          </Link>
        </div>
      )}

      <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-8">
        {isDigitalCart ? 'Digital Checkout' : 'Physical Order Checkout'}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Columns: Forms */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-8">
          
          {/* DIGITAL CART FORM: ONLY EMAIL & NAME */}
          {isDigitalCart ? (
            <div className="space-y-4 p-5 rounded-2xl border border-cyan-500/30 bg-card/40">
              <div className="flex items-center gap-2 text-foreground">
                <span className="w-6 h-6 rounded-full bg-cyan-500 text-black font-extrabold text-xs flex items-center justify-center">1</span>
                <h3 className="font-bold text-base">Digital Recipient Details</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1.5">
                    Your Email Address <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-3 py-3 rounded-xl border border-border bg-background text-foreground placeholder-zinc-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none text-sm transition-all"
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">Download links and high-res files will be sent here.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1.5">
                    Your Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Customer Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full p-3 rounded-xl border border-border bg-background text-foreground placeholder-zinc-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none text-sm transition-all"
                  />
                </div>
              </div>
            </div>
          ) : (
            /* PHYSICAL CART FORM: FULL SHIPPING & DELIVERY OPTIONS */
            <>
              {/* 1. Customer & Shipping Details */}
              <div className="space-y-4 p-5 rounded-2xl border border-border bg-card/40">
                <div className="flex items-center gap-2 text-foreground">
                  <span className="w-6 h-6 rounded-full bg-primary text-black font-extrabold text-xs flex items-center justify-center">1</span>
                  <h3 className="font-bold text-base">Customer & Shipping Details</h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1.5">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Kavindu Perera"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full p-3 rounded-xl border border-border bg-background text-foreground placeholder-zinc-500 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1.5">
                      WhatsApp Number <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="077 123 4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full p-3 rounded-xl border border-border bg-background text-foreground placeholder-zinc-500 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm transition-all"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1.5">
                      Delivery Address <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="No. 45, Temple Road, Colombo / Kandy"
                      value={addressLine1}
                      onChange={(e) => setAddressLine1(e.target.value)}
                      className="w-full p-3 rounded-xl border border-border bg-background text-foreground placeholder-zinc-500 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1.5">
                      City / Town
                    </label>
                    <input
                      type="text"
                      placeholder="Kandy"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full p-3 rounded-xl border border-border bg-background text-foreground placeholder-zinc-500 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1.5">
                      Special Notes
                    </label>
                    <input
                      type="text"
                      placeholder="Call before delivery / Urgent"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className="w-full p-3 rounded-xl border border-border bg-background text-foreground placeholder-zinc-500 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Delivery Options */}
              <div className="space-y-4 p-5 rounded-2xl border border-border bg-card/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-foreground">
                    <span className="w-6 h-6 rounded-full bg-primary text-black font-extrabold text-xs flex items-center justify-center">2</span>
                    <h3 className="font-bold text-base">Delivery Method</h3>
                  </div>
                  <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                    <Truck size={14} className="text-primary" /> 6 Delivery Options
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {deliveryOptions.map((opt) => {
                    const isSelected = deliveryMethod === opt.id;
                    return (
                      <label
                        key={opt.id}
                        className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-primary bg-primary/10 shadow-sm'
                            : 'border-border bg-background/50 hover:bg-card'
                        }`}
                      >
                        <input
                          type="radio"
                          name="deliveryMethod"
                          value={opt.id}
                          checked={isSelected}
                          onChange={() => setDeliveryMethod(opt.id)}
                          className="accent-primary h-4 w-4 mt-0.5"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className={`text-xs font-bold ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                              {opt.label}
                            </p>
                            <span className="text-[11px] font-bold text-muted-foreground">
                              {opt.cost === 0 ? 'FREE' : `Rs. ${opt.cost}`}
                            </span>
                          </div>
                          <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">
                            {opt.desc}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* 3. Optional Stencil / Accessories Codes */}
              <div className="p-5 rounded-2xl border border-border bg-card/40 space-y-4">
                <div
                  onClick={() => setShowStencilDetails(!showStencilDetails)}
                  className="flex items-center justify-between cursor-pointer select-none"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-700 text-white font-extrabold text-xs flex items-center justify-center">3</span>
                    <div>
                      <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                        <Layers size={16} className="text-lime-400" />
                        Custom Stencil Codes & Accessories (Optional)
                      </h3>
                      <p className="text-[11px] text-muted-foreground">
                        Ordering specific Stencil / Fabric Paint codes? Click to specify codes.
                      </p>
                    </div>
                  </div>
                  <button type="button" className="text-muted-foreground hover:text-foreground">
                    {showStencilDetails ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                </div>

                {showStencilDetails && (
                  <div className="pt-3 border-t border-border space-y-4 animate-fade-in">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-muted-foreground uppercase mb-1">
                          A3 Stencil Codes:
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. A3-01, A3-14"
                          value={stencilCodes.a3}
                          onChange={(e) => setStencilCodes({ ...stencilCodes, a3: e.target.value })}
                          className="w-full p-2.5 text-xs rounded-xl border border-border bg-background font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-muted-foreground uppercase mb-1">
                          A2 Stencil Codes:
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. A2-05"
                          value={stencilCodes.a2}
                          onChange={(e) => setStencilCodes({ ...stencilCodes, a2: e.target.value })}
                          className="w-full p-2.5 text-xs rounded-xl border border-border bg-background font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-muted-foreground uppercase mb-1">
                          A4 Stencil Codes:
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. A4-12, A4-88"
                          value={stencilCodes.a4}
                          onChange={(e) => setStencilCodes({ ...stencilCodes, a4: e.target.value })}
                          className="w-full p-2.5 text-xs rounded-xl border border-border bg-background font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-muted-foreground uppercase mb-1">
                        Fabric Painting Design Codes:
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. FB-01, FB-04, FB-12"
                        value={stencilCodes.fabricPainting}
                        onChange={(e) => setStencilCodes({ ...stencilCodes, fabricPainting: e.target.value })}
                        className="w-full p-2.5 text-xs rounded-xl border border-border bg-background font-mono"
                      />
                    </div>

                    <div>
                      <span className="block text-[11px] font-bold text-muted-foreground uppercase mb-2">
                        Include Accessories / අමතර ද්‍රව්‍ය:
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                        {[
                          { key: 'rollerBrush', label: 'Roller Brush' },
                          { key: 'paintBrush', label: 'Paint Brush' },
                          { key: 'fabricPaint', label: 'Fabric Paint' },
                          { key: 'tracing', label: 'Tracing Paper' },
                          { key: 'fabric', label: 'Fabric / Cloth' },
                        ].map((acc) => (
                          <label
                            key={acc.key}
                            className="p-2 rounded-lg border border-border bg-background flex items-center justify-between cursor-pointer hover:bg-muted"
                          >
                            <span className="text-[11px] font-medium">{acc.label}</span>
                            <input
                              type="checkbox"
                              checked={(stencilCodes as any)[acc.key]}
                              onChange={(e) =>
                                setStencilCodes({
                              ...stencilCodes,
                              [acc.key]: e.target.checked,
                            })
                          }
                          className="accent-primary h-3.5 w-3.5 rounded"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
            </>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-[#8DFF00] hover:bg-[#9eff1a] text-black font-extrabold text-base flex items-center justify-center gap-2 transition-all shadow-xl hover:shadow-[#8DFF00]/20 cursor-pointer"
          >
            {loading ? (
              <RefreshCw className="animate-spin" size={20} />
            ) : (
              <span>
                {isDigitalCart ? 'Confirm & Download Digital Files' : 'Confirm Physical Order'} • Total: Rs. {total.toLocaleString()}
              </span>
            )}
          </button>

        </form>

        {/* Right Column: Order Summary Review */}
        <div className="p-6 rounded-2xl border border-border bg-card/60 h-fit space-y-6 sticky top-24">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h3 className="font-black text-lg">Order Summary</h3>
            <span className="text-xs bg-primary/20 text-lime-400 font-bold px-2 py-0.5 rounded-full">
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </span>
          </div>

          <div className="space-y-3.5 max-h-[320px] overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between items-start gap-3 border-b border-border/30 pb-3">
                <div className="text-xs">
                  <p className="font-bold text-foreground leading-snug">{item.product.name}</p>
                  {item.type === 'apparel' && item.variant && (
                    <p className="text-muted-foreground text-[11px] mt-0.5">{item.variant.name}</p>
                  )}
                  {item.type === 'dtf_sheet' && item.customSheet && (
                    <p className="text-muted-foreground text-[11px] mt-0.5">Custom Canvas {item.customSheet.width}"x{item.customSheet.height}"</p>
                  )}
                  <p className="text-muted-foreground text-[11px] mt-1">Qty: <span className="font-semibold text-foreground">{item.quantity}</span></p>
                </div>
                <p className="text-xs font-bold text-[#8DFF00] whitespace-nowrap">
                  Rs. {(item.price * item.quantity).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          <div className="space-y-2.5 text-xs text-muted-foreground pt-2">
            <div className="flex justify-between">
              <span>Items Subtotal:</span>
              <span className="font-bold text-foreground">Rs. {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>
                {isDigitalCart ? 'Digital Delivery:' : `Delivery Fee (${selectedDelivery.label}):`}
              </span>
              <span className="font-bold text-foreground">
                {shippingCost === 0 ? 'FREE' : `Rs. ${shippingCost}`}
              </span>
            </div>
          </div>

          <div className="border-t border-border pt-4 flex justify-between items-end">
            <div>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-extrabold">Grand Total</span>
              <p className="text-2xl font-black text-[#8DFF00]">Rs. {total.toLocaleString()}</p>
            </div>
          </div>

          <div className="p-3 bg-muted/40 rounded-xl border border-border/60 text-[11px] text-muted-foreground space-y-1">
            <p className="flex items-center gap-1.5 font-medium text-foreground">
              {isDigitalCart ? (
                <><ShieldCheck size={14} className="text-cyan-400" /> Instant Digital Security</>
              ) : (
                <><CheckCircle2 size={14} className="text-primary" /> Direct Batch Print Sync</>
              )}
            </p>
            <p>
              {isDigitalCart 
                ? 'High-speed cloud delivery to your email inbox immediately upon checkout.'
                : 'Physical parcel syncs directly to Bitium 4-in-1 A4 printing queue for packaging.'
              }
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
