declare module 'bcrypt';
declare module 'jsonwebtoken';

declare namespace NodeJS {
  interface ProcessEnv {
    JWT_SECRET: string;
    DATABASE_URL: string;
    API_KEY: string;
  }
}
