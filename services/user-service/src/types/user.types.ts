import { Document } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  lastLogin?: Date;
  refreshTokens: string[];
  createdAt: Date;
  updatedAt: Date;
  
  // Virtual fields
  fullName: string;
  
  // Methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAuthToken(): { accessToken: string; refreshToken: string };
  generateEmailVerificationToken(): string;
  generatePasswordResetToken(): string;
}

export enum UserRole {
  CUSTOMER = 'customer',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin'
}

export interface CreateUserDTO {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role?: UserRole;
}

export interface UpdateUserDTO {
  firstName?: string;
  lastName?: string;
  phone?: string;
  isActive?: boolean;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RefreshTokenDTO {
  refreshToken: string;
}

export interface ForgotPasswordDTO {
  email: string;
}

export interface ResetPasswordDTO {
  token: string;
  newPassword: string;
}

export interface ChangePasswordDTO {
  currentPassword: string;
  newPassword: string;
}

export interface UserResponse {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
  isEmailVerified: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  user: UserResponse;
  accessToken: string;
  refreshToken: string;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface UserListQuery extends PaginationQuery {
  search?: string;
  role?: UserRole;
  isActive?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Event types for message queue
export interface UserCreatedEvent {
  type: 'USER_CREATED';
  data: {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    createdAt: Date;
  };
}

export interface UserUpdatedEvent {
  type: 'USER_UPDATED';
  data: {
    userId: string;
    email: string;
    updatedFields: Partial<UserResponse>;
    updatedAt: Date;
  };
}

export interface UserDeletedEvent {
  type: 'USER_DELETED';
  data: {
    userId: string;
    email: string;
    deletedAt: Date;
  };
}

export type UserEvent = UserCreatedEvent | UserUpdatedEvent | UserDeletedEvent;
