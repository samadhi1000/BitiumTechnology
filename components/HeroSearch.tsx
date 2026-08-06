'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Search, X, Clock, TrendingUp, ChevronRight, Command, ShoppingCart, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getProducts, Product } from '@/lib/products';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/store/cartStore';
import { sanitizeSearch } from '@/lib/security/sanitize';
import { useDebounce } from '@/lib/security/rateLimit';

// ─── Constants & Types ────────────────────────────────────────────────────────

const TRENDING_QUICK_SEARCHES = [
  { label: 'Tropical Monstera Stencil', category: 'stencil' },
  { label: 'Exposed Screen Printing', category: 'screen-printing' },
  { label: 'Anime DTF Sticker Pack', category: 'dtf_sheet' },
  { label: 'Copper Cap Batik Stamp', category: 'batik-stamp' },
  { label: 'Premium DTF Film Roll', category: 'materials' },
];

const RECENT_SEARCH_KEY = 'bitium_recent_searches';

interface HeroSearchProps {
  className?: string;
}

// ─── Category Style Helpers ──────────────────────────────────────────────────

const getCategoryBadgeStyles = (category: string) => {
  switch (category) {
    case 'stencil':
      return {
        bg: 'rgba(141, 255, 0, 0.12)',
        text: 'rgba(141, 255, 0, 0.9)',
        border: '1px solid rgba(141, 255, 0, 0.25)',
        label: 'Stencil',
      };
    case 'screen-printing':
      return {
        bg: 'rgba(141, 255, 0, 0.12)',
        text: 'rgba(141, 255, 0, 0.9)',
        border: '1px solid rgba(141, 255, 0, 0.25)',
        label: 'Screen Print',
      };
    case 'dtf_sheet':
      return {
        bg: 'rgba(141, 255, 0, 0.12)',
        text: 'rgba(245, 158, 11, 0.9)', // Custom styling mapping to orange/fuchsia depending on brand
        border: '1px solid rgba(141, 255, 0, 0.25)',
        label: 'DTF Print',
      };
    case 'batik-stamp':
      return {
        bg: 'rgba(245, 158, 11, 0.12)',
        text: 'rgba(253, 230, 138, 0.9)',
        border: '1px solid rgba(245, 158, 11, 0.25)',
        label: 'Batik Cap',
      };
    case 'materials':
      return {
        bg: 'rgba(16, 185, 129, 0.12)',
        text: 'rgba(167, 243, 208, 0.9)',
        border: '1px solid rgba(16, 185, 129, 0.25)',
        label: 'Consumable',
      };
    default:
      return {
        bg: 'rgba(113, 113, 122, 0.12)',
        text: 'rgba(212, 212, 216, 0.9)',
        border: '1px solid rgba(113, 113, 122, 0.25)',
        label: category,
      };
  }
};

// ─── HeroSearch Component ─────────────────────────────────────────────────────

export const HeroSearch: React.FC<HeroSearchProps> = ({ className = '' }) => {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredResults, setFilteredResults] = useState<Product[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  const debouncedQuery = useDebounce(query, 300); // Prevent filtering on every keystroke
  
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load all products and recent searches
  useEffect(() => {
    async function loadData() {
      try {
        const catalog = await getProducts();
        setProducts(catalog);
      } catch (err) {
        console.error('Failed to load products for search catalog:', err);
      }
    }
    loadData();

    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(RECENT_SEARCH_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            const sanitized = parsed
              .map((s) => sanitizeSearch(s))
              .filter(Boolean)
              .slice(0, 3);
            setRecentSearches(sanitized);
          }
        }
      } catch (err) {
        console.error('Failed to parse recent searches:', err);
      }
    }
  }, []);

  // Keyboard shortcut: Ctrl+K or Cmd+K to focus search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        inputRef.current?.blur();
        setIsFocused(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle clicking outside the container to dismiss dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced live filter of products
  useEffect(() => {
    const q = debouncedQuery.trim();
    if (q.length > 0) {
      const cleanQ = sanitizeSearch(q.toLowerCase());
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(cleanQ) ||
          product.description.toLowerCase().includes(cleanQ) ||
          product.category.toLowerCase().includes(cleanQ) ||
          (product.sub_category && product.sub_category.toLowerCase().includes(cleanQ))
      );
      setFilteredResults(filtered.slice(0, 5));
    } else {
      setFilteredResults([]);
    }
  }, [debouncedQuery, products]);

  // Live query change handler
  const handleChange = useCallback((value: string) => {
    setQuery(value);
  }, []);

  // Submit search and track recent query
  const handleSubmit = (value: string = query) => {
    const sanitizedVal = sanitizeSearch(value);
    const term = sanitizedVal.trim();
    if (!term) return;

    // Track in local storage
    if (typeof window !== 'undefined') {
      const nextRecent = [term, ...recentSearches.filter((s) => s !== term)].slice(0, 3);
      setRecentSearches(nextRecent);
      localStorage.setItem(RECENT_SEARCH_KEY, JSON.stringify(nextRecent));
    }

    // Attempt direct match or redirect to stencils search query page
    const matchedProduct = products.find(p => p.name.toLowerCase() === term.toLowerCase());
    if (matchedProduct) {
      router.push(`/products/${matchedProduct.id}`);
    } else {
      // Redirect to catalog/category or product detail matching category if generic
      const matchingCategory = ['stencil', 'screen-printing', 'dtf_sheet', 'batik-stamp', 'materials'].find(
        (cat) => cat === term.toLowerCase() || term.toLowerCase().includes(cat.replace('-', ' '))
      );
      if (matchingCategory) {
        router.push(matchingCategory === 'dtf_sheet' ? '/dtf-printing' : `/${matchingCategory}`);
      } else {
        // Fallback to stencils page or canvas
        router.push(`/stencil?search=${encodeURIComponent(term)}`);
      }
    }
    
    setIsFocused(false);
    inputRef.current?.blur();
  };

  const handleClear = () => {
    setQuery('');
    setFilteredResults([]);
    inputRef.current?.focus();
  };

  const showDropdown = isFocused;

  return (
    <div ref={containerRef} className={`relative w-full max-w-2xl ${className}`}>
      
      {/* ── Search Bar Input Wrapper ── */}
      <motion.div
        animate={{
          boxShadow: isFocused
            ? '0 0 0 1.5px rgba(141, 255, 0, 0.6), 0 8px 40px -8px rgba(141, 255, 0, 0.35), 0 2px 12px rgba(0, 0, 0, 0.6)'
            : '0 0 0 1px rgba(255, 255, 255, 0.08), 0 4px 24px rgba(0, 0, 0, 0.45)',
        }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="relative flex items-center rounded-2xl overflow-hidden bg-card/80 backdrop-blur-xl border border-border"
      >
        {/* Search icon */}
        <div className="flex-shrink-0 pl-4 pr-2">
          <motion.div
            animate={{ color: isFocused ? '#8DFF00' : '#71717a' }}
            transition={{ duration: 0.2 }}
          >
            <Search className="w-5 h-5" aria-hidden="true" />
          </motion.div>
        </div>

        {/* Input field */}
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={showDropdown}
          aria-haspopup="listbox"
          aria-label="Search print products, stencils, and equipment"
          autoComplete="off"
          spellCheck={false}
          placeholder="Search stencils, screen printing, custom DTF..."
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          className="flex-1 py-4 pr-2 bg-transparent text-foreground text-sm placeholder-zinc-500 outline-none font-sans"
        />

        {/* Clear (X) button */}
        <AnimatePresence>
          {query.length > 0 && (
            <motion.button
              key="clear"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.15 }}
              onClick={handleClear}
              aria-label="Clear search"
              className="flex-shrink-0 mr-2 p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Keyboard shortcut (Cmd/Ctrl + K) */}
        {!query && (
          <div className="hidden sm:flex flex-shrink-0 items-center gap-1 mr-3 px-2 py-1 rounded-md border border-white/5 bg-white/5">
            <Command className="w-3 h-3 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground leading-none font-mono">K</span>
          </div>
        )}

        {/* Submit search button */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => handleSubmit()}
          aria-label="Submit search"
          className="flex-shrink-0 m-1.5 px-4.5 py-2.5 rounded-xl text-[#0a0a0a] font-bold text-xs tracking-wider uppercase transition-all bg-[#8DFF00] hover:opacity-95 shadow-[0_2px_12px_rgba(139,92,246,0.25)]"
        >
          <span className="hidden sm:inline">Search</span>
          <Search className="w-3.5 h-3.5 sm:hidden" aria-hidden="true" />
        </motion.button>
      </motion.div>

      {/* ── Dropdown Suggestions ── */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            key="dropdown"
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            role="listbox"
            aria-label="Search suggestions"
            className="absolute top-full left-0 right-0 mt-3 rounded-2xl overflow-hidden z-50 bg-background/98 backdrop-blur-2xl border border-border/80 shadow-[0_24px_50px_-12px_rgba(0,0,0,0.85)]"
          >
            {/* Live Filter Results */}
            {filteredResults.length > 0 ? (
              <div className="p-2 animate-in fade-in slide-in-from-top-1 duration-200">
                <SectionLabel>Products Found</SectionLabel>
                {filteredResults.map((product) => {
                  const badge = getCategoryBadgeStyles(product.category);
                  return (
                    <SearchDropdownItem
                      key={product.id}
                      label={product.name}
                      badge={badge.label}
                      badgeStyles={badge}
                      icon="search"
                      product={product}
                      onClick={() => {
                        setIsFocused(false);
                        router.push(`/products/${product.id}`);
                      }}
                      onAddToCart={() => {
                        const defaultVariant = product.variants?.[0] || {
                          id: `var-${product.id}`,
                          name: 'Standard Option',
                          sku: `VAR-${product.id.toUpperCase()}`,
                          price_override: null,
                          stock_quantity: 100,
                          attributes: { type: 'standard' }
                        };
                        const price = defaultVariant.price_override || product.price;

                        addItem({
                          type: 'apparel',
                          product: {
                            id: product.id,
                            name: product.name,
                            description: product.description,
                            image_url: product.image_url,
                          },
                          variant: {
                            id: defaultVariant.id,
                            name: defaultVariant.name,
                            sku: defaultVariant.sku,
                            price: price,
                            attributes: defaultVariant.attributes,
                          },
                          quantity: 1,
                          price: price,
                        });
                        
                        setQuery('');
                        setIsFocused(false);
                        openCart();
                      }}
                      onCustomize={() => {
                        setQuery('');
                        setIsFocused(false);
                        if (product.sub_category === 'tshirt-design') {
                          router.push('/3d-customizer');
                        } else {
                          router.push('/canvas');
                        }
                      }}
                    />
                  );
                })}
              </div>
            ) : query.length > 0 ? (
              /* No Search Results */
              <div className="px-5 py-8 text-center">
                <Search className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  No products matching &ldquo;<span className="text-foreground">{query}</span>&rdquo;
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Try searching for: stencil, screen, dtf, or batik.
                </p>
              </div>
            ) : (
              /* Default Suggestions: Recents + Trendings */
              <div className="p-2">
                {recentSearches.length > 0 && (
                  <>
                    <SectionLabel gold={false}>Recent Searches</SectionLabel>
                    {recentSearches.map((item, i) => (
                      <SearchDropdownItem
                        key={`recent-${i}`}
                        label={item}
                        icon="clock"
                        onClick={() => {
                          setQuery(item);
                          handleSubmit(item);
                        }}
                      />
                    ))}
                    {/* Glowing Accent Line Divider */}
                    <div className="my-2 mx-3 h-[1px] bg-gradient-to-r from-transparent via-[#8DFF00]/20 to-transparent" />
                  </>
                )}

                <SectionLabel>Trending Categories</SectionLabel>
                {TRENDING_QUICK_SEARCHES.map((item, i) => {
                  const badge = getCategoryBadgeStyles(item.category);
                  return (
                    <SearchDropdownItem
                      key={`trending-${i}`}
                      label={item.label}
                      badge={badge.label}
                      badgeStyles={badge}
                      icon="trending"
                      onClick={() => {
                        setQuery(item.label);
                        handleSubmit(item.label);
                      }}
                    />
                  );
                })}
              </div>
            )}

            {/* Keyboard hints footer */}
            <div className="px-4 py-2.5 flex items-center justify-between border-t border-border/50 text-[10px] text-muted-foreground">
              <span>
                Press{' '}
                <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-mono text-[9px]">
                  ↵
                </kbd>{' '}
                to search
              </span>
              <span>
                <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-mono text-[9px]">
                  Esc
                </kbd>{' '}
                to close
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const SectionLabel: React.FC<{ children: React.ReactNode; gold?: boolean }> = ({
  children,
  gold = true,
}) => (
  <p
    className="px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.18em]"
    style={{ color: gold ? 'rgba(141, 255, 0, 0.7)' : '#71717a' }}
  >
    {children}
  </p>
);

interface DropdownItemProps {
  label: string;
  badge?: string;
  badgeStyles?: { bg: string; text: string; border: string };
  icon: 'search' | 'clock' | 'trending';
  onClick: () => void;
  product?: Product;
  onAddToCart?: () => void;
  onCustomize?: () => void;
}

const SearchDropdownItem: React.FC<DropdownItemProps> = ({
  label,
  badge,
  badgeStyles,
  icon,
  onClick,
  product,
  onAddToCart,
  onCustomize,
}) => {
  const IconComponent = icon === 'clock' ? Clock : icon === 'trending' ? TrendingUp : ChevronRight;

  return (
    <motion.div
      whileHover={{ backgroundColor: 'rgba(141, 255, 0, 0.06)' }}
      className="w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-left transition-colors group cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <span className="flex-shrink-0 p-1.5 rounded-lg bg-muted/50 group-hover:bg-[#9eff1a]/10 transition-colors">
          <IconComponent className="w-3.5 h-3.5 text-muted-foreground group-hover:text-[#8DFF00] transition-colors" />
        </span>

        <span className="text-sm text-foreground group-hover:text-foreground transition-colors truncate font-sans">
          {label}
        </span>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
        {product && (
          <div className="hidden group-hover:flex items-center gap-1.5 transition-all">
            {product.category === 'dtf_sheet' ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCustomize?.();
                }}
                className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-[#8DFF00] hover:bg-[#9eff1a] text-[#0a0a0a] flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Eye size={10} /> Customize
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart?.();
                }}
                className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-foreground flex items-center gap-1 transition-colors cursor-pointer"
              >
                <ShoppingCart size={10} /> Add to Cart
              </button>
            )}
          </div>
        )}

        {badge && badgeStyles && (
          <span
            className="text-[9px] px-2 py-0.5 rounded-full font-extrabold tracking-wide uppercase group-hover:opacity-30 group-hover:scale-95 transition-all"
            style={{
              background: badgeStyles.bg,
              color: badgeStyles.text,
              border: badgeStyles.border,
            }}
          >
            {badge}
          </span>
        )}
      </div>
    </motion.div>
  );
};
