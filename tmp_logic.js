import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const id = '4';
  const product = await prisma.product.findUnique({
    where: { id: parseInt(id) },
    include: { category: true, brand: true }
  });

  if (!product) {
    console.log("NOT FOUND");
    return;
  }

  const images = (product.images as string[]) || [];
  const specifications = typeof product.specifications === 'string' 
    ? JSON.parse(product.specifications) 
    : (product.specifications || {});

  const specKeys = Object.keys(specifications);
  console.log("Success! Keys:", specKeys, "Images Length:", images.length);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("ERROR", e);
    await prisma.$disconnect();
    process.exit(1);
  });
