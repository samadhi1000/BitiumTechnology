-- Staff Members and Role-Based Access Control (RBAC) Schema

CREATE TABLE IF NOT EXISTS public.staff_members (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    title TEXT NOT NULL,
    department TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'specialist',
    avatar_bg TEXT DEFAULT 'bg-emerald-500',
    initials TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    permissions JSONB NOT NULL DEFAULT '{}'::jsonb,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.staff_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated admin read/write staff_members"
    ON public.staff_members FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- Seed Default Profiles
INSERT INTO public.staff_members (id, name, title, department, email, role, avatar_bg, initials, is_active, permissions)
VALUES 
(
    'staff-indrajith',
    'Indrajith',
    'CEO & Admin',
    'Executive & Administration',
    'indrajith@bitiumtechnology.com',
    'ceo_admin',
    'bg-emerald-500',
    'IJ',
    true,
    '{
        "canViewProducts": true,
        "canAddProducts": true,
        "canEditProducts": true,
        "canDeleteProducts": true,
        "canViewDigital": true,
        "canAddDigital": true,
        "canEditDigital": true,
        "canDeleteDigital": true,
        "allowedProductCategories": ["*"],
        "allowedDigitalCategories": ["*"],
        "canAccessBatchPrint": true,
        "canAccessOrderForm": true,
        "canAccessPOSInvoice": true,
        "canAccessComplaints": true,
        "canManageStaff": true,
        "canExportData": true
    }'::jsonb
),
(
    'staff-prasadari',
    'Prasadari',
    'Screen Printing & Artwork',
    'Screen Printing Department',
    'prasadari@bitiumtechnology.com',
    'specialist',
    'bg-blue-500',
    'PS',
    true,
    '{
        "canViewProducts": true,
        "canAddProducts": true,
        "canEditProducts": true,
        "canDeleteProducts": false,
        "canViewDigital": true,
        "canAddDigital": true,
        "canEditDigital": true,
        "canDeleteDigital": false,
        "allowedProductCategories": ["screen-printing", "materials"],
        "allowedDigitalCategories": ["vector", "batik", "wall-art", "dtf"],
        "canAccessBatchPrint": true,
        "canAccessOrderForm": true,
        "canAccessPOSInvoice": false,
        "canAccessComplaints": false,
        "canManageStaff": false,
        "canExportData": false
    }'::jsonb
),
(
    'staff-nadeeka',
    'Nadeeka',
    'Stencils & Hand Painting',
    'Stencils & Handcraft Department',
    'nadeeka@bitiumtechnology.com',
    'specialist',
    'bg-amber-500',
    'ND',
    true,
    '{
        "canViewProducts": true,
        "canAddProducts": true,
        "canEditProducts": true,
        "canDeleteProducts": false,
        "canViewDigital": true,
        "canAddDigital": true,
        "canEditDigital": true,
        "canDeleteDigital": false,
        "allowedProductCategories": ["stencil", "materials"],
        "allowedDigitalCategories": ["vector", "wall-art"],
        "canAccessBatchPrint": true,
        "canAccessOrderForm": true,
        "canAccessPOSInvoice": false,
        "canAccessComplaints": false,
        "canManageStaff": false,
        "canExportData": false
    }'::jsonb
),
(
    'staff-dinithi',
    'Dinithi',
    'Cap Batik & Other',
    'Batik & Custom Crafts',
    'dinithi@bitiumtechnology.com',
    'specialist',
    'bg-purple-500',
    'DN',
    true,
    '{
        "canViewProducts": true,
        "canAddProducts": true,
        "canEditProducts": true,
        "canDeleteProducts": false,
        "canViewDigital": true,
        "canAddDigital": true,
        "canEditDigital": true,
        "canDeleteDigital": false,
        "allowedProductCategories": ["batik-stamp", "materials", "laser-cutting"],
        "allowedDigitalCategories": ["batik", "vector"],
        "canAccessBatchPrint": true,
        "canAccessOrderForm": true,
        "canAccessPOSInvoice": false,
        "canAccessComplaints": false,
        "canManageStaff": false,
        "canExportData": false
    }'::jsonb
),
(
    'staff-dilrukshi',
    'Dilrukshi',
    'Customer Complaints & Inquiries',
    'Customer Service & Resolution',
    'dilrukshi@bitiumtechnology.com',
    'support',
    'bg-rose-500',
    'DL',
    true,
    '{
        "canViewProducts": true,
        "canAddProducts": false,
        "canEditProducts": false,
        "canDeleteProducts": false,
        "canViewDigital": true,
        "canAddDigital": false,
        "canEditDigital": false,
        "canDeleteDigital": false,
        "allowedProductCategories": ["*"],
        "allowedDigitalCategories": ["*"],
        "canAccessBatchPrint": false,
        "canAccessOrderForm": true,
        "canAccessPOSInvoice": true,
        "canAccessComplaints": true,
        "canManageStaff": false,
        "canExportData": true
    }'::jsonb
)
ON CONFLICT (id) DO NOTHING;
