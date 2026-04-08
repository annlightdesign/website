import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const allCategories = await prisma.category.findMany();
  
  const fromName = "פרופילי תאורה";
  const toName = "תאורה מגנטית";

  const fromCat = allCategories.find(c => c.name.includes(fromName));
  const toCat = allCategories.find(c => c.name.includes(toName));

  if (!fromCat) {
    console.error(`Could not find source category matching: ${fromName}`);
    console.log("Available categories:", allCategories.map(c => c.name));
    return;
  }
  if (!toCat) {
    console.error(`Could not find destination category matching: ${toName}`);
    console.log("Available categories:", allCategories.map(c => c.name));
    return;
  }

  // Find products in fromCat
  const productsToMove = await prisma.product.findMany({
    where: { categoryId: fromCat.id }
  });

  if (productsToMove.length === 0) {
    console.log(`No products found in ${fromCat.name}`);
    return;
  }

  console.log(`Moving ${productsToMove.length} products from "${fromCat.name}" to "${toCat.name}":`);
  productsToMove.forEach(p => console.log(`- ${p.title} / ${p.titleHe}`));

  // Update them
  const result = await prisma.product.updateMany({
    where: { categoryId: fromCat.id },
    data: { categoryId: toCat.id }
  });

  console.log(`Successfully updated ${result.count} products!`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
