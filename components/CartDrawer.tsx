'use client';

import React, { useState } from 'react';
import { useCartStore, CartItem } from '@/lib/store/cartStore';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Trash2, Plus, Minus, ShoppingBag, 
  User, Phone, MapPin, Notebook, CreditCard, 
  Send, CheckCircle2, MessageSquare
} from 'lucide-react';
import Image from 'next/image';
import { 
  sanitizeName, 
  sanitizePhone, 
  sanitizeText, 
  sanitizeForWhatsApp 
} from '@/lib/security/sanitize';
import { useRateLimit } from '@/lib/security/rateLimit';

export default function CartDrawer() {
  const { 
    items, 
    isCartOpen, 
    closeCart, 
    updateQuantity, 
    removeItem, 
    getSubtotal, 
    clearCart,
    checkoutDetails,
    setCheckoutDetails,
    clearCheckoutDetails,
  } = useCartStore();

  // Destructure persisted checkout fields from the store
  const { name, phone, address, city, notes } = checkoutDetails;

  // Form error state
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Checkout loading/success states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const subtotal = getSubtotal();
  const shippingCost = 350; // COD Flat Rate
  const total = subtotal + shippingCost;

  // Initialize rate limiter: Max 3 checkout attempts per minute (Bot Prevention)
  const { guarded, isLimited, resetInSeconds } = useRateLimit({
    maxCalls: 3,
    windowMs: 60000,
    onLimitReached: (sec) => {
      setErrors((prev) => ({
        ...prev,
        submit: `Too many attempts. Please wait ${sec} seconds before trying again.`
      }));
    }
  });

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Sanitize values
    const sName = sanitizeName(name);
    const sPhone = sanitizePhone(phone);
    const sAddress = sanitizeText(address, 300);
    const sCity = sanitizeName(city);
    const sNotes = sanitizeText(notes, 500);

    // Update store with sanitized values so they persist cleanly
    setCheckoutDetails({
      name: sName,
      phone: sPhone,
      address: sAddress,
      city: sCity,
      notes: sNotes
    });

    // Validate sanitized inputs
    const newErrors: Record<string, string> = {};
    if (!sName) newErrors.name = 'Full Name is required';
    if (!sPhone) {
      newErrors.phone = 'Mobile/WhatsApp number is required';
    } else if (!/^\+?[0-9\s-]{9,15}$/.test(sPhone)) {
      newErrors.phone = 'Please enter a valid phone number (e.g. +94771234567)';
    }
    if (!sAddress) newErrors.address = 'Delivery Address is required';
    if (!sCity) newErrors.city = 'City is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    // Simulate small loading state for premium micro-feedback
    setTimeout(() => {
      // 1. Format the items list
      const itemsString = items.map((item, idx) => {
        let itemDetail = `${idx + 1}. *${item.product.name}*`;
        
        // Apparel item
        if (item.type === 'apparel' && item.variant) {
          itemDetail += ` - Variant: ${item.variant.name} | Qty: ${item.quantity} | Price: LKR ${item.price.toLocaleString()}`;
          if (item.customization) {
            const parts = [];
            if (item.customization.printStyle) parts.push(`Print Finish: ${item.customization.printStyle.toUpperCase()}`);
            if (item.customization.garmentSize) parts.push(`Size: ${item.customization.garmentSize}`);
            if (item.customization.garmentColor) parts.push(`Colour: ${item.customization.garmentColor.name}`);
            if (item.customization.designLayersCount) parts.push(`Design Layers: ${item.customization.designLayersCount}`);
            if (parts.length) itemDetail += `\n   *(${parts.join(' | ')})*`;
            if (item.customization.frontPreviewCloudinaryUrl) {
              itemDetail += `\n   \u{1F5BC}\u{FE0F} Design Preview: ${item.customization.frontPreviewCloudinaryUrl}`;
            }
          }
        }
        // DTF sheet item
        else if (item.type === 'dtf_sheet') {
          const w = item.customization?.sheetWidth ?? item.customSheet?.width ?? '?';
          const h = item.customization?.sheetHeight ?? item.customSheet?.height ?? '?';
          itemDetail += ` - Qty: ${item.quantity} | Price: LKR ${item.price.toLocaleString()}`;
          itemDetail += `\n   *(DTF Sheet: ${w}" x ${h}" | Layers: ${item.customization?.designLayersCount ?? 0})*`;
          if (item.customization?.frontPreviewCloudinaryUrl) {
            itemDetail += `\n   \u{1F5BC}\u{FE0F} Layout Preview: ${item.customization.frontPreviewCloudinaryUrl}`;
          }
        }
        else {
          itemDetail += ` - Qty: ${item.quantity} | Price: LKR ${item.price.toLocaleString()}`;
        }

        return itemDetail;
      }).join('\n');

      // 2. Format the complete WhatsApp template message (utilising sanitizeForWhatsApp for dynamic fields)
      const wName = sanitizeForWhatsApp(sName);
      const wPhone = sanitizeForWhatsApp(sPhone);
      const wAddress = sanitizeForWhatsApp(sAddress);
      const wCity = sanitizeForWhatsApp(sCity);
      const wNotes = sanitizeForWhatsApp(sNotes);

      const messageTemplate = 
`\u{1F6D2} *NEW ORDER RECEIVED* \u{1F6D2}
----------------------------------
\u{1F464} *Customer Details:*
- Name: ${wName}
- Phone: ${wPhone}
- Delivery Address: ${wAddress}, ${wCity}

\u{1F4E6} *Ordered Items:*
${itemsString}

\u{1F4B5} *Order Summary:*
- Total Amount: LKR ${total.toLocaleString()}
- Payment Option: Cash on Delivery (COD)
----------------------------------
\u{1F4DD} *Notes:* ${wNotes ? wNotes : 'None'}`;

      // 3. Encode safely and open WhatsApp API link
      const encodedText = encodeURIComponent(messageTemplate);
      const whatsappUrl = `https://wa.me/94715520897?text=${encodedText}`;
      
      window.open(whatsappUrl, '_blank');

      // 4. Update state
      setIsSubmitting(false);
      setShowSuccess(true);
      
      // 5. Clear cart and reset state after a short delay
      setTimeout(() => {
        clearCart();
        clearCheckoutDetails();
        setShowSuccess(false);
        closeCart();
      }, 3500);

    }, 1200);
  };

  // Guard checkout trigger with rate limiter
  const handleCheckoutGuarded = (e: React.FormEvent) => {
    e.preventDefault();
    guarded(handleCheckout)(e);
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-[99] bg-black/80 backdrop-blur-sm cursor-pointer"
          />

          {/* Slide-over Drawer panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 z-[100] w-full max-w-lg bg-background border-l border-border shadow-2xl flex flex-col h-full overflow-hidden"
          >
            {/* Success Overlay Panel */}
            <AnimatePresence>
              {showSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute inset-0 z-50 bg-background/95 flex flex-col items-center justify-center p-8 text-center space-y-6"
                >
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                    className="w-20 h-20 bg-emerald-950/30 border border-emerald-500/50 rounded-full flex items-center justify-center text-emerald-400"
                  >
                    <CheckCircle2 size={40} className="animate-pulse" />
                  </motion.div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Order Forwarded!</h3>
                    <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
                      We have redirected you to WhatsApp to complete your order. Thank you for shopping with us!
                    </p>
                  </div>
                  <div className="text-[11px] text-zinc-600 bg-card border border-border rounded-xl px-4 py-3 max-w-xs leading-normal">
                    <p className="font-bold text-muted-foreground mb-1 flex items-center gap-1.5 justify-center">
                      <MessageSquare size={11} className="text-emerald-400" />
                      What's Next?
                    </p>
                    Please click "Send" in the opened WhatsApp window to transmit the structured order invoice directly to our support desk.
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Drawer Header */}
            <div className="p-5 sm:p-6 border-b border-border flex items-center justify-between bg-background">
              <div className="flex items-center gap-3">
                <div className="relative p-2 rounded-xl bg-[#2CFF05]/10 border border-[#2CFF05]/20 text-[#2CFF05]">
                  <ShoppingBag size={20} />
                  {items.length > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#2CFF05] text-[9px] font-bold text-[#0a0a0a] ring-2 ring-zinc-950">
                      {items.reduce((acc, item) => acc + item.quantity, 0)}
                    </span>
                  )}
                </div>
                <div>
                  <h2 className="text-lg font-black text-foreground">Your Shopping Cart</h2>
                  <p className="text-xs text-muted-foreground font-medium">Verify your items & finish order checkout</p>
                </div>
              </div>
              <button 
                onClick={closeCart}
                className="p-2 rounded-xl bg-card hover:bg-muted border border-border hover:border-zinc-700 text-muted-foreground hover:text-foreground transition-all"
              >
                <X size={18} />
              </button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto divide-y divide-zinc-900 scrollbar-thin p-5 sm:p-6 space-y-8">
              
              {/* CART ITEMS LIST */}
              {items.length === 0 ? (
                <div className="py-16 text-center space-y-5">
                  <div className="w-16 h-16 bg-card/50 border border-border rounded-full flex items-center justify-center mx-auto text-zinc-600">
                    <ShoppingBag size={28} />
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="font-extrabold text-sm text-foreground">Your cart is empty</h4>
                    <p className="text-xs text-muted-foreground max-w-[240px] mx-auto leading-normal">
                      Customize a design or add products from our catalog to get started.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <span className="text-[10px] font-black text-[#2CFF05] uppercase tracking-widest block mb-2">Selected Items</span>
                  {items.map((item) => (
                    <div 
                      key={item.id}
                      className="flex gap-4 p-4 rounded-2xl border border-border bg-card/10 hover:bg-card/20 transition-all relative group overflow-hidden"
                    >
                      {/* Image Thumbnail / Preview */}
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-zinc-855 bg-background flex-shrink-0 flex items-center justify-center">
                        {item.customization?.frontPreviewCloudinaryUrl || item.product.image_url ? (
                          <Image
                            src={item.customization?.frontPreviewCloudinaryUrl || item.product.image_url || ''}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <ShoppingBag size={24} className="text-zinc-800" />
                        )}
                      </div>

                      {/* Text details */}
                      <div className="flex-1 min-w-0 pr-4">
                        <h4 className="text-xs font-bold text-foreground truncate mb-1">
                          {item.product.name}
                        </h4>
                        
                        {/* Variant details */}
                        {item.type === 'apparel' && item.variant && (
                          <p className="text-[10px] text-muted-foreground font-medium">
                            Variant: {item.variant.name}
                          </p>
                        )}

                        {/* Customization Details */}
                        {item.customization?.printStyle && (
                          <span className="inline-flex mt-1 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-[#45ff24]/10 border border-[#2CFF05]/20 text-[#45ff24]">
                            {item.customization.printStyle} Finish
                          </span>
                        )}
                        {item.customization?.garmentSize && (
                          <span className="inline-flex mt-1 ml-1 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-muted border border-zinc-700 text-muted-foreground">
                            Size: {item.customization.garmentSize}
                          </span>
                        )}

                        {item.type === 'dtf_sheet' && item.customSheet && (
                          <p className="text-[10px] text-[#2CFF05] font-bold mt-0.5">
                            Canvas {item.customSheet.width}" x {item.customSheet.height}" Layout
                          </p>
                        )}

                        <div className="flex items-center justify-between mt-3">
                          {/* Price */}
                          <span className="text-xs font-black text-foreground">
                            Rs. {item.price.toLocaleString()}
                          </span>

                          {/* Quantity Selector */}
                          <div className="flex items-center bg-background/80 border border-border rounded-lg p-0.5 scale-90 origin-right">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-6 h-6 flex items-center justify-center rounded hover:bg-muted text-xs font-black text-muted-foreground transition-colors"
                            >
                              <Minus size={10} />
                            </button>
                            <span className="w-8 text-center text-[11px] font-bold text-foreground">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-6 h-6 flex items-center justify-center rounded hover:bg-muted text-xs font-black text-muted-foreground transition-colors"
                            >
                              <Plus size={10} />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Delete Action button */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="absolute top-3 right-3 p-1.5 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* CHECKOUT DETAILS FORM */}
              {items.length > 0 && (
                <div className="space-y-4 pt-6 border-t border-border">
                  <span className="text-[10px] font-black text-[#2CFF05] uppercase tracking-widest block">Customer Details</span>
                  
                  <form onSubmit={handleCheckout} className="space-y-4">
                    {/* Full name */}
                    <div>
                      <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                        <User size={11} className="text-muted-foreground" /> Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Thusitha Weerasinghe"
                        value={name}
                        onChange={(e) => {
                          setCheckoutDetails({ name: e.target.value });
                          if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                        }}
                        className={`w-full p-3 rounded-xl border bg-card/40 text-sm text-foreground placeholder-zinc-600 outline-none transition-all ${
                          errors.name 
                            ? 'border-red-500/60 focus:border-red-500' 
                            : 'border-border focus:border-[#2CFF05] focus:ring-1 focus:ring-[#2CFF05]/30'
                        }`}
                      />
                      {errors.name && <p className="text-[10px] font-medium text-red-400 mt-1">{errors.name}</p>}
                    </div>

                    {/* WhatsApp Phone */}
                    <div>
                      <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                        <Phone size={11} className="text-muted-foreground" /> WhatsApp / Mobile Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        placeholder="e.g. +94715520897 or 0715520897"
                        value={phone}
                        onChange={(e) => {
                          setCheckoutDetails({ phone: e.target.value });
                          if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
                        }}
                        className={`w-full p-3 rounded-xl border bg-card/40 text-sm text-foreground placeholder-zinc-600 outline-none transition-all ${
                          errors.phone 
                            ? 'border-red-500/60 focus:border-red-500' 
                            : 'border-border focus:border-[#2CFF05] focus:ring-1 focus:ring-[#2CFF05]/30'
                        }`}
                      />
                      {errors.phone && <p className="text-[10px] font-medium text-red-400 mt-1">{errors.phone}</p>}
                    </div>

                    {/* Delivery Address */}
                    <div>
                      <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                        <MapPin size={11} className="text-muted-foreground" /> Delivery Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 120/A, Flower Road"
                        value={address}
                        onChange={(e) => {
                          setCheckoutDetails({ address: e.target.value });
                          if (errors.address) setErrors(prev => ({ ...prev, address: '' }));
                        }}
                        className={`w-full p-3 rounded-xl border bg-card/40 text-sm text-foreground placeholder-zinc-600 outline-none transition-all ${
                          errors.address 
                            ? 'border-red-500/60 focus:border-red-500' 
                            : 'border-border focus:border-[#2CFF05] focus:ring-1 focus:ring-[#2CFF05]/30'
                        }`}
                      />
                      {errors.address && <p className="text-[10px] font-medium text-red-400 mt-1">{errors.address}</p>}
                    </div>

                    {/* City */}
                    <div>
                      <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                        <MapPin size={11} className="text-muted-foreground" /> City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Colombo"
                        value={city}
                        onChange={(e) => {
                          setCheckoutDetails({ city: e.target.value });
                          if (errors.city) setErrors(prev => ({ ...prev, city: '' }));
                        }}
                        className={`w-full p-3 rounded-xl border bg-card/40 text-sm text-foreground placeholder-zinc-600 outline-none transition-all ${
                          errors.city 
                            ? 'border-red-500/60 focus:border-red-500' 
                            : 'border-border focus:border-[#2CFF05] focus:ring-1 focus:ring-[#2CFF05]/30'
                        }`}
                      />
                      {errors.city && <p className="text-[10px] font-medium text-red-400 mt-1">{errors.city}</p>}
                    </div>

                    {/* Order Notes */}
                    <div>
                      <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                        <Notebook size={11} className="text-muted-foreground" /> Custom Notes / Requests (Optional)
                      </label>
                      <textarea
                        placeholder="Specify color customizations, fabric preferences, or packaging notes..."
                        value={notes}
                        onChange={(e) => setCheckoutDetails({ notes: e.target.value })}
                        rows={3}
                        className="w-full p-3 rounded-xl border border-border bg-card/40 text-sm text-foreground placeholder-zinc-600 focus:border-[#2CFF05] focus:ring-1 focus:ring-[#2CFF05]/30 outline-none transition-all resize-none"
                      />
                    </div>

                    {/* Payment Method */}
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                        <CreditCard size={11} className="text-muted-foreground" /> Payment Option
                      </label>
                      
                      {/* Preselected Cash on Delivery block */}
                      <div className="p-3.5 rounded-xl border border-[#2CFF05]/50 bg-[#2CFF05]/5 flex items-center justify-between relative overflow-hidden group">
                        <div className="flex items-center gap-3">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#45ff24] border border-white/20" />
                          <div>
                            <p className="text-xs font-bold text-foreground flex items-center gap-2">
                              Cash on Delivery (COD)
                              <span className="text-[8px] bg-[#2CFF05]/30 text-[#45ff24] border border-[#2CFF05]/30 font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
                                Pay when you receive
                              </span>
                            </p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">Pay standard cash upon physical carrier delivery.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              )}

            </div>

            {/* Drawer Footer & Checkout Actions */}
            {items.length > 0 && (
              <div className="p-5 sm:p-6 border-t border-border bg-background space-y-4">
                {/* Cost breakups */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Cart Subtotal:</span>
                    <span className="font-semibold text-foreground">Rs. {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      Estimated Shipping (COD):
                    </span>
                    <span className="font-semibold text-foreground">Rs. {shippingCost}</span>
                  </div>
                  
                  {/* Glowing Total */}
                  <div className="flex justify-between items-baseline pt-2 border-t border-border">
                    <span className="text-xs font-bold text-foreground uppercase tracking-wider">Estimated Total</span>
                    <span className="text-xl font-black text-[#2CFF05] drop-shadow-[0_0_15px_rgba(139,92,246,0.35)]">
                      Rs. {total.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Checkout Trigger */}
                <button
                  type="button"
                  disabled={isSubmitting || isLimited}
                  onClick={handleCheckoutGuarded}
                  className="w-full py-4 rounded-xl bg-[#2CFF05] disabled:from-zinc-700 disabled:to-zinc-800 disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-95 text-[#0a0a0a] font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-[0_4px_20px_rgba(167,139,250,0.2)] hover:shadow-[0_4px_25px_rgba(167,139,250,0.35)]"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : isLimited ? (
                    <span>Wait {resetInSeconds}s to Avoid Spam</span>
                  ) : (
                    <>
                      <Send size={13} />
                      <span>Complete Order via WhatsApp</span>
                    </>
                  )}
                </button>

                {/* Cooldown error message display */}
                {errors.submit && (
                  <p className="text-[10px] text-amber-400 text-center font-medium mt-1">
                    {errors.submit}
                  </p>
                )}

                {/* Secure checkout info */}
                <p className="text-[9px] text-zinc-600 text-center font-medium">
                  By clicking above, your checkout data is formatted and compiled into a secure chat message.
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
