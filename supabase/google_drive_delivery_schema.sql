-- Enable UUID generator extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Digital Products Table
CREATE TABLE IF NOT EXISTS public.digital_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    google_drive_file_id TEXT NOT NULL, -- Direct File ID in Google Drive
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for digital_products
ALTER TABLE public.digital_products ENABLE ROW LEVEL SECURITY;

-- Select policy: Allow anyone to view active digital products
CREATE POLICY "Allow public read access to active products"
    ON public.digital_products FOR SELECT
    USING (is_active = TRUE);

-- Write policy: Allow only admins to write/update digital products
CREATE POLICY "Allow admin full access to products"
    ON public.digital_products FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- 2. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- Nullable for guest purchases
    customer_email TEXT NOT NULL CHECK (customer_email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$'),
    customer_name TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed')),
    total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
    payment_method TEXT DEFAULT 'payhere' CHECK (payment_method IN ('payhere', 'card')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Select policy: Users can only see their own orders based on email
CREATE POLICY "Allow customers to view their own orders"
    ON public.orders FOR SELECT
    USING (
        (auth.jwt() ->> 'email') = customer_email 
        OR EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- Insert policy: Server-side API route inserts orders (service_role bypasses RLS)
CREATE POLICY "Deny direct client insertion of orders"
    ON public.orders FOR INSERT
    WITH CHECK (FALSE);

-- 3. Order Items Table
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.digital_products(id) ON DELETE SET NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for order_items
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow view access to matching customer"
    ON public.order_items FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.orders
            WHERE orders.id = order_items.order_id 
            AND ((auth.jwt() ->> 'email') = orders.customer_email)
        )
        OR EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- 4. Granted File Permissions Table (Audit Log / Secure Registry)
CREATE TABLE IF NOT EXISTS public.file_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    customer_email TEXT NOT NULL,
    google_drive_file_id TEXT NOT NULL,
    google_permission_id TEXT NOT NULL, -- Returned by Drive API
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for file_permissions
ALTER TABLE public.file_permissions ENABLE ROW LEVEL SECURITY;

-- Admins only
CREATE POLICY "Allow admin full access to permissions log"
    ON public.file_permissions FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );
