# Email Verification Setup Guide

This guide explains how to set up email verification for your EncoreBot Support application using Supabase Edge Functions to send emails from verify@encorebot.me.

## Implementation Overview

The application uses a secure custom verification flow:
1. User registers → Backend generates a random 32-character verification token
2. Token is stored with 24-hour expiry in the user record
3. Supabase Edge Function sends HTML email from verify@encorebot.me with verification link
4. User clicks link → Backend validates token hasn't expired and marks email as verified
5. User can now log in and access the application

## Option 1: Using Supabase Edge Function (Recommended)

### Step 1: Create the Email Sending Edge Function

1. Install Supabase CLI if you haven't:
```bash
npm install -g supabase
```

2. Login to Supabase:
```bash
supabase login
```

3. Link to your project:
```bash
supabase link --project-ref <your-project-ref>
```

4. Create a new Edge Function:
```bash
supabase functions new send-email
```

5. Replace the contents of `supabase/functions/send-email/index.ts` with:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { to, from, subject, html } = await req.json()

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from,
        to,
        subject,
        html
      })
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.message || 'Failed to send email')
    }

    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 },
    )
  }
})
```

6. Deploy the Edge Function:
```bash
supabase functions deploy send-email
```

7. Set the RESEND_API_KEY secret:
```bash
supabase secrets set RESEND_API_KEY=<your-resend-api-key>
```

### Step 2: Set Up Resend (Email Service Provider)

1. Go to [Resend.com](https://resend.com) and create an account
2. Add and verify your domain (encorebot.me)
3. Create an API key
4. Configure DNS records as instructed by Resend to verify domain ownership
5. Set `verify@encorebot.me` as a verified sender address

### Step 3: Test the Implementation

1. Register a new account in your application
2. Check the inbox for the verification email
3. Click the verification link
4. Confirm successful verification and login

## Option 2: Using Nodemailer (Alternative)

If you prefer not to use Edge Functions, you can modify `server/supabase.ts` to use Nodemailer:

1. Install nodemailer:
```bash
npm install nodemailer
npm install --save-dev @types/nodemailer
```

2. Replace `server/supabase.ts` with a Nodemailer implementation using your SMTP credentials

3. Configure SMTP environment variables in Replit Secrets:
   - `SMTP_HOST`
   - `SMTP_PORT`
   - `SMTP_USER`
   - `SMTP_PASSWORD`

## Security Considerations

1. **Token Security**: 
   - Tokens are 32-character random hex strings
   - Stored securely with 24-hour expiry
   - Verified server-side before granting access

2. **Email Validation**:
   - Users cannot access protected routes until email is verified
   - Login is blocked for unverified accounts
   - Tokens are single-use (cleared after successful verification)

3. **Rate Limiting**:
   - Supabase Edge Functions have built-in rate limiting
   - Consider adding application-level rate limiting for resend requests

## Troubleshooting

### Emails Not Sending

1. Check Supabase Edge Function logs:
   ```bash
   supabase functions logs send-email
   ```

2. Verify RESEND_API_KEY is set correctly:
   ```bash
   supabase secrets list
   ```

3. Ensure domain is verified in Resend dashboard

### Verification Links Not Working

1. Check that REPLIT_DEV_DOMAIN environment variable is set correctly
2. Verify the token hasn't expired (24-hour limit)
3. Check browser console for errors on `/verify-email` page

### Wrong Sender Email

1. Verify domain ownership in Resend
2. Ensure `verify@encorebot.me` is added as a verified sender
3. Check DNS records are properly configured

## Email Template Customization

The HTML email template is defined in `server/supabase.ts`. You can customize:

- Brand colors and styling
- Email copy and messaging
- Button design and call-to-action
- Footer information

The template uses inline CSS for maximum email client compatibility.

## Production Checklist

- [ ] Domain verified in Resend
- [ ] Edge Function deployed and tested
- [ ] RESEND_API_KEY secret configured
- [ ] REPLIT_DEV_DOMAIN set to production URL
- [ ] Test full registration and verification flow
- [ ] Monitor Edge Function logs for errors
- [ ] Set up email delivery monitoring in Resend dashboard

## Additional Resources

- [Supabase Edge Functions Documentation](https://supabase.com/docs/guides/functions)
- [Resend Documentation](https://resend.com/docs)
- [Email Best Practices](https://www.resend.com/docs/send-with-nodejs)
