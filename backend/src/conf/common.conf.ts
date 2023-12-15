import dotEnv from "dotenv";
dotEnv.config();

const config: any = {
  SERVER_PORT: process.env.SERVER_PORT || 5000,
  JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET,
  JWT_ACCESS_TOKEN_EXPIRES_IN_MINUTES:
    process.env.JWT_ACCESS_TOKEN_EXPIRES_IN_MINUTES || 5,
  JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_EXPIRES_IN_MINUTES:
    process.env.JWT_REFRESH_TOKEN_EXPIRES_IN_MINUTES || 131400,
  ORACLE_DB_CONNECTION_STR: process.env.ORACLE_DB_CONNECTION_STR || "sqlite::memory:",
  HASH_PASSWORD_SALT_ROUNDS: process.env.HASH_PASSWORD_SALT_ROUNDS || 10,
  CORS_CONFIG: {
    origin: ["http://localhost:4200"],
    methods: ["*"],
    preflightContinue: false,
    optionsSuccessStatus: 200,
    credentials: true,
  },
  REFRESH_TOKEN_COOKIE_NAME: "x-refresh-token",
  ACCESS_TOKEN_COOKIE_NAME: "x-access-token",
  CSRF_TOKEN_COOKIE_NAME: process.env.CSRF_TOKEN_COOKIE_NAME || 'csrf-token',
  FIREBASE_CONFIG: {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOM,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MSG_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASURE_ID
  },
  FRIEND_SCORE: {
    like: 2,
    comment: 5
  },
  REST_AUTH_BYPASS_URL: process.env.REST_AUTH_BYPASS_URL || '/users,/auth/login,/auth/refresh',
  DATABASE_MODE: {  }
};
   
export { config }