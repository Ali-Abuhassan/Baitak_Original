const nodemailer = require('nodemailer');
const env = require('./env');

const createGmailTransporter = () => {
  // Validate required environment variables
  if (!env.gmail.gmailUser || !env.gmail.gmailPass) {
    throw new Error('Gmail credentials not found in environment variables');
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: env.gmail.gmailUser,
      pass: env.gmail.gmailPass,
    },
    // Optional: Add additional configuration
    pool: true, // Use connection pooling
    maxConnections: 5,
    maxMessages: 100,
    rateLimit: 14, // Max 14 messages per second
  });
};

// Test transporter connection
const testEmailConnection = async () => {
  try {
    const transporter = createGmailTransporter();
    await transporter.verify();
    console.log('✅ Email service connection successful');
    return true;
  } catch (error) {
    console.error('❌ Email service connection failed:', error.message);
    return false;
  }
};

module.exports = {
  createGmailTransporter,
  testEmailConnection
};
