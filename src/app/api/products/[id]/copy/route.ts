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

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await checkAuth(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const productId = parseInt(id, 10);
    
    let targetCategoryId: number | undefined;
    try {
      const data = await request.json();
      if (data.targetCategoryId) {
        targetCategoryId = parseInt(data.targetCategoryId, 10);
      }
    } catch (e) {
      // Body is optional
    }
    
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Determine the new title
    let newTitle = existingProduct.title + " - Copy";

    const newProduct = await prisma.product.create({
      data: {
        title: newTitle,
        titleHe: existingProduct.titleHe ? existingProduct.titleHe + " - Copy" : null,
        description: existingProduct.description,
        images: existingProduct.images as any,
        specifications: existingProduct.specifications as any,
        categoryId: targetCategoryId || existingProduct.categoryId,
        brandId: existingProduct.brandId
      }
    });

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error occurred' }, { status: 500 });
  }
}
