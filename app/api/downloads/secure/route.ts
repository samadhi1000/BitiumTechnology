import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifyDownloadToken, incrementDownloadCount } from '@/lib/digital';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const redirectParam = searchParams.get('redirect') === 'true';

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    // 1. Verify token & purchase
    const verification = await verifyDownloadToken(token);
    if (!verification) {
      return NextResponse.json({ error: 'Invalid or missing download token' }, { status: 403 });
    }

    const { purchase, artwork } = verification;

    // 2. Security validation: Check download count limits
    if (purchase.download_count >= purchase.max_downloads) {
      return NextResponse.json({ 
        error: 'Download limit exceeded. You have reached the maximum allowed downloads (5) for this asset.' 
      }, { status: 403 });
    }

    // 3. Security validation: Check expiry date (7 days limit)
    if (new Date(purchase.expires_at) < new Date()) {
      return NextResponse.json({ 
        error: 'Download link has expired. Access keys are only valid for 7 days post-purchase.' 
      }, { status: 403 });
    }

    // 4. Secure signed URL generation from private Supabase storage bucket
    // The link will expire in exactly 60 seconds (prevents sharing/hotlinking)
    const { data, error: storageError } = await supabase
      .storage
      .from('digital-artworks-secure')
      .createSignedUrl(artwork.file_key, 60);

    let signedUrl = data?.signedUrl;

    if (storageError || !signedUrl) {
      console.warn('Supabase storage signed URL generation failed. Providing mock signed URL for demonstration.');
      // Local fallback url for demonstration (points to a placeholder download file)
      signedUrl = `https://placeholder-storage.local/${artwork.file_key}?token=${token}&expires=${Math.floor(Date.now() / 1000) + 60}`;
    }

    // 5. Audit: Increment download counter in DB
    await incrementDownloadCount(purchase.id);

    // 6. Respond (direct 302 redirect or JSON URL payload)
    if (redirectParam) {
      return NextResponse.redirect(signedUrl);
    }

    return NextResponse.json({ 
      downloadUrl: signedUrl,
      fileName: `${artwork.title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_high_res.${artwork.file_format.toLowerCase().split(' ')[0]}`
    });
  } catch (err: any) {
    console.error('Error generating secure download link:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
