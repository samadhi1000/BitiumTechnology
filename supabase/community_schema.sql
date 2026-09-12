-- ==============================================================================
-- BITIUM TECHNOLOGY: Community Hub Schema & Full Permissions
-- Run this in Supabase Dashboard -> SQL Editor
-- ==============================================================================

-- 1. Community Posts Table
CREATE TABLE IF NOT EXISTS public.community_posts (
    id TEXT PRIMARY KEY,
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    author_email TEXT,
    author_name TEXT NOT NULL,
    author_avatar TEXT,
    author_role TEXT DEFAULT 'Member',
    author_badge TEXT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    category TEXT DEFAULT 'general',
    likes INTEGER DEFAULT 0,
    is_pinned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Community Comments Table
CREATE TABLE IF NOT EXISTS public.community_comments (
    id TEXT PRIMARY KEY,
    post_id TEXT REFERENCES public.community_posts(id) ON DELETE CASCADE NOT NULL,
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    author_name TEXT NOT NULL,
    author_avatar TEXT,
    author_badge TEXT,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for speedy feed queries
CREATE INDEX IF NOT EXISTS idx_community_posts_created_at ON public.community_posts (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_posts_is_pinned ON public.community_posts (is_pinned DESC);
CREATE INDEX IF NOT EXISTS idx_community_comments_post_id ON public.community_comments (post_id);

-- Enable RLS
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_comments ENABLE ROW LEVEL SECURITY;

-- Drop previous restrictive policies
DROP POLICY IF EXISTS "Allow all operations for community_posts" ON public.community_posts;
DROP POLICY IF EXISTS "Allow public read community_posts" ON public.community_posts;
DROP POLICY IF EXISTS "Allow insert community_posts" ON public.community_posts;
DROP POLICY IF EXISTS "Allow update community_posts" ON public.community_posts;
DROP POLICY IF EXISTS "Allow delete community_posts" ON public.community_posts;

DROP POLICY IF EXISTS "Allow all operations for community_comments" ON public.community_comments;
DROP POLICY IF EXISTS "Allow public read community_comments" ON public.community_comments;
DROP POLICY IF EXISTS "Allow insert community_comments" ON public.community_comments;
DROP POLICY IF EXISTS "Allow update community_comments" ON public.community_comments;
DROP POLICY IF EXISTS "Allow delete community_comments" ON public.community_comments;

-- Create full open access policies for community_posts (SELECT, INSERT, UPDATE, DELETE)
CREATE POLICY "Allow all operations for community_posts"
    ON public.community_posts FOR ALL
    USING (true)
    WITH CHECK (true);

-- Create full open access policies for community_comments (SELECT, INSERT, UPDATE, DELETE)
CREATE POLICY "Allow all operations for community_comments"
    ON public.community_comments FOR ALL
    USING (true)
    WITH CHECK (true);

-- Enable Realtime for community tables
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND schemaname = 'public' 
        AND tablename = 'community_posts'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.community_posts;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND schemaname = 'public' 
        AND tablename = 'community_comments'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.community_comments;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        NULL;
END $$;
