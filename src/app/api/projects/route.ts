// @ts-nocheck
import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "v3ry_s3cur3_s3cr3t");

async function checkAuth(request: NextRequest) {
  const token = request.cookies.get('adminToken')?.value;
  if (!token) return false;
  try {
    await jwtVerify(token, JWT_SECRET);
    return true;
  } catch (err) {
    return false;
  }
}

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }]
    });
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!(await checkAuth(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();

    const maxOrderProj = await prisma.project.findFirst({
      orderBy: { order: 'desc' }
    });
    const maxOrder = maxOrderProj ? maxOrderProj.order : 0;

    const newProject = await prisma.project.create({
      // @ts-ignore
      data: {
        title: data.title,
        titleHe: data.titleHe || null,
        images: data.images || [],
        architect: data.architect || null,
        photographer: data.photographer || null,
        lightingConsultant: data.lightingConsultant || null,
        location: data.location || null,
        order: maxOrder + 1
      }
    });
    return NextResponse.json(newProject);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create project: ' + String(error) }, { status: 400 });
  }
}
