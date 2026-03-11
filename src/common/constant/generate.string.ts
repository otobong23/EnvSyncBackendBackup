import crypto from 'crypto'

export const generateResetOTP = (): string => {
  // Define the length and character of the OTP
  const otpLength = 30;
  const characters =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

  // Generate a random OTP string of the specified length
  let otp = '';
  for (let i = 0; i < otpLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    otp += characters[randomIndex];
  }

  return otp;
};

export const generateVerifyOTP = (length=6): string => {
  // Define the length and character of the OTP
  return crypto.randomInt(0, Math.pow(10, length)).toString().padStart(length, '0');
};

export const generateRandomTokenForLoggedIn = async (): Promise<string> => {
  // Define the length and character of the OTP
  const otpLength = 5;
  const characters =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

  // Generate a random OTP string of the specified length
  let otp = '';
  for (let i = 0; i < otpLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    otp += characters[randomIndex];
  }

  return otp;
};
