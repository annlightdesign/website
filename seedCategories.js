const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const names = [
    "שקועי תקרה",
    "צמודי תקרה",
    "תאורת פנים",
    "תאורת חוץ",
    "פסי צבירה",
    "פרופילים",
    "תאורת קיר",
    "תלויים"
  ];

  for (const name of names) {
    const existing = await prisma.category.findFirst({ where: { name }});
    if (!existing) {
       await prisma.category.create({ data: { name } });
    }
  }

  const all = await prisma.category.findMany();
  console.log(JSON.stringify(all, null, 2));
}
main().finally(() => prisma.$disconnect());
