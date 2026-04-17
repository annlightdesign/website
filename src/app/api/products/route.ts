import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    // Server-side validation can be added here
    
    const product = await prisma.product.create({
      data: {
        title: data.title,
        titleHe: data.titleHe || null,
        description: data.description,
        images: data.images || [], 
        specifications: data.specifications || {}, 
        categories: {
          connect: data.categoryIds.map((id: string) => ({ id: parseInt(id) }))
        },
        brandId: data.brandId ? parseInt(data.brandId) : null,
      }
    });

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: { categories: true, brand: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }]
    });
    return NextResponse.json({ success: true, products });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error occurred' }, { status: 500 });
  }
}
