"use client";

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Upload, X } from 'lucide-react';
import { toast } from 'sonner';

import SortableImageList from '@/components/SortableImageList';
import ConfirmModal from '@/components/ConfirmModal';

export default function ProjectForm({ existingProject }: { existingProject?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [formData, setFormData] = useState({
    title: existingProject?.title || '',
    titleHe: existingProject?.titleHe || '',
    images: (existingProject?.images as string[]) || [],
    architect: existingProject?.architect || '',
    photographer: existingProject?.photographer || '',
    lightingConsultant: existingProject?.lightingConsultant || '',
    location: existingProject?.location || ''
  });

  // Track global unsaved state
  useEffect(() => {
    setMounted(true);
    (window as any).hasUnsavedAdminChanges = isDirty;
    return () => { (window as any).hasUnsavedAdminChanges = false; };
  }, [isDirty]);

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

  const processFiles = async (filesArray: File[]) => {
    if (filesArray.length === 0) return;
    setLoading(true);
    
    try {
      const uploadPromises = filesArray.map(async (file) => {
        const data = new FormData();
        data.append('file', file);
        const res = await fetch('/api/upload', { method: 'POST', body: data });
        const { url } = await res.json();
        return url;
      });
      
      const results = await Promise.all(uploadPromises);
      const validUrls = results.filter(url => typeof url === 'string');
      
      if (validUrls.length > 0) {
        setFormData(prev => ({ ...prev, images: [...prev.images, ...validUrls] }));
        setIsDirty(true);
      }
    } catch (err) {
      toast.error("Upload failed.", { description: "Ensure Cloudinary is configured." });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(Array.from(e.target.files));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const isEdit = !!existingProject;
    const url = isEdit ? `/api/projects/${existingProject.id}` : '/api/projects';
    const method = isEdit ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (res.ok) {
      toast.success("Project published!");
      setIsDirty(false);
      setIsOpen(false);
      window.location.reload();
    } else {
      const errText = await res.text();
      toast.error("Publish failed", { description: errText });
    }
    setLoading(false);
  }

  const handleClose = () => {
    if (isDirty) {
      setIsConfirmOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  const confirmExit = () => {
    setIsConfirmOpen(false);
    setIsDirty(false);
    setIsOpen(false);
  };

  return (
    <>
      {existingProject ? (
        <button onClick={() => setIsOpen(true)} className="text-xs font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground">
          Edit
        </button>
      ) : (
        <button onClick={() => setIsOpen(true)} className="bg-transparent border border-border text-foreground px-6 py-3 uppercase text-sm font-medium tracking-widest font-sans hover:bg-muted transition flex items-center gap-2">
          + Compile Project
        </button>
      )}

      {mounted && isOpen && createPortal(
        <div className="fixed inset-0 bg-background/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-background border border-border p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
              <h2 className="text-xl font-medium uppercase tracking-widest font-sans">New Project</h2>
              <button onClick={handleClose}><X className="w-6 h-6 hover:text-muted-foreground" /></button>
            </div>

            <form onSubmit={submit} className="flex flex-col gap-5 text-sm">
              <input required placeholder="Project Title" value={formData.title} onChange={e=>{setFormData({...formData, title: e.target.value}); setIsDirty(true);}} className="border p-3 outline-none" />

              
              <label 
                className={`border p-6 min-h-[180px] flex flex-col items-center justify-center border-dashed transition-all duration-200 gap-4 cursor-pointer hover:bg-muted/5 ${isDragging ? 'border-foreground bg-muted/10' : 'border-border'}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Upload className={`w-8 h-8 ${isDragging ? 'text-foreground' : 'text-muted-foreground'}`} />
                <span className="text-muted-foreground font-semibold uppercase tracking-widest text-xs text-center border-b border-transparent hover:border-muted-foreground transition-colors pb-1">
                  {isDragging ? 'Drop Photos Now' : 'Drag & Drop or Click to Browse'}
                </span>
                <input type="file" multiple onChange={handleImageUpload} disabled={loading} className="hidden" />
              </label>
              
              <div className="my-2">
                <SortableImageList 
                  images={formData.images} 
                  onChange={(newImages) => { setFormData(prev => ({ ...prev, images: newImages })); setIsDirty(true); }} 
                />
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-border pt-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">Architect</label>
                  <input placeholder="e.g. John Doe Architects" value={formData.architect} onChange={e=>{setFormData({...formData, architect: e.target.value}); setIsDirty(true);}} className="border p-3 outline-none" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">Photographer</label>
                  <input placeholder="e.g. Jane Smith Photography" value={formData.photographer} onChange={e=>{setFormData({...formData, photographer: e.target.value}); setIsDirty(true);}} className="border p-3 outline-none" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">Lighting Consultant</label>
                  <input placeholder="e.g. Ann Light" value={formData.lightingConsultant} onChange={e=>{setFormData({...formData, lightingConsultant: e.target.value}); setIsDirty(true);}} className="border p-3 outline-none" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">Location</label>
                  <input placeholder="e.g. Tel Aviv, Israel" value={formData.location} onChange={e=>{setFormData({...formData, location: e.target.value}); setIsDirty(true);}} className="border p-3 outline-none" />
                </div>
              </div>

              <button disabled={loading} type="submit" className="bg-accent text-accent-foreground p-4 mt-2 uppercase font-medium tracking-widest w-full font-sans transition-opacity hover:opacity-90">
                {loading ? "Processing..." : "Publish Project"}
              </button>
            </form>
          </div>
        </div>
      , document.body)}

      {mounted && createPortal(
        <ConfirmModal 
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={confirmExit}
          title="Discard Changes?"
          message="You have unsaved data in your form. Are you sure you want to discard these details and exit?"
          confirmText="Discard"
          confirmStyle="neutral"
        />,
        document.body
      )}
    </>
  );
}
