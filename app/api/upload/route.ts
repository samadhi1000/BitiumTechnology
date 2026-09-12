import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const folder = (formData.get('folder') as string) || 'community';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const fileExt = file.name.split('.').pop() || 'jpg';
    const cleanExt = fileExt.toLowerCase().replace(/[^a-z0-9]/g, '');
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}.${cleanExt}`;
    const filePath = `${folder}/${fileName}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    const { error } = await supabase.storage
      .from('public-previews')
      .upload(filePath, buffer, {
        contentType: file.type || 'image/jpeg',
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      console.error('[API /api/upload] Supabase storage upload error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data } = supabase.storage.from('public-previews').getPublicUrl(filePath);
    return NextResponse.json({ success: true, url: data.publicUrl });
  } catch (err: any) {
    console.error('[API /api/upload] Server error:', err);
    return NextResponse.json({ error: err.message || 'Upload failed' }, { status: 500 });
  }
}
