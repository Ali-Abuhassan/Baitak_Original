const { createGmailTransporter } = require('../config/emailConfig');
const env = require('../config/env');

class EmailService {
  constructor() {
    this.transporter = null;
  }

  getTransporter() {
    if (!this.transporter) {
      this.transporter = createGmailTransporter();
    }
    return this.transporter;
  }

  async sendOTP(email, otp, purpose) {
    const transporter = this.getTransporter();

    const purposeText = {
      login: 'Login',
      signup: 'Sign Up',
      reset_password: 'Password Reset',
      verify_email: 'Email Verification',
      booking_confirmation: 'Booking Confirmation'
    }[purpose] || purpose;

    const mailOptions = {
      from: {
        name: env.appName,
        address: env.gmail.gmailUser,
      },
      to: email,
      subject: `${env.appName} - ${purposeText} Verification Code`,
      html: this.getOTPHTML(otp, purposeText),
      text: this.getOTPText(otp, purposeText),
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log(`OTP email sent to ${email}:`, info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending OTP email:', error);
      throw new Error(`Failed to send OTP email: ${error.message}`);
    }
  }

  async sendWelcomeEmail(email, userName) {
    const transporter = this.getTransporter();

    const mailOptions = {
      from: {
        name: env.appName,
        address: env.gmail.gmailUser,
      },
      to: email,
      subject: `Welcome to ${env.appName} - Your Home Service Marketplace!`,
      html: this.getWelcomeHTML(userName),
      text: this.getWelcomeText(userName),
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log(`Welcome email sent to ${email}:`, info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending welcome email:', error);
      throw new Error(`Failed to send welcome email: ${error.message}`);
    }
  }

  async sendBookingConfirmation(email, booking) {
    const transporter = this.getTransporter();

    const mailOptions = {
      from: {
        name: env.appName,
        address: env.gmail.gmailUser,
      },
      to: email,
      subject: `Booking Confirmed - ${booking.booking_number}`,
      html: this.getBookingConfirmationHTML(booking),
      text: this.getBookingConfirmationText(booking),
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log(`Booking confirmation sent to ${email}:`, info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending booking confirmation:', error);
      throw new Error(`Failed to send booking confirmation: ${error.message}`);
    }
  }

  async sendBookingStatusUpdate(email, booking, newStatus) {
    const transporter = this.getTransporter();

    const statusText = {
      confirmed: 'Confirmed',
      provider_on_way: 'Provider On The Way',
      provider_arrived: 'Provider Arrived',
      in_progress: 'In Progress',
      completed: 'Completed',
      cancelled: 'Cancelled'
    }[newStatus] || newStatus;

    const mailOptions = {
      from: {
        name: env.appName,
        address: env.gmail.gmailUser,
      },
      to: email,
      subject: `Booking Update - ${statusText} - ${booking.booking_number}`,
      html: this.getStatusUpdateHTML(booking, statusText),
      text: this.getStatusUpdateText(booking, statusText),
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log(`Status update sent to ${email}:`, info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending status update:', error);
      throw new Error(`Failed to send status update: ${error.message}`);
    }
  }

  async sendProviderApproval(email, providerName, status) {
    const transporter = this.getTransporter();

    const subject = status === 'approved' 
      ? 'Your Provider Account Has Been Approved!' 
      : 'Provider Account Application Update';

    const mailOptions = {
      from: {
        name: env.appName,
        address: env.gmail.gmailUser,
      },
      to: email,
      subject,
      html: this.getProviderApprovalHTML(providerName, status),
      text: this.getProviderApprovalText(providerName, status),
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log(`Provider approval email sent to ${email}:`, info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending provider approval email:', error);
      throw new Error(`Failed to send provider approval email: ${error.message}`);
    }
  }

  // HTML Templates
  getOTPHTML(otp, purpose) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0;">${env.appName}</h1>
        </div>
        <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333;">Your ${purpose} Verification Code</h2>
          <div style="background: #f5f5f5; padding: 20px; text-align: center; border-radius: 5px; margin: 20px 0;">
            <h1 style="color: #667eea; letter-spacing: 5px; margin: 0;">${otp}</h1>
          </div>
          <p style="color: #666;">This code will expire in 10 minutes.</p>
          <p style="color: #666;">If you didn't request this code, please ignore this email.</p>
        </div>
      </div>
    `;
  }

  getOTPText(otp, purpose) {
    return `
${env.appName}

Your ${purpose} Verification Code: ${otp}

This code will expire in 10 minutes.
If you didn't request this code, please ignore this email.
    `;
  }

  getWelcomeHTML(userName) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0;">Welcome to ${env.appName}!</h1>
        </div>
        <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333;">Hello ${userName}!</h2>
          <p style="color: #666;">Thank you for joining ${env.appName} - your trusted home service marketplace.</p>
          <p style="color: #666;">With ${env.appName}, you can:</p>
          <ul style="color: #666;">
            <li>Find trusted service providers for all your home needs</li>
            <li>Book services instantly with transparent pricing</li>
            <li>Track your bookings in real-time</li>
            <li>Rate and review service providers</li>
          </ul>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${env.frontendUrl}" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Start Browsing Services</a>
          </div>
          <p style="color: #999; font-size: 12px;">Need help? Contact us at support@${env.appName.toLowerCase()}.com</p>
        </div>
      </div>
    `;
  }

  getWelcomeText(userName) {
    return `
Welcome to ${env.appName}!

Hello ${userName}!

Thank you for joining ${env.appName} - your trusted home service marketplace.

With ${env.appName}, you can:
- Find trusted service providers for all your home needs
- Book services instantly with transparent pricing
- Track your bookings in real-time
- Rate and review service providers

Start browsing services at: ${env.frontendUrl}

Need help? Contact us at support@${env.appName.toLowerCase()}.com
    `;
  }

  getBookingConfirmationHTML(booking) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0;">Booking Confirmed!</h1>
        </div>
        <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333;">Booking Details</h2>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Booking Number:</strong> ${booking.booking_number}</p>
            <p style="margin: 5px 0;"><strong>Date:</strong> ${booking.booking_date}</p>
            <p style="margin: 5px 0;"><strong>Time:</strong> ${booking.booking_time}</p>
            <p style="margin: 5px 0;"><strong>Service:</strong> ${booking.service_name || 'Service'}</p>
            <p style="margin: 5px 0;"><strong>Provider:</strong> ${booking.provider_name || 'Provider'}</p>
            <p style="margin: 5px 0;"><strong>Total Price:</strong> $${booking.total_price}</p>
          </div>
          <p style="color: #666;">The service provider will arrive at the scheduled time. You can track the status in your dashboard.</p>
        </div>
      </div>
    `;
  }

  getBookingConfirmationText(booking) {
    return `
Booking Confirmed!

Booking Details:
- Booking Number: ${booking.booking_number}
- Date: ${booking.booking_date}
- Time: ${booking.booking_time}
- Service: ${booking.service_name || 'Service'}
- Provider: ${booking.provider_name || 'Provider'}
- Total Price: $${booking.total_price}

The service provider will arrive at the scheduled time. You can track the status in your dashboard.
    `;
  }

  getStatusUpdateHTML(booking, status) {
    const statusMessages = {
      'Confirmed': 'Your booking has been confirmed by the provider.',
      'Provider On The Way': 'The service provider is on their way to your location!',
      'Provider Arrived': 'The service provider has arrived at your location.',
      'In Progress': 'Your service is now in progress.',
      'Completed': 'Your service has been completed. Please rate your experience!',
      'Cancelled': 'Your booking has been cancelled.'
    };

    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0;">Booking Update</h1>
        </div>
        <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333;">Status: ${status}</h2>
          <p style="color: #666;">${statusMessages[status] || 'Your booking status has been updated.'}</p>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Booking Number:</strong> ${booking.booking_number}</p>
            <p style="margin: 5px 0;"><strong>Date:</strong> ${booking.booking_date}</p>
            <p style="margin: 5px 0;"><strong>Time:</strong> ${booking.booking_time}</p>
          </div>
        </div>
      </div>
    `;
  }

  getStatusUpdateText(booking, status) {
    const statusMessages = {
      'Confirmed': 'Your booking has been confirmed by the provider.',
      'Provider On The Way': 'The service provider is on their way to your location!',
      'Provider Arrived': 'The service provider has arrived at your location.',
      'In Progress': 'Your service is now in progress.',
      'Completed': 'Your service has been completed. Please rate your experience!',
      'Cancelled': 'Your booking has been cancelled.'
    };

    return `
Booking Update - Status: ${status}

${statusMessages[status] || 'Your booking status has been updated.'}

Booking Details:
- Booking Number: ${booking.booking_number}
- Date: ${booking.booking_date}
- Time: ${booking.booking_time}
    `;
  }

  getProviderApprovalHTML(providerName, status) {
    const isApproved = status === 'approved';
    const title = isApproved ? 'Congratulations!' : 'Application Update';
    const message = isApproved 
      ? `Your provider account has been approved! You can now start offering your services on ${env.appName}.`
      : `Unfortunately, your provider application has been ${status}. Please contact support for more information.`;

    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0;">${title}</h1>
        </div>
        <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333;">Hello ${providerName}!</h2>
          <p style="color: #666;">${message}</p>
          ${isApproved ? `
            <div style="text-align: center; margin: 30px 0;">
              <a href="${env.frontendUrl}/provider/dashboard" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Go to Dashboard</a>
            </div>
            <p style="color: #666;">Tips to get started:</p>
            <ul style="color: #666;">
              <li>Complete your profile with portfolio images</li>
              <li>Set competitive pricing for your services</li>
              <li>Respond quickly to booking requests</li>
              <li>Maintain high service quality for good ratings</li>
            </ul>
          ` : ''}
        </div>
      </div>
    `;
  }

  getProviderApprovalText(providerName, status) {
    const isApproved = status === 'approved';
    const message = isApproved 
      ? `Your provider account has been approved! You can now start offering your services on ${env.appName}.`
      : `Unfortunately, your provider application has been ${status}. Please contact support for more information.`;

    return `
Hello ${providerName}!

${message}

${isApproved ? `
Tips to get started:
- Complete your profile with portfolio images
- Set competitive pricing for your services
- Respond quickly to booking requests
- Maintain high service quality for good ratings

Go to your dashboard: ${env.frontendUrl}/provider/dashboard
` : ''}
    `;
  }
}

module.exports = new EmailService();
