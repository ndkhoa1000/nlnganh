import dotenv from 'dotenv';
import { AppConfig } from '@/types/common.types';

dotenv.config();

const config: AppConfig = {
  port: parseInt(process.env.PORT || '3001', 10),
  env: process.env.NODE_ENV || 'development',
  serviceName: process.env.SERVICE_NAME || 'user-service',
  
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/userdb',
    options: {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    },
  },
  
  jwt: {
    secret: process.env.JWT_SECRET || 'your_jwt_secret',
    expiresIn: process.env.JWT_EXPIRE || '7d',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'your_refresh_secret',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRE || '30d',
  },
  
  rabbitmq: {
    url: process.env.RABBITMQ_URL || 'amqp://admin:admin123@localhost:5672',
    exchanges: {
      userEvents: 'user.events',
    },
    queues: {
      userNotifications: 'user.notifications',
    },
  },
  
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
};

export default config;
