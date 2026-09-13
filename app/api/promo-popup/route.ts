import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { supabase } from '@/lib/supabase';
import { DEFAULT_OFFER_POPUP, OfferPopupConfig } from '@/lib/promo-popup';

const fallbackConfigPath = path.join(process.cwd(), 'lib', 'promo-popup-config.json');

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// ── GET /api/promo-popup ──────────────────────────────────────────────────────
export async function GET() {
  try {
    // 1. Try Supabase first
    try {
      const { data, error } = await supabase
        .from('site_popups')
        .select('*')
        .eq('id', 'main_offer_popup')
        .single();

      if (!error && data) {
        const config: OfferPopupConfig = {
          id: data.id,
          is_active: data.is_active ?? true,
          campaign_name: data.campaign_name || DEFAULT_OFFER_POPUP.campaign_name,
          badge_text: data.badge_text || DEFAULT_OFFER_POPUP.badge_text,
          headline: data.headline || DEFAULT_OFFER_POPUP.headline,
          subheadline: data.subheadline || DEFAULT_OFFER_POPUP.subheadline,
          image_url: data.image_url || DEFAULT_OFFER_POPUP.image_url,
          features: Array.isArray(data.features) ? data.features : DEFAULT_OFFER_POPUP.features,
          promo_code: data.promo_code || DEFAULT_OFFER_POPUP.promo_code,
          cta_text: data.cta_text || DEFAULT_OFFER_POPUP.cta_text,
          cta_link: data.cta_link || DEFAULT_OFFER_POPUP.cta_link,
          countdown_end: data.countdown_end || '',
          show_delay_seconds: Number(data.show_delay_seconds) || DEFAULT_OFFER_POPUP.show_delay_seconds,
          show_frequency: data.show_frequency || DEFAULT_OFFER_POPUP.show_frequency,
          updated_at: data.updated_at,
        };

        return new NextResponse(JSON.stringify(config), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
            'CDN-Cache-Control': 'no-store',
          },
        });
      }
    } catch (dbErr) {
      console.warn('Supabase site_popups fetch failed, falling back to local storage:', dbErr);
    }

    // 2. Local fallback file
    if (fs.existsSync(fallbackConfigPath)) {
      try {
        const raw = fs.readFileSync(fallbackConfigPath, 'utf8');
        const parsed = JSON.parse(raw || '{}');
        return NextResponse.json({ ...DEFAULT_OFFER_POPUP, ...parsed });
      } catch {}
    }

    return NextResponse.json(DEFAULT_OFFER_POPUP);
  } catch (err: any) {
    console.error('Error in /api/promo-popup GET:', err);
    return NextResponse.json(DEFAULT_OFFER_POPUP);
  }
}

// ── POST /api/promo-popup ─────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const payload: OfferPopupConfig = {
      is_active: body.is_active !== false,
      campaign_name: body.campaign_name || DEFAULT_OFFER_POPUP.campaign_name,
      badge_text: body.badge_text || DEFAULT_OFFER_POPUP.badge_text,
      headline: body.headline || DEFAULT_OFFER_POPUP.headline,
      subheadline: body.subheadline || DEFAULT_OFFER_POPUP.subheadline,
      image_url: body.image_url || DEFAULT_OFFER_POPUP.image_url,
      features: Array.isArray(body.features) ? body.features : DEFAULT_OFFER_POPUP.features,
      promo_code: body.promo_code || '',
      cta_text: body.cta_text || DEFAULT_OFFER_POPUP.cta_text,
      cta_link: body.cta_link || DEFAULT_OFFER_POPUP.cta_link,
      countdown_end: body.countdown_end || '',
      show_delay_seconds: Number(body.show_delay_seconds) || DEFAULT_OFFER_POPUP.show_delay_seconds,
      show_frequency: body.show_frequency || DEFAULT_OFFER_POPUP.show_frequency,
      updated_at: new Date().toISOString(),
    };

    // 1. Sync to Supabase
    try {
      const { error: dbError } = await supabase.from('site_popups').upsert({
        id: 'main_offer_popup',
        ...payload,
      });
      if (dbError) {
        console.warn('Supabase site_popups upsert error:', dbError);
      }
    } catch (dbErr) {
      console.warn('Supabase site_popups update exception:', dbErr);
    }

    // 2. Sync to local fallback file
    try {
      fs.writeFileSync(fallbackConfigPath, JSON.stringify(payload, null, 2), 'utf8');
    } catch (fsErr) {
      console.warn('Failed to write promo popup fallback file:', fsErr);
    }

    return NextResponse.json({ success: true, config: payload });
  } catch (err: any) {
    console.error('Error in /api/promo-popup POST:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
