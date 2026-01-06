import { NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '@/lib/db/connect';
import User from '@/lib/db/models/User';
import { sendPasswordResetEmail } from '@/lib/email/service';

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json(
                { message: 'Email is required' },
                { status: 400 }
            );
        }

        await connectDB();

        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            // Return success even if user not found for security
            return NextResponse.json({
                message: 'If an account exists with this email, you will receive a reset link.',
            });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenHash = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        // Save token to user (valid for 1 hour)
        user.resetPasswordToken = resetTokenHash;
        user.resetPasswordExpire = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        await user.save({ validateBeforeSave: false });

        // Create reset URL
        const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

        // Send email
        try {
            await sendPasswordResetEmail({
                fullName: user.fullName,
                email: user.email,
                resetUrl,
            });

            return NextResponse.json({
                message: 'If an account exists with this email, you will receive a reset link.',
            });
        } catch (emailError) {
            // If email fails, clear the token
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });

            console.error('Email send error:', emailError);
            return NextResponse.json(
                { message: 'Email could not be sent. Please try again later.' },
                { status: 500 }
            );
        }
    } catch (error: any) {
        console.error('Forgot password error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
