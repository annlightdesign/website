const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  try {
    const product = await prisma.product.create({
      data: {
        title: "Test Fast Upload Product",
        titleHe: "בדיקה",
        description: "Test description",
        images: ["http://res.cloudinary.com/dummy/image/upload/v1234.jpg"],
        specifications: { key: "value" },
        categories: {
          connect: [] 
        },
        brandId: null,
      }
    });
    console.log("Created successfully:", product.id);
    
    await prisma.product.delete({ where: { id: product.id } });
    console.log("Cleaned up");
  } catch (err) {
    console.error("Crash or error!", err);
  } finally {
    await prisma.$disconnect();
  }
}

run();
