import dotEnv from "dotenv";
dotEnv.config();

const config = {
  SERVER_PORT: process.env.SERVER_PORT,
  JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET,
  JWT_ACCESS_TOKEN_EXPIRES_IN_MINUTES: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN_MINUTES,
  JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_EXPIRES_IN_MINUTES: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN_MINUTES,
  ORACLE_DB_CONNECTION_STR: process.env.ORACLE_DB_CONNECTION_STR,
  HASH_PASSWORD_SALT_ROUNDS: process.env.HASH_PASSWORD_SALT_ROUNDS,
  CORS_CONFIG: {
    origin: ["http://localhost:4200"],
    methods: ["*"],
    preflightContinue: false,
    optionsSuccessStatus: 200,
    credentials: true,
  },
  REFRESH_TOKEN_COOKIE_NAME: "rt",
  ACCESS_TOKEN_COOKIE_NAME: "at",
  SESSION_HEADER_NAME: 's-id',
  COOKIE_SIGNED_KEY: process.env.COOKIE_SIGNED_KEY,
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
    like: process.env.POST_LIKE_SCORE,
    comment: process.env.POST_COMMENT_SCORE
  },
  REST_AUTH_BYPASS_URL: process.env.REST_AUTH_BYPASS_URL,
  DATABASE_MODE: {},
  LOGGER_CONFIG: {}
};
   
export { config }