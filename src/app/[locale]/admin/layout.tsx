import AdminSidebar from "@/components/AdminSidebar";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  let unreadLeadsCount = 0;
  let unreadVisitsCount = 0;
  try {
    unreadLeadsCount = await prisma.architectLead.count({ where: { isRead: false } });
    unreadVisitsCount = await prisma.visitorLog.count({ where: { isRead: false } });
  } catch (e) { }

  const cookieStore = await cookies();
  const token = cookieStore.get("adminToken")?.value;
  let userRole = "ADMIN";
  let userPermissions: string[] = [];

  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'v3ry_s3cur3_s3cr3t');
      const { payload } = await jwtVerify(token, secret);
      
      if (payload.sub) {
        const dbUser = await prisma.user.findUnique({ where: { id: parseInt(payload.sub as string) } });
        if (dbUser) {
          userRole = dbUser.role;
          const rawPerms = (dbUser as any).permissions;
          if (rawPerms) {
            if (typeof rawPerms === 'string') {
              try { userPermissions = JSON.parse(rawPerms); } catch (e) {}
            } else if (Array.isArray(rawPerms)) {
              userPermissions = rawPerms as string[];
            }
          }
        }
      }
    } catch (e) {}
  }

  return (
    <div className="flex min-h-screen bg-background relative z-10 w-full pt-20">
      <AdminSidebar unreadLeadsCount={unreadLeadsCount} unreadVisitsCount={unreadVisitsCount} role={userRole} permissions={userPermissions} />
      <main className="flex-1 w-full relative overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
