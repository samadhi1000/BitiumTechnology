-- ==============================================================================
-- BITIUM TECHNOLOGY: POS Invoices Table Schema & Live Multi-Admin Sync
-- Run this in Supabase Dashboard -> SQL Editor
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.pos_invoices (
    id TEXT PRIMARY KEY,
    invoice_no TEXT UNIQUE NOT NULL,
    invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
    customer_name TEXT NOT NULL DEFAULT 'Walk-in Client',
    customer_phone TEXT DEFAULT '',
    customer_address TEXT DEFAULT '',
    issued_by TEXT DEFAULT 'Indrajith Admin',
    payment_method TEXT NOT NULL DEFAULT 'Cash',
    payment_status TEXT NOT NULL DEFAULT 'PAID',
    delivery_method TEXT DEFAULT 'Store Pickup',
    discount_value NUMERIC(10, 2) DEFAULT 0,
    discount_type TEXT DEFAULT 'flat',
    discount_amount NUMERIC(10, 2) DEFAULT 0,
    extra_charges NUMERIC(10, 2) DEFAULT 0,
    extra_charges_notes TEXT DEFAULT '',
    subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0,
    total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    line_items JSONB NOT NULL DEFAULT '[]'::jsonb,
    print_layout TEXT DEFAULT 'A4',
    status TEXT DEFAULT 'PAID',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for speedy lookups and ordering
CREATE INDEX IF NOT EXISTS idx_pos_invoices_invoice_no ON public.pos_invoices (invoice_no);
CREATE INDEX IF NOT EXISTS idx_pos_invoices_created_at ON public.pos_invoices (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pos_invoices_invoice_date ON public.pos_invoices (invoice_date DESC);

-- Enable RLS
ALTER TABLE public.pos_invoices ENABLE ROW LEVEL SECURITY;

-- Drop any previous restrictive policies
DROP POLICY IF EXISTS "Allow all operations for pos_invoices" ON public.pos_invoices;
DROP POLICY IF EXISTS "Allow public read access to pos_invoices" ON public.pos_invoices;
DROP POLICY IF EXISTS "Allow admin full access to pos_invoices" ON public.pos_invoices;

-- Allow full read/write/update/delete access for both authenticated and anon roles
CREATE POLICY "Allow all operations for pos_invoices" 
    ON public.pos_invoices FOR ALL 
    USING (true) 
    WITH CHECK (true);

-- Enable Realtime replication for pos_invoices table (allows live multi-admin sync)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND schemaname = 'public' 
        AND tablename = 'pos_invoices'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.pos_invoices;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        NULL;
END $$;
