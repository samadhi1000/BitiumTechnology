'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/lib/store/cartStore';
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getSubtotal } = useCartStore();

  const subtotal = getSubtotal();

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-card border border-border rounded-full flex items-center justify-center mx-auto text-muted-foreground">
          <ShoppingBag size={36} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Your cart is empty</h2>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto">
            Looks like you haven't added any products or custom sheets to your cart yet.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2CFF05] hover:bg-[#45ff24] text-[#0a0a0a] text-sm font-semibold transition-all"
        >
          <ArrowLeft size={16} /> Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold tracking-tight mb-8">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart items list */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 border border-border bg-card/20 rounded-2xl gap-4"
            >
              {/* Product preview */}
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-border bg-background flex-shrink-0">
                  {item.product.image_url ? (
                    <Image
                      src={item.product.image_url}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-card">
                      <ShoppingBag size={24} />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-foreground">{item.product.name}</h3>
                  {item.type === 'apparel' && item.variant && (
                    <p className="text-xs text-muted-foreground mt-1">
                      SKU: {item.variant.sku} | Variant: {item.variant.name}
                    </p>
                  )}
                  {item.type === 'dtf_sheet' && item.customSheet && (
                    <p className="text-xs text-[#2CFF05] mt-1 font-semibold">
                      Custom Canvas {item.customSheet.width}" x {item.customSheet.height}" Sheet
                    </p>
                  )}
                  <p className="text-sm font-semibold text-[#2CFF05] mt-1">
                    Rs. {item.price.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Quantity and delete */}
              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6 border-t sm:border-t-0 border-border pt-4 sm:pt-0">
                <div className="flex items-center bg-card/60 border border-border rounded-xl p-1">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted font-bold transition-colors"
                  >
                    -
                  </button>
                  <span className="w-10 text-center text-xs font-bold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted font-bold transition-colors"
                  >
                    +
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <p className="font-extrabold text-sm text-foreground min-w-[90px] text-right">
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </p>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-muted-foreground hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary side-panel */}
        <div className="p-6 rounded-2xl border border-border bg-card/40 h-fit space-y-6">
          <h3 className="font-bold text-lg">Checkout Summary</h3>

          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-semibold text-foreground">Rs. {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping cost:</span>
              <span className="font-semibold text-foreground">Rs. 350 (Flat Rate)</span>
            </div>
          </div>

          <div className="border-t border-border pt-4 flex justify-between items-end">
            <div>
              <span className="text-xs text-muted-foreground">Order Total</span>
              <p className="text-2xl font-black text-[#2CFF05]">Rs. {(subtotal + 350).toLocaleString()}</p>
            </div>
          </div>

          <Link
            href="/checkout"
            className="w-full py-4 rounded-xl bg-[#2CFF05] hover:bg-[#45ff24] text-[#0a0a0a] font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-[#2CFF05]/10"
          >
            Proceed to Checkout
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
