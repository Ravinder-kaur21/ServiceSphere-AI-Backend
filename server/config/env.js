import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: Number(process.env.PORT || 4000),
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/servicesphere_ai',
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-key',
};
