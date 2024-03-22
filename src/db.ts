import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma_global_instance =
  globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma_global_instance;

if (process.env.NODE_ENV !== 'production')
  globalThis.prismaGlobal = prisma_global_instance;
