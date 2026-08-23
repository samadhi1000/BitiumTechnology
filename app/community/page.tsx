'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useLanguage } from '@/lib/context/LanguageContext';
import { supabase } from '@/lib/supabase';
import { 
  MessageSquare, 
  ThumbsUp, 
  Share2, 
  Bookmark, 
  Send, 
  Image as ImageIcon, 
  Tag, 
  Award, 
  Users, 
  Flame, 
  TrendingUp, 
  Search,
  Sparkles,
  Shield,
  Smile,
  X,
  Pin
} from 'lucide-react';
import Image from 'next/image';

interface Comment {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorBadge?: string;
  content: string;
  createdAt: string;
}

interface Post {
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

const CATEGORY_TAGS = [
  { id: 'all', label: 'All Discussions', labelSi: 'සියලුම සාකච්ඡා' },
  { id: 'general', label: 'General', labelSi: 'පොදු අදහස්' },
  { id: 'dtf', label: 'DTF Printing', labelSi: 'DTF මුද්‍රණය' },
  { id: 'screen', label: 'Screen Printing', labelSi: 'ස්ක්‍රීන් මුද්‍රණය' },
  { id: 'stencil', label: 'Stencils & Stamps', labelSi: 'ස්ටෙන්සිල් සහ මුද්‍රා' },
  { id: 'showcase', label: 'Project Showcase', labelSi: 'නිර්මාණ ප්‍රදර්ශනය' },
];


const EXPERT_RESPONSES = [
  "Wow, that is an awesome project! From my experience in the workshop, making sure your drying oven maintains a stable temperature profile is absolutely vital. If the ink is under-cured, it cracks easily; if over-cured, the fabric gets scorched. Let us know how it works out!",
  "Highly recommend checking the mesh tension before exposing the emulsion. If the mesh is too loose, the dots shift during printing. Keep rocking the high-quality designs!",
  "Great question. For premium fabric stamps, seasoned jackwood is the gold standard because it handles water-based dye pastes without twisting. Make sure to sand the relief flat after hand-carving.",
  "Excellent choice! When running custom laser outlines on acrylic, always peel the paper masking AFTER cutting to avoid burn marks, but keep it on during engraving to prevent fogging from vaporized plastic."
];

export default function CommunityForumPage() {
  const { user, profile } = useAuth();
  const { language } = useLanguage();
  const t = language === 'si' ? {
    hubTitle: 'ප්‍රජා පුවරුව',
    hubSub: 'ශ්‍රී ලංකාවේ මුද්‍රණ තාක්ෂණික ශිල්පීන්ගේ සහ නිර්මාණකරුවන්ගේ එකමුතුව',
    newPost: 'අලුත් අදහසක් පළ කරන්න',
    placeholderTitle: 'ඔබේ ප්‍රශ්නය හෝ අදහස කෙටියෙන් ලියන්න...',
    placeholderContent: 'තාක්ෂණික විස්තර, අත්දැකීම් සහ ගැටළු මෙහි සවිස්තරාත්මකව සාකච්ඡා කරන්න...',
    selectCategory: 'කාණ්ඩය තෝරන්න',
    publish: 'පළ කරන්න',
    searchPlaceholder: 'ප්‍රජා ලිපි සහ සාකච්ඡා සොයන්න...',
    activeDiscussions: 'සක්‍රීය සාකච්ඡා',
    topContributors: 'ප්‍රධාන සාමාජිකයින්',
    guestUser: 'අමුත්තා (ලොග් වී නැත)',
    commentPlaceholder: 'අදහසක් එක් කරන්න...',
    like: 'කැමතියි',
    comment: 'අදහස්',
    share: 'බෙදාගන්න',
    copySuccess: 'ලින්ක් එක කොපි කරගත්තා!',
    selectImage: 'රූපයක් එක් කරන්න',
    imageOptional: 'Image URL (විකල්ප)',
  } : {
    hubTitle: 'Community Hub & Forum',
    hubSub: 'Connect with Sri Lankan print specialists, share designs, and resolve technical issues.',
    newPost: 'Create New Discussion',
    placeholderTitle: 'What is on your mind? (Title/Question)',
    placeholderContent: 'Describe your technical printing query, setup parameters, or project details...',
    selectCategory: 'Select Category',
    publish: 'Publish Post',
    searchPlaceholder: 'Search discussions, setups & tips...',
    activeDiscussions: 'Active Discussions',
    topContributors: 'Top Contributors',
    guestUser: 'Guest User (Not Logged In)',
    commentPlaceholder: 'Write a comment...',
    like: 'Like',
    comment: 'Comment',
    share: 'Share',
    copySuccess: 'Post link copied to clipboard!',
    selectImage: 'Attach Image',
    imageOptional: 'Image URL (Optional)',
  };

  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [forumSearch, setForumSearch] = useState('');
  const [activeCommentsPostId, setActiveCommentsPostId] = useState<string | null>(null);
  const [memberCount, setMemberCount] = useState<number>(0);

  // New post form states
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('general');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  // Guest details if not logged in
  const [guestName, setGuestName] = useState('');

  // Toast feedback
  const [toastMessage, setToastMessage] = useState('');

  const fetchCommunityPosts = async () => {
    try {
      const res = await fetch('/api/community');
      if (res.ok) {
        const data = await res.json();
        if (data.posts && Array.isArray(data.posts)) {
          setPosts(prev => {
            return data.posts.map((newP: Post) => {
              const existing = prev.find(p => p.id === newP.id);
              return {
                ...newP,
                isLikedByUser: existing ? existing.isLikedByUser : false,
                isBookmarkedByUser: existing ? existing.isBookmarkedByUser : false,
              };
            });
          });
        }
      }

      // Fetch actual registered member count from profiles table
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      if (!error && count !== null) {
        setMemberCount(count);
      }
    } catch (err) {
      console.error('Error fetching community posts:', err);
    }
  };

  useEffect(() => {
    fetchCommunityPosts();

    // Subscribe to realtime database changes for posts and comments
    const channel = supabase
      .channel('community_realtime_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'community_posts' },
        () => {
          fetchCommunityPosts();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'community_comments' },
        () => {
          fetchCommunityPosts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    setIsPosting(true);

    let authorName = 'Anonymous Printer';
    let authorAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';
    let authorRole = 'Member';
    let authorBadge = 'Guest';

    if (profile) {
      authorName = profile.full_name || profile.email;
      authorAvatar = profile.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${authorName}`;
      authorRole = profile.role === 'admin' ? 'System Admin' : 'Registered Printer';
      authorBadge = profile.role === 'admin' ? 'Admin' : 'Verified';
    } else if (guestName.trim()) {
      authorName = guestName.trim();
      authorAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${guestName}`;
      authorRole = 'Community guest';
    }

    const newPost: Post = {
      id: `post-${Date.now()}`,
      authorName,
      authorAvatar,
      authorRole,
      authorBadge,
      title: newTitle.trim(),
      content: newContent.trim(),
      imageUrl: newImageUrl.trim() ? newImageUrl.trim() : undefined,
      category: newPostCategory,
      likes: 0,
      comments: [],
      createdAt: 'Just now'
    };

    setPosts(prev => [newPost, ...prev]);

    try {
      await fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create_post', post: newPost }),
      });
      fetchCommunityPosts();
    } catch (err) {
      console.error(err);
    }

    setNewTitle('');
    setNewContent('');
    setNewImageUrl('');
    setIsPosting(false);

    setTimeout(() => {
      const randomExpert = ['Suresh Bandara', 'Amani Fernando', 'Nihal Gunawardena', 'Dilani Silva'][Math.floor(Math.random() * 4)];
      const randomAvatar = [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80'
      ][Math.floor(Math.random() * 4)];
      
      const responseText = EXPERT_RESPONSES[Math.floor(Math.random() * EXPERT_RESPONSES.length)];
      
      const simulatedComment: Comment = {
        id: `comment-${Date.now()}`,
        authorName: randomExpert,
        authorAvatar: randomAvatar,
        authorBadge: 'Industry Expert',
        content: responseText,
        createdAt: 'Just now'
      };

      fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add_comment', postId: newPost.id, comment: simulatedComment }),
      }).then(() => {
        fetchCommunityPosts();
        setToastMessage(`New reply from ${randomExpert}!`);
        setTimeout(() => setToastMessage(''), 3000);
      });
    }, 4000);
  };

  const handleLikePost = async (postId: string) => {
    const target = posts.find(p => p.id === postId);
    if (!target) return;
    const isLiked = !target.isLikedByUser;

    setPosts(prev => prev.map(p => p.id === postId ? {
      ...p,
      isLikedByUser: isLiked,
      likes: isLiked ? p.likes + 1 : Math.max(0, p.likes - 1)
    } : p));

    try {
      await fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'like_post', postId, isLiked }),
      });
      fetchCommunityPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async (postId: string, commentText: string) => {
    if (!commentText.trim()) return;

    let commenterName = 'Anonymous Member';
    let commenterAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';
    let commenterBadge = 'Contributor';

    if (profile) {
      commenterName = profile.full_name || profile.email;
      commenterAvatar = profile.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${commenterName}`;
      commenterBadge = profile.role === 'admin' ? 'Admin' : 'Verified';
    } else if (guestName.trim()) {
      commenterName = guestName.trim();
      commenterAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${guestName}`;
      commenterBadge = 'Guest';
    }

    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      authorName: commenterName,
      authorAvatar: commenterAvatar,
      authorBadge: commenterBadge,
      content: commentText.trim(),
      createdAt: 'Just now'
    };

    setPosts(prev => prev.map(p => p.id === postId ? {
      ...p,
      comments: [...p.comments, newComment]
    } : p));

    try {
      await fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add_comment', postId, comment: newComment }),
      });
      fetchCommunityPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const handlePinPost = async (postId: string, currentPinState: boolean) => {
    const isPinned = !currentPinState;
    // Optimistic UI update
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, isPinned } : p));
    
    try {
      await fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'pin_post', postId, isPinned }),
      });
      fetchCommunityPosts();
      setToastMessage(isPinned ? 'Post pinned successfully!' : 'Post unpinned successfully!');
      setTimeout(() => setToastMessage(''), 2500);
    } catch (err) {
      console.error('Error toggling pin status:', err);
    }
  };

  const handleShare = (postId: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/community#${postId}`);
    setToastMessage(t.copySuccess);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Dynamically compute contributors from the current active feed posts
  const dynamicContributors = React.useMemo(() => {
    const authorMap: Record<string, { name: string; avatar: string; role: string; badge?: string; postsCount: number }> = {};
    
    posts.forEach(post => {
      if (!authorMap[post.authorName]) {
        authorMap[post.authorName] = {
          name: post.authorName,
          avatar: post.authorAvatar,
          role: post.authorRole,
          badge: post.authorBadge,
          postsCount: 0
        };
      }
      authorMap[post.authorName].postsCount += 1;
    });

    return Object.values(authorMap)
      .sort((a, b) => b.postsCount - a.postsCount)
      .slice(0, 3); // Top 3
  }, [posts]);

  // Filter posts
  const filteredPosts = posts.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch = p.title.toLowerCase().includes(forumSearch.toLowerCase()) ||
                          p.content.toLowerCase().includes(forumSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow graphics */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#2CFF05]/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-600/5 rounded-full blur-[100px] pointer-events-none"></div>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[120] px-4 py-3 rounded-xl bg-[#2CFF05]/10 border border-[#2CFF05]/20 text-[#2CFF05] text-xs font-black shadow-2xl flex items-center gap-2 animate-bounce">
          <Sparkles size={14} />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        
        {/* Header Block */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2CFF05]/15 border border-emerald-600/30 dark:border-[#2CFF05]/30 text-[10px] font-extrabold text-emerald-700 dark:text-[#2CFF05] uppercase tracking-wider">
            <Users size={12} />
            <span>Community Feed</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight uppercase leading-none">
            Bitium <span className="text-[#2CFF05] [text-shadow:_0_1.5px_3px_rgba(0,0,0,0.85)] dark:[text-shadow:_0_0_12px_rgba(44,255,5,0.4)]">Community Hub</span>
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
            {t.hubSub}
          </p>
        </div>

        {/* ─── GRID LAYOUT: SIDEBARS & CENTRAL FEED ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* 1. LEFT SIDEBAR: CATEGORIES (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <div className="p-5 rounded-2xl border border-border bg-card/10 backdrop-blur-md space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-2">
                <Tag size={13} className="text-[#2CFF05]" />
                <span>Categories</span>
              </h3>
              <div className="flex flex-col gap-1.5">
                {CATEGORY_TAGS.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                      selectedCategory === cat.id
                        ? 'bg-[#2CFF05]/15 border border-[#2CFF05]/40 text-emerald-700 dark:text-[#2CFF05] pl-4 font-black'
                        : 'border border-transparent text-muted-foreground hover:text-foreground hover:bg-card/40'
                    }`}
                  >
                    <span>{language === 'si' ? cat.labelSi : cat.label}</span>
                    {selectedCategory === cat.id && <span className="w-1.5 h-1.5 rounded-full bg-[#2CFF05]"></span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Trending topics */}
            <div className="p-5 rounded-2xl border border-border bg-card/10 backdrop-blur-md space-y-4 hidden lg:block">
              <h3 className="text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-2">
                <Flame size={13} className="text-amber-500" />
                <span>Hot Topics</span>
              </h3>
              <div className="space-y-3 text-[11px] leading-relaxed">
                <div className="space-y-0.5">
                  <span className="text-amber-500 font-bold block">#1 Post Curing DTF</span>
                  <span className="text-muted-foreground">42 active members discussing wash tests.</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-amber-500 font-bold block">#2 Custom Screen Mesh</span>
                  <span className="text-muted-foreground">Choosing screen counts for detailed graphics.</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-amber-500 font-bold block">#3 Jackwood Carving</span>
                  <span className="text-muted-foreground">Techniques for smooth wooden stamp patterns.</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. CENTRAL COLUMN: DISCUSSIONS FEED (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Search and Filters Bar */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={15} />
              <input 
                type="text"
                value={forumSearch}
                onChange={e => setForumSearch(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card/10 backdrop-blur-md text-xs focus:outline-none focus:border-[#2CFF05] transition-colors"
              />
            </div>

            {/* New Post Creator Form */}
            <div className="p-5 rounded-2xl border border-border bg-card/15 backdrop-blur-md space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-[#2CFF05] flex items-center gap-2 border-b border-border/50 pb-2">
                <Sparkles size={14} />
                <span>{t.newPost}</span>
              </h3>

              <form onSubmit={handleCreatePost} className="space-y-4">
                
                {/* Guest name input if not authenticated */}
                {!profile && (
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-muted-foreground uppercase">Your Nickname *</label>
                    <input 
                      type="text"
                      required
                      value={guestName}
                      onChange={e => setGuestName(e.target.value)}
                      placeholder="e.g. PrinterPro99"
                      className="w-full bg-background border border-border rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-[#2CFF05] transition-colors text-foreground font-semibold"
                    />
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-muted-foreground uppercase">Title / Query *</label>
                  <input 
                    type="text"
                    required
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    placeholder={t.placeholderTitle}
                    className="w-full bg-background border border-border rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-[#2CFF05] transition-colors text-foreground font-bold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-muted-foreground uppercase">{t.selectCategory}</label>
                    <select
                      value={newPostCategory}
                      onChange={e => setNewPostCategory(e.target.value)}
                      className="w-full bg-background border border-border rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-[#2CFF05] transition-colors text-foreground font-semibold"
                    >
                      <option value="general">General</option>
                      <option value="dtf">DTF Printing</option>
                      <option value="screen">Screen Printing</option>
                      <option value="stencil">Stencils & Stamps</option>
                      <option value="showcase">Project Showcase</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-muted-foreground uppercase">{t.imageOptional}</label>
                    <input 
                      type="text"
                      value={newImageUrl}
                      onChange={e => setNewImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-background border border-border rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-[#2CFF05] transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-muted-foreground uppercase">Discussion Body *</label>
                  <textarea
                    required
                    value={newContent}
                    onChange={e => setNewContent(e.target.value)}
                    placeholder={t.placeholderContent}
                    rows={4}
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#2CFF05] transition-colors resize-none text-foreground leading-relaxed"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isPosting}
                    className="px-6 py-2.5 rounded-xl bg-[#2CFF05] hover:bg-[#7acc00] disabled:bg-zinc-700 disabled:opacity-40 text-black font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Send size={12} />
                    <span>{t.publish}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Discussions Feed Card List */}
            <div className="space-y-6">
              {filteredPosts.length === 0 ? (
                <div className="p-16 border border-border border-dashed rounded-3xl bg-card/5 text-center text-muted-foreground">
                  <MessageSquare size={36} className="mx-auto mb-2 text-muted-foreground opacity-55" />
                  <p className="text-xs font-bold">No discussions found matching criteria</p>
                  <p className="text-[10px] text-zinc-550 mt-1">Be the first to share an update or post a query!</p>
                </div>
              ) : (
                filteredPosts.map(post => {
                  const isCommentsOpen = activeCommentsPostId === post.id;
                  
                  return (
                    <div 
                      key={post.id} 
                      id={post.id}
                      className="p-5 sm:p-6 rounded-3xl border border-border bg-card/15 backdrop-blur-md space-y-4 hover:border-border/80 transition-all shadow-xl"
                    >
                      {/* Post Header: User metadata */}
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-border bg-background">
                            <Image src={post.authorAvatar} alt={post.authorName} fill className="object-cover" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-extrabold text-xs text-foreground">{post.authorName}</span>
                              {post.authorBadge && (
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-[#2CFF05]/15 border border-[#2CFF05]/30 text-[8px] font-black text-emerald-700 dark:text-[#2CFF05] uppercase tracking-wider">
                                  <Shield size={8} />
                                  <span>{post.authorBadge}</span>
                                </span>
                              )}
                            </div>
                            <span className="text-[9px] text-muted-foreground block">{post.authorRole} &middot; {post.createdAt}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {post.isPinned && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/35 text-[9px] font-black text-amber-500 uppercase tracking-widest animate-pulse">
                              <Pin size={9} className="fill-current" />
                              <span>Pinned</span>
                            </span>
                          )}
                          <span className="px-2 py-0.5 rounded-md bg-card border border-border text-[9px] font-extrabold text-emerald-700 dark:text-[#2CFF05] uppercase tracking-widest">
                            #{post.category}
                          </span>
                        </div>
                      </div>

                      {/* Post content body */}
                      <div className="space-y-3">
                        <h4 className="text-sm sm:text-base font-black text-foreground leading-tight tracking-tight">
                          {post.title}
                        </h4>
                        <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
                          {post.content}
                        </p>
                      </div>

                      {/* Attached image preview if present */}
                      {post.imageUrl && (
                        <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border border-border bg-background">
                          <Image src={post.imageUrl} alt={post.title} fill className="object-cover" />
                        </div>
                      )}

                      {/* Stats and actions footer */}
                      <div className="flex items-center justify-between pt-2 border-t border-border/40 text-[10px] font-bold text-muted-foreground">
                        <div className="flex items-center gap-3">
                          {/* Like action button */}
                          <button
                            onClick={() => handleLikePost(post.id)}
                            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
                              post.isLikedByUser
                                ? 'bg-[#2CFF05]/15 border-[#2CFF05]/40 text-emerald-700 dark:text-[#2CFF05] scale-105 font-bold'
                                : 'border-border bg-card/25 hover:bg-card hover:text-foreground'
                            }`}
                          >
                            <ThumbsUp size={11} className={post.isLikedByUser ? 'fill-current' : ''} />
                            <span>{post.likes} {t.like}</span>
                          </button>

                          {/* Comment toggle button */}
                          <button
                            onClick={() => setActiveCommentsPostId(isCommentsOpen ? null : post.id)}
                            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
                              isCommentsOpen
                                ? 'bg-[#2CFF05]/15 border-[#2CFF05]/40 text-emerald-700 dark:text-[#2CFF05] scale-105 font-bold'
                                : 'border-border bg-card/25 hover:bg-card hover:text-foreground'
                            }`}
                          >
                            <MessageSquare size={11} />
                            <span>{post.comments.length} {t.comment}</span>
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          {profile?.role === 'admin' && (
                            <button
                              onClick={() => handlePinPost(post.id, !!post.isPinned)}
                              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                                post.isPinned
                                  ? 'bg-amber-500/10 border-amber-500/20 text-amber-500'
                                  : 'border-border bg-card/25 hover:bg-card hover:text-foreground'
                              }`}
                              title={post.isPinned ? "Unpin Post" : "Pin Post"}
                            >
                              <Pin size={11} className={post.isPinned ? 'fill-current' : ''} />
                            </button>
                          )}
                          <button
                            onClick={() => handleShare(post.id)}
                            className="p-1.5 rounded-lg border border-border bg-card/25 hover:bg-card hover:text-foreground transition-all cursor-pointer"
                            title={t.share}
                          >
                            <Share2 size={11} />
                          </button>
                          <button
                            onClick={() => {
                              const updated = posts.map(p => p.id === post.id ? { ...p, isBookmarkedByUser: !p.isBookmarkedByUser } : p);
                              setPosts(updated);
                              setToastMessage(post.isBookmarkedByUser ? 'Removed from bookmarks' : 'Post bookmarked!');
                              setTimeout(() => setToastMessage(''), 2500);
                            }}
                            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                              post.isBookmarkedByUser
                                ? 'bg-amber-500/10 border-amber-500/20 text-amber-500'
                                : 'border-border bg-card/25 hover:bg-card hover:text-foreground'
                            }`}
                          >
                            <Bookmark size={11} className={post.isBookmarkedByUser ? 'fill-current' : ''} />
                          </button>
                        </div>
                      </div>

                      {/* Expandable nested comments thread */}
                      {isCommentsOpen && (
                        <div className="pt-4 border-t border-border/40 space-y-4">
                          
                          {/* Write comment input bar */}
                          <CommentInputBar onSubmit={(txt) => handleAddComment(post.id, txt)} placeholder={t.commentPlaceholder} />
                          
                          {/* List of comments */}
                          {post.comments.length > 0 && (
                            <div className="space-y-3.5 pl-2 sm:pl-4 border-l border-border/60">
                              {post.comments.map(c => (
                                <div key={c.id} className="flex gap-2.5 items-start text-xs">
                                  <div className="relative w-8 h-8 rounded-full overflow-hidden border border-border shrink-0 bg-background">
                                    <Image src={c.authorAvatar} alt={c.authorName} fill className="object-cover" />
                                  </div>
                                  <div className="flex-grow bg-card/25 rounded-2xl p-3 border border-border/60 space-y-1">
                                    <div className="flex items-center justify-between gap-2 flex-wrap">
                                      <div className="flex items-center gap-1.5">
                                        <span className="font-extrabold text-foreground">{c.authorName}</span>
                                        {c.authorBadge && (
                                          <span className="px-1 py-0.5 rounded bg-emerald-600/10 text-emerald-400 text-[7px] font-black uppercase tracking-wider">
                                            {c.authorBadge}
                                          </span>
                                        )}
                                      </div>
                                      <span className="text-[8px] text-muted-foreground">{c.createdAt}</span>
                                    </div>
                                    <p className="text-muted-foreground leading-relaxed">
                                      {c.content}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                    </div>
                  );
                })
              )}
            </div>

          </div>

          {/* 3. RIGHT SIDEBAR: COMMUNITY MEMBER BOARD (3 cols) */}
          <div className="lg:col-span-3 space-y-4 hidden lg:block">
            
            {/* Online Member count statistics */}
            <div className="p-5 rounded-2xl border border-border bg-card/10 backdrop-blur-md space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-2">
                <Users size={13} className="text-[#2CFF05]" />
                <span>Forum Stats</span>
              </h3>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-2.5 rounded-xl bg-card/30 border border-border">
                  <span className="text-lg font-black text-[#2CFF05] block leading-none">
                    {Math.max(1, Math.min(memberCount, Math.floor(memberCount * 0.2) + 1))}
                  </span>
                  <span className="text-[9px] font-semibold text-muted-foreground uppercase mt-1 block">Online Now</span>
                </div>
                <div className="p-2.5 rounded-xl bg-card/30 border border-border">
                  <span className="text-lg font-black text-foreground block leading-none">{memberCount}</span>
                  <span className="text-[9px] font-semibold text-muted-foreground uppercase mt-1 block">Members</span>
                </div>
              </div>
            </div>

            {/* Top Contributors list */}
            <div className="p-5 rounded-2xl border border-border bg-card/10 backdrop-blur-md space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-2">
                <Award size={13} className="text-[#2CFF05]" />
                <span>{t.topContributors}</span>
              </h3>
              
              <div className="space-y-3">
                {dynamicContributors.length === 0 ? (
                  <p className="text-[10px] text-muted-foreground text-center py-2">
                    No active contributors yet. Start a discussion to lead the board!
                  </p>
                ) : (
                  dynamicContributors.map((member, i) => (
                    <div key={i} className="flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden border border-border bg-background">
                          <Image src={member.avatar} alt={member.name} fill className="object-cover" />
                        </div>
                        <div>
                          <span className="font-extrabold text-foreground block leading-tight">{member.name}</span>
                          <span className="text-[8.5px] text-muted-foreground block">{member.role}</span>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono font-bold text-[#2CFF05] bg-[#2CFF05]/10 px-2 py-0.5 rounded-full">
                        {member.postsCount} post{member.postsCount > 1 ? 's' : ''}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Code guidelines safety warning */}
            <div className="p-4 rounded-xl border border-zinc-700/50 bg-[#2CFF05]/5 text-[9px] text-muted-foreground leading-relaxed space-y-1 text-center">
              <span className="font-black text-amber-500 uppercase block tracking-wider mb-1">📢 Community Rules</span>
              <p>Keep conversations civil. Share high-fidelity print specifications and help fellow craftspeople elevate their printing standards.</p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

// ─── HELP BAR COMPONENT FOR ADDING COMMENTS ───
interface CommentBarProps {
  onSubmit: (text: string) => void;
  placeholder: string;
}

function CommentInputBar({ onSubmit, placeholder }: CommentBarProps) {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSubmit(text);
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder={placeholder}
        className="flex-grow bg-background border border-border rounded-xl px-3.5 py-1.5 text-xs text-foreground focus:outline-none focus:border-[#2CFF05] transition-colors font-medium"
      />
      <button
        type="submit"
        className="px-3 rounded-xl bg-card border border-border hover:border-[#2CFF05]/45 hover:bg-card/50 text-[#2CFF05] transition-all cursor-pointer flex items-center justify-center"
      >
        <Send size={12} />
      </button>
    </form>
  );
}
