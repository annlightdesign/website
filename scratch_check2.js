const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const visitors = await prisma.visitorLog.findMany();
  console.log(`Total: ${visitors.length}`);
  console.log(`Unread: ${visitors.filter(v => !v.isRead).length}`);
  console.log(`Read: ${visitors.filter(v => v.isRead).length}`);
}
main().catch(console.error).finally(() => prisma.$disconnect());
