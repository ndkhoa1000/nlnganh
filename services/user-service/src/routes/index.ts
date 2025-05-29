import { Router } from 'express';
import userRoutes from './user.routes';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'User service is healthy',
    timestamp: new Date().toISOString(),
    service: 'user-service',
  });
});

// API routes
router.use('/users', userRoutes);

export default router;
