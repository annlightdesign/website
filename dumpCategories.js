const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const categories = await prisma.category.findMany();
  console.log("Categories in DB:", JSON.stringify(categories, null, 2));

  if (categories.length < 5) {
      console.log("Adding some default ones...");
      const names = ["שקועי תקרה", "צמודי תקרה", "תאורת חוץ", "פסי צבירה", "פרופילים", "תאורת קיר"];
      for (const name of names) {
          const exists = categories.find(c => c.name === name);
          if (!exists) {
              await prisma.category.create({ data: { name }});
          }
      }
      const allCategories = await prisma.category.findMany();
      console.log("Updated Categories:", JSON.stringify(allCategories, null, 2));
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
