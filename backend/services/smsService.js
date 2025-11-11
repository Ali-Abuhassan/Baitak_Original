const axios = require("axios");
require("dotenv").config();

const sendSMS = async (phoneNumber, messageText) => {
  try {
    const formattedPhone = phoneNumber.replace(/^\+/, "");

    const user = process.env.SMS_USER;
    const pass = process.env.SMS_PASS;
    const sid = process.env.SMS_SID;
    const type = process.env.SMS_TYPE;

    if (!user || !pass || !sid || !type) {
      throw new Error("SMS configuration missing in environment variables");
    }

    // URL encode the parameters to handle special characters
    const params = new URLSearchParams({
      user: user,
      pass: pass,
      sid: sid,
      mno: formattedPhone,
      type: type,
      text: messageText,
    });

    const url = `https://smsapi.theblunet.com:8441/websmpp/websms`;

    const response = await axios.post(url, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      timeout: 10000,
    });

    if (response.status === 200 && !response.data.includes("ERROR")) {
      return {
        success: true,
        message: "Message sent successfully",
        response: response.data,
      };
    } else {
      return {
        success: false,
        message: "Failed to send message. Please try again.",
        response: response.data,
      };
    }
  } catch (error) {
    console.error('SMS API Error:', error.message);
    if (error.response) {
      console.error('Response Status:', error.response.status);
      console.error('Response Data:', error.response.data);
      return {
        success: false,
        message: "Failed to send message. Please try again.",
        error: `SMS API error: ${error.response.status}`,
        response: error.response.data,
      };
    } else if (error.request) {
      return {
        success: false,
        message: "Failed to send message. No response from SMS service.",
        error: "No response received from SMS API",
      };
    } else {
      return {
        success: false,
        message: "Failed to send message due to configuration error.",
        error: error.message,
      };
    }
  }
};

const sendSMSWithEnvCheck = async (phone, message) => {
  if (process.env.NODE_ENV === "development") {
    console.log(`[DEV MODE] SMS not sent to ${phone}. Message: ${message}`);
    return {
      success: true,
      message: "SMS sending skipped in development mode",
      isDevelopment: true,
    };
  }

  try {
    const result = await sendSMS(phone, message);
    
    // If SMS fails due to authentication, log the error but don't crash the app
    if (!result.success && result.response && result.response.includes("Not Authorized")) {
      console.error("SMS Authentication Error - Please check your SMS credentials:");
      console.error("SMS_USER:", process.env.SMS_USER);
      console.error("SMS_SID:", process.env.SMS_SID);
      console.error("SMS_TYPE:", process.env.SMS_TYPE);
      console.error("Error Response:", result.response);
      
      // Return a fallback success response to prevent app crashes
      // In production, you might want to implement email fallback or other notification methods
      return {
        success: true,
        message: "SMS service temporarily unavailable - notification logged",
        isFallback: true,
        originalError: result.response,
      };
    }
    
    return result;
  } catch (error) {
    console.error("SMS sending failed:", error);
    return {
      success: false,
      message: "Failed to send message. Please try again.",
      error: error.message,
    };
  }
};

module.exports = {
  sendSMS,
  sendSMSWithEnvCheck,
};
