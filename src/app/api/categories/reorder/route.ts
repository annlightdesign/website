import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { orderedIds } = body;

    if (!Array.isArray(orderedIds)) {
      return new NextResponse('orderedIds must be an array', { status: 400 });
    }

    // Execute queries in a transaction
    await prisma.$transaction(
      orderedIds.map((id: number, index: number) =>
        prisma.category.update({
          where: { id },
          data: { order: index },
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error reordering categories:', error);
    return new NextResponse(error.message || 'Internal Server Error', { status: 500 });
  }
}
