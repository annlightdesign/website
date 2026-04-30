"use client";

import { useState, useEffect, useCallback } from 'react';
import { Link } from '@/i18n/routing';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateSlug } from '@/lib/slugs';

export default function ProjectClientView({
  project,
  prevProject,
  nextProject,
  images,
  locale,
  tAbout,
  tArchitect,
  tPhotographer,
  tLightingConsultant,
  tLocation,
  tBack,
  titleSize
}: any) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const mainImg = images.length > 0 ? images[0] : null;

  // Keyboard Navigation for Lightbox
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (activeIndex === null) return;
    if (e.key === 'Escape') setActiveIndex(null);
    if (e.key === 'ArrowLeft' && activeIndex > 0) setActiveIndex(activeIndex - 1);
    if (e.key === 'ArrowRight' && activeIndex < images.length - 1) setActiveIndex(activeIndex + 1);
  }, [activeIndex, images.length]);

  useEffect(() => {
    if (activeIndex !== null) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [activeIndex, handleKeyDown]);

  return (
    <div className="w-full pt-[80px] md:pt-0 bg-background text-foreground flex flex-col md:flex-row">

      {/* Left Column (Sticky Edge-to-Edge Image) */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay: 0.1 }}
        className="w-full md:w-1/2 md:h-[calc(100vh-5rem)] md:sticky md:top-20 relative z-10 flex-shrink-0 group cursor-zoom-in overflow-hidden"
        onClick={() => mainImg && setActiveIndex(0)}
      >

        {/* Back Button (Top Left) Proximity Trigger Area */}
        <div className="absolute top-0 left-0 p-6 md:p-8 z-30 group/back cursor-auto" onClick={(e) => e.stopPropagation()}>
          <Link href="/projects" className="w-10 h-10 bg-background/80 hover:bg-background text-foreground flex items-center justify-center rounded-full transition-all duration-500 font-bold text-lg shadow-sm border border-border/20 hover:scale-110 opacity-100 md:opacity-0 group-hover/back:opacity-100">
            ×
          </Link>
        </div>

        {/* Full Clickable Image */}
        {mainImg ? (
          <img
            src={mainImg}
            alt={project.title}
            onContextMenu={(e) => e.preventDefault()}
            draggable={false}
            className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-[1.03] select-none"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-muted text-muted-foreground uppercase tracking-widest text-sm">
            No Main Image
          </div>
        )}
      </motion.div>

      {/* Right Column (Scrollable Content) */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay: 0.3 }}
        className="w-full md:w-1/2 min-h-screen relative flex-shrink-0 flex flex-col pt-[144px] md:pt-[176px] pb-24 px-4 md:px-8 lg:px-12 items-center bg-background z-10"
      >

        {/* Title */}
        <h1
          className="font-light tracking-widest uppercase text-center leading-tight text-foreground transition-all duration-300 w-full"
          style={{ fontSize: `min(${titleSize || 72}px, 12vw)` }}
        >
          {locale === 'he' && project.titleHe ? project.titleHe : project.title}
        </h1>

        {/* Navigation Between Projects */}
        <div className="mt-16 w-full max-w-xl border-t border-foreground/30 pt-6 text-sm flex flex-col gap-4 font-sans uppercase tracking-[0.15em] text-foreground transition-colors group">
          <div className="flex justify-between items-center w-full">
            {prevProject ? (
              <Link href={`/projects/${generateSlug(prevProject.title)}`} className="hover:opacity-60 transition-opacity flex items-center gap-2">
                <span className="font-bold text-lg leading-none">←</span> <span className="hidden sm:inline">{locale === 'he' && prevProject.titleHe ? prevProject.titleHe : prevProject.title}</span>
              </Link>
            ) : <span className="opacity-0">Prev</span>}

            {nextProject ? (
              <Link href={`/projects/${generateSlug(nextProject.title)}`} className="hover:opacity-60 transition-opacity flex items-center gap-2 text-right">
                <span className="hidden sm:inline">{locale === 'he' && nextProject.titleHe ? nextProject.titleHe : nextProject.title}</span> <span className="font-bold text-lg leading-none">→</span>
              </Link>
            ) : <span className="opacity-0">Next</span>}
          </div>
        </div>

        {/* Metadata Details */}
        <div className="mt-16 flex flex-col items-center gap-5 text-sm tracking-widest font-sans w-full max-w-lg">
          <h3 className="text-center font-bold text-lg mb-4">{tAbout}</h3>

          {project.architect && (
            <div className={`flex justify-center items-baseline border-b border-border/40 pb-2 gap-4 w-full text-center ${locale === 'he' ? 'flex-row-reverse' : 'flex-row'}`}>
              <span className={`text-[11px] uppercase tracking-widest text-muted-foreground w-32 flex-shrink-0 ${locale === 'he' ? 'text-right' : 'text-left'}`}>{tArchitect}</span>
              <span className={`font-light flex-1 whitespace-normal break-words ${locale === 'he' ? 'text-left' : 'text-right'}`}>{project.architect}</span>
            </div>
          )}
          {project.photographer && (
            <div className={`flex justify-center items-baseline border-b border-border/40 pb-2 gap-4 w-full text-center ${locale === 'he' ? 'flex-row-reverse' : 'flex-row'}`}>
              <span className={`text-[11px] uppercase tracking-widest text-muted-foreground w-32 flex-shrink-0 ${locale === 'he' ? 'text-right' : 'text-left'}`}>{tPhotographer}</span>
              <span className={`font-light flex-1 whitespace-normal break-words ${locale === 'he' ? 'text-left' : 'text-right'}`}>{project.photographer}</span>
            </div>
          )}
          {project.lightingConsultant && (
            <div className={`flex justify-center items-baseline border-b border-border/40 pb-2 gap-4 w-full text-center ${locale === 'he' ? 'flex-row-reverse' : 'flex-row'}`}>
              <span className={`text-[11px] uppercase tracking-widest text-muted-foreground w-32 flex-shrink-0 ${locale === 'he' ? 'text-right' : 'text-left'}`}>{tLightingConsultant}</span>
              <span className={`font-light flex-1 whitespace-normal break-words ${locale === 'he' ? 'text-left' : 'text-right'}`}>{project.lightingConsultant}</span>
            </div>
          )}
          {project.location && (
            <div className={`flex justify-center items-baseline border-b border-border/40 pb-2 gap-4 w-full text-center ${locale === 'he' ? 'flex-row-reverse' : 'flex-row'}`}>
              <span className={`text-[11px] uppercase tracking-widest text-muted-foreground w-32 flex-shrink-0 ${locale === 'he' ? 'text-right' : 'text-left'}`}>{tLocation}</span>
              <span className={`font-light flex-1 whitespace-normal break-words ${locale === 'he' ? 'text-left' : 'text-right'}`}>{project.location}</span>
            </div>
          )}
        </div>

        {/* Standard Grid for all images (LTR flow) */}
        {images.length > 0 && (
          <div className="mt-20 grid grid-cols-2 lg:grid-cols-3 gap-2 w-full relative z-10">
            {images.map((img: string, idx: number) => (
              <div
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className="block overflow-hidden bg-muted group cursor-zoom-in aspect-square"
              >
                <img
                  src={img}
                  alt={`Project detail ${idx + 1}`}
                  onContextMenu={(e) => e.preventDefault()}
                  draggable={false}
                  className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-[1.03] select-none"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Animated Lightbox Overlay */}
      <div
        className={`fixed inset-0 z-[999] bg-background/95 backdrop-blur-md flex items-center justify-center p-4 md:p-12 transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${activeIndex !== null ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setActiveIndex(null)}
      >
        <button
          className="absolute top-6 right-6 lg:top-8 lg:right-8 p-2 bg-foreground/10 hover:bg-foreground/20 text-foreground rounded-full transition-colors z-[9999]"
          onClick={(e) => { e.stopPropagation(); setActiveIndex(null); }}
        >
          <X className="w-6 h-6" />
        </button>

        {activeIndex !== null && activeIndex > 0 && (
          <button
            className="absolute left-4 lg:left-12 top-1/2 -translate-y-1/2 p-3 bg-foreground/10 hover:bg-foreground/20 text-foreground rounded-full transition-colors z-[9999]"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setActiveIndex(activeIndex - 1);
            }}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        <AnimatePresence mode="wait">
          {activeIndex !== null && (
            <motion.img
              key={activeIndex}
              src={images[activeIndex]}
              alt="Enlarged view"
              onContextMenu={(e) => e.preventDefault()}
              draggable={false}
              initial={{ opacity: 0, filter: 'blur(4px)', scale: 0.98 }}
              animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
              exit={{ opacity: 0, filter: 'blur(4px)', scale: 1.02 }}
              transition={{ duration: 0.21, ease: [0.25, 0.1, 0.25, 1] }}
              className="max-w-full max-h-full object-contain shadow-2xl select-none"
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
            />
          )}
        </AnimatePresence>

        {activeIndex !== null && activeIndex < images.length - 1 && (
          <button
            className="absolute right-4 lg:right-12 top-1/2 -translate-y-1/2 p-3 bg-foreground/10 hover:bg-foreground/20 text-foreground rounded-full transition-colors z-[9999]"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setActiveIndex(activeIndex + 1);
            }}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

    </div>
  );
}
