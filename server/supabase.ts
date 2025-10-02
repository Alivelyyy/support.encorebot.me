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
  const verificationUrl = `${process.env.REPLIT_DEV_DOMAIN || 'http://localhost:5000'}/verify-email?token=${token}`;
  
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: verificationUrl,
      data: {
        verification_token: token,
        full_name: fullName,
      },
    },
  });

  if (error) {
    throw new Error(`Failed to send verification email: ${error.message}`);
  }
}

export async function resendVerificationEmail(
  email: string,
  token: string,
  fullName: string
): Promise<void> {
  return sendVerificationEmail(email, token, fullName);
}
