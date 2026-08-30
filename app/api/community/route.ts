import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export interface Comment {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorBadge?: string;
  content: string;
  createdAt: string;
}

export interface Post {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorRole: string;
  authorBadge?: string;
  title: string;
  content: string;
  imageUrl?: string;
  category: string;
  likes: number;
  comments: Comment[];
  createdAt: string;
  isLikedByUser?: boolean;
  isBookmarkedByUser?: boolean;
  isPinned?: boolean;
}

/** Converts a UTC timestamp into a human-readable "X minutes ago" label */
function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString();
}

function resolveAvatar(name: string, role?: string, badge?: string, avatarUrl?: string): string {
  const isDicebear = !!avatarUrl && avatarUrl.includes('dicebear.com');
  const isAdmin = 
    role === 'System Admin' || 
    badge === 'Admin' || 
    (name && (name.toLowerCase().includes('stackunleash') || name.toLowerCase().includes('bitium') || name.toLowerCase().includes('admin')));
  
  if (isAdmin && (!avatarUrl || isDicebear)) {
    if (name && name.toLowerCase().includes('stack')) {
      return '/images/stack-unleash-logo.webp';
    }
    return '/images/bitium-logo.webp';
  }

  if (isDicebear) {
    return '';
  }

  return avatarUrl || '';
}

export async function GET() {
  try {
    // Fetch posts with their comments in a single joined query
    const { data, error } = await supabase
      .from('community_posts')
      .select(`*, community_comments (*)`)
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw error;

    const posts: Post[] = (data || []).map((row: any) => ({
      id: row.id,
      authorName: row.author_name,
      authorAvatar: resolveAvatar(row.author_name, row.author_role, row.author_badge, row.author_avatar),
      authorRole: row.author_role || 'Member',
      authorBadge: row.author_badge,
      title: row.title,
      content: row.content,
      imageUrl: row.image_url,
      category: row.category,
      likes: row.likes || 0,
      isPinned: row.is_pinned || false,
      createdAt: timeAgo(row.created_at),
      comments: (row.community_comments || [])
        .sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        .map((c: any) => ({
          id: c.id,
          authorName: c.author_name,
          authorAvatar: resolveAvatar(c.author_name, undefined, c.author_badge, c.author_avatar),
          authorBadge: c.author_badge,
          content: c.content,
          createdAt: timeAgo(c.created_at),
        })),
    }));

    return NextResponse.json({ posts });
  } catch (err: any) {
    console.error('Community GET error:', err);
    return NextResponse.json({ posts: [] }, { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action } = body;

    // ── Create a new post ─────────────────────────────────────────────────────
    if (action === 'create_post') {
      const newPost = body.post;
      const { error } = await supabase.from('community_posts').insert([{
        id: newPost.id,
        author_name: newPost.authorName,
        author_avatar: newPost.authorAvatar,
        author_role: newPost.authorRole,
        author_badge: newPost.authorBadge,
        title: newPost.title,
        content: newPost.content,
        image_url: newPost.imageUrl,
        category: newPost.category,
        likes: 0,
        is_pinned: false,
      }]);
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    // ── Like / unlike a post ──────────────────────────────────────────────────
    if (action === 'like_post') {
      const { postId, isLiked } = body;

      // Fetch current likes count, then increment or decrement
      const { data: current, error: fetchErr } = await supabase
        .from('community_posts')
        .select('likes')
        .eq('id', postId)
        .single();
      if (fetchErr) throw fetchErr;

      const newLikes = Math.max(0, (current?.likes || 0) + (isLiked ? 1 : -1));
      const { error: updateErr } = await supabase
        .from('community_posts')
        .update({ likes: newLikes })
        .eq('id', postId);
      if (updateErr) throw updateErr;

      return NextResponse.json({ success: true, likes: newLikes });
    }

    // ── Add a comment ─────────────────────────────────────────────────────────
    if (action === 'add_comment') {
      const { postId, comment } = body;
      const { error } = await supabase.from('community_comments').insert([{
        id: comment.id,
        post_id: postId,
        author_name: comment.authorName,
        author_avatar: comment.authorAvatar,
        author_badge: comment.authorBadge,
        content: comment.content,
      }]);
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    // ── Pin / unpin a post ────────────────────────────────────────────────────
    if (action === 'pin_post') {
      const { postId, isPinned } = body;
      const { error } = await supabase
        .from('community_posts')
        .update({ is_pinned: isPinned })
        .eq('id', postId);
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    // ── Delete a comment ──────────────────────────────────────────────────────
    if (action === 'delete_comment') {
      const { commentId } = body;
      const { error } = await supabase
        .from('community_comments')
        .delete()
        .eq('id', commentId);
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    console.error('Community POST error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
