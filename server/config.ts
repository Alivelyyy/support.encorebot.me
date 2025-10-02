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

export function loadConfig(): Config {
  // In production (Vercel), always use environment variables
  if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
    console.log('Loading configuration from environment variables (Vercel mode)');
    return loadConfigFromEnv();
  }

  // In development, prefer environment variables if MONGODB_URI is set
  // This allows both methods to work in development
  if (process.env.MONGODB_URI) {
    console.log('Loading configuration from environment variables');
    return loadConfigFromEnv();
  }

  // Otherwise, try to load from config.yml
  console.log('Loading configuration from config.yml');
  return loadConfigFromFile();
}

export function getConfig(): Config {
  if (!cachedConfig) {
    cachedConfig = loadConfig();
  }
  return cachedConfig;
}
