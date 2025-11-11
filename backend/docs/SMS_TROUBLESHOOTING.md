# SMS Troubleshooting Guide

## Current Issue: HTTP15 --> Not Authorized

The SMS service is returning "HTTP15 --> Not Authorized for the request" which indicates an authentication problem.

## Possible Causes & Solutions

### 1. **Incorrect Credentials**

**Check your SMS provider dashboard or contact support to verify:**

- `SMS_USER` - Should be your exact username
- `SMS_PASS` - Should be your exact password (check for typos)
- `SMS_SID` - Should be your exact SID/Service ID
- `SMS_TYPE` - Should be the correct message type (usually 1, 2, 3, or 4)

### 2. **Account Issues**

- **Account Suspended**: Check if your account is active
- **Credits Exhausted**: Verify you have sufficient SMS credits
- **Service Not Activated**: Ensure SMS service is enabled on your account
- **IP Restrictions**: Check if your server IP is whitelisted

### 3. **API Endpoint Issues**

- **Wrong Endpoint**: Verify the correct API endpoint with your provider
- **Protocol Issues**: Try HTTP instead of HTTPS or vice versa
- **Port Issues**: Check if the port (8441) is correct

### 4. **Parameter Format Issues**

- **Special Characters**: The password `Bai-@25!` contains special characters that might need encoding
- **Parameter Names**: Verify the exact parameter names expected by the API
- **Data Types**: Ensure numeric values are sent as strings or numbers as expected

## Immediate Solutions

### Option 1: Verify Credentials

1. Log into your SMS provider dashboard
2. Check your account status and credits
3. Verify the exact credentials and API endpoint
4. Test with their web interface if available

### Option 2: Contact Support

Contact TheBluNet support with:

- Your account details
- The error message: "HTTP15 --> Not Authorized"
- Your server IP address
- The API endpoint you're using

### Option 3: Temporary Fallback

The current implementation includes a fallback that:

- Logs the authentication error
- Prevents app crashes
- Continues normal operation
- Logs notifications for debugging

## Testing Steps

### 1. Test with Provider's Web Interface

If available, test sending SMS through their web dashboard to verify:

- Account is active
- Credentials are correct
- Service is working

### 2. Test with Different Credentials

Try with a test account or different credentials if available.

### 3. Check API Documentation

Verify the correct:

- Endpoint URL
- Parameter names
- Request method (GET/POST)
- Content type
- Authentication method

## Current Implementation Status

✅ **SMS Service Created** - Custom service using TheBluNet API
✅ **Error Handling** - Comprehensive error handling implemented
✅ **Fallback System** - App won't crash if SMS fails
✅ **Debug Logging** - Detailed logs for troubleshooting
✅ **Development Mode** - Console logging in development

## Next Steps

1. **Verify Credentials** with your SMS provider
2. **Test API Access** through their dashboard
3. **Contact Support** if credentials are correct
4. **Update Credentials** once verified
5. **Test Integration** with real phone numbers

## Alternative Solutions

If the current SMS provider doesn't work:

### 1. **Try Different SMS Provider**

- Twilio
- AWS SNS
- MessageBird
- Vonage (Nexmo)

### 2. **Email Fallback**

- Send notifications via email instead
- Use email for OTP verification
- Implement email notifications for bookings

### 3. **Console Logging**

- Keep current development mode
- Log all notifications to console
- Implement proper logging system

## Environment Variables to Check

```env
# Current SMS Configuration
SMS_PROVIDER=sms
SMS_USER=Baitak
SMS_PASS=Bai-@25!
SMS_SID=Baitak
SMS_TYPE=4
NODE_ENV=production
```

## Debug Information

The system logs detailed information when SMS fails:

- API endpoint used
- Parameters sent
- Response received
- Error details

Check your server logs for these details to help with troubleshooting.

## Support Contact

If you need help:

1. Check this troubleshooting guide
2. Verify credentials with provider
3. Contact TheBluNet support
4. Consider alternative SMS providers
