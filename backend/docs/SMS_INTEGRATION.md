# SMS Integration Documentation

## Overview

This document describes the SMS integration using TheBluNet SMS API service for the Baitak application.

## Files Modified/Created

### 1. `services/smsService.js` (NEW)

- Custom SMS service using TheBluNet API
- Handles phone number formatting
- Includes development mode check
- Comprehensive error handling

### 2. `services/notificationService.js` (MODIFIED)

- Updated SMSNotificationService to use custom SMS provider
- Integrated with the new smsService
- Enhanced error handling and logging

### 3. `config/env.js` (MODIFIED)

- Added SMS configuration variables for TheBluNet
- Maintained backward compatibility with Twilio

### 4. `test-sms.js` (NEW)

- Test script to verify SMS functionality
- Tests both direct SMS service and notification service

## Environment Variables

Add these variables to your `.env` file:

```env
# SMS Configuration (TheBluNet)
SMS_PROVIDER=sms
SMS_USER=Baitak
SMS_PASS=Bai-@25!
SMS_SID=Baitak
SMS_TYPE=4
```

## Configuration Details

| Variable       | Value      | Description                              |
| -------------- | ---------- | ---------------------------------------- |
| `SMS_PROVIDER` | `sms`      | Sets the notification service to use SMS |
| `SMS_USER`     | `Baitak`   | Your SMS service username                |
| `SMS_PASS`     | `Bai-@25!` | Your SMS service password                |
| `SMS_SID`      | `Baitak`   | Your SMS service SID                     |
| `SMS_TYPE`     | `4`        | Message type for the SMS service         |

## Usage

### 1. Direct SMS Service

```javascript
const smsService = require("./services/smsService");

// Send SMS with environment check
const result = await smsService.sendSMSWithEnvCheck(
  "+1234567890",
  "Hello World!"
);
console.log(result);
```

### 2. Notification Service

```javascript
const NotificationFactory = require("./services/notificationService");

// Get SMS notification service
const notificationService = NotificationFactory.getService("sms");

// Send OTP
await notificationService.sendOTP("+1234567890", "123456", "login");

// Send booking confirmation
await notificationService.sendBookingConfirmation("+1234567890", {
  booking_number: "BK001",
  booking_date: "2024-01-15",
  booking_time: "10:00",
  total_price: 150.0,
});

// Send status update
await notificationService.sendStatusUpdate(
  "+1234567890",
  bookingData,
  "confirmed"
);
```

## Testing

Run the test script to verify SMS functionality:

```bash
node test-sms.js
```

**Note:** Replace the phone number in the test script with a real number for actual testing.

## Development vs Production

- **Development Mode**: SMS messages are logged to console instead of being sent
- **Production Mode**: SMS messages are sent via TheBluNet API

The mode is determined by the `NODE_ENV` environment variable.

## Error Handling

The SMS service includes comprehensive error handling for:

- Missing environment variables
- API request timeouts (10 seconds)
- HTTP errors
- Network connectivity issues
- Invalid responses

## API Response Format

### Success Response

```javascript
{
  success: true,
  message: "Message sent successfully",
  response: "API response data",
  isDevelopment: false // Only in development mode
}
```

### Error Response

```javascript
{
  success: false,
  message: "Failed to send message. Please try again.",
  error: "Error description",
  response: "API error response" // Optional
}
```

## Integration Points

The SMS service is integrated with:

1. **Authentication Controller** - OTP sending
2. **Booking Controller** - Booking confirmations and status updates
3. **Notification Service** - Centralized notification management

## Monitoring

Monitor SMS delivery through:

1. Console logs (development)
2. API response data (production)
3. Application error logs

## Troubleshooting

### Common Issues

1. **SMS not sending in development**

   - Check `NODE_ENV` is set to `development`
   - Messages are logged to console instead of being sent

2. **SMS not sending in production**

   - Verify all environment variables are set
   - Check API credentials
   - Verify phone number format (should include country code)

3. **Timeout errors**
   - Check network connectivity
   - Verify API endpoint is accessible
   - Consider increasing timeout if needed

### Debug Steps

1. Check environment variables:

   ```bash
   echo $SMS_USER
   echo $SMS_PASS
   echo $SMS_SID
   echo $SMS_TYPE
   ```

2. Test with a real phone number
3. Check server logs for error messages
4. Verify API credentials with TheBluNet

## Security Notes

- Store SMS credentials securely in environment variables
- Never commit credentials to version control
- Use different credentials for development and production
- Regularly rotate credentials

## Cost Considerations

- Monitor SMS usage through TheBluNet dashboard
- Implement rate limiting if needed
- Consider message length optimization
- Track delivery success rates
