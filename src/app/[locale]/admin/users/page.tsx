"use client";

import { useEffect, useState } from "react";
import UserForm from "@/components/UserForm";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import ConfirmModal from "@/components/ConfirmModal";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/users');
    if (res.status === 403 || res.status === 401) {
      setAuthError(true);
      setLoading(false);
      return;
    }
    const data = await res.json();
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async () => {
    if (!deletingId) return;
    
    const res = await fetch(`/api/admin/users?id=${deletingId}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success("Admin access permanently revoked.");
      fetchUsers();
    } else {
      const err = await res.json();
      toast.error("Revocation failed", { description: err.error });
    }
    setDeletingId(null);
  };

  if (authError) {
    return (
      <div className="flex-1 p-16 h-full flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-bold tracking-widest uppercase text-red-500 mb-4">Classified Segment</h1>
        <p className="text-muted-foreground uppercase tracking-widest text-sm max-w-md">
          Your current security clearance does not permit access to the identity management systems. 
          Please contact the primary system administrator.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 md:p-16 h-full">
      <div className="max-w-6xl mx-auto space-y-10">
        
        <header className="flex justify-between items-end border-b border-border/40 pb-6">
          <div>
            <h1 className="text-3xl font-light tracking-widest uppercase mb-1">Access Protocol</h1>
            <p className="text-xs text-muted-foreground tracking-widest uppercase font-semibold">Admin Identity Management</p>
          </div>
          <UserForm onComplete={fetchUsers} />
        </header>

        {loading ? (
          <div className="animate-pulse bg-muted/20 h-64 border border-border/30"></div>
        ) : (
          <div className="pl-1">
            <div className="grid grid-cols-12 gap-4 uppercase tracking-widest text-[10px] font-bold text-muted-foreground mb-4 px-4">
              <div className="col-span-1">ID</div>
              <div className="col-span-4">Email Locator</div>
              <div className="col-span-2">Security Tier</div>
              <div className="col-span-4">Module Clearance</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>

            <div className="flex flex-col gap-2">
              {users.map(user => {
                const perms = typeof user.permissions === 'string' ? JSON.parse(user.permissions) : user.permissions;
                return (
                  <div key={user.id} className="grid grid-cols-12 gap-4 items-center bg-background border border-border/40 p-4 transition-all hover:border-foreground/30 shadow-sm">
                    <div className="col-span-1 text-xs text-muted-foreground">{user.id}</div>
                    <div className="col-span-4 text-sm font-medium">{user.email}</div>
                    <div className="col-span-2">
                      <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-1 ${user.role === 'SUPERADMIN' ? 'bg-red-500/10 text-red-500' : 'bg-muted text-muted-foreground'}`}>
                        {user.role}
                      </span>
                    </div>
                    <div className="col-span-4 flex flex-wrap gap-1">
                      {user.role === 'SUPERADMIN' ? (
                        <span className="text-[10px] bg-foreground text-background px-2 py-0.5 uppercase tracking-widest font-bold">Unrestricted</span>
                      ) : (
                        perms.length === 0 ? (
                          <span className="text-[10px] text-muted-foreground uppercase tracking-widest italic">None specified</span>
                        ) : (
                          perms.map((p: string) => (
                            <span key={p} className="text-[9px] bg-muted px-2 py-0.5 uppercase tracking-wider text-muted-foreground">{p}</span>
                          ))
                        )
                      )}
                    </div>
                    <div className="col-span-1 flex items-center justify-end gap-3">
                      {user.role === 'SUPERADMIN' ? (
                         <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold opacity-50">LOCKED</span>
                      ) : (
                         <>
                           <UserForm existingUser={user} onComplete={fetchUsers} />
                           <button onClick={() => setDeletingId(user.id)} className="text-muted-foreground hover:text-red-500 transition-colors">
                             <Trash2 className="w-4 h-4" />
                           </button>
                         </>
                      )}
                    </div>
                  </div>
                )
              })}
              {users.length === 0 && (
                <div className="text-center p-12 border border-border/30 bg-muted/10 text-muted-foreground text-xs uppercase tracking-widest">
                  No active personnel found.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <ConfirmModal 
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="Revoke Admin Access?"
        message="This action will permanently terminate this user's access to the management dashboard. You cannot undo this action."
        confirmText="Revoke Access"
        confirmStyle="danger"
      />
    </div>
  );
}
