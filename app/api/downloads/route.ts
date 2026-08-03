import { NextResponse } from 'next/server';
import { getDigitalArtworks } from '@/lib/digital';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const search = searchParams.get('search') || undefined;

    const artworks = await getDigitalArtworks(category, search);
    return NextResponse.json(artworks);
  } catch (err: any) {
    console.error('Error fetching digital artworks catalog:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
