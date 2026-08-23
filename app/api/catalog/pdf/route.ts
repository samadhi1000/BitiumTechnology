import { NextResponse } from 'next/server';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';

export const dynamic = 'force-dynamic';

// Build R2 client directly here for streaming
const accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID;
const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME || 'bitiumcatalogs';

const ALLOWED_FILES: Record<string, string> = {
  tracing: 'Tracing Catlog.pdf',
  stencil: 'Stencil Catlog New pdf CUSTOMER File with water mark.pdf',
};

export async function GET(request: Request) {
  if (!accountId || !accessKeyId || !secretAccessKey) {
    return NextResponse.json({ error: 'R2 not configured' }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'tracing';

  // Whitelist check - never allow arbitrary file access
  const fileKey = ALLOWED_FILES[type];
  if (!fileKey) {
    return NextResponse.json({ error: 'Invalid catalog type' }, { status: 400 });
  }

  const s3 = new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });

  try {
    const command = new GetObjectCommand({ Bucket: bucketName, Key: fileKey });
    const response = await s3.send(command);

    if (!response.Body) {
      return NextResponse.json({ error: 'File not found in R2' }, { status: 404 });
    }

    // Stream the PDF bytes from R2 directly to the browser
    const stream = response.Body as Readable;
    const chunks: Buffer[] = [];

    for await (const chunk of stream) {
      chunks.push(Buffer.from(chunk));
    }

    const pdfBuffer = Buffer.concat(chunks);

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Length': pdfBuffer.length.toString(),
        // Allow PDF.js (same origin) to read the response
        'Cache-Control': 'private, max-age=3600',
      },
    });
  } catch (error) {
    console.error('R2 streaming error:', error);
    return NextResponse.json({ error: 'Failed to load catalog from storage' }, { status: 500 });
  }
}
