'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useLanguage } from '@/lib/context/LanguageContext';
import { supabase } from '@/lib/supabase';
import { 
  MessageSquare, 
  ThumbsUp, 
  Share2, 
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
  Pin,
  Trash2,
  Phone,
  PhoneCall,
  MessageCircle,
  Copy,
  Edit3,
  X,
  Loader2,
  Upload
} from 'lucide-react';
import Image from 'next/image';
import { uploadImageToStorage } from '@/lib/storage';

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
  authorId?: string;
  authorEmail?: string;
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

function getInitials(name: string): string {
  if (!name) return 'U';
  const clean = name.includes('@') ? name.split('@')[0] : name;
  const parts = clean.trim().split(/[\s._-]+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return clean.slice(0, 2).toUpperCase();
}

function CommunityAvatar({
  src,
  name,
  role,
  badge,
  size = 'md',
}: {
  src?: string;
  name: string;
  role?: string;
  badge?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const [imgError, setImgError] = useState(false);

  const isAdmin = 
    role === 'System Admin' || 
    badge === 'Admin' || 
    (name && (name.toLowerCase().includes('stackunleash') || name.toLowerCase().includes('bitium') || name.toLowerCase().includes('admin')));

  const isStack = name && name.toLowerCase().includes('stack');

  let resolvedSrc = src;
  if (!resolvedSrc || resolvedSrc.includes('dicebear.com')) {
    if (isAdmin) {
      resolvedSrc = isStack ? '/images/stack-unleash-logo.webp' : '/images/bitium-logo.webp';
    } else {
      resolvedSrc = '';
    }
  }

  const sizeClasses = {
    sm: 'w-8 h-8 text-[10px]',
    md: 'w-10 h-10 text-xs',
    lg: 'w-12 h-12 text-sm',
  }[size];

  const iconSizes = {
    sm: 14,
    md: 18,
    lg: 22,
  }[size];

  if (!resolvedSrc || imgError) {
    if (isAdmin) {
      return (
        <div className={`relative ${sizeClasses} rounded-full overflow-hidden border border-[#2CFF05]/50 bg-black flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(44,255,5,0.2)]`}>
          <Shield size={iconSizes} className="text-[#2CFF05]" />
        </div>
      );
    }

    const initials = getInitials(name);
    return (
      <div className={`relative ${sizeClasses} rounded-full flex items-center justify-center font-black select-none bg-gradient-to-br from-emerald-950 via-zinc-900 to-black text-[#2CFF05] border border-[#2CFF05]/30 shrink-0 shadow-inner`}>
        {initials}
      </div>
    );
  }

  return (
    <div className={`relative ${sizeClasses} rounded-full overflow-hidden border border-border/80 bg-zinc-900 shrink-0`}>
      <Image
        src={resolvedSrc}
        alt={name}
        fill
        unoptimized
        onError={() => setImgError(true)}
        className="object-cover"
      />
    </div>
  );
}

const CATEGORY_TAGS = [
  { id: 'all', label: 'All Discussions', labelSi: 'සියලුම සාකච්ඡා' },
  { id: 'general', label: 'General', labelSi: 'පොදු අදහස්' },
  { id: 'dtf', label: 'DTF Printing', labelSi: 'DTF මුද්‍රණය' },
  { id: 'screen', label: 'Screen Printing', labelSi: 'ස්ක්‍රීන් මුද්‍රණය' },
  { id: 'stencil', label: 'Stencils & Stamps', labelSi: 'ස්ටෙන්සිල් සහ මුද්‍රා' },
  { id: 'showcase', label: 'Project Showcase', labelSi: 'නිර්මාණ ප්‍රදර්ශනය' },
];

const COMMUNITY_CONTACTS = [
  {
    name: 'Indrajith',
    role: 'CEO',
    roleSi: 'ප්‍රධාන විධායක නිලධාරී (CEO)',
    phone: '0715520897',
    cleanPhone: '94715520897',
    badge: 'CEO',
    badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-[#2CFF05] border-emerald-500/30',
  },
  {
    name: 'Dilrukshi',
    role: 'Customer Inquiries & Complaints',
    roleSi: 'පාරිභෝගික විමසීම් සහ පැමිණිලි',
    phone: '0768370920',
    cleanPhone: '94768370920',
    badge: 'Inquiries',
    badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30',
  },
  {
    name: 'Prasadari',
    role: 'Screen Printing & Artwork',
    roleSi: 'ස්ක්‍රීන් මුද්‍රණය සහ කලා නිර්මාණ',
    phone: '0716352558',
    cleanPhone: '94716352558',
    badge: 'Screen Print',
    badgeColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30',
  },
  {
    name: 'Nadeeka',
    role: 'Stencils & Hand Painting',
    roleSi: 'ස්ටෙන්සිල් සහ අත් පින්තාරු',
    phone: '0772212369',
    cleanPhone: '94772212369',
    badge: 'Stencils',
    badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
  },
  {
    name: 'Dinithi',
    role: 'Cap Batik & Other',
    roleSi: 'කැප් බැටික් සහ වෙනත්',
    phone: '0779731097',
    cleanPhone: '94779731097',
    badge: 'Batik & Other',
    badgeColor: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30',
  },
  {
    name: 'Heshani',
    role: 'DTF & Artwork',
    roleSi: 'DTF මුද්‍රණය සහ කලා නිර්මාණ',
    phone: '0753026247',
    cleanPhone: '94753026247',
    badge: 'DTF & Art',
    badgeColor: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30',
  },
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
    selectImage: 'රූපයක් එක් කරන්න (Upload)',
    chooseImage: 'Device එකෙන් රූපයක් තෝරන්න',
    orPasteUrl: 'හෝ Image URL එකක් භාවිතා කරන්න',
    imageOptional: 'රූපය / ඡායාරූපය (විකල්ප)',
    uploadingImage: 'රූපය Upload වෙමින් පවතී...',
    changeImage: 'වෙනස් කරන්න',
    removeImage: 'ඉවත් කරන්න',
    edit: 'සංස්කරණය',
    editPost: 'සටහන සංස්කරණය කරන්න',
    editPostSub: 'ඔබගේ ප්‍රජා සටහනේ විස්තර යාවත්කාලීන කරන්න',
    saveChanges: 'වෙනස්කම් සුරකින්න',
    saving: 'සුරකිමින්...',
    cancel: 'අවලංගු කරන්න',
    postUpdatedSuccess: 'සටහන සාර්ථකව යාවත්කාලීන කරන ලදී!',
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
    selectImage: 'Upload Local Image',
    chooseImage: 'Choose image from device',
    orPasteUrl: 'Or enter image URL',
    imageOptional: 'Attachment Image (Optional)',
    uploadingImage: 'Uploading image...',
    changeImage: 'Change',
    removeImage: 'Remove',
    edit: 'Edit',
    editPost: 'Edit Discussion Post',
    editPostSub: 'Update details for your community topic',
    saveChanges: 'Save Changes',
    saving: 'Saving...',
    cancel: 'Cancel',
    postUpdatedSuccess: 'Post updated successfully!',
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
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [newImagePreview, setNewImagePreview] = useState<string | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');

  // Edit post modal states
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editCategory, setEditCategory] = useState('general');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

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

  const canEditPost = (post: Post) => {
    // 1. Staff admin from localStorage (Indrajith Admin or active staff)
    if (typeof window !== 'undefined') {
      const activeStaffId = localStorage.getItem('bitium_admin_active_staff_id_v1');
      if (activeStaffId) return true;
    }

    // 2. Supabase Admin check (Admin role or CEO Indrajith)
    if (profile?.role === 'admin' || user?.email === 'indrajith@bitiumtechnology.com') {
      return true;
    }

    // 3. Post Author checks
    if (post.authorId && user?.id && post.authorId === user.id) return true;
    if (post.authorEmail && user?.email && post.authorEmail.toLowerCase() === user.email.toLowerCase()) return true;
    if (profile?.email && post.authorName && profile.email.toLowerCase() === post.authorName.toLowerCase()) return true;
    if (profile?.full_name && post.authorName && profile.full_name.trim().toLowerCase() === post.authorName.trim().toLowerCase()) return true;
    if (user?.email && post.authorName && user.email.toLowerCase() === post.authorName.toLowerCase()) return true;

    // 4. Check if post was created in current browser session (for guests/unauthenticated authors)
    if (typeof window !== 'undefined') {
      try {
        const myPosts: string[] = JSON.parse(localStorage.getItem('bitium_my_community_post_ids') || '[]');
        if (myPosts.includes(post.id)) return true;
      } catch {}
    }

    return false;
  };

  const openEditModal = (post: Post) => {
    setEditingPost(post);
    setEditTitle(post.title);
    setEditContent(post.content);
    setEditCategory(post.category || 'general');
    setEditImageUrl(post.imageUrl || '');
    setEditImageFile(null);
    setEditImagePreview(null);
  };

  const handleSaveEditPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost || !editTitle.trim() || !editContent.trim()) return;

    setIsSavingEdit(true);
    let finalImageUrl = editImageUrl.trim();

    try {
      if (editImageFile) {
        finalImageUrl = await uploadImageToStorage(editImageFile, 'community');
      }
    } catch (uploadErr: any) {
      console.error('Image upload failed during edit:', uploadErr);
      setToastMessage(uploadErr.message || 'Image upload failed.');
      setIsSavingEdit(false);
      return;
    }

    const updatedPostId = editingPost.id;
    const updatedTitle = editTitle.trim();
    const updatedContent = editContent.trim();
    const updatedCategory = editCategory;
    const updatedImageUrl = finalImageUrl ? finalImageUrl : undefined;

    // Optimistic UI update
    setPosts(prev => prev.map(p => p.id === updatedPostId ? {
      ...p,
      title: updatedTitle,
      content: updatedContent,
      category: updatedCategory,
      imageUrl: updatedImageUrl,
    } : p));

    try {
      const res = await fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'edit_post',
          postId: updatedPostId,
          title: updatedTitle,
          content: updatedContent,
          category: updatedCategory,
          imageUrl: updatedImageUrl,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to update post');
      }

      fetchCommunityPosts();
      setToastMessage(t.postUpdatedSuccess);
      setTimeout(() => setToastMessage(''), 2500);
      setEditingPost(null);
      setEditImageFile(null);
      setEditImagePreview(null);
    } catch (err) {
      console.error('Error saving edited post:', err);
      setToastMessage('Failed to update post');
      setTimeout(() => setToastMessage(''), 2500);
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    setIsPosting(true);
    setUploadStatus('');

    let finalImageUrl = newImageUrl.trim();

    try {
      if (newImageFile) {
        setUploadStatus(t.uploadingImage);
        finalImageUrl = await uploadImageToStorage(newImageFile, 'community');
      }
    } catch (uploadErr: any) {
      console.error('Image upload failed:', uploadErr);
      setToastMessage(uploadErr.message || 'Image upload failed.');
      setIsPosting(false);
      setUploadStatus('');
      return;
    }

    let authorName = 'Anonymous Printer';
    let authorAvatar = '';
    let authorRole = 'Member';
    let authorBadge = 'Guest';

    if (profile) {
      authorName = profile.full_name || profile.email;
      authorRole = profile.role === 'admin' ? 'System Admin' : 'Registered Printer';
      authorBadge = profile.role === 'admin' ? 'Admin' : 'Verified';
      if (profile.role === 'admin' || profile.email?.toLowerCase().includes('admin') || profile.email?.toLowerCase().includes('stack')) {
        authorAvatar = profile.avatar_url || (profile.email?.toLowerCase().includes('stack') ? '/images/stack-unleash-logo.webp' : '/images/bitium-logo.webp');
      } else {
        authorAvatar = profile.avatar_url || '';
      }
    } else if (guestName.trim()) {
      authorName = guestName.trim();
      authorRole = 'Community guest';
      authorBadge = 'Guest';
      authorAvatar = '';
    }

    const newPost: Post = {
      id: `post-${Date.now()}`,
      authorId: user?.id,
      authorEmail: user?.email || profile?.email,
      authorName,
      authorAvatar,
      authorRole,
      authorBadge,
      title: newTitle.trim(),
      content: newContent.trim(),
      imageUrl: finalImageUrl ? finalImageUrl : undefined,
      category: newPostCategory,
      likes: 0,
      comments: [],
      createdAt: 'Just now'
    };

    setPosts(prev => [newPost, ...prev]);

    // Store created post ID locally for post creator permissions
    if (typeof window !== 'undefined') {
      try {
        const myPosts: string[] = JSON.parse(localStorage.getItem('bitium_my_community_post_ids') || '[]');
        if (!myPosts.includes(newPost.id)) {
          myPosts.push(newPost.id);
          localStorage.setItem('bitium_my_community_post_ids', JSON.stringify(myPosts));
        }
      } catch {}
    }

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
    setNewImageFile(null);
    setNewImagePreview(null);
    setIsPosting(false);
    setUploadStatus('');
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
    let commenterAvatar = '';
    let commenterBadge = 'Contributor';

    if (profile) {
      commenterName = profile.full_name || profile.email;
      commenterBadge = profile.role === 'admin' ? 'Admin' : 'Verified';
      if (profile.role === 'admin' || profile.email?.toLowerCase().includes('admin') || profile.email?.toLowerCase().includes('stack')) {
        commenterAvatar = profile.avatar_url || (profile.email?.toLowerCase().includes('stack') ? '/images/stack-unleash-logo.webp' : '/images/bitium-logo.webp');
      } else {
        commenterAvatar = profile.avatar_url || '';
      }
    } else if (guestName.trim()) {
      commenterName = guestName.trim();
      commenterBadge = 'Guest';
      commenterAvatar = '';
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

  const handleDeleteComment = async (commentId: string, postId: string) => {
    // Optimistic UI update - filter out the deleted comment locally
    setPosts(prev => prev.map(p => p.id === postId ? {
      ...p,
      comments: p.comments.filter(c => c.id !== commentId)
    } : p));
    
    try {
      await fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_comment', commentId }),
      });
      fetchCommunityPosts();
      setToastMessage('Comment deleted successfully!');
      setTimeout(() => setToastMessage(''), 2500);
    } catch (err) {
      console.error('Error deleting comment:', err);
    }
  };

  const handleDeletePost = async (postId: string) => {
    const targetPost = posts.find(p => p.id === postId);
    if (!targetPost) return;

    if (!canEditPost(targetPost)) {
      if (!user && !profile) {
        setToastMessage('Please login or switch to admin to delete this post.');
      } else {
        setToastMessage('You can only delete your own posts (or Admin required).');
      }
      setTimeout(() => setToastMessage(''), 2500);
      return;
    }

    if (!confirm('Are you sure you want to delete this post?')) return;

    // 1. Optimistic UI update
    setPosts(prev => prev.filter(p => p.id !== postId));

    // Remove from local creator list
    if (typeof window !== 'undefined') {
      try {
        const myPosts: string[] = JSON.parse(localStorage.getItem('bitium_my_community_post_ids') || '[]');
        const updated = myPosts.filter(id => id !== postId);
        localStorage.setItem('bitium_my_community_post_ids', JSON.stringify(updated));
      } catch {}
    }

    // 2. Call backend deletion
    try {
      const res = await fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_post', postId }),
      });

      if (!res.ok) {
        // Fallback to direct DELETE method
        await fetch(`/api/community?postId=${postId}`, {
          method: 'DELETE',
        });
      }

      fetchCommunityPosts();
      setToastMessage('Post deleted successfully!');
      setTimeout(() => setToastMessage(''), 2500);
    } catch (err) {
      console.error('Error deleting post:', err);
      try {
        await fetch(`/api/community?postId=${postId}`, {
          method: 'DELETE',
        });
        fetchCommunityPosts();
        setToastMessage('Post deleted successfully!');
      } catch (e2) {
        fetchCommunityPosts();
        setToastMessage('Failed to delete post. Please try again.');
      }
      setTimeout(() => setToastMessage(''), 2500);
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

  // Dynamically compute Hot Topics from real community discussions based on engagement (comments and likes)
  const hotTopics = React.useMemo(() => {
    if (!posts || posts.length === 0) return [];
    return [...posts]
      .sort((a, b) => {
        const scoreA = (a.comments?.length || 0) * 3 + (a.likes || 0);
        const scoreB = (b.comments?.length || 0) * 3 + (b.likes || 0);
        return scoreB - scoreA;
      })
      .slice(0, 4);
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

            {/* Real Trending / Hot Topics from Community */}
            <div className="p-5 rounded-2xl border border-border bg-card/10 backdrop-blur-md space-y-3.5 hidden lg:block">
              <div className="flex items-center justify-between border-b border-border/50 pb-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-2">
                  <Flame size={14} className="text-amber-500" />
                  <span>{language === 'si' ? 'උණුසුම් මාතෘකා' : 'Hot Topics'}</span>
                </h3>
                <span className="text-[9px] font-black text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 uppercase tracking-wider">
                  Active
                </span>
              </div>
              <div className="space-y-2 text-[11px] leading-relaxed">
                {hotTopics.length === 0 ? (
                  <p className="text-[10px] text-muted-foreground py-2 text-center">
                    {language === 'si' 
                      ? 'තවම සක්‍රීය සාකච්ඡා නොමැත. පළමු සාකච්ඡාව ඔබ ආරම්භ කරන්න!' 
                      : 'No active discussions yet. Be the first to start a hot topic!'}
                  </p>
                ) : (
                  hotTopics.map((topic, idx) => {
                    const replyCount = topic.comments?.length || 0;
                    const likeCount = topic.likes || 0;
                    return (
                      <button
                        key={topic.id}
                        onClick={() => {
                          const el = document.getElementById(topic.id);
                          if (el) {
                            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            setActiveCommentsPostId(topic.id);
                          } else {
                            setForumSearch(topic.title);
                          }
                        }}
                        className="w-full text-left p-2.5 rounded-xl border border-transparent hover:border-border/70 hover:bg-card/40 transition-all group cursor-pointer block space-y-1"
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-amber-500 font-bold block truncate text-xs group-hover:text-amber-400 transition-colors">
                            #{idx + 1} {topic.title}
                          </span>
                        </div>
                        <p className="text-muted-foreground text-[10.5px] line-clamp-2 leading-relaxed">
                          {topic.content}
                        </p>
                        <div className="flex items-center gap-2.5 text-[9px] text-muted-foreground pt-0.5 font-semibold">
                          <span className="flex items-center gap-1">
                            <MessageSquare size={10} className="text-emerald-500" />
                            <span>{replyCount} {replyCount === 1 ? 'reply' : 'replies'}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <ThumbsUp size={10} className="text-amber-500" />
                            <span>{likeCount} {likeCount === 1 ? 'like' : 'likes'}</span>
                          </span>
                        </div>
                      </button>
                    );
                  })
                )}
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

                {/* Local Image Uploader & Preview */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[9px] font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                      <ImageIcon size={12} className="text-emerald-600 dark:text-[#2CFF05]" />
                      <span>{t.imageOptional}</span>
                    </label>
                    {newImageFile && (
                      <span className="text-[10px] text-emerald-600 dark:text-[#2CFF05] font-bold">
                        {(newImageFile.size / (1024 * 1024)).toFixed(2)} MB
                      </span>
                    )}
                  </div>

                  <div className="p-3 rounded-2xl border border-dashed border-border hover:border-emerald-500/40 dark:hover:border-[#2CFF05]/40 bg-background/50 transition-all space-y-2.5">
                    {newImagePreview || newImageUrl ? (
                      <div className="flex items-center gap-3">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-border bg-black/40 shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={newImagePreview || newImageUrl}
                            alt="Selected attachment"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-foreground truncate">
                            {newImageFile ? newImageFile.name : (newImageUrl ? 'Image URL Provided' : 'Attached image')}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {newImageFile ? 'Local image will be uploaded with post' : 'External image URL'}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <label className="p-2 rounded-xl bg-card border border-border hover:border-emerald-500/50 hover:bg-card/80 text-foreground text-xs font-semibold cursor-pointer transition-colors shadow-xs" title={t.changeImage}>
                            <Upload size={13} className="text-emerald-600 dark:text-[#2CFF05]" />
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  setNewImageFile(file);
                                  setNewImagePreview(URL.createObjectURL(file));
                                  setNewImageUrl('');
                                }
                              }}
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              setNewImageFile(null);
                              setNewImagePreview(null);
                              setNewImageUrl('');
                            }}
                            className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500/20 text-xs font-semibold cursor-pointer transition-colors"
                            title={t.removeImage}
                          >
                            <X size={13} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <label className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-border hover:border-emerald-500/50 dark:hover:border-[#2CFF05]/50 hover:bg-card/80 text-foreground cursor-pointer transition-all text-xs font-bold shadow-xs">
                          <Upload size={14} className="text-emerald-600 dark:text-[#2CFF05]" />
                          <span>{t.chooseImage}</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setNewImageFile(file);
                                setNewImagePreview(URL.createObjectURL(file));
                                setNewImageUrl('');
                              }
                            }}
                          />
                        </label>
                        <div className="text-[10px] sm:text-[11px] text-muted-foreground font-medium text-center sm:text-left flex-1">
                          Select JPG, PNG, WEBP from your computer or phone
                        </div>
                      </div>
                    )}

                    {/* Fallback URL input */}
                    <input 
                      type="text"
                      value={newImageUrl}
                      onChange={e => {
                        setNewImageUrl(e.target.value);
                        if (e.target.value) {
                          setNewImageFile(null);
                          setNewImagePreview(null);
                        }
                      }}
                      placeholder={t.orPasteUrl}
                      className="w-full bg-background border border-border rounded-xl px-3.5 py-1.5 text-[11px] focus:outline-none focus:border-emerald-500 dark:focus:border-[#2CFF05] transition-colors text-muted-foreground"
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
                    className="px-6 py-2.5 rounded-xl bg-[#2CFF05] hover:bg-[#7acc00] disabled:bg-zinc-700 disabled:opacity-40 text-black font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-[#2CFF05]/20"
                  >
                    {isPosting ? (
                      <>
                        <Loader2 size={13} className="animate-spin" />
                        <span>{uploadStatus || 'Publishing...'}</span>
                      </>
                    ) : (
                      <>
                        <Send size={12} />
                        <span>{t.publish}</span>
                      </>
                    )}
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
                          <CommunityAvatar 
                            src={post.authorAvatar} 
                            name={post.authorName} 
                            role={post.authorRole} 
                            badge={post.authorBadge} 
                            size="md" 
                          />
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
                          {canEditPost(post) && (
                            <button
                              onClick={() => openEditModal(post)}
                              className="px-2 py-1.5 rounded-lg border border-border bg-card/25 hover:bg-card hover:border-[#2CFF05]/50 hover:text-[#2CFF05] transition-all cursor-pointer text-muted-foreground flex items-center gap-1.5 text-[10px] font-bold"
                              title={t.editPost}
                            >
                              <Edit3 size={11} className="text-[#2CFF05]" />
                              <span>{t.edit}</span>
                            </button>
                          )}
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
                            onClick={() => handleDeletePost(post.id)}
                            className="p-1.5 rounded-lg border border-border bg-card/25 hover:bg-red-500/10 hover:border-red-500/30 text-muted-foreground hover:text-red-500 transition-all cursor-pointer"
                            title="Delete Post"
                          >
                            <Trash2 size={11} />
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
                                  <CommunityAvatar 
                                    src={c.authorAvatar} 
                                    name={c.authorName} 
                                    badge={c.authorBadge} 
                                    size="sm" 
                                  />
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
                                      <div className="flex items-center gap-2">
                                        <span className="text-[8px] text-muted-foreground">{c.createdAt}</span>
                                        {(profile?.role === 'admin' || (profile && (profile.full_name === c.authorName || profile.email === c.authorName))) && (
                                          <button
                                            onClick={() => handleDeleteComment(c.id, post.id)}
                                            className="text-muted-foreground hover:text-red-500 transition-colors p-0.5"
                                            title="Delete Comment"
                                          >
                                            <Trash2 size={10} />
                                          </button>
                                        )}
                                      </div>
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
            
            {/* Direct Contacts & Specialized Support Team */}
            <div className="p-5 rounded-2xl border border-border bg-card/10 backdrop-blur-md space-y-3.5">
              <div className="flex items-center justify-between border-b border-border/50 pb-2.5">
                <h3 className="text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-2">
                  <PhoneCall size={14} className="text-[#2CFF05]" />
                  <span>{language === 'si' ? 'ක්ෂණික ඇමතුම් & සහාය' : 'Direct Support Contacts'}</span>
                </h3>
                <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-[#2CFF05]/15 text-emerald-700 dark:text-[#2CFF05] border border-emerald-500/30 uppercase tracking-widest">
                  Team
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground leading-tight">
                {language === 'si'
                  ? 'අපගේ විශේෂඥ කාර්ය මණ්ඩලය සෘජුවම සම්බන්ධ කරගන්න:'
                  : 'Directly reach out to our department leads for instant help:'}
              </p>

              <div className="space-y-2">
                {COMMUNITY_CONTACTS.map((contact, idx) => (
                  <div 
                    key={idx} 
                    className="p-2.5 rounded-xl border border-border/70 bg-card/25 hover:bg-card/45 hover:border-[#2CFF05]/40 transition-all space-y-1.5 group"
                  >
                    <div className="flex items-start justify-between gap-1.5">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-black text-xs text-foreground">{contact.name}</span>
                          <span className={`text-[8px] font-black px-1.5 py-0.2 rounded border ${contact.badgeColor}`}>
                            {contact.badge}
                          </span>
                        </div>
                        <span className="text-[9.5px] font-medium text-muted-foreground block leading-tight mt-0.5 truncate">
                          {language === 'si' ? contact.roleSi : contact.role}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-border/40 text-xs">
                      <a 
                        href={`tel:${contact.phone}`}
                        className="font-mono font-bold text-emerald-700 dark:text-[#2CFF05] text-[11px] hover:underline flex items-center gap-1.5"
                        title={`Call ${contact.name}`}
                      >
                        <Phone size={11} className="shrink-0" />
                        <span>{contact.phone}</span>
                      </a>
                      <div className="flex items-center gap-1">
                        <a 
                          href={`https://wa.me/${contact.cleanPhone}?text=${encodeURIComponent(`Hello ${contact.name}, I am contacting you regarding Bitium Technology inquiries.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 transition-colors"
                          title="Chat on WhatsApp"
                        >
                          <MessageCircle size={11} />
                        </a>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(contact.phone);
                            setToastMessage(`Copied ${contact.name}'s phone (${contact.phone})`);
                            setTimeout(() => setToastMessage(''), 2500);
                          }}
                          className="p-1 rounded-lg bg-card/40 hover:bg-card text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                          title="Copy phone number"
                        >
                          <Copy size={11} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
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
                        <CommunityAvatar 
                          src={member.avatar} 
                          name={member.name} 
                          role={member.role} 
                          badge={member.badge} 
                          size="sm" 
                        />
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

      {/* ─── EDIT POST MODAL ─── */}
      {editingPost && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-xl bg-card border border-[#2CFF05]/30 rounded-3xl p-6 sm:p-7 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative space-y-5">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border/60 pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#2CFF05]/10 text-[#2CFF05] border border-[#2CFF05]/20">
                  <Edit3 size={18} />
                </div>
                <div>
                  <h3 className="text-base font-black text-foreground uppercase tracking-tight">
                    {t.editPost}
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    {t.editPostSub}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingPost(null)}
                className="p-1.5 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Edit Form */}
            <form onSubmit={handleSaveEditPost} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Title / Query *
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  placeholder={t.placeholderTitle}
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#2CFF05] transition-colors text-foreground font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  {t.selectCategory}
                </label>
                <select
                  value={editCategory}
                  onChange={e => setEditCategory(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#2CFF05] transition-colors text-foreground font-semibold"
                >
                  <option value="general">General</option>
                  <option value="dtf">DTF Printing</option>
                  <option value="screen">Screen Printing</option>
                  <option value="stencil">Stencils & Stamps</option>
                  <option value="showcase">Project Showcase</option>
                </select>
              </div>

              {/* Edit Modal Local Image Uploader & Preview */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <ImageIcon size={12} className="text-emerald-600 dark:text-[#2CFF05]" />
                    <span>{t.imageOptional}</span>
                  </label>
                  {editImageFile && (
                    <span className="text-[10px] text-emerald-600 dark:text-[#2CFF05] font-bold">
                      {(editImageFile.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                  )}
                </div>

                <div className="p-3 rounded-2xl border border-dashed border-border hover:border-emerald-500/40 dark:hover:border-[#2CFF05]/40 bg-background/50 transition-all space-y-2.5">
                  {editImagePreview || editImageUrl ? (
                    <div className="flex items-center gap-3">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-border bg-black/40 shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={editImagePreview || editImageUrl}
                          alt="Edit attachment"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-foreground truncate">
                          {editImageFile ? editImageFile.name : (editImageUrl ? 'Image Attached' : 'Attached image')}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {editImageFile ? 'New local image selected' : 'Current image'}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <label className="p-2 rounded-xl bg-card border border-border hover:border-emerald-500/50 hover:bg-card/80 text-foreground text-xs font-semibold cursor-pointer transition-colors shadow-xs" title={t.changeImage}>
                          <Upload size={13} className="text-emerald-600 dark:text-[#2CFF05]" />
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setEditImageFile(file);
                                setEditImagePreview(URL.createObjectURL(file));
                                setEditImageUrl('');
                              }
                            }}
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setEditImageFile(null);
                            setEditImagePreview(null);
                            setEditImageUrl('');
                          }}
                          className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500/20 text-xs font-semibold cursor-pointer transition-colors"
                          title={t.removeImage}
                        >
                          <X size={13} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <label className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-border hover:border-emerald-500/50 dark:hover:border-[#2CFF05]/50 hover:bg-card/80 text-foreground cursor-pointer transition-all text-xs font-bold shadow-xs">
                        <Upload size={14} className="text-emerald-600 dark:text-[#2CFF05]" />
                        <span>{t.chooseImage}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setEditImageFile(file);
                              setEditImagePreview(URL.createObjectURL(file));
                              setEditImageUrl('');
                            }
                          }}
                        />
                      </label>
                      <div className="text-[10px] sm:text-[11px] text-muted-foreground font-medium text-center sm:text-left flex-1">
                        Select JPG, PNG, WEBP from your computer or phone
                      </div>
                    </div>
                  )}

                  {/* Fallback URL input */}
                  <input
                    type="text"
                    value={editImageUrl}
                    onChange={e => {
                      setEditImageUrl(e.target.value);
                      if (e.target.value) {
                        setEditImageFile(null);
                        setEditImagePreview(null);
                      }
                    }}
                    placeholder={t.orPasteUrl}
                    className="w-full bg-background border border-border rounded-xl px-3.5 py-1.5 text-[11px] focus:outline-none focus:border-emerald-500 dark:focus:border-[#2CFF05] transition-colors text-muted-foreground"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Discussion Body *
                </label>
                <textarea
                  required
                  value={editContent}
                  onChange={e => setEditContent(e.target.value)}
                  placeholder={t.placeholderContent}
                  rows={5}
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#2CFF05] transition-colors resize-none text-foreground leading-relaxed"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => setEditingPost(null)}
                  className="px-4 py-2 rounded-xl border border-border bg-card/40 hover:bg-card text-muted-foreground hover:text-foreground text-xs font-bold transition-all cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  disabled={isSavingEdit}
                  className="px-6 py-2 rounded-xl bg-[#2CFF05] hover:bg-[#7acc00] disabled:bg-zinc-700 disabled:opacity-40 text-black font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-[#2CFF05]/20"
                >
                  {isSavingEdit ? (
                    <>
                      <Loader2 size={13} className="animate-spin" />
                      <span>{t.saving}</span>
                    </>
                  ) : (
                    <>
                      <Send size={13} />
                      <span>{t.saveChanges}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
