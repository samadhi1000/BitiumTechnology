-- ==============================================================================
-- BITIUM TECHNOLOGY: Promo Offer Popup Banner Schema
-- Run this in Supabase Dashboard -> SQL Editor
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.site_popups (
    id TEXT PRIMARY KEY DEFAULT 'main_offer_popup',
    is_active BOOLEAN DEFAULT TRUE,
    campaign_name TEXT NOT NULL DEFAULT 'Seasonal Mega Offer 2026',
    badge_text TEXT NOT NULL DEFAULT '🔥 SPECIAL SEASONAL OFFER',
    headline TEXT NOT NULL DEFAULT 'UP TO 40% OFF',
    subheadline TEXT NOT NULL DEFAULT 'Exclusive discounts on Custom DTF Gang Sheets, Screen Exposed Prints & Premium Apparel.',
    image_url TEXT NOT NULL DEFAULT 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80',
    features JSONB DEFAULT '["⚡ 24H Express Dispatch", "✨ 1440 DPI HD Prints", "🛡️ 100% Guaranteed"]'::jsonb,
    promo_code TEXT DEFAULT 'BITIUM40',
    cta_text TEXT NOT NULL DEFAULT 'Claim Offer & Shop Now',
    cta_link TEXT NOT NULL DEFAULT '/gang-sheet',
    countdown_end TEXT,
    show_delay_seconds NUMERIC(4, 2) DEFAULT 1.2,
    show_frequency TEXT DEFAULT 'once_per_session',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.site_popups ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active popups
DROP POLICY IF EXISTS "Allow public read access to site_popups" ON public.site_popups;
CREATE POLICY "Allow public read access to site_popups" 
    ON public.site_popups FOR SELECT 
    USING (true);

-- Allow all operations for site_popups
DROP POLICY IF EXISTS "Allow all operations for site_popups" ON public.site_popups;
CREATE POLICY "Allow all operations for site_popups" 
    ON public.site_popups FOR ALL 
    USING (true)
    WITH CHECK (true);

-- Insert initial default record
INSERT INTO public.site_popups (
    id,
    is_active,
    campaign_name,
    badge_text,
    headline,
    subheadline,
    image_url,
    features,
    promo_code,
    cta_text,
    cta_link,
    show_delay_seconds,
    show_frequency
) VALUES (
    'main_offer_popup',
    true,
    'Seasonal Mega Offer 2026',
    '🔥 SPECIAL SEASONAL OFFER',
    'UP TO 40% OFF',
    'Exclusive discounts on Custom DTF Gang Sheets, Screen Exposed Prints & Premium Apparel.',
    'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80',
    '["⚡ 24H Express Dispatch", "✨ 1440 DPI HD Prints", "🛡️ 100% Guaranteed"]'::jsonb,
    'BITIUM40',
    'Claim Offer & Shop Now',
    '/gang-sheet',
    1.2,
    'once_per_session'
) ON CONFLICT (id) DO NOTHING;
