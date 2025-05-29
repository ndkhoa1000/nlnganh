import { Request, Response } from 'express';
import { AuthenticatedRequest } from '@/types/common.types';
import { 
  CreateUserDTO, 
  UpdateUserDTO, 
  LoginDTO, 
  RefreshTokenDTO,
  UserListQuery 
} from '@/types/user.types';
import userService from '@/services/user.service';
import { ResponseHelper } from '@/utils/response';
import logger from '@/utils/logger';

class UserController {
  public async register(req: Request, res: Response): Promise<void> {
    try {
      const userData: CreateUserDTO = req.body;
      const result = await userService.createUser(userData);

      if (!result.success) {
        ResponseHelper.error(res, result.error!, result.statusCode!);
        return;
      }

      ResponseHelper.success(
        res,
        result.data,
        'User registered successfully',
        result.statusCode!
      );
    } catch (error) {
      logger.error('Register controller error:', error);
      ResponseHelper.internalError(res);
    }
  }

  public async login(req: Request, res: Response): Promise<void> {
    try {
      const loginData: LoginDTO = req.body;
      const result = await userService.login(loginData);

      if (!result.success) {
        ResponseHelper.error(res, result.error!, result.statusCode!);
        return;
      }

      ResponseHelper.success(
        res,
        result.data,
        'Login successful',
        result.statusCode!
      );
    } catch (error) {
      logger.error('Login controller error:', error);
      ResponseHelper.internalError(res);
    }
  }

  public async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const tokenData: RefreshTokenDTO = req.body;
      const result = await userService.refreshToken(tokenData);

      if (!result.success) {
        ResponseHelper.error(res, result.error!, result.statusCode!);
        return;
      }

      ResponseHelper.success(
        res,
        result.data,
        'Token refreshed successfully',
        result.statusCode!
      );
    } catch (error) {
      logger.error('Refresh token controller error:', error);
      ResponseHelper.internalError(res);
    }
  }

  public async logout(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!._id;
      const refreshToken = req.body.refreshToken;

      const result = await userService.logout(userId, refreshToken);

      if (!result.success) {
        ResponseHelper.error(res, result.error!, result.statusCode!);
        return;
      }

      ResponseHelper.success(
        res,
        undefined,
        'Logout successful',
        result.statusCode!
      );
    } catch (error) {
      logger.error('Logout controller error:', error);
      ResponseHelper.internalError(res);
    }
  }

  public async getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!._id;
      const result = await userService.getUserById(userId);

      if (!result.success) {
        ResponseHelper.error(res, result.error!, result.statusCode!);
        return;
      }

      ResponseHelper.success(
        res,
        result.data,
        'Profile retrieved successfully',
        result.statusCode!
      );
    } catch (error) {
      logger.error('Get profile controller error:', error);
      ResponseHelper.internalError(res);
    }
  }

  public async updateProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!._id;
      const updateData: UpdateUserDTO = req.body;

      const result = await userService.updateUser(userId, updateData);

      if (!result.success) {
        ResponseHelper.error(res, result.error!, result.statusCode!);
        return;
      }

      ResponseHelper.success(
        res,
        result.data,
        'Profile updated successfully',
        result.statusCode!
      );
    } catch (error) {
      logger.error('Update profile controller error:', error);
      ResponseHelper.internalError(res);
    }
  }

  public async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const query: UserListQuery = req.query as any;
      const result = await userService.getUsers(query);

      if (!result.success) {
        ResponseHelper.error(res, result.error!, result.statusCode!);
        return;
      }

      ResponseHelper.success(
        res,
        result.data,
        'Users retrieved successfully',
        result.statusCode!
      );
    } catch (error) {
      logger.error('Get users controller error:', error);
      ResponseHelper.internalError(res);
    }
  }

  public async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.id;
      
      if (!userId) {
        ResponseHelper.error(res, 'User ID is required', 400);
        return;
      }

      const result = await userService.getUserById(userId);

      if (!result.success) {
        ResponseHelper.error(res, result.error!, result.statusCode!);
        return;
      }

      ResponseHelper.success(
        res,
        result.data,
        'User retrieved successfully',
        result.statusCode!
      );
    } catch (error) {
      logger.error('Get user by ID controller error:', error);
      ResponseHelper.internalError(res);
    }
  }

  public async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.id;
      
      if (!userId) {
        ResponseHelper.error(res, 'User ID is required', 400);
        return;
      }
      
      const updateData: UpdateUserDTO = req.body;

      const result = await userService.updateUser(userId, updateData);

      if (!result.success) {
        ResponseHelper.error(res, result.error!, result.statusCode!);
        return;
      }

      ResponseHelper.success(
        res,
        result.data,
        'User updated successfully',
        result.statusCode!
      );
    } catch (error) {
      logger.error('Update user controller error:', error);
      ResponseHelper.internalError(res);
    }
  }

  public async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.id;
      
      if (!userId) {
        ResponseHelper.error(res, 'User ID is required', 400);
        return;
      }
      
      const result = await userService.deleteUser(userId);

      if (!result.success) {
        ResponseHelper.error(res, result.error!, result.statusCode!);
        return;
      }

      ResponseHelper.success(
        res,
        undefined,
        'User deleted successfully',
        result.statusCode!
      );
    } catch (error) {
      logger.error('Delete user controller error:', error);
      ResponseHelper.internalError(res);
    }
  }
}

export default new UserController();
