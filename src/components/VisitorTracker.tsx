'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function VisitorTracker() {
  const pathname = usePathname();
  const trackedPaths = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Avoid double firing in strict mode or tracking the exact same path multiple times per session
    if (trackedPaths.current.has(pathname)) return;
    
    trackedPaths.current.add(pathname);

    // Don't leak tracking to admin panel directly (optional, but good practice so admins dont skew results)
    if (pathname.includes('/admin')) return;

    fetch('/api/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        path: pathname,
        source: typeof document !== 'undefined' ? document.referrer : null
      }),
    }).catch(err => {
      // Silently fail if tracking block exists, e.g. adblocker
      console.warn("Could not track visit", err);
    });
  }, [pathname]);

  return null;
}
