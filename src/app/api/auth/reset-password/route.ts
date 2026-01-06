import { NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '@/lib/db/connect';
import User from '@/lib/db/models/User';

export async function POST(req: Request) {
    try {
        const { token, password } = await req.json();

        if (!token || !password) {
            return NextResponse.json(
                { message: 'Token and new password are required' },
                { status: 400 }
            );
        }

        await connectDB();

        // Hash the token from the URL to compare with stored hash
        const resetTokenHash = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        // Find user with valid token and not expired
        const user = await User.findOne({
            resetPasswordToken: resetTokenHash,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return NextResponse.json(
                { message: 'Invalid or expired password reset token' },
                { status: 400 }
            );
        }

        // Set new password
        user.password = password;

        // Clear reset token fields
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        return NextResponse.json({
            message: 'Password reset successful. You can now log in.',
        });
    } catch (error: any) {
        console.error('Reset password error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
