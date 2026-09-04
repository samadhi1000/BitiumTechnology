-- ==============================================================================
-- BITIUM TECHNOLOGY: Fix Products & Variants Live Sync RLS & Columns
-- Run this in Supabase Dashboard -> SQL Editor
-- ==============================================================================

-- 1. Ensure required columns exist on products table
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS original_price NUMERIC(10, 2);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sub_category TEXT;

-- 2. Drop restrictive category constraint to support all Bitium categories
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_category_check;

-- 3. Enable RLS and allow full access (Select, Insert, Update, Delete) to Products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to products" ON public.products;
DROP POLICY IF EXISTS "Allow admin full access to products" ON public.products;
DROP POLICY IF EXISTS "Allow all operations for products" ON public.products;

CREATE POLICY "Allow all operations for products" 
    ON public.products FOR ALL 
    USING (true)
    WITH CHECK (true);

-- 4. Enable RLS and allow full access (Select, Insert, Update, Delete) to Product Variants
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to variants" ON public.product_variants;
DROP POLICY IF EXISTS "Allow admin full access to variants" ON public.product_variants;
DROP POLICY IF EXISTS "Allow all operations for variants" ON public.product_variants;

CREATE POLICY "Allow all operations for variants" 
    ON public.product_variants FOR ALL 
    USING (true)
    WITH CHECK (true);

-- 5. Seed / ensure foreign key cascade
ALTER TABLE public.product_variants 
    DROP CONSTRAINT IF EXISTS product_variants_product_id_fkey,
    ADD CONSTRAINT product_variants_product_id_fkey 
    FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;
