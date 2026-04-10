const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const visitors = await prisma.visitorLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5
  });
  console.log(visitors.map(v => ({ id: v.id, isRead: v.isRead, ip: v.ip, path: v.path })));
}
main().catch(console.error).finally(() => prisma.$disconnect());
