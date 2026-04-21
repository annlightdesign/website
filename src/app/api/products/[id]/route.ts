import { NextRequest, NextResponse } from 'next/server';
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

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await checkAuth(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const { id } = await params;
    const productId = parseInt(id, 10);
    
    if (isNaN(productId)) {
      return NextResponse.json({ error: 'Invalid product ID format' }, { status: 400 });
    }
    
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        title: data.title,
        titleHe: data.titleHe !== undefined ? data.titleHe : null,
        description: data.description,
        images: data.images || [], 
        specifications: data.specifications || {}, 
        categories: {
          set: data.categoryIds.map((id: string) => ({ id: parseInt(id) }))
        },
        brandId: data.brandId ? parseInt(data.brandId) : null,
      }
    });

    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error occurred' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await checkAuth(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const productId = parseInt(id, 10);
    
    await prisma.product.delete({
      where: { id: productId }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product: ' + String(error) }, { status: 400 });
  }
}
