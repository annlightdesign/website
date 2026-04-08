import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

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
          if (v.includes(',')) {
             v.split(',').forEach(item => values.add(item.trim()));
          } else {
             values.add(v.trim());
          }
        }
      }
    }
  });

  const output = "=== KEYS ===\n" + Array.from(keys).join("\n") + "\n\n=== VALUES ===\n" + Array.from(values).join("\n");
  fs.writeFileSync('tmp_specs2.txt', output, 'utf8');
}

main().catch(console.error).finally(() => prisma.$disconnect());
