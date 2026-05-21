const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const projects = await prisma.project.findMany({
    take: 5,
    select: { images: true }
  });
  console.log('Projects:', JSON.stringify(projects, null, 2));

  const categories = await prisma.category.findMany({
    take: 5,
    select: { image: true }
  });
  console.log('Categories:', JSON.stringify(categories, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
