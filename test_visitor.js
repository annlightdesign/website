const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.visitorLog.create({
    data: {
      ip: '127.0.0.1',
      path: '/test',
      isRead: false
    }
  });
}
main().catch(console.error).finally(() => prisma.$disconnect());
