/**
 * NextAuth configuration for authentication
 * Handles user login, registration, and session management
 * 
 * Uses Credentials provider with Supabase for user storage
 * Password verification done with bcrypt
 */

import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { supabaseAdmin } from './supabase';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Validate credentials exist
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials');
        }

        // Query user from Supabase database
        const { data: user, error } = await supabaseAdmin
          .from('users')
          .select('*')
          .eq('email', credentials.email)
          .single();

        if (error || !user) {
          throw new Error('Invalid email or password');
        }

        // Verify password hash using bcrypt
        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.password_hash
        );

        if (!isValidPassword) {
          throw new Error('Invalid email or password');
        }

        // Return user object for session
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    // Add user info to JWT token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    // Add user info to session (available client-side)
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};

/**
 * Register a new user
 * Creates a new user account with hashed password
 * 
 * @param name - User's full name
 * @param email - User's email address (must be unique)
 * @param password - User's password (will be hashed with bcrypt)
 * @returns User object or throws error
 */
export async function registerUser(
  name: string,
  email: string,
  password: string
) {
  // Hash password using bcrypt (10 rounds)
  const password_hash = await bcrypt.hash(password, 10);

  // Insert user into Supabase database
  const { data, error } = await supabaseAdmin
    .from('users')
    .insert([
      {
        name,
        email,
        password_hash,
        role: 'user', // Default role is 'user', can be upgraded to 'admin' in database
      },
    ])
    .select()
    .single();

  if (error) {
    // Check for duplicate email (PostgreSQL unique constraint error)
    if (error.code === '23505') {
      throw new Error('Email already exists');
    }
    throw new Error('Failed to create user');
  }

  return data;
}
