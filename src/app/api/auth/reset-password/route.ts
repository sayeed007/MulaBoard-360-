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



        // First, check if token exists at all
        const userWithToken = await User.findOne({
            resetPasswordToken: resetTokenHash,
        });

        if (!userWithToken) {
            console.log('Reset Password Failed: Token hash not found in DB');

            // Debug: Check if the token exists anywhere or if it's a format issue
            const count = await User.countDocuments({ resetPasswordToken: resetTokenHash });
            console.log('Debug: Count of users with this exact token hash:', count);

            // Debug: Dump all tokens (WARNING: Only for dev debugging, remove later)
            // const allWithTokens = await User.find({ resetPasswordToken: { $exists: true, $ne: null } }).select('email resetPasswordToken');
            // console.log('Debug: All active tokens:', allWithTokens);

            return NextResponse.json(
                { message: 'Invalid password reset token' },
                { status: 400 }
            );
        }



        // Check if expired
        if (!userWithToken.resetPasswordExpire || new Date() > userWithToken.resetPasswordExpire) {
            return NextResponse.json(
                { message: 'Password reset token has expired' },
                { status: 400 }
            );
        }

        const user = userWithToken;

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
