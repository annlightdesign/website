"use client";

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import ConfirmModal from '@/components/ConfirmModal';

export default function SecurityForm() {
  const [loading, setLoading] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  
  // States
  const [formData, setFormData] = useState({
    anti_theft_enabled: 'true',
    anti_theft_right_click: 'true',
    anti_theft_f12: 'true',
    anti_theft_home_enabled: 'true',
    anti_theft_catalog_enabled: 'true',
    anti_theft_projects_enabled: 'true',
    anti_theft_contact_enabled: 'false' // Contact page might need copying email/number etc.
  });

  useEffect(() => {
    fetch('/api/settings').then(res => res.json()).then(data => {
      setFormData(prev => ({
        ...prev,
        anti_theft_enabled: data.anti_theft_enabled ?? 'true',
        anti_theft_right_click: data.anti_theft_right_click ?? 'true',
        anti_theft_f12: data.anti_theft_f12 ?? 'true',
        anti_theft_home_enabled: data.anti_theft_home_enabled ?? 'true',
        anti_theft_catalog_enabled: data.anti_theft_catalog_enabled ?? 'true',
        anti_theft_projects_enabled: data.anti_theft_projects_enabled ?? 'true',
        anti_theft_contact_enabled: data.anti_theft_contact_enabled ?? 'false'
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
      toast.success("Security Policies Enforced", {
        description: "Target locked."
      });
    } else {
      toast.error("Encryption Failed");
    }
    setLoading(false);
  };

  return (
    <>
    <form onSubmit={handleAttemptSubmit} className="flex flex-col gap-8 flex-1">
      
      {/* Global Module toggle */}
      <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-sm">
        <h4 className="text-red-500 text-sm font-bold uppercase tracking-widest mb-1">Anti-Theft Protocol</h4>
        <p className="text-red-500/80 text-xs font-light mb-6">Instantly lock down the website to prevent unauthorized asset downloading or code inspection.</p>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <label className="text-lg font-semibold tracking-wide text-foreground">Master System Engine</label>
            <span className="text-xs text-muted-foreground">If disabled, the security module is shut off completely everywhere.</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={formData.anti_theft_enabled === 'true'} onChange={(e) => {setFormData({...formData, anti_theft_enabled: e.target.checked ? 'true' : 'false'}); setIsDirty(true);}} className="sr-only peer" />
            <div className="w-14 h-7 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-background after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-foreground after:border-border after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-red-500"></div>
          </label>
        </div>
      </div>

      <div className={`flex flex-col gap-8 transition-opacity duration-300 ${formData.anti_theft_enabled === 'false' ? 'opacity-30 pointer-events-none blur-[1px]' : 'opacity-100'}`}>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Hardware Locking */}
          <div className="w-full md:w-1/2 bg-muted/10 border border-border/40 p-6 flex flex-col gap-6">
            <h5 className="text-xs font-bold uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-2">Interaction Locking</h5>
            
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Block Right Click Context Menu</label>
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Prevents "Save Image As..."</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={formData.anti_theft_right_click === 'true'} onChange={(e) => {setFormData({...formData, anti_theft_right_click: e.target.checked ? 'true' : 'false'}); setIsDirty(true);}} className="sr-only peer" />
                <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-500"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Block DevTools & Hotkeys</label>
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Disables F12, Element Inspector, View Source</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={formData.anti_theft_f12 === 'true'} onChange={(e) => {setFormData({...formData, anti_theft_f12: e.target.checked ? 'true' : 'false'}); setIsDirty(true);}} className="sr-only peer" />
                <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-500"></div>
              </label>
            </div>
          </div>

          {/* Route Toggles */}
          <div className="w-full md:w-1/2 bg-muted/10 border border-border/40 p-6 flex flex-col gap-6">
            <h5 className="text-xs font-bold uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-2">Enforce Policies On Routes</h5>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium uppercase tracking-widest">Homepage</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={formData.anti_theft_home_enabled === 'true'} onChange={(e) => {setFormData({...formData, anti_theft_home_enabled: e.target.checked ? 'true' : 'false'}); setIsDirty(true);}} className="sr-only peer" />
                <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium uppercase tracking-widest">Catalog</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={formData.anti_theft_catalog_enabled === 'true'} onChange={(e) => {setFormData({...formData, anti_theft_catalog_enabled: e.target.checked ? 'true' : 'false'}); setIsDirty(true);}} className="sr-only peer" />
                <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium uppercase tracking-widest">Projects</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={formData.anti_theft_projects_enabled === 'true'} onChange={(e) => {setFormData({...formData, anti_theft_projects_enabled: e.target.checked ? 'true' : 'false'}); setIsDirty(true);}} className="sr-only peer" />
                <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium uppercase tracking-widest">Contact Us</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={formData.anti_theft_contact_enabled === 'true'} onChange={(e) => {setFormData({...formData, anti_theft_contact_enabled: e.target.checked ? 'true' : 'false'}); setIsDirty(true);}} className="sr-only peer" />
                <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-500"></div>
              </label>
            </div>

          </div>
        </div>

        <div className="pt-4 border-t border-border mt-auto flex-shrink-0">
          <button disabled={loading} type="submit" className="bg-red-500 text-white p-4 text-sm font-medium tracking-widest uppercase font-sans w-full transition-opacity hover:opacity-90 shadow-md">
            {loading ? "Locking..." : "Enforce Security Policies"}
          </button>
        </div>

      </div>

    </form>

    <ConfirmModal 
      isOpen={isConfirmOpen}
      onClose={() => setIsConfirmOpen(false)}
      onConfirm={confirmSubmit}
      title="Enforce Security Policies?"
      message="Adjusting the Anti-Theft Protocol can instantly lock out users or yourself from specific flows. Are you absolutely sure these routes are properly configured?"
      confirmText="Deploy Locks"
      confirmStyle="danger"
    />
    </>
  );
}
