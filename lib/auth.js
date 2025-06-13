// lib/auth.js
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { authPrisma } from './auth-prisma';
import bcrypt from 'bcryptjs';

const auth = betterAuth({
  database: prismaAdapter(authPrisma, {
    provider: 'mysql',
    modelNames: {
      user: 'users',
      session: 'session',
    },
    fieldNames: {
      user: {
        id: 'id',
        email: 'email',
        name: 'user_name',
        password: 'password',
      },
    },
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    password: {
      hash: {
        type: 'bcrypt',
        async hash(password) {
          try {
            const saltRounds = 10;
            const hash = await bcrypt.hash(password, saltRounds);
            console.log('Password hashed successfully:', hash);
            return hash;
          } catch (error) {
            console.error('Password hashing error:', error);
            throw error;
          }
        },
      },
      verify: async (user, password) => {
        console.log('Verify called with:', { userId: user?.id, email: user?.email });
        if (!user) throw new Error('User not found');
        if (!password) throw new Error('Password is required');
        if (!user.password || !user.password.startsWith('$2a$')) {
          console.log('Invalid password hash for user:', user.email);
          throw new Error('Invalid password hash');
        }
        try {
          const isValid = await bcrypt.compare(password, user.password);
          console.log('Password verification result:', isValid);
          if (!isValid) throw new Error('Invalid password');
          return true;
        } catch (error) {
          console.error('Password verification error:', error);
          throw error;
        }
      },
    },
  },
  session: {
    expiresIn: (data) => {
      console.log('Session expiresIn:', data);
      return data.rememberMe ? 7 * 24 * 60 * 60 : 60 * 60; // 7 days or 1 hour
    },
  },
  secret: process.env.BETTER_AUTH_SECRET,
});

export { auth };