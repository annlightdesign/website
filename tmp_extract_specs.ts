import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    select: { specifications: true }
  });

  const keys = new Set<string>();
  const values = new Set<string>();

  products.forEach(p => {
    if (p.specifications && typeof p.specifications === 'object') {
      const specs = p.specifications as Record<string, any>;
      for (const [k, v] of Object.entries(specs)) {
        keys.add(k);
        if (typeof v === 'string') {
          // split by comma if comma separated list
          if (v.includes(',')) {
             v.split(',').forEach(item => values.add(item.trim()));
          } else {
             values.add(v.trim());
          }
        }
      }
    }
  });

  console.log("=== ALL KEYS ===");
  console.log(Array.from(keys).join(" | "));

  console.log("\n=== ALL STRING VALUES ===");
  console.log(Array.from(values).join(" | "));
}

main().catch(console.error).finally(() => prisma.$disconnect());
