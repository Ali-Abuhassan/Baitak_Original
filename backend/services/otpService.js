const { redis } = require("../config/redis");

class OTPService {
  constructor() {
    this.prefix = "OTP";
    this.ttl = 300; // 5 mins expiration
    this.maxAttempts = 5; // Max allowed attempts
  }

//   _key(phone) {
//     return `${this.prefix}:${phone}`;
//   }

//   _attemptsKey(phone) {
//     return `${this.prefix}:${phone}:attempts`;
//   }

//   /**
//    * Generate and save OTP in Redis
//    */
//   async generateOTP(phone) {
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();

//     // Store OTP in Redis (5 min TTL)
//     await redis.set(this._key(phone), otp, { EX: this.ttl });

//     // Reset attempts
//     await redis.del(this._attemptsKey(phone));

//     return otp;
//   }

//   /**
//    * Verify OTP
//    */
//   async verifyOTP(phone, userOtp) {
//     const key = this._key(phone);
//     const attemptsKey = this._attemptsKey(phone);

//     const storedOtp = await redis.get(key);

//     if (!storedOtp) {
//       return { success: false, message: "OTP expired or not found" };
//     }
_key(recipient, purpose) {
  return `OTP:${recipient}:${purpose}`;
}

_attemptsKey(recipient, purpose) {
  return `OTP:${recipient}:${purpose}:attempts`;
}

async generateOTP(recipient, purpose) {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await redis.set(this._key(recipient, purpose), otp, { EX: this.ttl });
  await redis.del(this._attemptsKey(recipient, purpose));

  return otp;
}

async verifyOTP(recipient, purpose, userOtp) {
  const key = this._key(recipient, purpose);
  const attemptsKey = this._attemptsKey(recipient, purpose);

  const storedOtp = await redis.get(key);
  if (!storedOtp) return { success: false };

    // Get current attempts
    let attempts = parseInt(await redis.get(attemptsKey)) || 0;

    if (attempts >= this.maxAttempts) {
      return { success: false, message: "Too many attempts. OTP blocked." };
    }

    if (storedOtp !== userOtp) {
      attempts++;
      await redis.set(attemptsKey, attempts, { EX: this.ttl });
      return { success: false, message: "Incorrect OTP", attempts };
    }

    // OTP correct → delete both keys
    await redis.del(key);
    await redis.del(attemptsKey);

    return { success: true };
  }
}

module.exports = new OTPService();
