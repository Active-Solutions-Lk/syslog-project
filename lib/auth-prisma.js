// ./lib/auth-prisma.js
import { PrismaClient } from '@/generated/auth-client';
// import dotenv from 'dotenv';

// // Load environment variables
// dotenv.config();

// Initialize Prisma client for authentication database
const authPrisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.AUTH_DATABASE_URL,
    },
    
  },
});

// Function to test database connection
async function testDatabaseConnection() {
  try {
    await authPrisma.$connect();
    console.log('Successfully connected to syslog_db MySQL database (auth-client)!');

    // Test query to verify table access
    const userCount = await authPrisma.users.count();
    console.log(`Found ${userCount} records in the users table.`);
  } catch (error) {
    console.error('Failed to connect to syslog_db MySQL database (auth-client):', error);
    throw error;
  } finally {
    // await authPrisma.$disconnect();
    console.log('ready for next request from API.');
  }
}

// Run the connection test (for debugging)
testDatabaseConnection().catch((error) => {
  console.error('Connection test failed:', error);
  process.exit(1); // Exit on failure (optional, for debugging)
});

export { authPrisma };