"use client";

import { X, Copy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface CopyProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (targetCategoryId?: number) => void;
  title: string;
  originalCategoryId: number;
}

export default function CopyProductModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  originalCategoryId
}: CopyProductModalProps) {
  const [mounted, setMounted] = useState(false);
  const [categories, setCategories] = useState<{id: number, name: string}[]>([]);
  const [targetCategory, setTargetCategory] = useState<number>(originalCategoryId);

  useEffect(() => {
    setMounted(true);
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setCategories(data.categories);
        }
      });
  }, []);

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />

          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative bg-background border border-border/50 shadow-2xl w-full max-w-[500px] p-8 overflow-hidden rounded-md text-foreground font-sans text-center"
          >
            <button 
              onClick={onClose} 
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex justify-center mb-6 mt-2">
              <Copy className="w-12 h-12 text-foreground" strokeWidth={1.5} />
            </div>

            <h2 className="text-[22px] font-semibold tracking-wide mb-3">
              {title}
            </h2>
            <p className="text-[14px] text-muted-foreground font-light mb-8">
              Select the destination category for the duplicated product.
            </p>

            <div className="flex flex-col gap-2 text-left mb-8">
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Target Category</label>
              <select 
                value={targetCategory}
                onChange={(e) => setTargetCategory(parseInt(e.target.value))}
                className="w-full border border-border bg-background p-3 outline-none rounded-md"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => onConfirm(targetCategory)} 
                className="py-3 px-4 uppercase text-[13px] font-bold tracking-widest bg-foreground hover:bg-foreground/90 text-background transition-colors rounded-sm"
              >
                YES, DUPLICATE
              </button>
              <button 
                onClick={onClose} 
                className="py-3 px-4 uppercase text-[13px] font-bold tracking-widest bg-transparent border border-border text-foreground hover:bg-muted transition-colors rounded-sm"
              >
                CANCEL
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  if (!mounted) return null;
  return createPortal(modalContent, document.body);
}
