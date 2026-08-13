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
}

const INITIAL_POSTS: Post[] = [
  {
    id: 'post-1',
    authorName: 'Nimna Wijesinghe',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    authorRole: 'Master Designer',
    authorBadge: 'Industry Pro',
    title: 'How to avoid cracking in DTF transfers on 100% heavy cotton hoodies?',
    content: 'Hi everyone! I am running a batch of custom heavy hoodies and noticing some microscopic cracks after the first wash test. I am printing on double matte hot peel film. Any recommendations for temperature and pressure tuning? Should I do a post-press seal?',
    category: 'dtf',
    likes: 42,
    imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=600&q=80',
    createdAt: '2 hours ago',
    comments: [
      {
        id: 'comment-1-1',
        authorName: 'Kamal Perera',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        authorBadge: 'DTF Specialist',
        content: 'Try pressing at 145°C for 12 seconds with medium-heavy pressure. Crucially, let it cool completely for hot-peel, then do a second press for 5 seconds using a teflon sheet. That completely binds the ink fibers into the cotton grain!',
        createdAt: '1 hour ago'
      }
    ]
  },
  {
    id: 'post-2',
    authorName: 'Priyantha De Silva',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    authorRole: 'Screen Workshop Owner',
    authorBadge: 'Screen Master',
    title: 'Halftone mesh count suggestions for vintage CMYK separations?',
    content: 'We are printing a detailed 4-color raster layout onto white cotton tees. We have 120T and 140T aluminum frames ready. What mesh count will produce the cleanest halftone dots without clogging with plastisol ink?',
    category: 'screen',
    likes: 28,
    imageUrl: 'https://images.unsplash.com/photo-1606159068539-43f36b99d1b2?auto=format&fit=crop&w=600&q=80',
    createdAt: '5 hours ago',
    comments: [
      {
        id: 'comment-2-1',
        authorName: 'Ruwan Kumara',
        authorAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80',
        content: 'Definitely use the 140T (355 mesh) screen for the yellow/cyan details, and print wet-on-wet. Make sure your squeegee is sharp (75 durometer) and angle it around 80 degrees to avoid flooding the dots.',
        createdAt: '3 hours ago'
      }
    ]
  }
];

// Global in-memory storage for real-time central sync across all connections
let globalPosts: Post[] = [...INITIAL_POSTS];

export async function GET() {
  try {
    const { data, error } = await supabase.from('community_posts').select('*').order('created_at', { ascending: false });
    if (!error && data && data.length > 0) {
      const dbPosts: Post[] = data.map((row: any) => ({
        id: row.id,
        authorName: row.author_name,
        authorAvatar: row.author_avatar,
        authorRole: row.author_role || 'Member',
        authorBadge: row.author_badge,
        title: row.title,
        content: row.content,
        imageUrl: row.image_url,
        category: row.category,
        likes: row.likes || 0,
        comments: row.comments || [],
        createdAt: row.created_at_label || 'Just now',
      }));
      return NextResponse.json({ posts: dbPosts });
    }
  } catch {}

  return NextResponse.json({ posts: globalPosts });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === 'create_post') {
      const newPost: Post = body.post;
      globalPosts = [newPost, ...globalPosts];

      try {
        await supabase.from('community_posts').insert([{
          id: newPost.id,
          author_name: newPost.authorName,
          author_avatar: newPost.authorAvatar,
          author_role: newPost.authorRole,
          author_badge: newPost.authorBadge,
          title: newPost.title,
          content: newPost.content,
          image_url: newPost.imageUrl,
          category: newPost.category,
          likes: newPost.likes,
          comments: newPost.comments,
          created_at_label: newPost.createdAt
        }]);
      } catch {}

      return NextResponse.json({ success: true, posts: globalPosts });
    }

    if (action === 'like_post') {
      const { postId, isLiked } = body;
      globalPosts = globalPosts.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            likes: isLiked ? p.likes + 1 : Math.max(0, p.likes - 1)
          };
        }
        return p;
      });

      try {
        const target = globalPosts.find(p => p.id === postId);
        if (target) {
          await supabase.from('community_posts').update({ likes: target.likes }).eq('id', postId);
        }
      } catch {}

      return NextResponse.json({ success: true, posts: globalPosts });
    }

    if (action === 'add_comment') {
      const { postId, comment } = body;
      globalPosts = globalPosts.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            comments: [...p.comments, comment]
          };
        }
        return p;
      });

      try {
        const target = globalPosts.find(p => p.id === postId);
        if (target) {
          await supabase.from('community_posts').update({ comments: target.comments }).eq('id', postId);
        }
      } catch {}

      return NextResponse.json({ success: true, posts: globalPosts });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
