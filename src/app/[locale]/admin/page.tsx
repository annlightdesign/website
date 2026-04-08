import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { LayoutDashboard, Users, FileImage, FolderKanban, Settings } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const allProductsCount = await prisma.product.count();
  const allProjectsCount = await prisma.project.count();
  
  let unreadLeadsCount = 0;
  try {
    unreadLeadsCount = await prisma.architectLead.count({ where: { isRead: false } });
  } catch (e) {}

  return (
    <div className="p-10 pt-10 max-w-5xl mx-auto min-h-screen pb-40">
      <div className="flex flex-col items-start gap-4 border-b border-border/40 pb-10 mb-16">
        <div className="flex items-center gap-4 text-foreground/80">
           <LayoutDashboard className="w-8 h-8 stroke-1" />
           <h1 className="text-4xl font-light tracking-widest uppercase font-sans">Admin Control Hub</h1>
        </div>
        <p className="text-muted-foreground font-light tracking-wide text-lg">Select a section to manage your website content.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Architect Leads Hub Button */}
        <Link href="/admin/leads" className="group flex flex-col p-10 border border-border/40 hover:border-foreground transition-all bg-muted/5 hover:bg-muted/20 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 text-muted-foreground/20 group-hover:scale-110 group-hover:text-foreground/10 transition-all duration-500">
             <Users className="w-32 h-32 stroke-1" />
           </div>
           <h2 className="text-2xl font-medium tracking-widest uppercase mb-4 relative z-10">Architect Leads</h2>
           <p className="text-muted-foreground font-light relative z-10">Manage database registrations</p>
           <div className="mt-8 relative z-10 flex gap-3">
             <span className={`${unreadLeadsCount > 0 ? 'bg-red-500 text-white animate-pulse' : 'bg-foreground text-background'} px-4 py-1.5 text-sm uppercase tracking-widest font-semibold transition-colors`}>
               {unreadLeadsCount > 0 ? `${unreadLeadsCount} Unread` : 'All Read'}
             </span>
           </div>
        </Link>
        
        {/* Projects Hub Button */}
        <Link href="/admin/projects" className="group flex flex-col p-10 border border-border/40 hover:border-foreground transition-all bg-muted/5 hover:bg-muted/20 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 text-muted-foreground/20 group-hover:scale-110 group-hover:text-foreground/10 transition-all duration-500">
             <FolderKanban className="w-32 h-32 stroke-1" />
           </div>
           <h2 className="text-2xl font-medium tracking-widest uppercase mb-4 relative z-10">Projects</h2>
           <p className="text-muted-foreground font-light relative z-10">Manage portfolio & architecture</p>
           <div className="mt-8 relative z-10">
             <span className="bg-foreground text-background px-4 py-1.5 text-sm uppercase tracking-widest font-semibold">{allProjectsCount} Items</span>
           </div>
        </Link>

        {/* Products Hub Button */}
        <Link href="/admin/products" className="group flex flex-col p-10 border border-border/40 hover:border-foreground transition-all bg-muted/5 hover:bg-muted/20 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 text-muted-foreground/20 group-hover:scale-110 group-hover:text-foreground/10 transition-all duration-500">
             <FileImage className="w-32 h-32 stroke-1" />
           </div>
           <h2 className="text-2xl font-medium tracking-widest uppercase mb-4 relative z-10">Products</h2>
           <p className="text-muted-foreground font-light relative z-10">Manage catalog inventory</p>
           <div className="mt-8 relative z-10">
             <span className="bg-foreground text-background px-4 py-1.5 text-sm uppercase tracking-widest font-semibold">{allProductsCount} Items</span>
           </div>
        </Link>

        {/* Settings Hub Button */}
        <Link href="/admin/settings" className="group flex flex-col p-10 border border-border/40 hover:border-foreground transition-all bg-muted/5 hover:bg-muted/20 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 text-muted-foreground/20 group-hover:scale-110 group-hover:text-foreground/10 transition-all duration-500">
             <Settings className="w-32 h-32 stroke-1" />
           </div>
           <h2 className="text-2xl font-medium tracking-widest uppercase mb-4 relative z-10">Global Settings</h2>
           <p className="text-muted-foreground font-light relative z-10">Manage typography & wallpapers</p>
        </Link>

      </div>
    </div>
  );
}
