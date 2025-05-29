import { Router } from 'express';
import userController from '@/controllers/user.controller';
import { authenticate, authorize } from '@/middleware/auth.middleware';
import { validateRequest, validateQuery } from '@/middleware/validation.middleware';
import {
  createUserSchema,
  updateUserSchema,
  loginSchema,
  refreshTokenSchema,
  userListQuerySchema,
} from '@/utils/validation';
import { UserRole } from '@/types/user.types';

const router = Router();

// Public routes
router.post(
  '/register',
  validateRequest(createUserSchema),
  userController.register
);

router.post(
  '/login',
  validateRequest(loginSchema),
  userController.login
);

router.post(
  '/refresh-token',
  validateRequest(refreshTokenSchema),
  userController.refreshToken
);

// Protected routes - require authentication
router.post(
  '/logout',
  authenticate,
  userController.logout
);

router.get(
  '/profile',
  authenticate,
  userController.getProfile
);

router.put(
  '/profile',
  authenticate,
  validateRequest(updateUserSchema),
  userController.updateProfile
);

// Admin routes - require admin privileges
router.get(
  '/',
  authenticate,
  authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateQuery(userListQuerySchema),
  userController.getUsers
);

router.get(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  userController.getUserById
);

router.put(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(updateUserSchema),
  userController.updateUser
);

router.delete(
  '/:id',
  authenticate,
  authorize(UserRole.SUPER_ADMIN),
  userController.deleteUser
);

export default router;
