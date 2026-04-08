import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const categories = await prisma.category.findMany();
  console.log("Categories:", categories.map(c => ({ id: c.id, name: c.name })));

  const productsInProfile = await prisma.product.findMany({
    where: { category: { name: { contains: "פרופילי" } } },
    select: { id: true, title: true, titleHe: true, createdAt: true, categoryId: true }
  });
  console.log("Products in Profile category:", productsInProfile);
  
  const productsInMagnetic = await prisma.product.findMany({
    where: { category: { name: { contains: "מגנטית" } } },
    select: { id: true, title: true, titleHe: true, createdAt: true, categoryId: true }
  });
  console.log("Products in Magnetic category:", productsInMagnetic);
}

main().catch(console.error).finally(() => prisma.$disconnect());
