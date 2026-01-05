import nodemailer from 'nodemailer';

/**
 * Email Service using Nodemailer
 *
 * Configure with environment variables:
 * - EMAIL_HOST: SMTP server host (e.g., smtp.gmail.com)
 * - EMAIL_PORT: SMTP port (e.g., 587 for TLS, 465 for SSL)
 * - EMAIL_USER: SMTP username/email
 * - EMAIL_PASSWORD: SMTP password or app-specific password
 * - EMAIL_FROM: From email address
 */

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Verify connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.error('Email service configuration error:', error);
  } else {
    console.log('✅ Email service is ready to send messages');
  }
});

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send an email
 */
export async function sendEmail({ to, subject, html, text }: SendEmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'MulaBoard <noreply@mulaboard.com>',
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML for text version if not provided
    });

    console.log('✅ Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return { success: false, error };
  }
}

/**
 * Send email to admin when a new user registers
 */
export async function sendNewUserNotificationToAdmin(user: {
  fullName: string;
  email: string;
  designation?: string;
  department?: string;
  createdAt: Date;
}) {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;

  if (!adminEmail) {
    console.warn('⚠️ Admin email not configured. Skipping notification.');
    return { success: false, error: 'Admin email not configured' };
  }

  const approvalUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin/pending`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .user-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981; }
          .info-row { margin: 10px 0; }
          .label { font-weight: bold; color: #666; }
          .button { display: inline-block; padding: 12px 24px; background: #10b981; color: white; text-decoration: none; border-radius: 6px; margin-top: 20px; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌿 New User Registration</h1>
          </div>
          <div class="content">
            <p>A new user has registered on MulaBoard and is waiting for approval.</p>

            <div class="user-info">
              <div class="info-row">
                <span class="label">Name:</span> ${user.fullName}
              </div>
              <div class="info-row">
                <span class="label">Email:</span> ${user.email}
              </div>
              ${user.designation ? `<div class="info-row"><span class="label">Designation:</span> ${user.designation}</div>` : ''}
              ${user.department ? `<div class="info-row"><span class="label">Department:</span> ${user.department}</div>` : ''}
              <div class="info-row">
                <span class="label">Registered:</span> ${user.createdAt.toLocaleString()}
              </div>
            </div>

            <p>Please review and approve or reject this registration.</p>

            <a href="${approvalUrl}" class="button">Review Pending Users</a>
          </div>
          <div class="footer">
            <p>This is an automated message from MulaBoard</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: adminEmail,
    subject: '🌿 New User Registration - Approval Required',
    html,
  });
}

/**
 * Send approval email to user
 */
export async function sendUserApprovedEmail(user: {
  fullName: string;
  email: string;
}) {
  const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .success-box { background: #d1fae5; border: 2px solid #10b981; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
          .button { display: inline-block; padding: 12px 24px; background: #10b981; color: white; text-decoration: none; border-radius: 6px; margin-top: 20px; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Account Approved!</h1>
          </div>
          <div class="content">
            <p>Hello ${user.fullName},</p>

            <div class="success-box">
              <h2 style="margin: 0; color: #10b981;">🎉 Welcome to MulaBoard!</h2>
              <p style="margin: 10px 0 0;">Your account has been approved by an administrator.</p>
            </div>

            <p>You can now log in to your account and start using MulaBoard to receive anonymous feedback from your colleagues.</p>

            <p><strong>What's next?</strong></p>
            <ul>
              <li>Complete your profile with additional information</li>
              <li>Share your public profile link with colleagues</li>
              <li>Start receiving valuable feedback</li>
            </ul>

            <a href="${loginUrl}" class="button">Log In Now</a>
          </div>
          <div class="footer">
            <p>This is an automated message from MulaBoard</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: user.email,
    subject: '✅ Your MulaBoard Account Has Been Approved!',
    html,
  });
}

/**
 * Send rejection email to user
 */
export async function sendUserRejectedEmail(user: {
  fullName: string;
  email: string;
  rejectionReason: string;
}) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .reason-box { background: #fee2e2; border: 2px solid #ef4444; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>❌ Account Registration Declined</h1>
          </div>
          <div class="content">
            <p>Hello ${user.fullName},</p>

            <p>We regret to inform you that your MulaBoard registration has been declined by an administrator.</p>

            <div class="reason-box">
              <strong>Reason:</strong>
              <p>${user.rejectionReason}</p>
            </div>

            <p>If you believe this is a mistake or would like to discuss this decision, please contact your organization's administrator.</p>

            <p>Thank you for your interest in MulaBoard.</p>
          </div>
          <div class="footer">
            <p>This is an automated message from MulaBoard</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: user.email,
    subject: '❌ MulaBoard Registration Update',
    html,
  });
}
