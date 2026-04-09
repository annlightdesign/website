"use client";

import { usePathname } from '@/i18n/routing';

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const TiktokIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

export default function Footer() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  
  const bgClass = isHome 
    ? "bg-gradient-to-b from-[#11100f] to-[#050404]" 
    : "bg-background/95";

  return (
    <footer className={`w-full border-t border-white/[0.08] ${bgClass} backdrop-blur-sm h-auto md:h-20 py-4 md:py-0 mt-auto flex items-center`}>
      <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 md:px-12 gap-5 md:gap-0">
        
        {/* Left / Center-Left: Logo Mark & Copyright */}
        <div className="flex items-center gap-3 md:gap-4 flex-wrap">
          <span className="font-light tracking-[0.25em] uppercase text-white/90 text-[13px] md:text-sm">
            Ann
          </span>
          <span className="text-white/50 text-[10px] md:text-[11px] font-light tracking-[0.1em] border-l border-white/[0.08] pl-3 md:pl-4 py-0.5 uppercase">
            © 2026 Ann Light Design. All rights reserved.
          </span>
          <span className="hidden md:inline text-white/20">•</span>
          <a href="/privacy" className="text-white/50 hover:text-white/80 text-[10px] md:text-[11px] font-light tracking-[0.1em] uppercase transition-colors">
            Privacy Policy
          </a>
        </div>

        {/* Right: Floating Social Icons */}
        <div className="flex items-center gap-7 md:gap-8">
          <a href="https://www.instagram.com/annlightdesign/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-white opacity-60 hover:opacity-100 hover:scale-[1.05] transition-all duration-300 ease-out">
            <InstagramIcon className="w-[17px] h-[17px] stroke-[1.5]" />
          </a>
          <a href="https://www.tiktok.com/@ann.light.design" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="text-white opacity-60 hover:opacity-100 hover:scale-[1.05] transition-all duration-300 ease-out">
            <TiktokIcon className="w-[17px] h-[17px] stroke-[2]" />
          </a>
          <a href="https://www.facebook.com/annlightdesign" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-white opacity-60 hover:opacity-100 hover:scale-[1.05] transition-all duration-300 ease-out">
            <FacebookIcon className="w-[17px] h-[17px] stroke-[1.5]" />
          </a>
        </div>

      </div>
    </footer>
  );
}
