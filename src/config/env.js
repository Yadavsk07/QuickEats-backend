require('dotenv').config();

const env = {
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/foodorder',
  JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret_key',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
  NODE_ENV: process.env.NODE_ENV || 'development',
};

module.exports = env;
