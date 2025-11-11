# Environment Setup Guide

## ⚠️ Security Notice

**NEVER commit `.env` files to the repository!** They contain sensitive information like database passwords and API keys.

## Quick Setup

1. **Copy the environment template:**

   ```bash
   cp .env.example .env
   ```

2. **Edit the `.env` file with your actual values:**

   ```bash
   nano .env  # or use your preferred editor
   ```

3. **Update the following required values:**
   - `DB_PASSWORD` - Your database password
   - `JWT_SECRET` - A secure random string for JWT tokens
   - `GMAIL_APP_PASSWORD` - If using Gmail for emails
   - `TWILIO_*` - If using Twilio for SMS

## Required Environment Variables

### Database Configuration

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=baitak_marketplace
DB_USER=root
DB_PASSWORD=your_database_password_here
```

### JWT Configuration

```env
JWT_SECRET=your_super_secure_jwt_secret_key_change_this_in_production
JWT_EXPIRE=7d
```

### Server Configuration

```env
NODE_ENV=development
PORT=3026
SERVER_BASE_URL=http://192.168.1.87:3026
FRONTEND_URL=http://localhost:3000
```

## Optional Environment Variables

### Email Configuration (Gmail)

```env
GMAIL_USER=your_email@gmail.com
GMAIL_APP_PASSWORD=your_gmail_app_password_here
```

### SMS Configuration (Twilio)

```env
SMS_PROVIDER=console
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

### File Upload Configuration

```env
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,image/webp
```

## Environment-Specific Files

- `.env` - Local development (ignored by git)
- `.env.example` - Template file (committed to git)
- `.env.production` - Production environment (ignored by git)
- `.env.staging` - Staging environment (ignored by git)

## Security Best Practices

1. **Never commit `.env` files**
2. **Use strong, unique passwords**
3. **Rotate secrets regularly**
4. **Use different values for different environments**
5. **Keep production secrets secure**

## Troubleshooting

### "Environment variable not found" error

- Check if `.env` file exists
- Verify the variable name is correct
- Restart the server after changing `.env`

### Database connection issues

- Verify database credentials
- Check if database server is running
- Ensure database exists

### JWT token issues

- Verify `JWT_SECRET` is set
- Check if `JWT_EXPIRE` is valid
- Ensure secret is consistent across restarts
