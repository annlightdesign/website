import { prisma } from '@/lib/prisma';
import AdminListActions from '@/components/AdminListActions';
import MarkReadButton from '@/components/MarkReadButton';
import AutoMarkRead from '@/components/AutoMarkRead';

export const dynamic = 'force-dynamic';
import { ArrowLeft } from 'lucide-react';

export default async function AdminLeadsPage() {
  let allArchitects: any[] = [];
  try {
    allArchitects = await prisma.architectLead.findMany({ orderBy: { createdAt: 'desc' } });
  } catch (e) {}

  return (
    <div className="p-10 max-w-5xl mx-auto space-y-10 pb-40">
      <AutoMarkRead />
      
      <div className="mb-10 flex items-center justify-between border-b border-border/40 pb-6">
        <h1 className="text-3xl font-medium tracking-widest uppercase font-sans">Architect Leads</h1>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {allArchitects.map(a => (
          <div key={a.id} className={`flex justify-between items-center p-5 border transition-colors ${!a.isRead ? 'border-red-500/50 bg-red-500/5 hover:bg-red-500/10' : 'border-border/40 bg-muted/10 hover:bg-muted/20'}`}>
            <div className="flex flex-col">
              <div className="flex items-center gap-3">
                <span className="font-medium text-lg">{a.name}</span>
                {!a.isRead && (
                  <span className="bg-red-500 text-white text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-sm animate-pulse">New</span>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                <a href={`tel:${a.phone}`} className="hover:text-foreground">{a.phone}</a>
                <span>|</span>
                <a href={`mailto:${a.email}`} className="hover:text-foreground">{a.email}</a>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-3">
               <span className="text-xs text-muted-foreground uppercase tracking-widest">{new Date(a.createdAt).toLocaleDateString()}</span>
               <div className="flex gap-4 mt-1">
                 <MarkReadButton id={a.id} />
                 <AdminListActions type="lead" id={a.id} />
               </div>
             </div>
          </div>
        ))}
        {allArchitects.length === 0 && (
          <div className="text-center p-10 text-muted-foreground uppercase tracking-widest text-sm border border-border/40 border-dashed">
            No leads found yet.
          </div>
        )}
      </div>

    </div>
  );
}
