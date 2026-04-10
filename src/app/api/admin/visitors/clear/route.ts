import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('adminToken')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'v3ry_s3cur3_s3cr3t');
    try {
      await jwtVerify(token, secret);
    } catch (e) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Clear all visitors
    await prisma.visitorLog.deleteMany({});

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error clearing visitors:', error);
    return NextResponse.json({ error: 'Failed to clear visitors' }, { status: 500 });
  }
}
