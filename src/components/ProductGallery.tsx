'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

interface ProductGalleryProps {
  images: string[];
  title: string;
  locale: string;
}

export default function ProductGallery({ images, title, locale }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const isHebrew = locale === 'he';

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
    setIsZoomed(false);
  };

  const closeLightbox = () => {
    setSelectedIndex(null);
    setIsZoomed(false);
  };

  const showNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev! + 1) % images.length);
    setIsZoomed(false);
  }, [images.length, selectedIndex]);

  const showPrev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev! - 1 + images.length) % images.length);
    setIsZoomed(false);
  }, [images.length, selectedIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, isHebrew, showNext, showPrev]);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-muted relative w-full flex items-center justify-center text-muted-foreground border border-dashed border-border">
        <span className="uppercase tracking-widest text-sm">No Images Available</span>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-4 w-full">
        {/* Main highlight image */}
        <div 
          className="aspect-square bg-muted relative w-full overflow-hidden cursor-zoom-in group"
          onClick={() => openLightbox(0)}
        >
          <img 
            src={images[0]} 
            alt={title} 
            className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-105" 
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
             <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-md" />
          </div>
        </div>
        
        {/* Remaining images grid */}
        {images.length > 1 && (
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            {images.slice(1).map((img, idx) => (
              <div 
                key={idx} 
                className="aspect-square bg-muted relative w-full overflow-hidden cursor-zoom-in group"
                onClick={() => openLightbox(idx + 1)}
              >
                <img 
                  src={img} 
                  alt={`Detail ${idx + 2}`} 
                  className="object-cover w-full h-full transition-transform duration-500 ease-out group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                  <ZoomIn className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-md" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-50 bg-background/95 backdrop-blur-md flex items-center justify-center ${isHebrew ? 'rtl' : 'ltr'}`}
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button 
              className="absolute top-6 right-6 lg:top-8 lg:right-8 p-2 bg-foreground/10 hover:bg-foreground/20 text-foreground rounded-full transition-colors z-50"
              onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation Buttons (only if multiple images) */}
            {images.length > 1 && (
              <>
                <button
                  className="absolute left-4 lg:left-12 top-1/2 -translate-y-1/2 p-3 bg-foreground/10 hover:bg-foreground/20 text-foreground rounded-full transition-colors z-50"
                  onClick={showPrev}
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  className="absolute right-4 lg:right-12 top-1/2 -translate-y-1/2 p-3 bg-foreground/10 hover:bg-foreground/20 text-foreground rounded-full transition-colors z-50"
                  onClick={showNext}
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Main Lightbox Image */}
            <motion.div 
              key={selectedIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full h-full max-w-5xl max-h-[85vh] mx-auto p-4 md:p-12 flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation();
                setIsZoomed(!isZoomed);
              }}
            >
              <img 
                src={images[selectedIndex]} 
                alt={`${title} Preview`} 
                className={`transition-all duration-300 ease-out shadow-2xl ${
                  isZoomed 
                    ? 'w-[200%] h-[200%] max-w-none origin-center cursor-zoom-out object-cover' 
                    : 'max-w-full max-h-full object-contain cursor-zoom-in'
                }`}
                style={{
                  height: isZoomed ? '150vh' : undefined // Basic zoom
                }}
              />
            </motion.div>

            {/* Indicator Dots */}
            {images.length > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-50">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => { e.stopPropagation(); openLightbox(idx); }}
                    className={`w-2 h-2 rounded-full transition-all ${idx === selectedIndex ? 'bg-foreground w-6' : 'bg-foreground/30 hover:bg-foreground/50'}`}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
