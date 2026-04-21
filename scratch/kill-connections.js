const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function killConnections() {
  try {
    console.log("Attempting to kill idle/zombie connections...");
    const result = await prisma.$executeRawUnsafe(`
      SELECT pg_terminate_backend(pid) 
      FROM pg_stat_activity 
      WHERE usename = 'avnadmin' 
        AND pid <> pg_backend_pid();
    `);
    console.log("Terminated connections successfully.");
  } catch (err) {
    console.error("Error terminating connections:", err);
  } finally {
    await prisma.$disconnect();
  }
}

killConnections();
