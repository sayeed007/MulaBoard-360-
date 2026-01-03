/**
 * NextAuth.js Type Extensions
 *
 * Extends the default NextAuth types to include our custom user fields
 */

import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface User {
    id: string;
    email: string;
    name: string;
    role: 'employee' | 'admin';
    image?: string | null;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: 'employee' | 'admin';
      image?: string | null;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    email: string;
    name: string;
    role: 'employee' | 'admin';
  }
}
