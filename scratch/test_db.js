const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const cats = await prisma.category.findMany();
    console.log("Cats:", cats);
    const cat = await prisma.category.update({
      where: { id: cats[0].id },
      data: { enabled: false }
    });
    console.log("Updated:", cat);
  } catch (e) {
    console.error("ERROR:", e);
  } finally {
    await prisma.$disconnect();
  }
}
main();
