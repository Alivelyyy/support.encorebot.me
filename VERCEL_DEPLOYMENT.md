# Deploying to Vercel

This guide will help you deploy your ticket system application to Vercel.

## Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. A MongoDB Atlas account (or any MongoDB hosting service)
3. A Supabase account (for email functionality)
4. A Resend account (for sending emails)

## Step 1: Set Up MongoDB

1. Create a free MongoDB Atlas cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a database user with read/write permissions
3. Get your connection string (it looks like: `mongodb+srv://username:password@cluster.mongodb.net/...`)
4. Whitelist all IP addresses (0.0.0.0/0) in Network Access for serverless deployment

## Step 2: Set Up Email Services

### Supabase Setup
1. Create a project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from Project Settings > API

### Resend Setup
1. Create an account at [resend.com](https://resend.com)
2. Verify your domain or use the sandbox domain for testing
3. Get your API key from the dashboard

## Step 3: Prepare Your Application

1. Build your application locally to test:
   ```bash
   npm run vercel-build
   ```

2. Make sure `vercel.json` is configured correctly (it should already be set up)

## Step 4: Deploy to Vercel

### Option 1: Deploy via Vercel Dashboard

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your GitHub repository (or upload your project)
4. Vercel will auto-detect the configuration

### Option 2: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

## Step 5: Configure Environment Variables on Vercel

**IMPORTANT:** This application automatically uses environment variables when deployed to Vercel. You don't need to create a `config.yml` file on Vercel.

1. In your Vercel project dashboard, go to **Settings > Environment Variables**

2. Add the following environment variables:

| Variable Name | Description | Example Value |
|--------------|-------------|---------------|
| `MONGODB_URI` | Your MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/?retryWrites=true&w=majority` |
| `DB_NAME` | Database name | `ticketsystem` |
| `SESSION_SECRET` | Random secure string for sessions | `your-secure-random-string-here` |
| `SUPABASE_URL` | Your Supabase project URL | `https://your-project.supabase.co` |
| `SUPABASE_ANON_KEY` | Your Supabase anonymous key | `eyJhbGc...` |
| `RESEND_API_KEY` | Your Resend API key | `re_...` |
| `BASE_URL` | Your deployed app URL | `https://your-app.vercel.app` |
| `ADMIN_EMAIL` | Default admin email address | `admin@example.com` |

3. Set all variables to apply to **Production**, **Preview**, and **Development** environments

4. Redeploy your application for the changes to take effect

## How Configuration Works

The application uses a smart configuration system:

- **Vercel/Production**: Automatically uses environment variables
- **Local Development**: You can use either:
  - Environment variables (set `MONGODB_URI` and others in your environment)
  - `config.yml` file (copy from `config.example.yml` and fill in your values)

This means:
- ✅ `config.yml` is gitignored and never deployed to Vercel
- ✅ Sensitive data stays secure in Vercel's environment variables
- ✅ Local development is flexible (use whichever method you prefer)

## Step 6: Verify Deployment

1. Wait for the deployment to complete
2. Visit your deployed URL
3. Test creating an account and creating a ticket
4. Check that emails are being sent correctly

## Troubleshooting

### MongoDB Connection Issues
- Make sure your IP whitelist includes 0.0.0.0/0
- Verify your connection string is correct
- Check that your database user has the correct permissions
- Ensure the connection string is properly URL-encoded (especially passwords with special characters)

### Email Not Sending
- Verify your Resend API key is correct
- Check that your domain is verified in Resend (or use sandbox mode for testing)
- Make sure the BASE_URL is set to your Vercel deployment URL
- Check Vercel function logs for email sending errors

### Application Not Starting
- Check the Vercel deployment logs
- Verify all environment variables are set correctly
- Make sure the build completed successfully
- Look for any error messages in the Function logs

### Session Issues
- Sessions are stored in signed cookies (compatible with serverless)
- Each cold start creates a new function instance, but sessions persist in cookies
- If users are being logged out unexpectedly, check SESSION_SECRET is set correctly

## Production Considerations

1. **Security**
   - Use strong, unique values for `SESSION_SECRET` (32+ random characters)
   - Never commit `config.yml` to your repository (it's gitignored)
   - Regularly rotate API keys and secrets
   - Enable 2FA on all service accounts (MongoDB Atlas, Supabase, Resend)

2. **Performance**
   - MongoDB Atlas M0 (free tier) is suitable for small apps
   - Consider upgrading as your user base grows
   - Vercel serverless functions have a 10-second execution timeout
   - Enable MongoDB connection pooling (automatically handled by Mongoose)

3. **Monitoring**
   - Set up Vercel Analytics for usage tracking
   - Monitor your MongoDB Atlas dashboard for performance
   - Check Resend dashboard for email delivery rates
   - Set up alerts for function errors in Vercel

4. **Scaling**
   - Vercel automatically scales serverless functions
   - MongoDB Atlas can be scaled up as needed
   - Consider upgrading Vercel plan for higher limits
   - Monitor your usage to avoid hitting free tier limits

## Cost Estimates

- **Vercel**: Free tier supports up to 100GB bandwidth/month
- **MongoDB Atlas**: Free tier (M0) includes 512MB storage
- **Supabase**: Free tier includes email sending capabilities
- **Resend**: Free tier includes 100 emails/day

## Local Development

For local development, create a `config.yml` file (see `config.example.yml`) or set environment variables:

```bash
export MONGODB_URI="mongodb+srv://..."
export DB_NAME="ticketsystem"
export SESSION_SECRET="your-secret"
export SUPABASE_URL="https://..."
export SUPABASE_ANON_KEY="..."
export RESEND_API_KEY="re_..."
export BASE_URL="http://localhost:5000"
export ADMIN_EMAIL="admin@example.com"

npm run dev
```

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check MongoDB Atlas logs
3. Check Resend delivery logs
4. Review this deployment guide
5. Contact support for the specific service having issues

## Next Steps

After successful deployment:
1. Test all features (signup, login, ticket creation, email verification)
2. Set up custom domain (optional)
3. Configure email sender domain in Resend
4. Set up monitoring and alerts
5. Create your admin account using the whitelisted email

Congratulations! Your ticket system is now live on Vercel! 🎉
