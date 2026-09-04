import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { supabase } from '@/lib/supabase';
import catalogData from '@/lib/products-catalog.json';

const catalogPath = path.join(process.cwd(), 'lib', 'products-catalog.json');

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Format Supabase product records into application Product structure
function formatSupabaseProduct(row: any): any {
  return {
    id: row.id,
    name: row.name,
    description: row.description || '',
    price: Number(row.price) || 0,
    original_price: row.original_price ? Number(row.original_price) : undefined,
    image_url: row.image_url || '',
    category: row.category,
    sub_category: row.sub_category || undefined,
    is_active: row.is_active !== false,
    variants: (row.variants || []).map((v: any) => ({
      id: v.id,
      product_id: v.product_id,
      name: v.name,
      sku: v.sku,
      price_override: v.price_override != null ? Number(v.price_override) : null,
      stock_quantity: Number(v.stock_quantity) || 0,
      attributes: v.attributes || { size: v.name },
    })),
  };
}

// ── GET /api/products ──────────────────────────────────────────────────────────
export async function GET() {
  try {
    let dbProducts: any[] = [];
    
    // 1. Fetch live products from Supabase
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          variants:product_variants(*)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        dbProducts = data.map(formatSupabaseProduct);
      }
    } catch (dbErr) {
      console.error('Supabase products fetch failed:', dbErr);
    }

    // 2. Read local fallback catalog file
    let fileProducts: any[] = [];
    try {
      if (fs.existsSync(catalogPath)) {
        const raw = fs.readFileSync(catalogPath, 'utf8');
        fileProducts = JSON.parse(raw || '[]');
      } else {
        fileProducts = catalogData || [];
      }
    } catch {
      fileProducts = catalogData || [];
    }

    // 3. Merge: DB products take priority, fallback file products fill in any missing items
    const mergedMap = new Map<string, any>();
    
    // Put file products first
    fileProducts.forEach((p: any) => {
      if (p.id) mergedMap.set(p.id, p);
    });

    // Override / prepend with live Supabase products
    dbProducts.forEach((p: any) => {
      if (p.id) mergedMap.set(p.id, p);
    });

    const result = Array.from(mergedMap.values()).filter((p: any) => p.is_active !== false);

    return new NextResponse(JSON.stringify(result), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        'CDN-Cache-Control': 'no-store',
      },
    });
  } catch (err: any) {
    console.error('Error in /api/products GET:', err);
    return NextResponse.json(catalogData || [], { status: 200 });
  }
}

// ── POST /api/products ─────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }

    const { action, product, variants, id, productData, products } = body;

    // A) CREATE SINGLE PRODUCT
    if (action === 'create' && product) {
      const p = product;
      const vars = variants || p.variants || [];

      // Insert product to Supabase
      const { error: prodError } = await supabase.from('products').upsert([{
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price,
        original_price: p.original_price || null,
        image_url: p.image_url,
        category: p.category,
        sub_category: p.sub_category || null,
        is_active: p.is_active !== false,
      }]);

      if (prodError) {
        console.error('Supabase product insert error in API:', prodError);
      }

      // Insert variants to Supabase
      if (vars.length > 0) {
        const varRows = vars.map((v: any) => ({
          id: v.id,
          product_id: p.id,
          name: v.name,
          sku: v.sku,
          price_override: v.price_override != null ? v.price_override : null,
          stock_quantity: v.stock_quantity || 0,
          attributes: v.attributes || { size: v.name },
        }));
        const { error: varError } = await supabase.from('product_variants').upsert(varRows);
        if (varError) {
          console.error('Supabase variants insert error in API:', varError);
        }
      }

      // Local fallback write
      if (process.env.NODE_ENV !== 'production' && fs.existsSync(catalogPath)) {
        try {
          const raw = fs.readFileSync(catalogPath, 'utf8');
          const current = JSON.parse(raw || '[]');
          current.unshift(p);
          fs.writeFileSync(catalogPath, JSON.stringify(current, null, 2), 'utf8');
        } catch {}
      }

      return NextResponse.json({ success: true, product: p });
    }

    // B) UPDATE SINGLE PRODUCT
    if (action === 'update' && id) {
      const p = productData || {};
      const vars = variants;

      const updatePayload: any = {};
      if (p.name !== undefined) updatePayload.name = p.name;
      if (p.description !== undefined) updatePayload.description = p.description;
      if (p.price !== undefined) updatePayload.price = p.price;
      if (p.original_price !== undefined) updatePayload.original_price = p.original_price;
      if (p.image_url !== undefined) updatePayload.image_url = p.image_url;
      if (p.category !== undefined) updatePayload.category = p.category;
      if (p.sub_category !== undefined) updatePayload.sub_category = p.sub_category;
      if (p.is_active !== undefined) updatePayload.is_active = p.is_active;

      const { error: updateErr } = await supabase
        .from('products')
        .update(updatePayload)
        .eq('id', id);

      if (updateErr) {
        console.error('Supabase product update error in API:', updateErr);
      }

      if (vars && vars.length > 0) {
        await supabase.from('product_variants').delete().eq('product_id', id);
        const varRows = vars.map((v: any) => ({
          id: v.id,
          product_id: id,
          name: v.name,
          sku: v.sku,
          price_override: v.price_override != null ? v.price_override : null,
          stock_quantity: v.stock_quantity || 0,
          attributes: v.attributes || { size: v.name },
        }));
        await supabase.from('product_variants').upsert(varRows);
      }

      // Local fallback write
      if (process.env.NODE_ENV !== 'production' && fs.existsSync(catalogPath)) {
        try {
          const raw = fs.readFileSync(catalogPath, 'utf8');
          const current = JSON.parse(raw || '[]');
          const idx = current.findIndex((item: any) => item.id === id);
          if (idx !== -1) {
            current[idx] = { ...current[idx], ...p, ...(vars ? { variants: vars } : {}) };
            fs.writeFileSync(catalogPath, JSON.stringify(current, null, 2), 'utf8');
          }
        } catch {}
      }

      return NextResponse.json({ success: true, id });
    }

    // C) DELETE SINGLE PRODUCT
    if (action === 'delete' && id) {
      const { error: delErr } = await supabase
        .from('products')
        .update({ is_active: false })
        .eq('id', id);

      if (delErr) {
        console.error('Supabase delete error in API:', delErr);
      }

      // Local fallback write
      if (process.env.NODE_ENV !== 'production' && fs.existsSync(catalogPath)) {
        try {
          const raw = fs.readFileSync(catalogPath, 'utf8');
          const current = JSON.parse(raw || '[]');
          const idx = current.findIndex((item: any) => item.id === id);
          if (idx !== -1) {
            current[idx].is_active = false;
            fs.writeFileSync(catalogPath, JSON.stringify(current, null, 2), 'utf8');
          }
        } catch {}
      }

      return NextResponse.json({ success: true, id });
    }

    // D) BATCH SYNC / ARRAY OF PRODUCTS
    const productList = products || (Array.isArray(body) ? body : null);
    if (productList && Array.isArray(productList)) {
      if (process.env.NODE_ENV !== 'production') {
        try {
          fs.writeFileSync(catalogPath, JSON.stringify(productList, null, 2), 'utf8');
        } catch {}
      }
      return NextResponse.json({ success: true, count: productList.length });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (err: any) {
    console.error('Error writing products:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
