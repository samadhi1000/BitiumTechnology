import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { supabase } from '@/lib/supabase';
import { defaultCustomerFeedbacks, CustomerFeedbackItem } from '@/lib/data/customerFeedbacks';

const fallbackConfigPath = path.join(process.cwd(), 'lib', 'customer-reviews-config.json');

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// ── GET /api/customer-reviews ──────────────────────────────────────────────────
export async function GET() {
  try {
    // 1. Try Supabase first
    try {
      const { data, error } = await supabase
        .from('customer_reviews')
        .select('*')
        .order('created_at', { ascending: true });

      if (!error && Array.isArray(data) && data.length > 0) {
        const formatted: CustomerFeedbackItem[] = data.map((item) => ({
          id: String(item.id || item.review_id || ''),
          name: item.name || '',
          nameSi: item.name_si || item.nameSi || '',
          role: item.role || '',
          roleSi: item.role_si || item.roleSi || '',
          rating: Number(item.rating) || 5,
          text: item.text || '',
          textSi: item.text_si || item.textSi || '',
          avatar: item.avatar || (item.name ? item.name.slice(0, 2).toUpperCase() : 'CU'),
          avatarBg: item.avatar_bg || item.avatarBg || '#22c55e',
          image: item.image || item.image_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1000&q=80',
          categoryTag: item.category_tag || item.categoryTag || '',
        }));

        return new NextResponse(JSON.stringify(formatted), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
          },
        });
      }
    } catch (dbErr) {
      console.warn('Supabase customer_reviews fetch failed, checking local file fallback:', dbErr);
    }

    // 2. Local JSON fallback file
    if (fs.existsSync(fallbackConfigPath)) {
      try {
        const raw = fs.readFileSync(fallbackConfigPath, 'utf8');
        const parsed = JSON.parse(raw || '[]');
        if (Array.isArray(parsed) && parsed.length > 0) {
          return NextResponse.json(parsed);
        }
      } catch (fileErr) {
        console.warn('Error reading fallback reviews file:', fileErr);
      }
    }

    // 3. Default preset reviews
    return NextResponse.json(defaultCustomerFeedbacks);
  } catch (err: any) {
    console.error('Error in /api/customer-reviews GET:', err);
    return NextResponse.json(defaultCustomerFeedbacks);
  }
}

// ── POST /api/customer-reviews ─────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || !Array.isArray(body)) {
      return NextResponse.json({ error: 'Expected array of customer feedback items' }, { status: 400 });
    }

    const feedbacks: CustomerFeedbackItem[] = body.map((item, index) => ({
      id: item.id || `review-${Date.now()}-${index}`,
      name: item.name || 'Anonymous Client',
      nameSi: item.nameSi || item.name || '',
      role: item.role || 'Verified Customer',
      roleSi: item.roleSi || item.role || '',
      rating: Number(item.rating) || 5,
      text: item.text || '',
      textSi: item.textSi || item.text || '',
      avatar: item.avatar || (item.name ? item.name.slice(0, 2).toUpperCase() : 'BT'),
      avatarBg: item.avatarBg || '#22c55e',
      image: item.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1000&q=80',
      categoryTag: item.categoryTag || '',
    }));

    // 1. Sync to Supabase (if table exists)
    try {
      const dbPayload = feedbacks.map((f, i) => ({
        id: f.id,
        name: f.name,
        name_si: f.nameSi,
        role: f.role,
        role_si: f.roleSi,
        rating: f.rating,
        text: f.text,
        text_si: f.textSi,
        avatar: f.avatar,
        avatar_bg: f.avatarBg,
        image: f.image,
        category_tag: f.categoryTag,
        order_index: i,
        updated_at: new Date().toISOString(),
      }));

      const { error: dbError } = await supabase
        .from('customer_reviews')
        .upsert(dbPayload, { onConflict: 'id' });

      if (dbError) {
        console.warn('Supabase customer_reviews upsert warning (fallback file will be used):', dbError.message);
      }
    } catch (dbErr) {
      console.warn('Supabase exception on customer_reviews save:', dbErr);
    }

    // 2. Sync to local JSON fallback file (works immediately in all environments)
    try {
      fs.writeFileSync(fallbackConfigPath, JSON.stringify(feedbacks, null, 2), 'utf8');
    } catch (fsErr) {
      console.warn('Failed to write customer reviews fallback file:', fsErr);
    }

    return NextResponse.json({ success: true, count: feedbacks.length, data: feedbacks });
  } catch (err: any) {
    console.error('Error in /api/customer-reviews POST:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
