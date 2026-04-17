const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    where: {
      categoryId: { not: null }
    }
  });

  console.log(`Found ${products.length} products to migrate`);

  for (const product of products) {
    if (product.categoryId) {
      await prisma.product.update({
        where: { id: product.id },
        data: {
          categories: { connect: { id: product.categoryId } }
        }
      });
      console.log(`Migrated product ${product.id}`);
    }
  }

  console.log('Migration complete.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
