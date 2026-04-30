"use client";

import { useState, useEffect, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Upload, X, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface CategoryFormProps {
  existingCategory?: { id: number; name: string; nameHe?: string | null; enabled?: boolean; image?: string | null; parentId?: number | null };
  trigger?: ReactNode;
  externalOpen?: boolean;
  onExternalClose?: () => void;
  parentId?: number | null;
}

export default function CategoryForm({ existingCategory, trigger, externalOpen, onExternalClose, parentId }: CategoryFormProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = externalOpen !== undefined ? externalOpen : internalIsOpen;
  const setIsOpen = (val: boolean) => {
    if (externalOpen === undefined) setInternalIsOpen(val);
    else if (!val && onExternalClose) onExternalClose();
  };
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState(existingCategory?.name || '');
  const [nameHe, setNameHe] = useState(existingCategory?.nameHe || '');
  const [enabled, setEnabled] = useState(existingCategory?.enabled ?? true);
  const [image, setImage] = useState<string | null>(existingCategory?.image || null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

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
      body: JSON.stringify({ name, nameHe, enabled, image, parentId: existingCategory ? existingCategory.parentId : parentId })
    });

    if (res.ok) {
      toast.success(isEdit ? "Category updated!" : "Category created!");
      setIsOpen(false);
      if (!isEdit) {
        setName('');
        setNameHe('');
        setEnabled(true);
        setImage(null);
      }
      window.location.reload();
    } else {
      const errText = await res.text();
      toast.error(isEdit ? "Failed to update category" : "Failed to create category", { description: errText });
    }
    setLoading(false);
  };

  const handleClose = () => {
    if (externalOpen !== undefined && onExternalClose) {
      onExternalClose();
    } else {
      setIsOpen(false);
    }
    if (!existingCategory) {
      setName('');
      setNameHe('');
      setImage(null);
    } else {
      setName(existingCategory.name);
      setNameHe(existingCategory.nameHe || '');
      setEnabled(existingCategory.enabled ?? true);
      setImage(existingCategory.image || null);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploadingImage(true);
    try {
      const data = new FormData();
      data.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: data });
      if (!res.ok) throw new Error(await res.text());
      const { url } = await res.json();
      setImage(url);
    } catch (err: any) {
      toast.error("Upload failed.", { description: err.message });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setUploadingImage(true);
      try {
        const data = new FormData();
        data.append('file', file);
        const res = await fetch('/api/upload', { method: 'POST', body: data });
        if (!res.ok) throw new Error(await res.text());
        const { url } = await res.json();
        setImage(url);
      } catch (err: any) {
        toast.error("Upload failed.", { description: err.message });
      } finally {
        setUploadingImage(false);
      }
    }
  };

  return (
    <>
      {trigger !== null && (
        <div onClick={() => setIsOpen(true)}>
          {trigger !== undefined ? trigger : (
            <button className="bg-transparent border border-border text-foreground px-6 py-3 uppercase text-sm font-medium tracking-widest font-sans hover:bg-muted transition flex items-center gap-2">
              + Add Category
            </button>
          )}
        </div>
      )}

      {mounted && isOpen && createPortal(
        <div className="fixed inset-0 bg-background/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-background border border-border p-8 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
              <h2 className="text-xl font-medium uppercase tracking-widest font-sans">
                {existingCategory ? "Edit Category" : "New Category"}
              </h2>
              <button disabled={loading} onClick={handleClose}><X className="w-6 h-6 hover:text-muted-foreground" /></button>
            </div>

            <form onSubmit={submit} className="flex flex-col gap-5 text-sm">
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">Category Name (English)</label>
                <input required placeholder="e.g. Indoor Lighting" value={name} onChange={e => setName(e.target.value)} className="border border-border bg-background p-3 outline-none" autoFocus />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">Category Name (Hebrew)</label>
                <input placeholder="e.g. תאורת פנים" value={nameHe} onChange={e => setNameHe(e.target.value)} className="border border-border bg-background p-3 outline-none text-right" dir="auto" />
              </div>

              <div className="flex items-center gap-2 mt-2">
                <input type="checkbox" id="enabled-checkbox" checked={enabled} onChange={e => setEnabled(e.target.checked)} className="w-4 h-4 cursor-pointer" />
                <label htmlFor="enabled-checkbox" className="text-xs uppercase tracking-widest font-semibold text-muted-foreground cursor-pointer">
                  Category Enabled (Visible in Catalog)
                </label>
              </div>

              <div className="flex flex-col gap-2 mt-2 border-t border-border pt-4">
                <label className="text-xs uppercase tracking-widest font-semibold text-muted-foreground flex justify-between">
                  <span>Cinematic Wallpaper</span>
                  {image && (
                     <button type="button" onClick={() => setImage(null)} className="text-red-500 hover:text-red-400 flex items-center gap-1">
                       <Trash2 className="w-3 h-3" /> Remove
                     </button>
                  )}
                </label>
                {image ? (
                  <div className="w-full aspect-[21/9] bg-muted relative rounded-sm overflow-hidden border border-border">
                    <img src={image} alt="Category Wallpaper" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <label 
                    className={`border p-6 flex flex-col items-center justify-center border-dashed transition-all duration-200 gap-3 cursor-pointer hover:bg-muted/5 ${isDragging ? 'border-foreground bg-muted/10' : 'border-border'}`}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                    onDrop={handleDrop}
                  >
                    <Upload className={`w-6 h-6 ${isDragging ? 'text-foreground' : 'text-muted-foreground'}`} />
                    <span className="text-muted-foreground font-semibold uppercase tracking-widest text-[10px] text-center">
                      {uploadingImage ? 'Uploading...' : (isDragging ? 'Drop Image Now' : 'Upload High-Res Wallpaper')}
                    </span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage || loading} className="hidden" />
                  </label>
                )}
              </div>

              <button disabled={loading || uploadingImage || !name.trim()} type="submit" className="bg-accent text-accent-foreground p-4 mt-2 uppercase font-medium tracking-widest w-full font-sans transition-opacity hover:opacity-90 disabled:opacity-50">
                {loading ? "Processing..." : (existingCategory ? "Save Changes" : "Create Category")}
              </button>
            </form>
          </div>
        </div>
      , document.body)}
    </>
  );
}
