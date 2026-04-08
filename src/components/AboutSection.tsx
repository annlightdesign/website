"use client";

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

interface AboutSectionProps {
  aboutTitle: string | undefined;
  aboutText: string | undefined;
  wallpaperUrl2: string | undefined;
  locale: string;
  assistantFontClassName: string;
}

export default function AboutSection({
  aboutTitle,
  aboutText,
  wallpaperUrl2,
  locale,
  assistantFontClassName,
}: AboutSectionProps) {
  const containerRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const [scrollEl, setScrollEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // Find the scroll container which is the <main> element in page.tsx
    setScrollEl(document.querySelector('main'));
  }, []);

  // Parallax and scale for background using the specific scroll container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    container: scrollEl ? { current: scrollEl } : undefined,
    offset: ["start end", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const backgroundScale = useTransform(scrollYProgress, [0, 1], [1.12, 1.02]);

  // Viewport trigger for card animations
  // amount: 0.2 means trigger when 20% of the element is visible
  const isInView = useInView(cardRef, { once: false, amount: 0.2 });

  const easeCinematic = [0.22, 1, 0.36, 1] as const;

  const containerVariants = {
    hidden: {
      opacity: 0,
      y: 15,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: easeCinematic,
        when: "beforeChildren",
        staggerChildren: 0.15,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: easeCinematic }
    }
  };

  if (!aboutTitle && !aboutText && !wallpaperUrl2) return null;

  return (
    <section
      ref={containerRef}
      className={`relative w-full ${wallpaperUrl2 ? 'h-[100dvh]' : 'min-h-[50dvh] bg-background'} snap-start snap-always flex flex-col items-center justify-center p-8 pt-24 overflow-hidden`}
    >
      {/* Infinite Slow Parallax/Zoom Background */}
      {wallpaperUrl2 && (
        <motion.div
          className="absolute inset-0 z-0 origin-center"
          initial={{ scale: 1 }}
          animate={isInView ? { scale: 1.05 } : { scale: 1 }}
          transition={{ duration: 10, ease: "linear" }}
        >
          <motion.img 
            src={wallpaperUrl2} 
            alt="About Wallpaper" 
            className="absolute inset-0 w-full h-full object-cover pointer-events-none" 
            style={{ y: backgroundY }}
          />
        </motion.div>
      )}

      {wallpaperUrl2 && (
        <div className="absolute inset-0 bg-black/40 z-0 pointer-events-none" />
      )}

      {(aboutTitle || aboutText) && (
        <motion.div
          ref={cardRef}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className={`relative z-10 max-w-4xl w-[90%] md:w-auto text-center flex flex-col items-center justify-center gap-4 md:gap-8 ${wallpaperUrl2
            ? 'bg-white/5 p-8 md:p-12 rounded-2xl border border-white/20 shadow-[0_0_50px_rgba(255,255,255,0.05)] backdrop-blur-xl text-white'
            : ''
            }`}
        >
          {/* Subtle Glow Highlighting using pseudoelement styling */}
          {wallpaperUrl2 && (
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/10 to-transparent opacity-50 pointer-events-none" />
          )}

          {aboutTitle && (
            <motion.h2
              variants={itemVariants}
              className={`text-2xl md:text-4xl uppercase tracking-[0.2em] drop-shadow-sm protect-text ${locale === 'he' ? assistantFontClassName + ' font-light' : 'font-light'}`}
            >
              {aboutTitle}
            </motion.h2>
          )}

          {aboutText && (
            <motion.p
              variants={itemVariants}
              className={`text-base md:text-xl px-4 md:px-8 leading-relaxed whitespace-pre-wrap drop-shadow-sm opacity-90 protect-text ${wallpaperUrl2 ? 'font-light' : 'text-muted-foreground'} ${locale === 'he' ? assistantFontClassName : ''}`}
            >
              {aboutText}
            </motion.p>
          )}
        </motion.div>
      )}
    </section>
  );
}
