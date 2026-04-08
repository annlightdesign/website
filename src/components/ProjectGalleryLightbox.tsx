"use client";

import { useState } from 'react';
import { X } from 'lucide-react';

export default function ProjectGalleryLightbox({ images }: { images: string[] }) {
  const [activeImage, setActiveImage] = useState<string | null>(null);

  if (images.length === 0) return null;

  return (
    <>
      <div className="mt-10 columns-1 sm:columns-2 gap-4 space-y-4">
        {images.map((img, idx) => (
          <div 
            key={idx} 
            onClick={() => setActiveImage(img)}
            className="block overflow-hidden bg-muted group cursor-zoom-in"
          >
            <img 
              src={img} 
              alt={`Project detail ${idx + 1}`}
              className="w-full h-auto block transition-transform duration-700 ease-in-out group-hover:scale-105"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {/* Lightbox Overlay */}
      {activeImage && (
        <div 
          className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center cursor-zoom-out p-4 md:p-12"
          onClick={() => setActiveImage(null)}
        >
          <button 
            className="absolute top-8 right-8 text-foreground hover:text-muted-foreground z-50 p-2"
            onClick={() => setActiveImage(null)}
          >
            <X className="w-8 h-8" />
          </button>
          
          <img 
            src={activeImage} 
            alt="Enlarged view" 
            className="max-w-full max-h-full object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image itself
          />
        </div>
      )}
    </>
  );
}
