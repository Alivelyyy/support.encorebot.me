import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function sendVerificationEmail(
  email: string,
  token: string,
  fullName: string
): Promise<void> {
  const baseUrl = process.env.REPLIT_DEV_DOMAIN || 'http://localhost:5000';
  const verificationUrl = `${baseUrl}/verify-email?token=${encodeURIComponent(token)}`;
  
  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; padding: 20px 0;">
        <h1 style="color: #2563eb;">EncoreBot Support</h1>
      </div>
      
      <div style="background: #f8fafc; border-radius: 8px; padding: 30px; margin: 20px 0;">
        <h2 style="color: #334155; margin-bottom: 20px;">Verify Your Email Address</h2>
        
        <p style="color: #64748b; line-height: 1.6; margin-bottom: 25px;">
          Hi ${fullName},
        </p>
        
        <p style="color: #64748b; line-height: 1.6; margin-bottom: 25px;">
          Thank you for registering with EncoreBot Support. Please click the button below to verify your email address and activate your account.
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background: #2563eb; color: white; padding: 12px 32px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
            Verify Email Address
          </a>
        </div>
        
        <p style="color: #94a3b8; font-size: 14px; margin-top: 25px;">
          Or copy and paste this URL into your browser:<br>
          <span style="color: #2563eb; word-break: break-all;">${verificationUrl}</span>
        </p>
        
        <p style="color: #94a3b8; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
          This verification link will expire in 24 hours. If you didn't create an account with EncoreBot Support, you can safely ignore this email.
        </p>
      </div>
      
      <div style="text-align: center; color: #94a3b8; font-size: 12px; padding-top: 20px;">
        <p>© EncoreBot Support - All rights reserved</p>
      </div>
    </div>
  `;

  const { data, error } = await supabase.functions.invoke('send-email', {
    body: {
      to: email,
      from: 'verify@encorebot.me',
      subject: 'Verify your email address - EncoreBot Support',
      html: htmlBody,
    },
  });

  if (error) {
    console.error('Supabase email error:', error);
    throw new Error(`Failed to send verification email: ${error.message}`);
  }

  if (!data || data.error) {
    console.error('Email sending failed:', data);
    throw new Error('Failed to send verification email');
  }
}

export async function resendVerificationEmail(
  email: string,
  token: string,
  fullName: string
): Promise<void> {
  return sendVerificationEmail(email, token, fullName);
}
