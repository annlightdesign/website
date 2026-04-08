"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, AlignJustify } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SortableProductsList from "@/components/SortableProductsList";
import { Product } from "@prisma/client";

interface AdminCategoryAccordionProps {
  title: string;
  count: number;
  products: Product[];
  defaultOpen?: boolean;
}

export default function AdminCategoryAccordion({
  title,
  count,
  products,
  defaultOpen = false,
}: AdminCategoryAccordionProps) {
  const storageKey = `annlight_admin_accordion_${title}`;
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved !== null) {
      setIsOpen(saved === "true");
    }
    setMounted(true);
  }, [storageKey]);

  const toggleAccordion = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    localStorage.setItem(storageKey, String(newState));
  };

  if (!mounted) {
    return (
      <div className="mb-4 bg-background border border-border/40 overflow-hidden shadow-sm h-[56px] flex items-center p-4">
        <div className="animate-pulse flex items-center gap-4 w-full">
          <div className="w-5 h-5 bg-muted rounded-sm" />
          <div className="h-4 bg-muted rounded-md w-48" />
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4 bg-background border border-border/40 overflow-hidden shadow-sm">
      {/* Header */}
      <div
        onClick={toggleAccordion}
        className="flex items-center justify-between p-4 bg-muted/20 hover:bg-muted/40 cursor-pointer transition-colors"
      >
        <div className="flex items-center gap-4 text-foreground/90">
          <AlignJustify className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
          <h2 className="text-[15px] font-medium tracking-wider uppercase">
            {title} <span className="text-muted-foreground text-xs ml-2 normal-case tracking-normal font-light">({count} item{count !== 1 ? 's' : ''})</span>
          </h2>
        </div>
        <div className="text-muted-foreground">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </div>

      {/* Collapsible Content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: "auto" },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="overflow-hidden bg-background"
          >
            <div className="p-4 border-t border-border/20">
              <SortableProductsList initialProducts={products} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
