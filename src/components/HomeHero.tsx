"use client";

import { motion } from 'framer-motion';
import ScrollIndicator from '@/components/ScrollIndicator';

interface HomeHeroProps {
  title: string | undefined;
  subtitle: string | undefined;
  wallpaperUrl: string | undefined;
  locale: string;
  assistantFontClassName: string;
}

export default function HomeHero({ title, subtitle, wallpaperUrl, locale, assistantFontClassName }: HomeHeroProps) {
  const easeCinematic = [0.22, 1, 0.36, 1] as const;

  return (
    <section className="relative w-full h-[100dvh] snap-start snap-always flex flex-col items-center justify-center p-4 md:p-24 overflow-hidden bg-background">
      {wallpaperUrl && (
        <motion.img 
          src={wallpaperUrl} 
          alt="Hero Wallpaper" 
          className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
          initial={{ scale: 1 }}
          animate={{ scale: 1.03 }}
          transition={{ duration: 6, ease: "easeOut" }}
        />
      )}
      <div className="absolute inset-0 bg-background/25 z-0 pointer-events-none" />
      
      <div className="relative z-10 max-w-5xl w-full items-center justify-between font-sans text-sm flex flex-col text-center mt-20">
        <motion.div 
          className="flex flex-col items-center justify-center mb-12 select-none font-sans"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: easeCinematic }}
        >
          <h1 className="text-[6rem] md:text-[9rem] font-light tracking-[0.05em] text-foreground leading-none ml-[0.05em]">
            ANN
          </h1>
          <span className="text-lg md:text-2xl font-medium tracking-[0.35em] md:tracking-[0.45em] uppercase text-foreground mt-2 md:mt-4 ml-[0.35em]">
            Light Design
          </span>
          <span className="sr-only">{title}</span>
        </motion.div>
        
        {subtitle && (
          <motion.p 
            className={`text-xl text-muted-foreground w-[90%] md:w-1/2 mx-auto whitespace-pre-wrap protect-text ${locale === 'he' ? assistantFontClassName : ''}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.15, ease: easeCinematic }}
          >
            {subtitle}
          </motion.p>
        )}
      </div>

      <ScrollIndicator />
    </section>
  );
}
