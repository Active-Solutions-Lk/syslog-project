// app/api/health/route.js
import  {authPrisma}  from '../../../lib/auth-prisma';

export async function GET() {
  try {
    await authPrisma.$connect(); // Optional, Prisma auto-connects on query
    const userCount = await authPrisma.users.count();
    return new Response(JSON.stringify({ message: 'Database connected (auth-client)', userCount }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Database connection failed (auth-client)', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  } // No $disconnect() here to keep pool active
}