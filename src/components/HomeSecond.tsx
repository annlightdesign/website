"use client";

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from '@/i18n/routing';

const MotionLink = motion(Link as any);

interface HomeSecondProps {
  secondTitle: string | undefined;
  secondText: string | undefined;
  wallpaperUrl2: string | undefined;
  locale: string;
  assistantFontClassName: string;
  btnText: string;
}

export default function HomeSecond({
  secondTitle,
  secondText,
  wallpaperUrl2,
  locale,
  assistantFontClassName,
  btnText
}: HomeSecondProps) {
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once: false, margin: "-10%" });

  const easeCinematic = [0.22, 1, 0.36, 1] as const;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 1.0, ease: easeCinematic } 
    }
  };

  const btnVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { duration: 1.0, ease: easeCinematic } 
    }
  };

  if (!wallpaperUrl2) return null;

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[100svh] snap-start snap-always flex flex-col justify-start items-center md:items-end p-8 pt-32 md:p-24 md:pt-40 overflow-hidden"
    >
      <motion.img 
        src={wallpaperUrl2} 
        alt="Section Wallpaper" 
        className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0 origin-center" 
        initial={{ scale: 1.03, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : { scale: 1.03, opacity: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />
      <div className="absolute inset-0 bg-black/3 z-0 pointer-events-none" />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="relative z-10 text-white pt-20 md:pt-0 text-center flex flex-col items-center max-w-5xl w-full md:w-auto"
      >
        {secondTitle && (
          <motion.h2 
            variants={itemVariants} 
            className={`font-light mb-6 tracking-widest drop-shadow-lg ${locale === 'he' ? assistantFontClassName + ' text-4xl md:text-6xl' : 'text-2xl sm:text-3xl md:text-6xl whitespace-nowrap'}`}
          >
            {secondTitle}
          </motion.h2>
        )}
        {secondText && (
           <motion.p 
             variants={itemVariants} 
             className={`text-lg md:text-2xl leading-relaxed opacity-90 drop-shadow-md mb-10 whitespace-pre-line protect-text ${locale === 'he' ? assistantFontClassName : ''}`}
           >
             {secondText}
           </motion.p>
        )}

        <MotionLink
          href="/projects"
          variants={btnVariants}
          className="mt-4 group relative inline-flex items-center justify-center text-white/90 hover:text-white border border-white/10 hover:border-white/25 px-9 py-4 uppercase text-xs tracking-[0.2em] backdrop-blur-xl hover:backdrop-blur-2xl bg-white/5 hover:bg-white/10 transition-all duration-[400ms] font-light shadow-2xl rounded-sm hover:-translate-y-0.5 hover:scale-[1.03] overflow-hidden"
          style={{ WebkitBackfaceVisibility: "hidden", WebkitTransform: "translate3d(0,0,0)" }}
        >
          <span className="relative z-10 transition-all duration-[400ms] group-hover:tracking-[0.22em]">{btnText}</span>
          {/* Subtle glass sweep reflection */}
          <div className="absolute top-0 left-[-150%] w-[100%] h-[100%] bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-25deg] group-hover:left-[150%] transition-all duration-[800ms] ease-out z-0 pointer-events-none" />
        </MotionLink>
      </motion.div>
    </section>
  );
}
