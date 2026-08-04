import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import catalogData from '@/lib/products-catalog.json';

const catalogPath = path.join(process.cwd(), 'lib', 'products-catalog.json');

// Read JSON file database
export async function GET() {
  try {
    // In production (Vercel), use the statically imported catalog
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(catalogData);
    }
    if (fs.existsSync(catalogPath)) {
      const data = fs.readFileSync(catalogPath, 'utf8');
      return NextResponse.json(JSON.parse(data || '[]'));
    }
  } catch (err: any) {
    console.error('Error reading products-catalog.json:', err);
    return NextResponse.json({ error: err.message }, { status: 550 });
  }
  return NextResponse.json([]);
}

// Write to JSON file database (only allowed in local development)
export async function POST(request: Request) {
  try {
    const products = await request.json();
    
    // We only write to disk if running locally. On Vercel (read-only environment), we bypass writing.
    if (process.env.NODE_ENV !== 'production') {
      fs.writeFileSync(catalogPath, JSON.stringify(products, null, 2), 'utf8');
      console.log('Successfully synced product changes to lib/products-catalog.json');
    } else {
      console.log('Production environment detected: Skipped physical write to lib/products-catalog.json');
    }
    
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Error writing products-catalog.json:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
