import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// eslint-disable-next-line import/prefer-default-export
export const prisma = globalForPrisma.prisma
  || new PrismaClient({
    log: ['query'],
    errorFormat: 'minimal', // 👈 Add this line
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
