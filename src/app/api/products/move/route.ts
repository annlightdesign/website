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

export async function PATCH(req: NextRequest) {
  if (!(await checkAuth(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { productId, oldCategoryId, newCategoryId, newOrderIndex } = await req.json();

    if (!productId || newCategoryId === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Move the product: Ensure it only belongs to the new category.
    // The user explicitly requested that when moving to a collection, it shouldn't stay in the parent category.
    // Using `set` clears all existing relationships and assigns it exclusively to the new one.
    if (newCategoryId) {
      await prisma.product.update({
        where: { id: productId },
        data: {
          categories: {
            set: [{ id: newCategoryId }],
          }
        }
      });
    } else {
      // If moving to uncategorized
      await prisma.product.update({
        where: { id: productId },
        data: {
          categories: {
            set: [],
          }
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error occurred' }, { status: 500 });
  }
}
