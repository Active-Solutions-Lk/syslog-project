const { authPrisma } = require("../lib/auth-prisma");
const { syslogPrisma } = require("../lib/syslog-prisma");

async function testConnections() {
  try {
    await authPrisma.$connect();
    console.log("Connected to remote auth database successfully!");
    const users = await authPrisma.users.findMany();
    console.log("Users:", users);

    await syslogPrisma.$connect();
    console.log("Connected to local syslog database successfully!");
    const logs = await syslogPrisma.remote_logs.findMany({ take: 5 });
    console.log("Recent Logs:", logs);
  } catch (error) {
    console.error("Database connection error:", error);
  } finally {
    await authPrisma.$disconnect();
    await syslogPrisma.$disconnect();
  }
}

testConnections();