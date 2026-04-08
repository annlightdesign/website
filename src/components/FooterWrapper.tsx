"use client";

import { usePathname } from 'next/navigation';
import Footer from './Footer';

export default function FooterWrapper() {
  const pathname = usePathname();
  
  // Isolate the global footer out of the exact homepage route string 
  // so the internal homepage snap-scroller can manage it structurally
  if (pathname === '/en' || pathname === '/he' || pathname === '/') {
    return null;
  }
  
  return <Footer />;
}
