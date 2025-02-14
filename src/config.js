const dotenv = require("dotenv");
dotenv.config();

const {
  NODE_ENV,
  CACHE_HOST,
  CACHE_PORT,
  IMGUR_API_KEY,
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
  DB_DATABASE,
  AUTH_JWT_AUDIENCE,
  AUTH_JWT_ISSUER,
  AUTH_JWKS_URI,
  AUTH_JWKS_REQUESTS_PER_MINUTE,
  AUTH0_DOMAIN,
  AUTH0_CLIENT_ID,
  AUTH0_CLIENT_SECRET,
} = process.env;

module.exports = {
  NODE_ENV,
  CACHE_HOST,
  CACHE_PORT,
  IMGUR_API_KEY,
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
  DB_DATABASE,
  AUTH_JWT_AUDIENCE,
  AUTH_JWT_ISSUER,
  AUTH_JWKS_URI,
  AUTH_JWKS_REQUESTS_PER_MINUTE,
  AUTH0_DOMAIN,
  AUTH0_CLIENT_ID,
  AUTH0_CLIENT_SECRET,
};
