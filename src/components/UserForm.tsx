"use client";

import { useState, useEffect } from 'react';
import { X, Shield } from 'lucide-react';
import { toast } from 'sonner';
import ConfirmModal from '@/components/ConfirmModal';

const AVAILABLE_PERMISSIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'leads', label: 'Architect Leads' },
  { id: 'projects', label: 'Projects' },
  { id: 'products', label: 'Products' },
  { id: 'settings', label: 'Global Settings' },
  { id: 'typography', label: 'Typography Control' },
  { id: 'security', label: 'Security' },
  { id: 'users', label: 'Identity & Users' },
];

export default function UserForm({ existingUser, onComplete }: { existingUser?: any, onComplete: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  
  const [isSuperAdmin, setIsSuperAdmin] = useState(existingUser?.role === 'SUPERADMIN');
  const [formData, setFormData] = useState({
    email: existingUser?.email || '',
    password: '',
    permissions: (existingUser?.permissions ? 
      (typeof existingUser.permissions === 'string' ? JSON.parse(existingUser.permissions) : existingUser.permissions) 
      : []) as string[]
  });

  // Track global unsaved state
  useEffect(() => {
    (window as any).hasUnsavedAdminChanges = isDirty;
    return () => { (window as any).hasUnsavedAdminChanges = false; };
  }, [isDirty]);

  const togglePermission = (permId: string) => {
    setFormData(prev => {
      const perms = prev.permissions.includes(permId)
        ? prev.permissions.filter((p: string) => p !== permId)
        : [...prev.permissions, permId];
      return { ...prev, permissions: perms };
    });
    setIsDirty(true);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    if (!existingUser && !formData.password) {
      toast.error("Password is required for new accounts");
      setLoading(false);
      return;
    }

    const payload = {
      ...(existingUser && { id: existingUser.id }),
      email: formData.email,
      ...(formData.password && { password: formData.password }),
      permissions: formData.permissions,
      role: isSuperAdmin ? 'SUPERADMIN' : 'ADMIN'
    };

    const method = existingUser ? 'PUT' : 'POST';
    const res = await fetch('/api/admin/users', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      toast.success(`Admin Account ${existingUser ? 'Updated' : 'Provisioned'}!`);
      setIsDirty(false);
      setIsOpen(false);
      onComplete();
    } else {
      const err = await res.json();
      toast.error("Action failed", { description: err.error || "Unknown error" });
    }
    setLoading(false);
  };

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
      {existingUser ? (
        <button onClick={() => setIsOpen(true)} className="text-xs font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">
          Edit Policy
        </button>
      ) : (
        <button onClick={() => setIsOpen(true)} className="bg-transparent border border-border text-foreground px-6 py-3 uppercase text-sm font-medium tracking-widest font-sans hover:bg-muted transition flex items-center gap-2 shadow-sm">
          <Shield className="w-4 h-4" /> Provision Admin
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 bg-background/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-background border border-border/30 shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-border/30">
              <h2 className="text-lg font-medium uppercase tracking-widest font-sans">
                {existingUser ? 'Modify Access Policy' : 'Provision New Admin'}
              </h2>
              <button onClick={handleClose}><X className="w-5 h-5 hover:text-muted-foreground transition-colors" /></button>
            </div>

            <form onSubmit={submit} className="flex flex-col gap-6 p-8 text-sm">
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">Admin Link Email</label>
                <input 
                  required 
                  type="email"
                  disabled={!!existingUser}
                  placeholder="e.g. associate@annlights.com" 
                  value={formData.email} 
                  onChange={e=>{setFormData({...formData, email: e.target.value}); setIsDirty(true);}} 
                  className="border border-border/30 bg-muted/20 p-3 outline-none focus:border-foreground transition-colors disabled:opacity-50" 
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-widest font-semibold text-muted-foreground flex justify-between">
                  <span>Security Password</span>
                  {existingUser && <span className="text-[10px] text-muted-foreground/70">Leave blank to keep existing</span>}
                </label>
                <input 
                  type="password"
                  required={!existingUser}
                  placeholder="********" 
                  value={formData.password} 
                  onChange={e=>{setFormData({...formData, password: e.target.value}); setIsDirty(true);}} 
                  className="border border-border/30 bg-muted/20 p-3 outline-none focus:border-foreground transition-colors" 
                />
              </div>

              <div className="border border-border/30 p-6 mt-2 relative">
                <div className="absolute -top-3 left-4 bg-background px-2 text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
                  Module Clearances
                </div>
                
                <div className="mb-6 pb-6 border-b border-border/30">
                  <label className="flex items-center justify-between cursor-pointer group">
                    <div className="flex flex-col">
                      <span className="text-xs uppercase tracking-widest font-bold text-red-500 transition-colors">
                        Grant SUPERADMIN Privileges
                      </span>
                      <span className="text-[10px] text-muted-foreground uppercase mt-1 opacity-80">Full unrestricted access</span>
                    </div>
                    
                    <label className="relative flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={isSuperAdmin} 
                        onChange={(e) => { setIsSuperAdmin(e.target.checked); setIsDirty(true); }}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-[110%] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-500 shadow-inner"></div>
                    </label>
                  </label>
                </div>
                
                <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                  {AVAILABLE_PERMISSIONS.map(pm => (
                    <label key={pm.id} className={`flex items-center justify-between cursor-pointer group ${isSuperAdmin ? 'opacity-30 pointer-events-none' : ''}`}>
                      <span className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground transition-colors group-hover:text-foreground">
                        {pm.label}
                      </span>
                      
                      <label className="relative flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={formData.permissions.includes(pm.id) || isSuperAdmin} 
                          onChange={() => togglePermission(pm.id)}
                          className="sr-only peer"
                          disabled={isSuperAdmin}
                        />
                        <div className="w-9 h-5 bg-muted/60 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-[110%] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500 shadow-inner"></div>
                      </label>
                    </label>
                  ))}
                </div>
              </div>

              <button disabled={loading} type="submit" className="bg-foreground text-background p-4 mt-2 uppercase font-medium tracking-widest w-full font-sans transition-all hover:bg-foreground/90 disabled:opacity-50 shadow-sm">
                {loading ? "Processing..." : (existingUser ? "Update Policies" : "Deploy Admin Credentials")}
              </button>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmExit}
        title="Discard Credentials?"
        message="You have unsaved access policies. Are you sure you want to discard them and exit?"
        confirmText="Discard"
        confirmStyle="neutral"
      />
    </>
  );
}
