import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";

export async function requirePermission(permissionId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("adminToken")?.value;
  if (!token) return false;

  // Overview is implicitly accessible to all logged-in admins
  if (permissionId === 'overview') return true;

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'v3ry_s3cur3_s3cr3t');
    const { payload } = await jwtVerify(token, secret);
    
    if (!payload.sub) return false;

    // Fetch real-time permissions from DB in case token is stale or user was revoked
    const dbUser = await prisma.user.findUnique({ where: { id: parseInt(payload.sub as string) } });
    if (!dbUser) return false;

    if (dbUser.role === 'SUPERADMIN') return true;
    
    let perms: string[] = [];
    const rawPerms = (dbUser as any).permissions;
    if (typeof rawPerms === 'string') {
      try { perms = JSON.parse(rawPerms); } catch (e) {}
    } else if (Array.isArray(rawPerms)) {
      perms = rawPerms as string[];
    }
    
    return perms.includes(permissionId);
  } catch(e) {
    return false;
  }
}

export async function checkIsSuperAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("adminToken")?.value;
  if (!token) return false;

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'v3ry_s3cur3_s3cr3t');
    const { payload } = await jwtVerify(token, secret);
    
    if (!payload.sub) return false;

    const dbUser = await prisma.user.findUnique({ where: { id: parseInt(payload.sub as string) } });
    if (!dbUser) return false;

    return dbUser.role === 'SUPERADMIN';
  } catch(e) {
    return false;
  }
}
