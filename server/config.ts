import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

export interface Config {
  database: {
    mongodb_uri: string;
    db_name: string;
  };
  server: {
    port: number;
    session_secret: string;
  };
  email: {
    supabase_url: string;
    supabase_anon_key: string;
    resend_api_key: string;
    base_url: string;
  };
  admin: {
    default_email: string;
  };
}

let cachedConfig: Config | null = null;

function loadConfigFromFile(): Config {
  const configPath = path.join(process.cwd(), 'config.yml');

  if (!fs.existsSync(configPath)) {
    throw new Error(
      'config.yml not found. Please create one based on config.example.yml'
    );
  }

  try {
    const fileContents = fs.readFileSync(configPath, 'utf8');
    return yaml.load(fileContents) as Config;
  } catch (error) {
    throw new Error(`Failed to load config.yml: ${error}`);
  }
}

function loadConfigFromEnv(): Config {
  return {
    database: {
      mongodb_uri: process.env.MONGODB_URI || '',
      db_name: process.env.DB_NAME || 'ticketsystem',
    },
    server: {
      port: parseInt(process.env.PORT || '5000', 10),
      session_secret: process.env.SESSION_SECRET || 'fallback-secret-change-this',
    },
    email: {
      supabase_url: process.env.SUPABASE_URL || '',
      supabase_anon_key: process.env.SUPABASE_ANON_KEY || '',
      resend_api_key: process.env.RESEND_API_KEY || '',
      base_url: process.env.BASE_URL || 'http://localhost:5000',
    },
    admin: {
      default_email: process.env.ADMIN_EMAIL || 'admin@example.com',
    },
  };
}

// Renamed from loadConfig to getConfigFromEnv to avoid confusion with loadConfig
function getConfigFromEnv(): Config {
  return loadConfigFromEnv();
}

export function getConfig(): Config {
  // Check if running on Vercel or similar serverless platform
  // In these environments, we should use environment variables
  const isServerless = process.env.VERCEL || 
                       process.env.AWS_LAMBDA_FUNCTION_NAME || 
                       process.env.NODE_ENV === 'production';

  if (isServerless || process.env.MONGODB_URI) {
    console.log('Using environment variables for configuration');
    return getConfigFromEnv();
  }

  // Otherwise, try to load from config.yml
  console.log('Loading configuration from config.yml');
  return loadConfigFromFile();
}

export function getConfiguration(): Config {
  if (!cachedConfig) {
    cachedConfig = getConfig();
  }
  return cachedConfig;
}