import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { requirePermission, checkIsSuperAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  if (!(await requirePermission('users'))) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  
  const users = await (prisma.user as any).findMany({
    select: { id: true, email: true, role: true, permissions: true, createdAt: true }
  });
  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  if (!(await requirePermission('users'))) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  const { email, password, permissions, role } = await req.json();
  if (!email || !password) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  if (role === 'SUPERADMIN' && !(await checkIsSuperAdmin())) {
    return NextResponse.json({ error: 'Only SUPERADMINs can create SUPERADMINs' }, { status: 403 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return NextResponse.json({ error: 'Email already in use' }, { status: 400 });

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await (prisma.user as any).create({
    data: {
      email,
      password: hashedPassword,
      role: role === 'SUPERADMIN' ? 'SUPERADMIN' : 'ADMIN',
      permissions: JSON.stringify(permissions || [])
    }
  });

  return NextResponse.json({ success: true, user: { id: newUser.id, email: newUser.email } });
}

export async function PUT(req: NextRequest) {
  if (!(await requirePermission('users'))) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  const { id, password, permissions, role } = await req.json();
  if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

  if (role === 'SUPERADMIN' && !(await checkIsSuperAdmin())) {
    return NextResponse.json({ error: 'Only SUPERADMINs can assign SUPERADMINs' }, { status: 403 });
  }

  const updateData: any = {};
  if (password) updateData.password = await bcrypt.hash(password, 10);
  if (permissions) updateData.permissions = JSON.stringify(permissions);
  if (role) updateData.role = role === 'SUPERADMIN' ? 'SUPERADMIN' : 'ADMIN';

  const updatedUser = await (prisma.user as any).update({
    where: { id },
    data: updateData
  });

  return NextResponse.json({ success: true, user: { id: updatedUser.id } });
}

export async function DELETE(req: NextRequest) {
  if (!(await requirePermission('users'))) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const id = parseInt(searchParams.get('id') || '0');
  
  if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { id } });
  if (user?.role === 'SUPERADMIN') {
    return NextResponse.json({ error: 'Cannot delete SUPERADMIN' }, { status: 400 });
  }

  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
