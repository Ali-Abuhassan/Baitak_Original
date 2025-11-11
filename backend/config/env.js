require('dotenv').config();

// Determine if SSL is enabled
const sslEnabled = process.env.SSL === 'true';

// Auto-adjust SERVER_BASE_URL protocol based on SSL setting
const defaultPort = process.env.PORT || 3026;
const defaultProtocol = sslEnabled ? 'https' : 'http';
const defaultServerUrl = `${defaultProtocol}://localhost:${defaultPort}`;

const env = {
  port: defaultPort,
  nodeEnv: process.env.NODE_ENV || 'development',
  serverBaseUrl: process.env.SERVER_BASE_URL || defaultServerUrl,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  appName: process.env.APP_NAME || 'Baitak',
  
  // SSL Configuration
  ssl: {
    enabled: sslEnabled,
    keyPath: process.env.SSL_KEY_PATH || '/etc/letsencrypt/live/baitak.io/privkey.pem',
    certPath: process.env.SSL_CERT_PATH || '/etc/letsencrypt/live/baitak.io/fullchain.pem',
  },
  
  // Database
  database: {
    host: process.env.DB_HOST || 'spark-main.ctoqqaqmac65.us-east-2.rds.amazonaws.com',
    port: process.env.DB_PORT || 3306,
    name: process.env.DB_NAME || 'baitak_beta',
    user: process.env.DB_USER || 'admin',
    password: process.env.DB_PASSWORD || 'gJGPbTWSYEfSarHWCKY2',
  },
  
  // JWT
  jwtSecret: process.env.JWT_SECRET || 'your_super_secure_jwt_secret_key_change_this_in_production_2024',
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  
  // Email
  gmail: {
    gmailUser: process.env.GMAIL_USER || '',
    gmailPass: process.env.GMAIL_APP_PASSWORD || '',
  },
  
  // SMS
  sms: {
    provider: process.env.SMS_PROVIDER || 'console',
    // Custom SMS Provider (TheBluNet)
    user: process.env.SMS_USER || '',
    pass: process.env.SMS_PASS || '',
    sid: process.env.SMS_SID || '',
    type: process.env.SMS_TYPE || '',
    // Twilio (fallback)
    twilioAccountSid: process.env.TWILIO_ACCOUNT_SID || '',
    twilioAuthToken: process.env.TWILIO_AUTH_TOKEN || '',
    twilioPhoneNumber: process.env.TWILIO_PHONE_NUMBER || '',
  },
  
  // File Upload
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880, // 5MB
    allowedFileTypes: process.env.ALLOWED_FILE_TYPES?.split(',') || [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp'
    ],
  },
  
  // Admin
  admin: {
    email: process.env.ADMIN_EMAIL || 'admin@baitak.com',
    password: process.env.ADMIN_PASSWORD || 'Admin@123456',
  },
  
  // OpenAI (for smart search)
  openai: {
    apiKey: process.env.OPENAI_API_KEY || null,
  },
};

// Validate required environment variables
const requiredEnvVars = ['JWT_SECRET'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0 && env.nodeEnv === 'production') {
  console.error('Missing required environment variables:', missingVars.join(', '));
  process.exit(1);
}

module.exports = env;
