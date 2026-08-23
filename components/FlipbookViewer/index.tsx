'use client';

import dynamic from 'next/dynamic';

const DynamicFlipbookViewer = dynamic(
  () => import('./FlipbookViewer'),
  { ssr: false }
);

interface FlipbookProps {
  pdfUrl: string;
}

export default function FlipbookIndex({ pdfUrl }: FlipbookProps) {
  return <DynamicFlipbookViewer pdfUrl={pdfUrl} />;
}
