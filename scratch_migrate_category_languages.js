const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const categoryTranslations = {
  "שקועי תקרה": "Recessed Ceiling",
  "תאורה מגנטית": "Magnetic Lighting",
  "פרופילי תאורה": "Lighting Profiles",
  "מנורות תלייה": "Pendant Lights",
  "צמודי תקרה": "Ceiling Flush Mounts",
  "מנורת קיר": "Wall Lamps",
  "שקועי קיר": "Recessed Wall Lights",
  "פסי אמבטיה": "Bathroom Strips",
  "מראות מוארות": "Illuminated Mirrors",
  "גופי תאורה בייצור מיוחד": "Custom Lighting",
  "מנורות עמידה / שולחן": "Floor / Table Lamps",
  "גופי תאורה חוץ": "Outdoor Lighting",
  "ריהוט גן מואר": "Illuminated Garden Furniture",
  "מאווררי תקרה": "Ceiling Fans"
};

async function run() {
  const categories = await prisma.category.findMany();
  for (const cat of categories) {
    if (categoryTranslations[cat.name]) {
       await prisma.category.update({
         where: { id: cat.id },
         data: {
            name: categoryTranslations[cat.name],
            nameHe: cat.name
         }
       });
       console.log(`Updated ${cat.name} -> ${categoryTranslations[cat.name]}`);
    }
  }
}

run()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
