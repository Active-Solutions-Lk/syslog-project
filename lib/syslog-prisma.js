const { PrismaClient } = require("../generated/syslog-client");

const globalForSyslogPrisma = global;

const syslogPrisma =
  globalForSyslogPrisma.syslogPrisma ||
  new PrismaClient({
    log: ["query", "info", "warn", "error"],
  });

if (process.env.NODE_ENV !== "production") globalForSyslogPrisma.syslogPrisma = syslogPrisma;

module.exports = { syslogPrisma };