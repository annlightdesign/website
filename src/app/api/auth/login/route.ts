import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'v3ry_s3cur3_s3cr3t');

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const userCount = await prisma.user.count();
    if (userCount === 0) {
      const hashedPassword = await bcrypt.hash('AnnLight2026', 10);
      await prisma.user.create({
        data: { 
          email: 'admin@annlights.com', 
          password: hashedPassword, 
          role: 'SUPERADMIN',
          permissions: JSON.stringify(['overview', 'leads', 'projects', 'products', 'settings', 'security', 'users'])
        },
      });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    const token = await new SignJWT({ 
      sub: user.id.toString(), 
      role: user.role,
      permissions: user.permissions
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .sign(SECRET);

    const response = NextResponse.json({ success: true });
    response.cookies.set('adminToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24,
      path: '/'
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error', stack: error.stack }, { status: 500 });
  }
}
