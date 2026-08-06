'use client';

import React, { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getProductById, Product, Variant } from '@/lib/products';
import { useCartStore } from '@/lib/store/cartStore';
import { ArrowLeft, ShoppingBag, Check } from 'lucide-react';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  // Await params using React.use()
  const resolvedParams = use(params);
  const productId = resolvedParams.id;

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);

  useEffect(() => {
    async function load() {
      const data = await getProductById(productId);
      if (data) {
        setProduct(data);
        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0]);
        }
      }
      setLoading(false);
    }
    load();
  }, [productId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8DFF00] mx-auto"></div>
        <p className="text-muted-foreground mt-4 text-sm">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl font-bold">Product Not Found</h2>
        <p className="text-muted-foreground mt-2 text-sm">The product you are looking for does not exist.</p>
        <Link href="/" className="inline-flex items-center gap-2 text-[#8DFF00] hover:text-[#9eff1a] mt-6 font-semibold">
          <ArrowLeft size={16} /> Back to Home
        </Link>
      </div>
    );
  }

  const currentPrice = selectedVariant?.price_override || product.price;

  const handleAddToCart = () => {
    if (!selectedVariant) return;

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
      quantity: quantity,
      price: currentPrice,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    openCart();
  };

  // Group variants by color and size if applicable
  const sizes = Array.from(new Set(product.variants?.map((v) => v.attributes.size).filter(Boolean)));
  const colors = Array.from(new Set(product.variants?.map((v) => v.attributes.color).filter(Boolean)));

  const handleSelectAttribute = (size: string, color: string) => {
    const variant = product.variants?.find(
      (v) => v.attributes.size === size && v.attributes.color === color
    );
    if (variant) {
      setSelectedVariant(variant);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Back Button */}
      <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 text-sm font-semibold">
        <ArrowLeft size={16} /> Back to Catalog
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left Column: Image */}
        <div className="relative aspect-square rounded-3xl overflow-hidden border border-border bg-card shadow-2xl">
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(max-w-768px) 100vw, 600px"
            priority
            className="object-cover"
          />
        </div>

        {/* Right Column: Order Panel */}
        <div className="flex flex-col justify-between">
          <div className="space-y-6">
            <span className="text-xs text-[#8DFF00] font-bold uppercase tracking-widest bg-[#8DFF00]/10 border border-[#8DFF00]/20 px-2.5 py-1 rounded-md w-fit">
              Premium Blanks
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{product.name}</h1>
            <p className="text-2xl font-bold text-[#8DFF00]">Rs. {currentPrice.toLocaleString()}</p>
            <p className="text-muted-foreground text-sm leading-relaxed">{product.description}</p>

            {/* Sizes */}
            {sizes.length > 0 && (
              <div className="space-y-2">
                <span className="text-sm font-semibold text-foreground">Select Size:</span>
                <div className="flex gap-2">
                  {sizes.map((sz) => {
                    const isAvailable = product.variants?.some(
                      (v) => v.attributes.size === sz && v.attributes.color === (selectedVariant?.attributes.color || colors[0])
                    );
                    const isSelected = selectedVariant?.attributes.size === sz;
                    return (
                      <button
                        key={sz as string}
                        disabled={!isAvailable}
                        onClick={() => handleSelectAttribute(sz as string, selectedVariant?.attributes.color || (colors[0] as string))}
                        className={`min-w-12 h-12 flex items-center justify-center rounded-xl border text-sm font-bold transition-all ${
                          isSelected
                            ? 'bg-[#8DFF00] border-[#8DFF00] text-[#0a0a0a]'
                            : isAvailable
                            ? 'border-border bg-card/50 hover:bg-muted text-[#0a0a0a] hover:text-[#0a0a0a]'
                            : 'border-border bg-background/20 text-zinc-600 cursor-not-allowed'
                        }`}
                      >
                        {sz as string}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Colors */}
            {colors.length > 0 && (
              <div className="space-y-2">
                <span className="text-sm font-semibold text-foreground">Select Color:</span>
                <div className="flex gap-2">
                  {colors.map((col) => {
                    const isAvailable = product.variants?.some(
                      (v) => v.attributes.color === col && v.attributes.size === (selectedVariant?.attributes.size || sizes[0])
                    );
                    const isSelected = selectedVariant?.attributes.color === col;
                    return (
                      <button
                        key={col as string}
                        disabled={!isAvailable}
                        onClick={() => handleSelectAttribute(selectedVariant?.attributes.size || (sizes[0] as string), col as string)}
                        className={`px-4 h-12 flex items-center justify-center rounded-xl border text-xs sm:text-sm font-bold transition-all ${
                          isSelected
                            ? 'bg-[#8DFF00] border-[#8DFF00] text-[#0a0a0a]'
                            : isAvailable
                            ? 'border-border bg-card/50 hover:bg-muted text-[#0a0a0a] hover:text-[#0a0a0a]'
                            : 'border-border bg-background/20 text-zinc-600 cursor-not-allowed'
                        }`}
                      >
                        {col as string}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="space-y-2">
              <span className="text-sm font-semibold text-foreground">Quantity:</span>
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
          </div>

          <div className="mt-8 pt-8 border-t border-border">
            <button
              onClick={handleAddToCart}
              className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${
                added
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-[#0a0a0a]'
                  : 'bg-[#8DFF00] hover:bg-[#9eff1a] text-[#0a0a0a] glow-primary'
              }`}
            >
              {added ? (
                <>
                  <Check size={18} />
                  <span>Added to Cart</span>
                </>
              ) : (
                <>
                  <ShoppingBag size={18} />
                  <span>Add to Cart</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
