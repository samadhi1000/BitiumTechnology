'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DeprecatedDownloadsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the unified admin dashboard
    router.replace('/admin');
  }, [router]);

  return (
    <div className="w-full min-h-screen bg-background flex flex-col items-center justify-center gap-3">
      <div className="animate-pulse text-xs text-muted-foreground font-semibold">
        Redirecting to unified Admin Dashboard...
      </div>
    </div>
  );
}
