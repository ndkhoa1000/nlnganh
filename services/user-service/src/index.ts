import 'module-alias/register';
import * as fs from 'fs';
import * as path from 'path';
import App from './app';
import logger from '@/utils/logger';

const logsDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: unknown, promise: Promise<any>) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the application
const app = new App();
app.start().catch((error) => {
  logger.error('Failed to start application:', error);
  process.exit(1);
});
