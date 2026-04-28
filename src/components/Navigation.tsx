"use client";

import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname, routing } from '@/i18n/routing';
import { Menu, Search, ShoppingBag } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navigation() {
  const t = useTranslations('Navigation');
  const locale = useLocale();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement | Document;
      let scrollTop = 0;

      if (target === document) {
        scrollTop = window.scrollY;
      } else if (target instanceof HTMLElement) {
        scrollTop = target.scrollTop;
      }

      // We only want to trigger the navbar state if the whole page or main snapping container scrolls
      if (target === document || (target instanceof HTMLElement && target.tagName === 'MAIN')) {
        const scrolled = scrollTop > 50;
        setIsScrolled(scrolled);
        document.documentElement.setAttribute('data-nav-scrolled', String(scrolled));
      }
    };

    // Use capture phase (true) to catch scroll events from overflow-scroll containers like the Homepage's <main>
    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, []);

  const navLinkClass = "relative opacity-70 hover:opacity-100 tracking-widest hover:tracking-[0.15em] transition-all duration-500 after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[1px] after:bg-current after:scale-x-0 after:origin-right after:transition-transform after:duration-500 hover:after:scale-x-100 hover:after:origin-left";

  const isExactProjectView = pathname.startsWith('/projects/') && pathname.length > '/projects/'.length;
  
  // On exact project view pages, lock the navbar to the h-20 state permanently.
  // This exactly matches the md:top-20 (80px) sticky offset of the main photo.
  const heightClasses = isExactProjectView 
    ? 'h-20' 
    : (isScrolled ? 'h-14 md:h-16' : 'h-20 md:h-24');

  const bgClasses = isExactProjectView
    ? 'bg-[rgba(20,20,20,0.6)] backdrop-blur-[12px] border-b border-white/5 shadow-sm'
    : (isScrolled 
        ? 'bg-[rgba(20,20,20,0.6)] backdrop-blur-[12px] border-b border-white/5 shadow-sm' 
        : 'bg-gradient-to-b from-[rgba(20,20,20,0.35)] to-[rgba(20,20,20,0.15)] backdrop-blur-[10px] border-transparent');

  return (
    <header className={`fixed top-0 z-50 w-full transition-all duration-700 ${bgClasses}`}>
      <div className={`w-full flex items-center justify-between px-4 lg:px-8 relative transition-all duration-700 ${heightClasses}`}>
        <div className="flex items-center gap-6 flex-1">
          <button
            className="lg:hidden text-foreground hover:opacity-70 transition-opacity drop-shadow-md"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
          <Link href="/" className="font-light text-2xl md:text-3xl tracking-[0.4em] font-sans uppercase pl-[0.4em] drop-shadow-lg">
            ANN LIGHT
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className={`hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-10 text-sm font-medium uppercase text-foreground ${locale === 'he' ? 'flex-row-reverse' : ''}`}>
          <Link href="/catalog" className={navLinkClass}>{t('catalog')}</Link>
          <Link href="/projects" className={navLinkClass}>{t('projects')}</Link>
          <Link href="/brands" className={navLinkClass}>{t('brands')}</Link>
          <Link href="/architects" className={navLinkClass}>{t('architects')}</Link>
          <Link href="/contact" className={navLinkClass}>{t('contact')}</Link>
        </nav>

        {/* Icons */}
        <div className="flex flex-1 justify-end items-center gap-2 md:gap-4">
          <button className="p-2 hover:bg-muted rounded-full transition-colors"><Search className="w-5 h-5" /></button>

          {/* Language Switcher */}
          <div className="flex items-center gap-3 border-l border-border pl-4">
            <Link href={pathname} locale="en" className={navLinkClass + " text-xs"}>EN</Link>
            <Link href={pathname} locale="he" className={navLinkClass + " text-sm font-sans"}>עב</Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-background/95 backdrop-blur-xl border-b border-border p-8 lg:hidden flex flex-col gap-6 text-sm tracking-widest uppercase font-medium shadow-2xl">
          <Link href="/catalog" onClick={() => setIsMenuOpen(false)} className="w-fit">{t('catalog')}</Link>
          <Link href="/projects" onClick={() => setIsMenuOpen(false)} className="w-fit">{t('projects')}</Link>
          <Link href="/brands" onClick={() => setIsMenuOpen(false)} className="w-fit">{t('brands')}</Link>
          <Link href="/architects" onClick={() => setIsMenuOpen(false)} className="w-fit">{t('architects')}</Link>
          <Link href="/contact" onClick={() => setIsMenuOpen(false)} className="w-fit">{t('contact')}</Link>
        </div>
      )}
    </header>
  );
}
