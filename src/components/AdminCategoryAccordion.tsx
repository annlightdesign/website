"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronUp, AlignJustify, MoreVertical } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SortableProductsList from "@/components/SortableProductsList";
import { Product } from "@prisma/client";
import CategoryForm from "@/components/CategoryForm";
import ConfirmModal from "@/components/ConfirmModal";
import { toast } from "sonner";

interface AdminCategoryAccordionProps {
  category?: { id: number; name: string; nameHe?: string | null };
  title: string;
  count: number;
  products: Product[];
  defaultOpen?: boolean;
}

export default function AdminCategoryAccordion({
  category,
  title,
  count,
  products,
  defaultOpen = false,
}: AdminCategoryAccordionProps) {
  const storageKey = `annlight_admin_accordion_${title}`;
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved !== null) {
      setIsOpen(saved === "true");
    }
    setMounted(true);
  }, [storageKey]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const toggleAccordion = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    localStorage.setItem(storageKey, String(newState));
  };

  const handleDelete = async () => {
    if (!category) return;
    setIsDeleting(true);
    
    const res = await fetch(`/api/categories/${category.id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      toast.success("Category deleted!");
      setIsConfirmOpen(false);
      window.location.reload();
    } else {
      const errText = await res.text();
      toast.error("Failed to delete category", { description: errText });
    }
    setIsDeleting(false);
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
    <div className={`mb-4 bg-background border border-border/40 shadow-sm relative ${isMenuOpen ? 'z-50' : 'z-10'}`}>
      {/* Header */}
      <div
        onClick={toggleAccordion}
        className="flex items-center justify-between p-4 bg-muted/20 hover:bg-muted/40 cursor-pointer transition-colors"
      >
        <div className="flex items-center gap-4 text-foreground/90">
          <AlignJustify className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
          <h2 className="text-[15px] font-medium tracking-wider uppercase flex items-center gap-2">
            <span>{category?.name || title}</span>
            {category?.nameHe && <span className="text-muted-foreground ml-1 dir-rtl opacity-75">/ {category.nameHe}</span>}
            <span className="text-muted-foreground text-xs ml-2 normal-case tracking-normal font-light">({count} item{count !== 1 ? 's' : ''})</span>
          </h2>
        </div>
        <div className="flex flex-row items-center gap-1">
          {category && (
             <div className="relative" ref={menuRef} onClick={(e) => e.stopPropagation()}>
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)} 
                  className="p-1.5 hover:bg-border/50 transition-colors mr-2 cursor-pointer text-muted-foreground focus:outline-none"
                  aria-label="Options"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
                <AnimatePresence>
                  {isMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -5, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -5, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-1 bg-background border border-border shadow-sm min-w-[140px] z-20 flex flex-col py-1"
                    >
                      <button 
                        className="w-full text-left px-4 py-2 hover:bg-muted text-[13px] font-medium tracking-wide uppercase transition-colors" 
                        onClick={() => {
                          setIsMenuOpen(false);
                          setIsEditModalOpen(true);
                        }}
                      >
                        Edit
                      </button>
                      <button 
                        className="w-full text-left px-4 py-2 hover:bg-red-500/10 text-red-500 text-[13px] font-medium tracking-wide uppercase transition-colors" 
                        onClick={() => { setIsConfirmOpen(true); setIsMenuOpen(false); }}
                      >
                        Delete
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
             </div>
             <CategoryForm 
                 existingCategory={category} 
                 trigger={null}
                 externalOpen={isEditModalOpen}
                 onExternalClose={() => setIsEditModalOpen(false)}
             />
          )}
          <div className="text-muted-foreground flex items-center justify-center p-1">
            {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
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
              <SortableProductsList initialProducts={products} categoryId={category?.id} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmModal 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Category?"
        message={`Are you sure you want to delete the category "${category?.name || title}"? This action cannot be undone. To prevent accidental data loss, you must first remove or reassign all products within this category before deleting it.`}
        confirmText={isDeleting ? "Deleting..." : "Delete Category"}
        confirmStyle="danger"
      />
    </div>
  );
}
