import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import config from '@/config';
import database from '@/config/database';
import messageQueue from '@/services/messageQueue.service';
import metricsService from '@/services/metrics.service';
import routes from '@/routes';
import { errorHandler, notFoundHandler } from '@/middleware/error.middleware';
import logger from '@/utils/logger';

class App {
  public app: express.Application;
  public port: number;

  constructor() {
    this.app = express();
    this.port = config.port;

    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddleware(): void {
    // Security middleware
    this.app.use(helmet());
    
    // CORS
    this.app.use(cors({
      origin: process.env.NODE_ENV === 'production' 
        ? ['https://yourdomain.com'] 
        : ['http://localhost:3000', 'http://localhost:5173'],
      credentials: true,
    }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      message: {
        success: false,
        error: 'Too many requests from this IP, please try again later.',
      },
    });
    this.app.use('/api', limiter);

    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Logging
    this.app.use(morgan('combined', {
      stream: { write: (message) => logger.info(message.trim()) }
    }));

    // Metrics tracking
    this.app.use(metricsService.trackHttpRequest());

    // Connection tracking
    this.app.use((req, res, next) => {
      metricsService.incrementActiveConnections();
      res.on('finish', () => {
        metricsService.decrementActiveConnections();
      });
      next();
    });
  }

  private initializeRoutes(): void {
    // Health check
    this.app.get('/', (req, res) => {
      res.status(200).json({
        success: true,
        message: 'User Service API',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
      });
    });

    // Metrics endpoint for Prometheus
    this.app.get('/metrics', async (req, res) => {
      try {
        const metrics = await metricsService.getMetrics();
        res.set('Content-Type', 'text/plain');
        res.send(metrics);
      } catch (error) {
        logger.error('Error getting metrics:', error);
        res.status(500).send('Error getting metrics');
      }
    });

    // API routes
    this.app.use('/api', routes);
  }

  private initializeErrorHandling(): void {
    this.app.use(notFoundHandler);
    this.app.use(errorHandler);
  }

  public async start(): Promise<void> {
    try {
      // Initialize database
      await database.connect();
      logger.info('Database connected successfully');

      // Initialize message queue
      try {
        await messageQueue.connect();
        logger.info('Message queue connected successfully');
      } catch (error) {
        logger.warn('Failed to connect to message queue:', error);
        // Continue without message queue in development
      }

      // Start server
      this.app.listen(this.port, () => {
        logger.info(`User service running on port ${this.port}`);
        logger.info(`Environment: ${config.env}`);
        logger.info(`Metrics available at: http://localhost:${this.port}/metrics`);
      });

      // Graceful shutdown
      process.on('SIGTERM', this.gracefulShutdown.bind(this));
      process.on('SIGINT', this.gracefulShutdown.bind(this));

    } catch (error) {
      logger.error('Failed to start application:', error);
      process.exit(1);
    }
  }

  private async gracefulShutdown(signal: string): Promise<void> {
    logger.info(`Received ${signal}, starting graceful shutdown`);

    try {
      // Close database connection
      await database.disconnect();
      logger.info('Database disconnected');

      // Close message queue connection
      await messageQueue.disconnect();
      logger.info('Message queue disconnected');

      logger.info('Graceful shutdown completed');
      process.exit(0);
    } catch (error) {
      logger.error('Error during graceful shutdown:', error);
      process.exit(1);
    }
  }
}

export default App;
