"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Users, FileImage, FolderKanban, Settings, LogOut, Shield, Type, Activity } from "lucide-react";
import { useState } from "react";
import ConfirmModal from "@/components/ConfirmModal";

export default function AdminSidebar({ 
  unreadLeadsCount = 0,
  role = "ADMIN",
  permissions = []
}: { 
  unreadLeadsCount?: number;
  role?: string;
  permissions?: string[];
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [pendingRoute, setPendingRoute] = useState<string | null>(null);

  const menuItemsRaw = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard, perm: "overview" },
    { name: "Visitors", href: "/admin/visitors", icon: Activity, perm: "visitors" },
    { name: "Architect Leads", href: "/admin/leads", icon: Users, perm: "leads" },
    { name: "Projects", href: "/admin/projects", icon: FolderKanban, perm: "projects" },
    { name: "Products", href: "/admin/products", icon: FileImage, perm: "products" },
    { name: "Global Settings", href: "/admin/settings", icon: Settings, perm: "settings" },
    { name: "Users", href: "/admin/users", icon: Users, perm: "users" },
    { name: "Typography", href: "/admin/typography", icon: Type, perm: "typography" },
    { name: "Security", href: "/admin/security", icon: Shield, perm: "security" }
  ];

  const menuItems = menuItemsRaw.filter(item => 
    role === 'SUPERADMIN' || permissions.includes(item.perm) || item.perm === "overview" // Assume overview is always visible or check strictly
  );

  if (pathname.includes('/login')) return null;

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if ((window as any).hasUnsavedAdminChanges) {
      e.preventDefault();
      setPendingRoute(href);
    }
  };

  const confirmNavigation = () => {
    (window as any).hasUnsavedAdminChanges = false;
    if (pendingRoute) {
      router.push(pendingRoute);
    }
    setPendingRoute(null);
  };

  return (
    <>
    <aside className="w-64 h-screen border-r border-border/40 bg-background/50 backdrop-blur-md sticky top-0 flex flex-col justify-between hidden md:flex">
      <div>
        <div className="p-8 pb-10">
          <Link href="/admin">
            <h2 className="text-2xl font-light tracking-widest uppercase text-foreground hover:text-muted-foreground transition-colors">Admin<span className="font-bold">Hub</span></h2>
          </Link>
        </div>
        
        <nav className="flex flex-col gap-2 px-4">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/admin");
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.name} 
                href={item.href}
                onClick={(e) => handleLinkClick(e, item.href)}
                className={`flex items-center justify-between px-4 py-3 rounded-sm transition-all group ${
                  isActive 
                    ? (item.name === 'Security' ? "bg-red-500 text-white font-medium shadow-md" : "bg-foreground text-background font-medium shadow-md") 
                    : (item.name === 'Security' ? "text-red-500/70 hover:bg-red-500/10 hover:text-red-500" : "text-muted-foreground hover:bg-muted/30 hover:text-foreground")
                }`}
              >
                <div className="flex items-center gap-4">
                  <Icon className={`w-5 h-5 ${isActive ? "stroke-2" : "stroke-1 group-hover:scale-110 transition-transform"}`} />
                  <span className="tracking-wide text-sm">{item.name}</span>
                </div>
                {item.name === "Architect Leads" && unreadLeadsCount > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm animate-pulse">
                    {unreadLeadsCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-border/40">
         <Link 
            href="/"
            onClick={(e) => handleLinkClick(e, "/")}
            className="flex items-center gap-4 px-4 py-3 rounded-sm text-red-500/80 hover:bg-red-500/10 hover:text-red-500 transition-all group"
          >
            <LogOut className="w-5 h-5 stroke-1 group-hover:-translate-x-1 transition-transform" />
            <span className="tracking-wide text-sm uppercase">Exit Admin</span>
          </Link>
      </div>
    </aside>

    <ConfirmModal 
      isOpen={!!pendingRoute}
      onClose={() => setPendingRoute(null)}
      onConfirm={confirmNavigation}
      title="Discard Warning"
      message="You have unsaved text or changes in your active form. Are you absolutely sure you want to discard them and navigate away?"
      confirmText="Discard & Leave"
      confirmStyle="neutral"
    />
    </>
  );
}
