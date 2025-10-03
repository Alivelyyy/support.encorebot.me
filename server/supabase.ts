import { createClient } from '@supabase/supabase-js';
import { getConfig } from './config';

// Defer client creation until first use (lazy initialization for Vercel)
let supabaseClient: ReturnType<typeof createClient> | null = null;

function getSupabaseClient() {
  if (!supabaseClient) {
    const config = getConfig();
    supabaseClient = createClient(config.email.supabase_url, config.email.supabase_anon_key);
  }
  return supabaseClient;
}

export const supabase = new Proxy({} as ReturnType<typeof createClient>, {
  get: (target, prop) => {
    const client = getSupabaseClient();
    return (client as any)[prop];
  }
});

export async function sendVerificationEmail(
  email: string,
  token: string,
  fullName: string
): Promise<void> {
  const config = getConfig(); // Access config at runtime, not import time
  const baseUrl = config.email.base_url;
  const verificationUrl = `${baseUrl}/verify-email?token=${encodeURIComponent(token)}`;
  
  const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email - EncoreBot</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; padding: 40px 20px;">
      <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
        <!-- Header with Gradient -->
        <tr>
          <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
            <h1 style="margin: 0; color: white; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">
              ✨ EncoreBot
            </h1>
            <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.9); font-size: 16px; font-weight: 400;">
              Support Platform
            </p>
          </td>
        </tr>
        
        <!-- Main Content -->
        <tr>
          <td style="padding: 50px 40px;">
            <h2 style="margin: 0 0 24px 0; color: #1a202c; font-size: 28px; font-weight: 600; text-align: center;">
              Verify Your Email Address
            </h2>
            
            <p style="margin: 0 0 16px 0; color: #4a5568; font-size: 16px; line-height: 1.6;">
              Hi <strong style="color: #2d3748;">${fullName}</strong>,
            </p>
            
            <p style="margin: 0 0 32px 0; color: #4a5568; font-size: 16px; line-height: 1.6;">
              Welcome to EncoreBot Support! We're excited to have you on board. To get started and access all features, please verify your email address by clicking the button below.
            </p>
            
            <!-- CTA Button -->
            <table role="presentation" style="width: 100%; margin: 0 0 32px 0;">
              <tr>
                <td style="text-align: center;">
                  <a href="${verificationUrl}" 
                     style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 48px; text-decoration: none; border-radius: 50px; font-size: 16px; font-weight: 600; box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4); transition: all 0.3s ease;">
                    Verify Email Address
                  </a>
                </td>
              </tr>
            </table>
            
            <!-- Alternative Link -->
            <div style="background: #f7fafc; border-radius: 8px; padding: 20px; margin: 0 0 32px 0;">
              <p style="margin: 0 0 8px 0; color: #718096; font-size: 14px; font-weight: 500;">
                Or copy and paste this link:
              </p>
              <p style="margin: 0; word-break: break-all;">
                <a href="${verificationUrl}" style="color: #667eea; text-decoration: none; font-size: 13px;">
                  ${verificationUrl}
                </a>
              </p>
            </div>
            
            <!-- Security Notice -->
            <div style="border-left: 3px solid #667eea; padding-left: 16px; margin: 32px 0 0 0;">
              <p style="margin: 0; color: #718096; font-size: 14px; line-height: 1.5;">
                <strong style="color: #4a5568;">⏱️ Link expires in 24 hours</strong><br>
                If you didn't create an account with EncoreBot Support, please disregard this email.
              </p>
            </div>
          </td>
        </tr>
        
        <!-- Footer -->
        <tr>
          <td style="background: #f7fafc; padding: 32px 40px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0 0 12px 0; color: #a0aec0; font-size: 14px;">
              Need help? <a href="https://encorebot.me" style="color: #667eea; text-decoration: none; font-weight: 500;">Visit our support center</a>
            </p>
            <p style="margin: 0; color: #cbd5e0; font-size: 12px;">
              © 2024 EncoreBot Support. All rights reserved.
            </p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const resendApiKey = config.email.resend_api_key;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${resendApiKey}`
    },
    body: JSON.stringify({
      from: 'EncoreBot Support <noreply@encorebot.me>',
      to: email,
      subject: '✉️ Verify your email - EncoreBot Support',
      html: htmlBody
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to send email: ${JSON.stringify(error)}`);
  }

  return;
}

export async function resendVerificationEmail(email: string, fullName: string, token: string): Promise<void> {
  return sendVerificationEmail(email, token, fullName);
}

export async function sendPasswordResetEmail(
  email: string,
  token: string,
  fullName: string
): Promise<void> {
  const config = getConfig();
  const baseUrl = config.email.base_url;
  const resetUrl = `${baseUrl}/reset-password?token=${encodeURIComponent(token)}`;
  
  const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password - EncoreBot</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; padding: 40px 20px;">
      <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
        <!-- Header with Gradient -->
        <tr>
          <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
            <h1 style="margin: 0; color: white; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">
              ✨ EncoreBot
            </h1>
            <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.9); font-size: 16px; font-weight: 400;">
              Support Platform
            </p>
          </td>
        </tr>
        
        <!-- Main Content -->
        <tr>
          <td style="padding: 50px 40px;">
            <h2 style="margin: 0 0 24px 0; color: #1a202c; font-size: 28px; font-weight: 600; text-align: center;">
              Reset Your Password
            </h2>
            
            <p style="margin: 0 0 16px 0; color: #4a5568; font-size: 16px; line-height: 1.6;">
              Hi <strong style="color: #2d3748;">${fullName}</strong>,
            </p>
            
            <p style="margin: 0 0 32px 0; color: #4a5568; font-size: 16px; line-height: 1.6;">
              We received a request to reset your password for your EncoreBot Support account. Click the button below to create a new password.
            </p>
            
            <!-- CTA Button -->
            <table role="presentation" style="width: 100%; margin: 0 0 32px 0;">
              <tr>
                <td style="text-align: center;">
                  <a href="${resetUrl}" 
                     style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 48px; text-decoration: none; border-radius: 50px; font-size: 16px; font-weight: 600; box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4); transition: all 0.3s ease;">
                    Reset Password
                  </a>
                </td>
              </tr>
            </table>
            
            <!-- Alternative Link -->
            <div style="background: #f7fafc; border-radius: 8px; padding: 20px; margin: 0 0 32px 0;">
              <p style="margin: 0 0 8px 0; color: #718096; font-size: 14px; font-weight: 500;">
                Or copy and paste this link:
              </p>
              <p style="margin: 0; word-break: break-all;">
                <a href="${resetUrl}" style="color: #667eea; text-decoration: none; font-size: 13px;">
                  ${resetUrl}
                </a>
              </p>
            </div>
            
            <!-- Security Notice -->
            <div style="border-left: 3px solid #667eea; padding-left: 16px; margin: 32px 0 0 0;">
              <p style="margin: 0; color: #718096; font-size: 14px; line-height: 1.5;">
                <strong style="color: #4a5568;">⏱️ Link expires in 1 hour</strong><br>
                If you didn't request a password reset, please disregard this email. Your password will remain unchanged.
              </p>
            </div>
          </td>
        </tr>
        
        <!-- Footer -->
        <tr>
          <td style="background: #f7fafc; padding: 32px 40px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0 0 12px 0; color: #a0aec0; font-size: 14px;">
              Need help? <a href="https://encorebot.me" style="color: #667eea; text-decoration: none; font-weight: 500;">Visit our support center</a>
            </p>
            <p style="margin: 0; color: #cbd5e0; font-size: 12px;">
              © 2024 EncoreBot Support. All rights reserved.
            </p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const resendApiKey = config.email.resend_api_key;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${resendApiKey}`
    },
    body: JSON.stringify({
      from: 'EncoreBot Support <noreply@encorebot.me>',
      to: email,
      subject: '🔐 Reset your password - EncoreBot Support',
      html: htmlBody
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to send email: ${JSON.stringify(error)}`);
  }

  return;
}
