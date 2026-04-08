"use client";

import { motion } from 'framer-motion';

export default function ScrollIndicator() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
      className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-20 pointer-events-none select-none"
    >
      <span className="text-white/60 uppercase font-semibold text-[11px] tracking-[0.4em] ml-[0.4em]">
        Explore
      </span>
      <div className="w-[28px] h-[56px] rounded-full border border-white/20 flex justify-center pt-2 relative backdrop-blur-sm bg-white/5 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
        <motion.div 
          animate={{ y: [0, 20, 0] }}
          transition={{ 
            duration: 2.5, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="w-[8px] h-[8px] bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]"
        />
      </div>
    </motion.div>
  );
}
