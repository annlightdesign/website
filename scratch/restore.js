const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  await prisma.product.update({
    where: { id: 9 },
    data: {
      categories: {
        set: [{ id: 14 }]
      }
    }
  });
  console.log("Moved ANN Eclipse 30W back to Recessed Wall Lights (14)");
}

run().finally(() => prisma.$disconnect());
