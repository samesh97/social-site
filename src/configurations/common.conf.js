const dotEnv = require("dotenv");
dotEnv.config();

const config = {
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
};
   
module.exports = { config };