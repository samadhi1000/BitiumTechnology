'use client';

import React, { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getProductById, Product, Variant } from '@/lib/products';
import { useCartStore } from '@/lib/store/cartStore';
import { ArrowLeft, ShoppingBag, Check, AlertCircle, Ruler } from 'lucide-react';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);

  useEffect(() => {
    async function load() {
      const data = await getProductById(productId);
      if (data) {
        setProduct(data);
        if (data.variants && data.variants.length > 0) {
          // Auto-select ONLY when the product has a single "Default" variant
          // (existing mock products). Multi-size products require manual selection.
          const isDefaultOnly =
            data.variants.length === 1 && data.variants[0].attributes.size === 'Default';
          if (isDefaultOnly) {
            setSelectedVariant(data.variants[0]);
          }
        }
      }
      setLoading(false);
    }
    load();
  }, [productId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2CFF05] mx-auto" />
        <p className="text-muted-foreground mt-4 text-sm">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl font-bold">Product Not Found</h2>
        <p className="text-muted-foreground mt-2 text-sm">
          The product you are looking for does not exist.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[#2CFF05] hover:text-[#45ff24] mt-6 font-semibold"
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>
      </div>
    );
  }

  // ── Derive size list (exclude 'Default' placeholder) ──────────────────────
  const allVariants = product.variants ?? [];
  const sizedVariants = allVariants.filter(
    (v) => v.attributes.size && v.attributes.size !== 'Default'
  );
  const hasRealSizes = sizedVariants.length > 0;

  // Lowest price across all size variants (used for "From Rs." display)
  const minVariantPrice = hasRealSizes
    ? Math.min(...sizedVariants.map((v) => v.price_override ?? product.price))
    : product.price;

  // Current displayed price
  const currentPrice = selectedVariant
    ? (selectedVariant.price_override ?? product.price)
    : (hasRealSizes ? minVariantPrice : product.price);

  const handleSelectSize = (variant: Variant) => {
    setSelectedVariant(variant);
    setSizeError(false);
  };

  const handleAddToCart = () => {
    // For sized products, require a size to be selected
    if (!selectedVariant) {
      if (hasRealSizes) {
        setSizeError(true);
        setTimeout(() => setSizeError(false), 2500);
      }
      return;
    }

    addItem({
      type: 'apparel',
      product: {
        id: product.id,
        name: product.name,
        description: product.description,
        image_url: product.image_url,
      },
      variant: {
        id: selectedVariant.id,
        name: selectedVariant.name,
        sku: selectedVariant.sku,
        price: currentPrice,
        attributes: selectedVariant.attributes,
      },
      quantity,
      price: currentPrice,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    openCart();
  };

  // Category badge label
  const categoryLabel: Record<string, string> = {
    stencil: 'Stencils',
    'screen-printing': 'Screen Printing',
    dtf_sheet: 'DTF Printing',
    'batik-stamp': 'Batik Stamps',
    materials: 'Materials & Ink',
    'laser-cutting': 'Laser Cutting',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Back Button */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 text-sm font-semibold"
      >
        <ArrowLeft size={16} /> Back to Catalog
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* ── Left Column: Image ─────────────────────────────────────────── */}
        <div className="relative aspect-square rounded-3xl overflow-hidden border border-border bg-card shadow-2xl">
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 600px"
            priority
            className="object-cover"
          />
        </div>

        {/* ── Right Column: Order Panel ──────────────────────────────────── */}
        <div className="flex flex-col justify-between">
          <div className="space-y-5">
            {/* Category tag */}
            <span className="text-xs text-[#2CFF05] font-bold uppercase tracking-widest bg-[#2CFF05]/10 border border-[#2CFF05]/20 px-2.5 py-1 rounded-md w-fit">
              {categoryLabel[product.category] ?? 'Premium Blanks'}
            </span>

            {/* Product title */}
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{product.name}</h1>

            {/* Price display */}
            <div className="flex items-baseline gap-2">
              <p className="text-2xl sm:text-3xl font-black text-[#2CFF05] transition-all duration-200">
                {hasRealSizes && !selectedVariant ? 'From ' : ''}Rs.{' '}
                {currentPrice.toLocaleString()}
              </p>
              {product.original_price && (
                <p className="text-sm text-muted-foreground line-through">
                  Rs. {product.original_price.toLocaleString()}
                </p>
              )}
            </div>

            {/* Description */}
            <p className="text-muted-foreground text-sm leading-relaxed">{product.description}</p>

            {/* ── SIZE SELECTOR ─────────────────────────────────────────── */}
            {hasRealSizes && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                    <Ruler size={14} className="text-[#2CFF05]" />
                    Select Size:
                  </span>
                  {sizeError && (
                    <span className="text-xs text-rose-400 font-semibold flex items-center gap-1 animate-pulse">
                      <AlertCircle size={12} /> Please select a size
                    </span>
                  )}
                </div>

                {/* Size button grid */}
                <div className="flex flex-wrap gap-2.5">
                  {sizedVariants.map((variant) => {
                    const sz = variant.attributes.size as string;
                    const variantPrice = variant.price_override ?? product.price;
                    const isSelected = selectedVariant?.id === variant.id;

                    return (
                      <button
                        key={variant.id}
                        onClick={() => handleSelectSize(variant)}
                        className={`
                          min-w-[72px] px-3 py-2.5 flex flex-col items-center justify-center
                          rounded-xl border text-center transition-all duration-150
                          ${isSelected
                            ? 'bg-[#2CFF05] border-[#2CFF05] text-[#0a0a0a] shadow-lg shadow-[#2CFF05]/25 scale-105'
                            : sizeError
                            ? 'border-rose-500/50 bg-rose-500/5 hover:border-[#2CFF05]/40 hover:bg-card text-foreground'
                            : 'border-border bg-card/50 hover:border-[#2CFF05]/40 hover:bg-card text-foreground'
                          }
                        `}
                      >
                        <span className="text-sm font-black leading-none">{sz}</span>
                        <span
                          className={`text-[10px] font-semibold mt-1 leading-none ${
                            isSelected ? 'text-[#0a0a0a]/70' : 'text-muted-foreground'
                          }`}
                        >
                          Rs.{variantPrice.toLocaleString()}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Selected size info row */}
                {selectedVariant && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Check size={12} className="text-[#2CFF05]" />
                    <span>
                      <strong className="text-foreground">{selectedVariant.attributes.size}</strong> selected
                      {selectedVariant.attributes.size === 'Meters' && (
                        <span className="ml-1">&mdash; use Quantity for total meters</span>
                      )}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* ── QUANTITY ─────────────────────────────────────────────── */}
            <div className="space-y-2">
              <span className="text-sm font-semibold text-foreground">
                Quantity{selectedVariant?.attributes.size === 'Meters' ? ' (meters)' : ''}:
              </span>
              <div className="flex items-center space-x-3 bg-card border border-border rounded-xl w-fit p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-muted font-bold transition-colors"
                >
                  -
                </button>
                <span className="w-12 text-center font-bold text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-muted font-bold transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Total price (when quantity > 1) */}
            {quantity > 1 && (
              <p className="text-xs text-muted-foreground">
                Total:{' '}
                <strong className="text-[#2CFF05]">
                  Rs. {(currentPrice * quantity).toLocaleString()}
                </strong>
              </p>
            )}
          </div>

          {/* ── Add to Cart ───────────────────────────────────────────── */}
          <div className="mt-8 pt-8 border-t border-border">
            {hasRealSizes && !selectedVariant ? (
              <button
                onClick={handleAddToCart}
                className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all border-2 ${
                  sizeError
                    ? 'border-rose-500 bg-rose-500/10 text-rose-400 animate-pulse'
                    : 'border-border bg-card/50 text-muted-foreground hover:border-[#2CFF05]/40'
                }`}
              >
                <Ruler size={18} />
                <span>Select a Size to Continue</span>
              </button>
            ) : (
              <button
                onClick={handleAddToCart}
                className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${
                  added
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-[#0a0a0a]'
                    : 'bg-[#2CFF05] hover:bg-[#45ff24] text-[#0a0a0a] glow-primary'
                }`}
              >
                {added ? (
                  <>
                    <Check size={18} />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={18} />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
