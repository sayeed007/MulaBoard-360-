import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';

/**
 * Debug Session API Endpoint
 * 
 * Returns the current session data to help diagnose role issues
 */
export async function GET() {
    try {
        const session = await auth();

        if (!session?.user) {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            );
        }

        return NextResponse.json({
            session: {
                user: {
                    id: session.user.id,
                    email: session.user.email,
                    name: session.user.name,
                    role: session.user.role,
                    publicSlug: session.user.publicSlug,
                    isProfileActive: session.user.isProfileActive,
                },
            },
            roleType: typeof session.user.role,
            roleValue: session.user.role,
            isAdmin: session.user.role === 'admin',
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Error fetching session:', error);
        return NextResponse.json(
            { error: 'Failed to fetch session' },
            { status: 500 }
        );
    }
}
