import { Request } from 'express';
import { UserRole } from './user.types';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  errors?: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
    email: string;
    role: UserRole;
    isActive: boolean;
  };
}

export interface ServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
}

export interface DatabaseConfig {
  uri: string;
  options?: {
    maxPoolSize?: number;
    serverSelectionTimeoutMS?: number;
    socketTimeoutMS?: number;
  };
}

export interface JWTConfig {
  secret: string;
  expiresIn: string;
  refreshSecret: string;
  refreshExpiresIn: string;
}

export interface RabbitMQConfig {
  url: string;
  exchanges: {
    userEvents: string;
  };
  queues: {
    userNotifications: string;
  };
}

export interface AppConfig {
  port: number;
  env: string;
  serviceName: string;
  database: DatabaseConfig;
  jwt: JWTConfig;
  rabbitmq: RabbitMQConfig;
  redis: {
    url: string;
  };
}

export interface MetricsConfig {
  port: number;
  path: string;
}
