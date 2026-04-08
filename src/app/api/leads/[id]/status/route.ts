import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  try {
    const { isRead } = await request.json();
    
    await prisma.architectLead.update({
      where: { id: Number(id) },
      data: { isRead }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update lead status error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
