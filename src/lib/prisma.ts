import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Force Prisma to use 1 connection per instance to prevent serverless connection exhaustion on Aiven
const getDbUrl = () => {
  let url = process.env.DATABASE_URL || '';
  if (url && !url.includes('connection_limit')) {
    url = url.includes('?') ? `${url}&connection_limit=1` : `${url}?connection_limit=1`;
  }
  return url;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: getDbUrl()
    }
  }
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
