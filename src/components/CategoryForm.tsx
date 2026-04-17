"use client";

import { useState, useEffect, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { toast } from 'sonner';

interface CategoryFormProps {
  existingCategory?: { id: number; name: string; nameHe?: string | null };
  trigger?: ReactNode;
}

export default function CategoryForm({ existingCategory, trigger }: CategoryFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState(existingCategory?.name || '');
  const [nameHe, setNameHe] = useState(existingCategory?.nameHe || '');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock background scrolling while modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const isEdit = !!existingCategory;
    const url = isEdit ? `/api/categories/${existingCategory.id}` : '/api/categories';
    const method = isEdit ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, nameHe })
    });

    if (res.ok) {
      toast.success(isEdit ? "Catalog updated!" : "Catalog created!");
      setIsOpen(false);
      if (!isEdit) {
        setName('');
        setNameHe('');
      }
      window.location.reload();
    } else {
      const errText = await res.text();
      toast.error(isEdit ? "Failed to update catalog" : "Failed to create catalog", { description: errText });
    }
    setLoading(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    if (!existingCategory) {
      setName('');
      setNameHe('');
    } else {
      setName(existingCategory.name);
      setNameHe(existingCategory.nameHe || '');
    }
  };

  return (
    <>
      <div onClick={() => setIsOpen(true)}>
        {trigger ? trigger : (
          <button className="bg-transparent border border-border text-foreground px-6 py-3 uppercase text-sm font-medium tracking-widest font-sans hover:bg-muted transition flex items-center gap-2">
            + Add Catalog
          </button>
        )}
      </div>

      {mounted && isOpen && createPortal(
        <div className="fixed inset-0 bg-background/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-background border border-border p-8 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
              <h2 className="text-xl font-medium uppercase tracking-widest font-sans">
                {existingCategory ? "Edit Catalog" : "New Catalog"}
              </h2>
              <button disabled={loading} onClick={handleClose}><X className="w-6 h-6 hover:text-muted-foreground" /></button>
            </div>

            <form onSubmit={submit} className="flex flex-col gap-5 text-sm">
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">Catalog Name (English)</label>
                <input required placeholder="e.g. Indoor Lighting" value={name} onChange={e => setName(e.target.value)} className="border border-border bg-background p-3 outline-none" autoFocus />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">Catalog Name (Hebrew)</label>
                <input placeholder="e.g. תאורת פנים" value={nameHe} onChange={e => setNameHe(e.target.value)} className="border border-border bg-background p-3 outline-none text-right" dir="auto" />
              </div>

              <button disabled={loading || !name.trim()} type="submit" className="bg-accent text-accent-foreground p-4 mt-2 uppercase font-medium tracking-widest w-full font-sans transition-opacity hover:opacity-90 disabled:opacity-50">
                {loading ? "Processing..." : (existingCategory ? "Save Changes" : "Create Catalog")}
              </button>
            </form>
          </div>
        </div>
      , document.body)}
    </>
  );
}
