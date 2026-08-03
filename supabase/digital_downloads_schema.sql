-- Create tables for Digital Downloads section of Bitium Technologies

-- 1. Digital Artworks Table (E-commerce Digital products)
CREATE TABLE IF NOT EXISTS public.digital_artworks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    preview_url TEXT NOT NULL, -- low-resolution watermarked file url
    file_key TEXT NOT NULL, -- private storage file path (e.g., 'artworks/high_res/royal_peacock.zip')
    category TEXT NOT NULL CHECK (category IN ('batik', 'vector', 'dtf', 'wall-art')),
    tags TEXT[] NOT NULL DEFAULT '{}',
    file_format TEXT NOT NULL, -- e.g., 'ZIP', 'SVG', 'PNG', 'PDF'
    file_size TEXT, -- e.g., '25 MB'
    resolution TEXT, -- e.g., '4500 x 3000 px'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for digital_artworks
ALTER TABLE public.digital_artworks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to active digital artworks" 
    ON public.digital_artworks FOR SELECT 
    USING (is_active = true);

CREATE POLICY "Allow admin full access to digital artworks" 
    ON public.digital_artworks FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- 2. Digital Purchases / Download Tokens Table (Post-purchase secure access)
CREATE TABLE IF NOT EXISTS public.digital_purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID, -- nullable in case of guest checkout or standalone quick-buy
    customer_email TEXT NOT NULL,
    artwork_id UUID REFERENCES public.digital_artworks(id) ON DELETE CASCADE NOT NULL,
    download_token UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
    download_count INTEGER DEFAULT 0 CHECK (download_count >= 0),
    max_downloads INTEGER DEFAULT 5 CHECK (max_downloads > 0),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for digital_purchases
ALTER TABLE public.digital_purchases ENABLE ROW LEVEL SECURITY;

-- Note: We do NOT allow general users to read from this table directly by ID unless they verify via token endpoint.
-- Admin has full access.
CREATE POLICY "Allow admin full access to digital purchases" 
    ON public.digital_purchases FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- 3. Create private storage bucket for high-res assets in Supabase if not exists
-- (Note: Storage policies and bucket creation is usually handled in the Supabase Dashboard,
-- but this SQL provides a reference for setting up the private bucket named 'digital-artworks-secure')
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('digital-artworks-secure', 'digital-artworks-secure', false, 104857600, '{"application/zip", "image/png", "image/svg+xml", "application/pdf"}')
ON CONFLICT (id) DO NOTHING;
