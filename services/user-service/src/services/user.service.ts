import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '@/models/User.model';
import { 
  CreateUserDTO, 
  UpdateUserDTO, 
  LoginDTO, 
  RefreshTokenDTO,
  ForgotPasswordDTO,
  ResetPasswordDTO,
  ChangePasswordDTO,
  UserResponse,
  AuthResponse,
  UserListQuery,
  PaginatedResponse,
  UserCreatedEvent,
  UserUpdatedEvent,
  UserDeletedEvent
} from '@/types/user.types';
import { ServiceResponse } from '@/types/common.types';
import config from '@/config';
import logger from '@/utils/logger';
import messageQueue from './messageQueue.service';
import { createPaginationResponse } from '@/utils/response';

class UserService {
  private static instance: UserService;

  private constructor() {}

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  public async createUser(userData: CreateUserDTO): Promise<ServiceResponse<AuthResponse>> {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        return {
          success: false,
          error: 'User with this email already exists',
          statusCode: 409,
        };
      }

      // Create new user
      const user = new User(userData);
      await user.save();

      // Generate tokens
      const { accessToken, refreshToken } = user.generateAuthToken();
      
      // Save refresh token
      user.refreshTokens.push(refreshToken);
      await user.save();

      // Publish user created event
      const userCreatedEvent: UserCreatedEvent = {
        type: 'USER_CREATED',
        data: {
          userId: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          createdAt: user.createdAt,
        },
      };
      
      await messageQueue.publishUserEvent(userCreatedEvent);

      const userResponse: UserResponse = this.transformUserToResponse(user);

      logger.info(`User created successfully: ${user.email}`);

      return {
        success: true,
        data: {
          user: userResponse,
          accessToken,
          refreshToken,
        },
        statusCode: 201,
      };
    } catch (error) {
      logger.error('Error creating user:', error);
      return {
        success: false,
        error: 'Failed to create user',
        statusCode: 500,
      };
    }
  }

  public async login(loginData: LoginDTO): Promise<ServiceResponse<AuthResponse>> {
    try {
      // Find user with password
      const user = await User.findOne({ email: loginData.email }).select('+password +refreshTokens');
      
      if (!user || !await user.comparePassword(loginData.password)) {
        return {
          success: false,
          error: 'Invalid email or password',
          statusCode: 401,
        };
      }

      if (!user.isActive) {
        return {
          success: false,
          error: 'Account is deactivated',
          statusCode: 401,
        };
      }

      // Generate new tokens
      const { accessToken, refreshToken } = user.generateAuthToken();
      
      // Add refresh token and limit to 5 active tokens
      user.refreshTokens.push(refreshToken);
      if (user.refreshTokens.length > 5) {
        user.refreshTokens = user.refreshTokens.slice(-5);
      }
      
      // Update last login
      user.lastLogin = new Date();
      await user.save();

      const userResponse: UserResponse = this.transformUserToResponse(user);

      logger.info(`User logged in successfully: ${user.email}`);

      return {
        success: true,
        data: {
          user: userResponse,
          accessToken,
          refreshToken,
        },
        statusCode: 200,
      };
    } catch (error) {
      logger.error('Error during login:', error);
      return {
        success: false,
        error: 'Login failed',
        statusCode: 500,
      };
    }
  }

  public async refreshToken(tokenData: RefreshTokenDTO): Promise<ServiceResponse<AuthResponse>> {
    try {
      const decoded = jwt.verify(tokenData.refreshToken, config.jwt.refreshSecret) as any;
      
      const user = await User.findById(decoded._id).select('+refreshTokens');
      
      if (!user || !user.isActive || !user.refreshTokens.includes(tokenData.refreshToken)) {
        return {
          success: false,
          error: 'Invalid refresh token',
          statusCode: 401,
        };
      }

      // Generate new tokens
      const { accessToken, refreshToken } = user.generateAuthToken();
      
      // Replace old refresh token with new one
      user.refreshTokens = user.refreshTokens.filter(token => token !== tokenData.refreshToken);
      user.refreshTokens.push(refreshToken);
      await user.save();

      const userResponse: UserResponse = this.transformUserToResponse(user);

      return {
        success: true,
        data: {
          user: userResponse,
          accessToken,
          refreshToken,
        },
        statusCode: 200,
      };
    } catch (error) {
      logger.error('Error refreshing token:', error);
      return {
        success: false,
        error: 'Token refresh failed',
        statusCode: 401,
      };
    }
  }

  public async logout(userId: string, refreshToken?: string): Promise<ServiceResponse<void>> {
    try {
      const user = await User.findById(userId).select('+refreshTokens');
      
      if (user) {
        if (refreshToken) {
          // Remove specific refresh token
          user.refreshTokens = user.refreshTokens.filter(token => token !== refreshToken);
        } else {
          // Remove all refresh tokens (logout from all devices)
          user.refreshTokens = [];
        }
        await user.save();
      }

      return {
        success: true,
        statusCode: 200,
      };
    } catch (error) {
      logger.error('Error during logout:', error);
      return {
        success: false,
        error: 'Logout failed',
        statusCode: 500,
      };
    }
  }

  public async getUserById(userId: string): Promise<ServiceResponse<UserResponse>> {
    try {
      const user = await User.findById(userId);
      
      if (!user) {
        return {
          success: false,
          error: 'User not found',
          statusCode: 404,
        };
      }

      const userResponse: UserResponse = this.transformUserToResponse(user);

      return {
        success: true,
        data: userResponse,
        statusCode: 200,
      };
    } catch (error) {
      logger.error('Error getting user by ID:', error);
      return {
        success: false,
        error: 'Failed to get user',
        statusCode: 500,
      };
    }
  }

  public async updateUser(userId: string, updateData: UpdateUserDTO): Promise<ServiceResponse<UserResponse>> {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true, runValidators: true }
      );

      if (!user) {
        return {
          success: false,
          error: 'User not found',
          statusCode: 404,
        };
      }

      // Publish user updated event
      const userUpdatedEvent: UserUpdatedEvent = {
        type: 'USER_UPDATED',
        data: {
          userId: user._id,
          email: user.email,
          updatedFields: updateData,
          updatedAt: user.updatedAt,
        },
      };
      
      await messageQueue.publishUserEvent(userUpdatedEvent);

      const userResponse: UserResponse = this.transformUserToResponse(user);

      logger.info(`User updated successfully: ${user.email}`);

      return {
        success: true,
        data: userResponse,
        statusCode: 200,
      };
    } catch (error) {
      logger.error('Error updating user:', error);
      return {
        success: false,
        error: 'Failed to update user',
        statusCode: 500,
      };
    }
  }

  public async deleteUser(userId: string): Promise<ServiceResponse<void>> {
    try {
      const user = await User.findByIdAndDelete(userId);

      if (!user) {
        return {
          success: false,
          error: 'User not found',
          statusCode: 404,
        };
      }

      // Publish user deleted event
      const userDeletedEvent: UserDeletedEvent = {
        type: 'USER_DELETED',
        data: {
          userId: user._id,
          email: user.email,
          deletedAt: new Date(),
        },
      };
      
      await messageQueue.publishUserEvent(userDeletedEvent);

      logger.info(`User deleted successfully: ${user.email}`);

      return {
        success: true,
        statusCode: 200,
      };
    } catch (error) {
      logger.error('Error deleting user:', error);
      return {
        success: false,
        error: 'Failed to delete user',
        statusCode: 500,
      };
    }
  }

  public async getUsers(query: UserListQuery): Promise<ServiceResponse<PaginatedResponse<UserResponse>>> {
    try {
      const { page = 1, limit = 10, sort = 'createdAt', order = 'desc', search, role, isActive } = query;
      
      // Build filter
      const filter: any = {};
      
      if (search) {
        filter.$or = [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ];
      }
      
      if (role) filter.role = role;
      if (typeof isActive === 'boolean') filter.isActive = isActive;

      // Build sort
      const sortOrder = order === 'asc' ? 1 : -1;
      const sortObj: any = { [sort]: sortOrder };

      // Execute queries
      const [users, total] = await Promise.all([
        User.find(filter)
          .sort(sortObj)
          .skip((page - 1) * limit)
          .limit(limit)
          .lean(),
        User.countDocuments(filter),
      ]);

      const userResponses: UserResponse[] = users.map(user => this.transformUserToResponse(user));
      const paginatedResponse = createPaginationResponse(userResponses, page, limit, total);

      return {
        success: true,
        data: paginatedResponse,
        statusCode: 200,
      };
    } catch (error) {
      logger.error('Error getting users:', error);
      return {
        success: false,
        error: 'Failed to get users',
        statusCode: 500,
      };
    }
  }

  private transformUserToResponse(user: any): UserResponse {
    return {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName || `${user.firstName} ${user.lastName}`,
      phone: user.phone,
      role: user.role,
      isActive: user.isActive,
      isEmailVerified: user.isEmailVerified,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}

export default UserService.getInstance();
