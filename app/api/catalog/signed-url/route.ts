import { NextResponse } from 'next/server';
import { getSecureR2DownloadUrl } from '@/lib/cloudflareR2';

// Ensure this route is always dynamically generated so the signed URL is fresh (not cached statically)
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    // Read optional 'file' query parameter, default to 'Tracing Catlog.pdf'
    const { searchParams } = new URL(request.url);
    const fileKey = searchParams.get('file') || 'Tracing Catlog.pdf';

    // Generate a signed URL valid for 1 hour (3600 seconds)
    const signedUrl = await getSecureR2DownloadUrl(fileKey, 3600);
    
    return NextResponse.json({ url: signedUrl });
  } catch (error) {
    console.error('Failed to generate catalog signed URL:', error);
    return NextResponse.json(
      { error: 'Failed to secure catalog access' },
      { status: 500 }
    );
  }
}
