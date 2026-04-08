"use client";

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import ConfirmModal from '@/components/ConfirmModal';

export default function TypographyForm() {
  const [loading, setLoading] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  
  // States
  const [formData, setFormData] = useState({
    typography_enabled: 'true',
    typography_home: 'true',
    typography_catalog: 'true',
    typography_projects: 'true',
    typography_contact: 'true',
    typography_block_ctrl_a: 'true',
    typography_disable_scrollbar: 'false'
  });

  useEffect(() => {
    fetch('/api/settings').then(res => res.json()).then(data => {
      setFormData(prev => ({
        ...prev,
        typography_enabled: data.typography_enabled ?? 'true',
        typography_home: data.typography_home ?? 'true',
        typography_catalog: data.typography_catalog ?? 'true',
        typography_projects: data.typography_projects ?? 'true',
        typography_contact: data.typography_contact ?? 'true',
        typography_block_ctrl_a: data.typography_block_ctrl_a ?? 'true',
        typography_disable_scrollbar: data.typography_disable_scrollbar ?? 'false'
      }));
    });
  }, []);

  // Protect against accidental exits
  useEffect(() => {
    (window as any).hasUnsavedAdminChanges = isDirty;
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      (window as any).hasUnsavedAdminChanges = false;
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isDirty]);

  const handleAttemptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsConfirmOpen(true);
  };

  const confirmSubmit = async () => {
    setIsConfirmOpen(false);
    setLoading(true);
    const res = await fetch('/api/settings', {
      method: 'POST',
      body: JSON.stringify(formData)
    });
    if (res.ok) {
      setIsDirty(false);
      toast.success("Typography Settings Deployed", {
        description: "Text selection rules updated."
      });
    } else {
      toast.error("Deployment Failed");
    }
    setLoading(false);
  };

  return (
    <>
    <form onSubmit={handleAttemptSubmit} className="flex flex-col gap-8 flex-1">
      
      {/* Global Module toggle */}
      <div className="bg-foreground/5 border border-border/40 p-6 rounded-sm">
        <h4 className="text-foreground text-sm font-bold uppercase tracking-widest mb-1">Global Typography Guard</h4>
        <p className="text-muted-foreground text-xs font-light mb-6">Instantly enable or disable text selection/highlighting on headers universally.</p>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <label className="text-lg font-semibold tracking-wide text-foreground">Master System Engine</label>
            <span className="text-xs text-muted-foreground">If disabled, text highlighting is allowed on all pages.</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={formData.typography_enabled === 'true'} onChange={(e) => {setFormData({...formData, typography_enabled: e.target.checked ? 'true' : 'false'}); setIsDirty(true);}} className="sr-only peer" />
            <div className="w-14 h-7 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-500"></div>
          </label>
        </div>
      </div>

      <div className={`flex flex-col gap-8 transition-opacity duration-300 ${formData.typography_enabled === 'false' ? 'opacity-30 pointer-events-none blur-[1px]' : 'opacity-100'}`}>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Route Toggles */}
          <div className="w-full bg-muted/10 border border-border/40 p-6 flex flex-col gap-6">
            <h5 className="text-xs font-bold uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-2">Interaction Locking</h5>
            
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Block Select All (Ctrl+A / Cmd+A)</label>
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Prevents users from highlighting all text on the active page</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={formData.typography_block_ctrl_a === 'true'} onChange={(e) => {setFormData({...formData, typography_block_ctrl_a: e.target.checked ? 'true' : 'false'}); setIsDirty(true);}} className="sr-only peer" />
                <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Disable Browser Scroll Bar</label>
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Hides the default scrollbar globally for a cleaner layout</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={formData.typography_disable_scrollbar === 'true'} onChange={(e) => {setFormData({...formData, typography_disable_scrollbar: e.target.checked ? 'true' : 'false'}); setIsDirty(true);}} className="sr-only peer" />
                <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
              </label>
            </div>
            
            <h5 className="text-xs font-bold uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-2 mt-2">Enforce Policies On Routes</h5>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium uppercase tracking-widest">Homepage</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={formData.typography_home === 'true'} onChange={(e) => {setFormData({...formData, typography_home: e.target.checked ? 'true' : 'false'}); setIsDirty(true);}} className="sr-only peer" />
                <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium uppercase tracking-widest">Catalog</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={formData.typography_catalog === 'true'} onChange={(e) => {setFormData({...formData, typography_catalog: e.target.checked ? 'true' : 'false'}); setIsDirty(true);}} className="sr-only peer" />
                <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium uppercase tracking-widest">Projects</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={formData.typography_projects === 'true'} onChange={(e) => {setFormData({...formData, typography_projects: e.target.checked ? 'true' : 'false'}); setIsDirty(true);}} className="sr-only peer" />
                <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium uppercase tracking-widest">Contact Us</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={formData.typography_contact === 'true'} onChange={(e) => {setFormData({...formData, typography_contact: e.target.checked ? 'true' : 'false'}); setIsDirty(true);}} className="sr-only peer" />
                <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
              </label>
            </div>

          </div>
        </div>

        <div className="pt-4 border-t border-border mt-auto flex-shrink-0">
          <button disabled={loading} type="submit" className="bg-foreground text-background p-4 text-sm font-medium tracking-widest uppercase font-sans w-full transition-opacity hover:opacity-90 shadow-md">
            {loading ? "Deploying..." : "Update Typography Policies"}
          </button>
        </div>

      </div>

    </form>

    <ConfirmModal 
      isOpen={isConfirmOpen}
      onClose={() => setIsConfirmOpen(false)}
      onConfirm={confirmSubmit}
      title="Update Typography Settings?"
      message="Are you sure you want to deploy these text selection rules globally?"
      confirmText="Deploy Roles"
      confirmStyle="neutral"
    />
    </>
  );
}
