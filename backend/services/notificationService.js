const env = require('../config/env');

// Abstract Notification Service
class NotificationService {
  async sendOTP(recipient, otp, purpose) {
    throw new Error('sendOTP method must be implemented');
  }

  async sendBookingConfirmation(recipient, booking) {
    throw new Error('sendBookingConfirmation method must be implemented');
  }

  async sendStatusUpdate(recipient, booking, newStatus) {
    throw new Error('sendStatusUpdate method must be implemented');
  }
}

// Console Notification Service (for development)
class ConsoleNotificationService extends NotificationService {
  async sendOTP(recipient, otp, purpose) {
    console.log('='.repeat(50));
    console.log('📱 OTP NOTIFICATION');
    console.log(`Recipient: ${recipient}`);
    console.log(`OTP Code: ${otp}`);
    console.log(`Purpose: ${purpose}`);
    console.log(`Valid for: 10 minutes`);
    console.log('='.repeat(50));
    return { success: true, messageId: 'console-' + Date.now() };
  }

  async sendBookingConfirmation(recipient, booking) {
    console.log('='.repeat(50));
    console.log('✅ BOOKING CONFIRMATION');
    console.log(`Recipient: ${recipient}`);
    console.log(`Booking #: ${booking.booking_number}`);
    console.log(`Date: ${booking.booking_date}`);
    console.log(`Time: ${booking.booking_time}`);
    console.log('='.repeat(50));
    return { success: true, messageId: 'console-' + Date.now() };
  }

  async sendStatusUpdate(recipient, booking, newStatus) {
    console.log('='.repeat(50));
    console.log('📊 STATUS UPDATE');
    console.log(`Recipient: ${recipient}`);
    console.log(`Booking #: ${booking.booking_number}`);
    console.log(`New Status: ${newStatus}`);
    console.log('='.repeat(50));
    return { success: true, messageId: 'console-' + Date.now() };
  }
}

// SMS Notification Service (Custom Provider - TheBluNet)
class SMSNotificationService extends NotificationService {
  constructor() {
    super();
    this.smsService = require('./smsService');
  }

  async sendOTP(recipient, otp, purpose) {
    try {
      const message = `Your ${env.appName} verification code is: ${otp}. Valid for 10 minutes.`;
      
      const result = await this.smsService.sendSMSWithEnvCheck(recipient, message);
      
      if (result.success) {
        console.log(`SMS sent to ${recipient}: ${message}`);
        return { success: true, messageId: 'sms-' + Date.now(), result };
      } else {
        console.error('SMS sending failed:', result);
        throw new Error(result.message || 'Failed to send SMS');
      }
    } catch (error) {
      console.error('SMS sending failed:', error);
      throw error;
    }
  }

  async sendBookingConfirmation(recipient, booking) {
    try {
      const message = `${env.appName}: Booking ${booking.booking_number} confirmed for ${booking.booking_date} at ${booking.booking_time}. Total: $${booking.total_price}`;
      
      const result = await this.smsService.sendSMSWithEnvCheck(recipient, message);
      
      if (result.success) {
        console.log(`SMS sent to ${recipient}: ${message}`);
        return { success: true, messageId: 'sms-' + Date.now(), result };
      } else {
        console.error('SMS sending failed:', result);
        throw new Error(result.message || 'Failed to send SMS');
      }
    } catch (error) {
      console.error('SMS sending failed:', error);
      throw error;
    }
  }

  async sendStatusUpdate(recipient, booking, newStatus) {
    try {
      let message = `${env.appName}: Booking ${booking.booking_number} `;
      
      switch (newStatus) {
        case 'confirmed':
          message += 'has been confirmed by the provider.';
          break;
        case 'provider_on_way':
          message += '- Provider is on the way!';
          break;
        case 'provider_arrived':
          message += '- Provider has arrived at your location.';
          break;
        case 'in_progress':
          message += '- Service has started.';
          break;
        case 'completed':
          message += 'has been completed. Please rate your experience.';
          break;
        case 'cancelled':
          message += 'has been cancelled.';
          break;
        default:
          message += `status updated to ${newStatus}.`;
      }
      
      const result = await this.smsService.sendSMSWithEnvCheck(recipient, message);
      
      if (result.success) {
        console.log(`SMS sent to ${recipient}: ${message}`);
        return { success: true, messageId: 'sms-' + Date.now(), result };
      } else {
        console.error('SMS sending failed:', result);
        throw new Error(result.message || 'Failed to send SMS');
      }
    } catch (error) {
      console.error('SMS sending failed:', error);
      throw error;
    }
  }

  async sendSMS(recipient, message) {
    try {
      const result = await this.smsService.sendSMSWithEnvCheck(recipient, message);
      
      if (result.success) {
        console.log(`SMS sent to ${recipient}: ${message}`);
        return { success: true, messageId: 'sms-' + Date.now(), result };
      } else {
        console.error('SMS sending failed:', result);
        throw new Error(result.message || 'Failed to send SMS');
      }
    } catch (error) {
      console.error('SMS sending failed:', error);
      throw error;
    }
  }
}

// Email Notification Service
class EmailNotificationService extends NotificationService {
  constructor() {
    super();
    this.emailService = require('./emailService');
  }

  async sendOTP(recipient, otp, purpose) {
    try {
      return await this.emailService.sendOTP(recipient, otp, purpose);
    } catch (error) {
      console.error('Email sending failed:', error);
      throw error;
    }
  }

  async sendBookingConfirmation(recipient, booking) {
    try {
      return await this.emailService.sendBookingConfirmation(recipient, booking);
    } catch (error) {
      console.error('Email sending failed:', error);
      throw error;
    }
  }

  async sendStatusUpdate(recipient, booking, newStatus) {
    try {
      return await this.emailService.sendBookingStatusUpdate(recipient, booking, newStatus);
    } catch (error) {
      console.error('Email sending failed:', error);
      throw error;
    }
  }
}

// Factory to get the appropriate notification service
class NotificationFactory {
  static getService(type = null) {
    // Determine the type based on environment if not specified
    if (!type) {
      type = env.sms.provider || 'console'; // Default to console for development
    }

    switch (type) {
      case 'sms':
        return new SMSNotificationService();
      case 'email':
        return new EmailNotificationService();
      case 'console':
        return new ConsoleNotificationService();
      default:
        // If provider is set to 'custom' or any other value, use SMS
        return new SMSNotificationService();
    }
  }
}

module.exports = NotificationFactory;
