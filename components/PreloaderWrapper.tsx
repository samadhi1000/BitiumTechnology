'use client';

import React, { useEffect, useState } from 'react';
import Preloader from '@/components/Preloader';

export default function PreloaderWrapper({ children }: { children: React.ReactNode }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Only show once per session
    const seen = sessionStorage.getItem('bitium_loaded');
    if (seen) setShow(false);
  }, []);

  const handleDone = () => {
    sessionStorage.setItem('bitium_loaded', '1');
    setShow(false);
  };

  return (
    <>
      {show && <Preloader onDone={handleDone} />}
      {children}
    </>
  );
}
