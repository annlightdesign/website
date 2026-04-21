const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function main() {
  try {
    const products = await prisma.product.findMany({ take: 1 });
    console.log("Success:", products.length);
    
    // Simulate updating
    if (products.length > 0) {
       console.log("Updating product " + products[0].id);
       await prisma.product.update({
         where: { id: products[0].id },
         data: { order: products[0].order }
       });
       console.log("Success update");
    }
    
    // Simulate multiple concurrent operations
    console.log("Starting concurrent operations...");
    const promises = [];
    for (let i=0; i<10; i++) {
      promises.push(
        prisma.product.findFirst()
      );
    }
    await Promise.all(promises);
    console.log("Concurrent success");

  } catch (err) {
    console.error("Prisma error:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
