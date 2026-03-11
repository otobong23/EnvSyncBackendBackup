declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string;
    MONGO_DB: string;

    JWT_SECRET: string;
    JWT_EXPIRATION_TIME: string;

    JWT_REFRESH_SECRET: string;
    JWT_REFRESH_EXP_TIME: string;

    EMAIL_USER: string;
    EMAIL_PASS: string;

    GITHUB_CLIENT_ID: string;
    GITHUB_CLIENT_SECRET: string;

    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;

    ORIGIN: string;

    NODE_ENV: "development" | "production" | "test";
  }
}
