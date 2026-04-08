"use client";

import { Toaster } from 'sonner';

export default function ToasterWrapper() {
  return (
    <Toaster 
      position="bottom-right"
      toastOptions={{
        className: 'bg-background text-foreground border border-border/50 uppercase tracking-widest text-[11px] py-4 px-6 rounded-sm shadow-2xl font-medium',
        style: {
          background: 'hsl(var(--background))',
          color: 'hsl(var(--foreground))',
          border: '1px solid hsl(var(--border))'
        }
      }}
    />
  );
}
