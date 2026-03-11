import * as dotenv from 'dotenv';
dotenv.config();
export const ENVIRONMENT = {
  MAIL: {
    SMTP_USER: process.env.EMAIL_USER,
    AUTH_PASS: process.env.EMAIL_PASS,
  },

  CONNECTION: {
    PORT: process.env.PORT,
  },

  OWNER: {
    OWNER_EMAIL: process.env.EMAIL_USER,
  },

  JWT: {
    JWT_SECRET: process.env.JWT_SECRET,
    EXPIRATION_TIME: process.env.JWT_EXPIRATION_TIME,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    JWT_REFRESH_EXP_TIME: process.env.JWT_REFRESH_EXP_TIME,
  },

  GITHUB: {
    CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    CALLBACK: 'http://localhost:4000/auth/github/callback',
  },
  GOOGLE: {
    CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    CALLBACK: 'http://localhost:4000/auth/google/callback',
  },
  WEB: {
    ORIGIN: process.env.ORIGIN
  }
};
