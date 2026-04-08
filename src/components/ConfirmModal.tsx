"use client";

import { X, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmStyle?: "danger" | "neutral";
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmStyle = "neutral"
}: ConfirmModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative bg-background border border-border/50 shadow-2xl w-full max-w-[500px] p-8 overflow-hidden rounded-md text-foreground font-sans text-center"
          >
            {/* Close Cross */}
            <button 
              onClick={onClose} 
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Warning Icon */}
            <div className="flex justify-center mb-6 mt-2">
              <AlertTriangle className={`w-12 h-12 ${confirmStyle === 'danger' ? 'text-red-500' : 'text-foreground'}`} strokeWidth={1.5} />
            </div>

            {/* Title & Message */}
            <h2 className="text-[22px] font-semibold tracking-wide mb-3">
              {title}
            </h2>
            <p className="text-[14px] text-muted-foreground font-light mb-8">
              {message}
            </p>

            {/* Buttons Layout */}
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={onConfirm} 
                className={`py-3 px-4 uppercase text-[13px] font-bold tracking-widest transition-colors rounded-sm ${
                  confirmStyle === 'danger'
                    ? 'bg-red-500 hover:bg-red-600 text-white shadow-md'
                    : 'bg-foreground hover:bg-foreground/90 text-background'
                }`}
              >
                {confirmText}
              </button>
              <button 
                onClick={onClose} 
                className="py-3 px-4 uppercase text-[13px] font-bold tracking-widest bg-transparent border border-border text-foreground hover:bg-muted transition-colors rounded-sm"
              >
                {cancelText}
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
