"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "@/i18n/routing";

interface CinematicCategoryProps {
  id: number;
  name: string;
  image: string | null;
  locale: string;
}

export default function CinematicCategory({ id, name, image, locale }: CinematicCategoryProps) {
  const containerRef = useRef<HTMLElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.1, 1]);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[100svh] snap-start snap-always overflow-hidden group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/catalog?category=${id}`} prefetch={false} className="absolute inset-0 z-20" aria-label={name} />
      
      {/* Background Image with Parallax */}
      <motion.div
        className="absolute inset-0 z-0 origin-center"
        style={{ y, scale }}
        animate={{ scale: isHovered ? 1.05 : 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-neutral-900" />
        )}
      </motion.div>

      {/* Lighting Effect Overlay: "Lights turn on softly on hover" */}
      <motion.div
        className="absolute inset-0 z-0 pointer-events-none transition-colors duration-1000 ease-out"
        animate={{
          backgroundColor: isHovered ? "rgba(0, 0, 0, 0.2)" : "rgba(0, 0, 0, 0.6)",
        }}
      />
      
      {/* Subtle Glow around the center on hover */}
      <motion.div
        className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <div className="w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] rounded-full bg-white/10 blur-[100px] md:blur-[150px]" />
      </motion.div>

      {/* Category Title */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none p-6 text-center">
        <motion.h2
          className="text-4xl md:text-7xl lg:text-[6rem] font-light uppercase tracking-[0.2em] text-white drop-shadow-2xl"
          initial={{ opacity: 0.6, y: 10, filter: "blur(4px)" }}
          animate={{
            opacity: isHovered ? 1 : 0.7,
            y: isHovered ? -5 : 0,
            filter: isHovered ? "blur(0px)" : "blur(2px)",
            letterSpacing: isHovered ? "0.25em" : "0.2em"
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          dir="auto"
        >
          {name}
        </motion.h2>
        
        {/* Animated Line */}
        <motion.div 
          className="h-[1px] bg-white/50 mt-8"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: isHovered ? "120px" : "40px", opacity: isHovered ? 1 : 0.4 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
        
        <motion.span
          className="mt-6 text-xs md:text-sm tracking-[0.3em] uppercase text-white/70 font-light"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
        >
          {locale === 'he' ? 'חקור קולקציה' : 'Explore Collection'}
        </motion.span>
      </div>
    </section>
  );
}
