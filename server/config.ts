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

export function loadConfig(): Config {
  if (cachedConfig) {
    return cachedConfig;
  }

  const configPath = path.join(process.cwd(), 'config.yml');
  
  if (!fs.existsSync(configPath)) {
    throw new Error(
      'config.yml not found. Please create one based on config.example.yml'
    );
  }

  try {
    const fileContents = fs.readFileSync(configPath, 'utf8');
    cachedConfig = yaml.load(fileContents) as Config;
    return cachedConfig;
  } catch (error) {
    throw new Error(`Failed to load config.yml: ${error}`);
  }
}

export function getConfig(): Config {
  if (!cachedConfig) {
    cachedConfig = loadConfig();
  }
  return cachedConfig;
}
