import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { loginSchema } from '@/validators/user';
import connectDB from '@/lib/db/connect';
import User from '@/lib/db/models/User';

/**
 * NextAuth.js v5 Instance
 *
 * This exports the auth handlers and helper functions
 * for authentication throughout the application.
 *
 * This full instance includes Node.js-specific providers (like Mongoose).
 * For the Edge-compatible version used in Middleware, refer to auth.config.ts.
 */

export const { auth, signIn, signOut, handlers } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },

            async authorize(credentials) {
                try {
                    // Validate input
                    const validatedFields = loginSchema.safeParse(credentials);

                    if (!validatedFields.success) {
                        console.error('Invalid credentials format');
                        return null;
                    }

                    const { email, password } = validatedFields.data;

                    // Connect to database
                    await connectDB();

                    // Find user and explicitly include password field
                    const user = await User.findOne({ email }).select('+password');

                    if (!user) {
                        console.error('User not found');
                        return null;
                    }

                    // Check if profile is active
                    if (!user.isProfileActive) {
                        console.error('User profile is inactive');
                        return null;
                    }

                    // Compare password
                    const isPasswordValid = await user.comparePassword(password);

                    if (!isPasswordValid) {
                        console.error('Invalid password');
                        return null;
                    }

                    // Return user object (password will be excluded by toJSON)
                    return {
                        id: user._id.toString(),
                        email: user.email,
                        name: user.fullName,
                        role: user.role,
                        image: user.profileImage || null,
                        publicSlug: user.publicSlug,
                        isProfileActive: user.isProfileActive,
                    };
                } catch (error) {
                    console.error('Error during authentication:', error);
                    return null;
                }
            },
        }),
    ],
});
