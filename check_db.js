const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const settings = await prisma.siteSetting.findMany({
    where: { key: { startsWith: 'homepage_wallpaper' } }
  });
  console.log(settings);
}
main();
