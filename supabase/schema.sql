-- Create tables for PrintGrid e-commerce platform

-- 1. Profiles Table (linked to Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to profiles" 
    ON public.profiles FOR SELECT 
    USING (true);

CREATE POLICY "Allow users to update their own profile" 
    ON public.profiles FOR UPDATE 
    USING (auth.uid() = id);

-- Trigger to create a profile automatically on auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        NEW.raw_user_meta_data->>'avatar_url',
        'customer'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    image_url TEXT,
    category TEXT NOT NULL CHECK (category IN ('apparel', 'dtf_sheet', 'accessory')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to products" 
    ON public.products FOR SELECT 
    USING (is_active = true);

CREATE POLICY "Allow admin full access to products" 
    ON public.products FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- 3. Product Variants Table
CREATE TABLE IF NOT EXISTS public.product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL, -- e.g., "M / Black", "12x23 inch"
    sku TEXT UNIQUE NOT NULL,
    price_override NUMERIC(10, 2),
    stock_quantity INTEGER DEFAULT 0,
    attributes JSONB NOT NULL DEFAULT '{}'::jsonb, -- e.g., {"size": "M", "color": "Black", "width": 12, "height": 23}
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for product_variants
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to variants" 
    ON public.product_variants FOR SELECT 
    USING (true);

CREATE POLICY "Allow admin full access to variants" 
    ON public.product_variants FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- 4. Custom Sheets Table (for Canvas Designs)
CREATE TABLE IF NOT EXISTS public.custom_sheets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- nullable for guest uploads
    width NUMERIC(5, 2) NOT NULL, -- in inches (e.g. 12.00)
    height NUMERIC(5, 2) NOT NULL, -- in inches (e.g. 23.00)
    canvas_json JSONB NOT NULL, -- FabricJS layout JSON
    preview_url TEXT, -- PNG/SVG render URL
    price NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for custom_sheets
ALTER TABLE public.custom_sheets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to owner or guests" 
    ON public.custom_sheets FOR SELECT 
    USING (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Allow inserts to all (users and guests)" 
    ON public.custom_sheets FOR INSERT 
    WITH CHECK (true);

-- 5. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- nullable for guest checkouts
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')),
    total_price NUMERIC(10, 2) NOT NULL,
    shipping_address JSONB NOT NULL, -- e.g., { "full_name": "", "address_line1": "", "city": "", "phone": "" }
    payment_method TEXT DEFAULT 'cod' CHECK (payment_method IN ('cod', 'card', 'ipay')),
    payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'refunded')),
    n8n_processed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to view their own orders" 
    ON public.orders FOR SELECT 
    USING (user_id = auth.uid());

CREATE POLICY "Allow inserts to all (users and guests)" 
    ON public.orders FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Allow admin full access to orders" 
    ON public.orders FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- 6. Order Items Table
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
    custom_sheet_id UUID REFERENCES public.custom_sheets(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for order_items
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to view their own order items" 
    ON public.order_items FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.orders 
            WHERE orders.id = order_items.order_id AND (orders.user_id = auth.uid() OR orders.user_id IS NULL)
        )
    );

CREATE POLICY "Allow inserts to all" 
    ON public.order_items FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Allow admin full access to order items" 
    ON public.order_items FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- 7. Insert Initial Dummy Data for Testing
INSERT INTO public.products (id, name, description, price, image_url, category, is_active) VALUES
('b2a8d3e9-4e7a-4e2b-b6c8-2f1a3b4c5d6e', 'Custom DTF Sheet Builder', 'Create custom DTF transfer sheets with our interactive designer. Standard sheet size is 12x23 inches.', 1500.00, '/images/products/dtf-sheet.jpg', 'dtf_sheet', true),
('c3b9e4f0-5f8b-5f3c-c7d9-3a2b4c5d6e7f', 'Premium Heavyweight Tee', '100% premium cotton heavyweight 240GSM blank tee, perfect for DTF printing.', 2200.00, '/images/products/heavyweight-tee.jpg', 'apparel', true)
ON CONFLICT DO NOTHING;

INSERT INTO public.product_variants (product_id, name, sku, price_override, stock_quantity, attributes) VALUES
('b2a8d3e9-4e7a-4e2b-b6c8-2f1a3b4c5d6e', '12" x 23" Sheet', 'DTF-1223', NULL, 9999, '{"width": 12, "height": 23}'),
('c3b9e4f0-5f8b-5f3c-c7d9-3a2b4c5d6e7f', 'M / Black', 'TS-M-BLK', NULL, 150, '{"size": "M", "color": "Black"}'),
('c3b9e4f0-5f8b-5f3c-c7d9-3a2b4c5d6e7f', 'L / Black', 'TS-L-BLK', NULL, 120, '{"size": "L", "color": "Black"}'),
('c3b9e4f0-5f8b-5f3c-c7d9-3a2b4c5d6e7f', 'XL / Black', 'TS-XL-BLK', 200.00, 80, '{"size": "XL", "color": "Black"}'),
('c3b9e4f0-5f8b-5f3c-c7d9-3a2b4c5d6e7f', 'M / White', 'TS-M-WHT', NULL, 100, '{"size": "M", "color": "White"}'),
('c3b9e4f0-5f8b-5f3c-c7d9-3a2b4c5d6e7f', 'L / White', 'TS-L-WHT', NULL, 90, '{"size": "L", "color": "White"}')
ON CONFLICT DO NOTHING;
