import { PrismaClient } from '../generated/prisma-logger'

const globalForPrismaLogger = globalThis

const prismaLogger = globalForPrismaLogger.prismaLogger || new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrismaLogger.prismaLogger = prismaLogger
}

export default prismaLogger